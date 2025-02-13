import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

import { auth } from "./firebaseconfig.js";


let email = document.querySelector('#email');
let password = document.querySelector('#password');
let form = document.querySelector('#form');


form.addEventListener('submit' , (event)=>{
event.preventDefault();
signInWithEmailAndPassword(auth, email.value, password.value)
  .then((userCredential) => {
    const user = userCredential.user;
    console.log(user)
    window.location.href = "./home.html"; 

  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage)
  });
})