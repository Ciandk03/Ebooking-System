// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

// Export the services
export { db, auth, analytics };
export default app;