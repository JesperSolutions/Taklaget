import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Debug: Log config in development (remove this in production)
if (import.meta.env.DEV) {
  console.log('Firebase Config:', {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    hasApiKey: !!firebaseConfig.apiKey,
    hasAppId: !!firebaseConfig.appId
  });
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Connect to emulators in development (only if explicitly enabled)
if (import.meta.env.DEV && import.meta.env.VITE_FIREBASE_USE_EMULATORS === 'true') {
  const emulatorHost = import.meta.env.VITE_FIREBASE_EMULATOR_HOST || 'localhost';
  
  // Connect to Auth emulator
  connectAuthEmulator(auth, `http://${emulatorHost}:9099`, { disableWarnings: true });
  
  // Connect to Firestore emulator
  connectFirestoreEmulator(db, emulatorHost, 8080);
  
  // Connect to Storage emulator
  connectStorageEmulator(storage, emulatorHost, 9199);
  
  // Connect to Functions emulator
  connectFunctionsEmulator(functions, emulatorHost, 5001);
}

export default app;