import { auth, db } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { User } from '../shared/types';

export async function setupFirstUser(
  email: string, 
  password: string, 
  firstName: string, 
  lastName: string
): Promise<User> {
  try {
    console.log('Setting up first super admin user...');
    
    // Step 1: Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    
    console.log('Firebase Auth user created with UID:', uid);
    
    // Step 2: Create user document in Firestore
    const userData: User = {
      uid,
      firstName,
      lastName,
      email,
      phone: '',
      role: 'SUPER_ADMIN',
      orgId: '', // Will be set after organization creation
      departmentId: '',
      isActive: true,
      profilePicture: '',
      skills: [],
      certifications: [],
      hireDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Step 3: Try to create user document
    // Note: This will fail with current security rules
    // You'll need to temporarily modify firestore.rules
    try {
      await setDoc(doc(db, 'users', uid), userData);
      console.log('User document created successfully!');
    } catch (error) {
      console.error('Failed to create user document:', error);
      console.log('You need to temporarily modify firestore.rules to allow user creation');
      console.log('Add this rule temporarily: allow create: if true;');
    }
    
    return userData;
  } catch (error) {
    console.error('Error setting up first user:', error);
    throw error;
  }
}

export function getSetupInstructions(): string {
  return `
SETUP INSTRUCTIONS FOR FIRST SUPER ADMIN USER:

1. TEMPORARILY MODIFY FIRESTORE RULES:
   Open firestore.rules and temporarily change the users collection rule to:
   
   match /users/{userId} {
     allow read, write: if true; // TEMPORARY - REMOVE AFTER SETUP
   }

2. DEPLOY THE RULES:
   firebase deploy --only firestore:rules

3. RUN THIS SCRIPT:
   Call setupFirstUser() with your email and password

4. RESTORE SECURITY RULES:
   Change the rule back to the original secure version

5. REDEPLOY RULES:
   firebase deploy --only firestore:rules

WARNING: This temporarily opens your database to public access.
Only do this briefly during initial setup!
  `;
}
