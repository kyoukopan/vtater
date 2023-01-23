// Import the functions you need from the SDKs you need
import { FirebaseApp, FirebaseOptions, initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
import { getAuth, connectAuthEmulator, Auth } from "firebase/auth";

// Configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyD87Jo3vH-Ppo6dJ8FiSUCHu31Ky2EaT1Q",
  authDomain: "art-share-kyoukopan.firebaseapp.com",
  projectId: "art-share-kyoukopan",
  storageBucket: "art-share-kyoukopan.appspot.com",
  messagingSenderId: "717583682682",
  appId: "1:717583682682:web:fad1c51a63fe8fe1463fc3",
};

const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);

export const auth: Auth = getAuth(firebaseApp);

if (process.env.NEXT_PUBLIC_ENV === "development") {
  connectAuthEmulator(auth, "http://localhost:9099");
  console.log("Connected to auth emulator");
}

// Initialize Firebase
export default firebaseApp;
