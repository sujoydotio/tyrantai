// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "tyrantai-c5fe1.firebaseapp.com",
  projectId: "tyrantai-c5fe1",
  storageBucket: "tyrantai-c5fe1.firebasestorage.app",
  messagingSenderId: "292463395777",
  appId: "1:292463395777:web:d8b5605a0cdbc2ecf86540",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
