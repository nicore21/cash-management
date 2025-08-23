// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "sevasahayak-cikxx",
  "appId": "1:140218973639:web:e0eac40080553062692de2",
  "storageBucket": "sevasahayak-cikxx.firebasestorage.app",
  "apiKey": "AIzaSyCc_QGZbqpihn46m-YWZ_ZjUElUGw55d84",
  "authDomain": "sevasahayak-cikxx.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "140218973639"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
