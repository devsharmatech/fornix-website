// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWEHad0OcD-Pr9nEwe_RdQhgkqWIj_Gwo",
  authDomain: "fornix-1dad5.firebaseapp.com",
  projectId: "fornix-1dad5",
  storageBucket: "fornix-1dad5.firebasestorage.app",
  messagingSenderId: "197827513183",
  appId: "1:197827513183:web:c249385db56fe2d6ca44ea"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);