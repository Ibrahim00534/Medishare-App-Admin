import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAbttBDjk2oTfSurmsAuv1m4ixLYohh6oM",
  authDomain: "medishare-48d90.firebaseapp.com",
  projectId: "medishare-48d90",
  storageBucket: "medishare-48d90.firebasestorage.app",
  messagingSenderId: "1023096883237",
  appId: "1:1023096883237:web:4e8b551856e913de8ed7cc",
  measurementId: "G-M9CWSZC09Z"
};
// Firebase App Initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, doc, setDoc, getDoc };