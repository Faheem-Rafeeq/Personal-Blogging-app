import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCbouB2JOfrOtKw4m1YMONRRK_vIxkSMUg",
    authDomain: "login-page-ab5b2.firebaseapp.com",
    projectId: "login-page-ab5b2",
    storageBucket: "login-page-ab5b2.firebasestorage.app",
    messagingSenderId: "252914670896",
    appId: "1:252914670896:web:90efae7a3987b861ef3cf5"
  };

  export const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export const db = getFirestore(app);