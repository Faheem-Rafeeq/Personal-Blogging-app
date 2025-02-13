import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { auth, db } from "./firebaseconfig.js";

// Getting elements from HTML
let email = document.querySelector('#email');
let password = document.querySelector('#password');
let form = document.querySelector('#form');
let fullname = document.querySelector('#firstName');

// Cloudinary function to handle image upload
let userProfileUrl = '';
let isUploadComplete = false; // Flag to track upload status

let myWidget = cloudinary.createUploadWidget({
  cloudName: 'deoewfuu1', 
  uploadPreset: 'blogging app'
}, (error, result) => { 
  if (!error && result && result.event === "success") { 
    console.log('Done! Here is the image info: ', result.info); 
    userProfileUrl = result.info.secure_url;
    isUploadComplete = true; // Set upload flag to true
  }
});

document.getElementById("upload_widget").addEventListener("click", function(event) {
  event.preventDefault(); // Prevent form submission
  myWidget.open();
}, false);

// Function to handle form submission and add user to Firestore
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Check if the profile picture upload is complete
  if (!isUploadComplete) {
    alert("Please wait for the profile picture to upload.");
    return;
  }

  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;
    console.log(user);

    // Add user data to Firestore
    await addDoc(collection(db, "users"), {
      fullname: fullname.value,
      email: email.value,
      profilePic: userProfileUrl,
      uid: user.uid,
    });

    console.log("User added to Firestore successfully!");

    // Clear form fields
    fullname.value = '';
    password.value = '';
    email.value = '';
    userProfileUrl = ''; // Reset profile picture URL
    isUploadComplete = false; // Reset upload flag
  } catch (error) {
    console.error("Error: ", error.message);
  }
});