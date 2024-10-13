import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Firebase Storage

const firebaseConfig = {
    apiKey: "AIzaSyB9E3rssehL5x_C89Q1piTYM_FSX-K0BZw",
    authDomain: "creativeclique-2bc25.firebaseapp.com",
    projectId: "creativeclique-2bc25",
    storageBucket: "creativeclique-2bc25.appspot.com",
    messagingSenderId: "322630521434",
    appId: "1:322630521434:web:7d37084dfb4486d072fe63",
    measurementId: "G-Z16PFV9GE7"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app); // Initialize Firebase Storage

export { db, auth, storage };
