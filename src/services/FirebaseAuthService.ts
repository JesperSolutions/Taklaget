import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { AuthService } from './AuthService';
import { User } from '../shared/types';

export class FirebaseAuthService implements AuthService {
  private currentUser: User | null = null;

  constructor() {
    // Listen for auth state changes
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await this.getUserData(firebaseUser.uid);
        this.currentUser = userData;
      } else {
        this.currentUser = null;
      }
    });
  }

  private async getUserData(uid: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return { uid, ...userDoc.data() } as User;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userData = await this.getUserData(userCredential.user.uid);
      
      if (!userData) {
        throw new Error('User data not found');
      }

      this.currentUser = userData;
      return userData;
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  }

  async logout(): Promise<void> {
    await signOut(auth);
    this.currentUser = null;
  }

  async getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const userData = await this.getUserData(firebaseUser.uid);
          this.currentUser = userData;
          resolve(userData);
        } else {
          this.currentUser = null;
          resolve(null);
        }
        unsubscribe();
      });
    });
  }

  async register(email: string, password: string, userData: Omit<User, 'uid' | 'createdAt' | 'updatedAt'>): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      
      // Create user document in Firestore
      const userRef = doc(db, 'users', uid);
      const now = new Date().toISOString();
      const newUser: User = {
        uid,
        ...userData,
        createdAt: now,
        updatedAt: now,
      };
      
      // Note: This will fail if security rules don't allow it
      // We need to temporarily allow user creation
      await this.createUserDocument(uid, newUser);
      
      this.currentUser = newUser;
      return newUser;
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  private async createUserDocument(uid: string, userData: User): Promise<void> {
    // This is a workaround for the initial user creation
    // In production, you'd use Firebase Functions or admin SDK
    const userRef = doc(db, 'users', uid);
    // We'll need to handle this differently due to security rules
    console.log('Attempting to create user document:', userData);
  }
}