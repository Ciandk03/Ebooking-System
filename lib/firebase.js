// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbx81rL8zlOxZymWD10YCGMKuIa0uPEIk",
  authDomain: "cinema-e-booking-21d56.firebaseapp.com",
  projectId: "cinema-e-booking-21d56",
  storageBucket: "cinema-e-booking-21d56.firebasestorage.app",
  messagingSenderId: "841058389276",
  appId: "1:841058389276:web:590f0f2f94798c23e37ed9",
  measurementId: "G-GF8DCH581C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Export the services (analytics removed for server-side compatibility)
export { db, auth };
export default app;