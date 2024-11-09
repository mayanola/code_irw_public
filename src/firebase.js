// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getFunctions } from "firebase/functions";
import firebase from "firebase/compat/app";
import 'firebase/compat/firestore';
import "firebase/compat/functions";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
};


// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const functions = getFunctions(app);
// const firestore = firebase.firestore(app);

// export { functions, firestore };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const firestore = firebase.firestore();
export const functions = firebase.app().functions("us-central1");