// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXlJecHn_2Pyitma6hTt0vV2powAU3A1A",
  authDomain: "the-gallery-fadc6.firebaseapp.com",
  projectId: "the-gallery-fadc6",
  storageBucket: "the-gallery-fadc6.firebasestorage.app",
  messagingSenderId: "780486717877",
  appId: "1:780486717877:web:73f432a6096917a4b7a9fc",
  measurementId: "G-YGY7LXY2N0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { app, auth };