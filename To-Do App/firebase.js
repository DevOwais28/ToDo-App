import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
const firebaseConfig = {
    apiKey: "AIzaSyDzd2ArU-zzw5J9_fkRRLf5gXXMo0HKp9o",
    authDomain: "authentication-b600f.firebaseapp.com",
    projectId: "authentication-b600f",
    storageBucket: "authentication-b600f.firebasestorage.app",
    messagingSenderId: "495946130974",
    appId: "1:495946130974:web:1237a4975221f2283eb00f",
    measurementId: "G-L31YHXZLH3"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export {auth,db}