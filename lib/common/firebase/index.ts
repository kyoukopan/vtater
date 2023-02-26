// Import the functions you need from the SDKs you need
import {
  FirebaseApp,
  FirebaseOptions,
  getApps,
  initializeApp
} from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
import { Auth, connectAuthEmulator, getAuth } from 'firebase/auth';
import {
  connectFirestoreEmulator,
  Firestore,
  getFirestore
} from 'firebase/firestore';
import { connectStorageEmulator, getStorage } from 'firebase/storage';

// Configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: 'AIzaSyD87Jo3vH-Ppo6dJ8FiSUCHu31Ky2EaT1Q',
  authDomain: 'art-share-kyoukopan.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: 'art-share-kyoukopan.appspot.com',
  messagingSenderId: '717583682682',
  appId: '1:717583682682:web:fad1c51a63fe8fe1463fc3',
};

let firebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
}
export const auth: Auth = getAuth(firebaseApp);
export const db: Firestore = getFirestore(firebaseApp as FirebaseApp);
export const storage = getStorage(firebaseApp);
if (
  process.env.NEXT_PUBLIC_ENV === 'development' ||
  process.env.NODE_ENV === 'development'
) {
  connectAuthEmulator(auth, 'http://localhost:9099');
  console.log('Connected to auth emulator');
  connectFirestoreEmulator(db, 'localhost', 8080);
  console.log('Connected to firestore emulator');
  connectStorageEmulator(storage, 'localhost', 9199);
  console.log('Connected to storage emulator');
}
