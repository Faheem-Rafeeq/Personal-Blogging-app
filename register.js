import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import {addDoc , collection} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js"
import { auth , db } from "./firebaseconfig.js";

// getting elements from html
let email = document.querySelector('#email');
let password = document.querySelector('#password');
let form = document.querySelector('#form');
let fullname = document.querySelector('#firstName');

// claudnary function to handle form submission
let userProfileUrl = '';

let myWidget = cloudinary.createUploadWidget({
  cloudName: 'deoewfuu1', 
  uploadPreset: 'blogging app'}, (error, result) => { 
    if (!error && result && result.event === "success") { 
      console.log('Done! Here is the image info: ', result.info); 
      userProfileUrl = result.info.secure_url;
    }
  }
)

document.getElementById("upload_widget").addEventListener("click", function(){
    myWidget.open();
  }, false);



// function to handle form submission and add user to firestore
form.addEventListener('submit' , (event)=>{
event.preventDefault();

if(!userProfileUrl){
  alert('Please upload a profile picture');
  return;
}

createUserWithEmailAndPassword(auth, email.value, password.value)
  .then (async(userCredential) => {
    const user = userCredential.user;
    console.log(user);

    // add data in fireBase  
    try {
      await addDoc(collection(db, "users"), {
        fullname: fullname.value,
        email: email.value,
        profilePic : userProfileUrl,
        uid: auth.currentUser.uid,
      });

    } catch (e) {
      console.error("Error adding document: ", e);
    }
fullname.value = '';
password.value = '';
email.value = '';


  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
   console.log(errorMessage)
  });

})