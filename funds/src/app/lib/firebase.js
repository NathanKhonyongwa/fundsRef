// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBfTbfyAkqddj1EzO5tdIWZYjJwTD_OprI",
  authDomain: "funds-b3e5f.firebaseapp.com",
  projectId: "funds-b3e5f",
  storageBucket: "funds-b3e5f.firebasestorage.app",
  messagingSenderId: "579367616424",
  appId: "1:579367616424:web:be1b88f1c91630fb90a79d",
  measurementId: "G-0YB79L9JW7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Export the Firestore database
export { db, app };