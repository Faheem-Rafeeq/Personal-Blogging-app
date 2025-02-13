import { addDoc, collection, Timestamp, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { auth, db } from "./firebaseconfig.js";

// Getting elements from HTML
let textInput = document.querySelector('#textInput');
let form = document.querySelector('#form');

// Cloudinary function to handle image upload
let postBlogs = null;

let myWidget = cloudinary.createUploadWidget({
  cloudName: 'deoewfuu1', 
  uploadPreset: 'blogging app'
}, (error, result) => { 
  if (!error && result && result.event === "success") { 
    console.log('Done! Here is the image info: ', result.info); 
    postBlogs = result.info.secure_url;
  }
});

document.getElementById("upload_widget").addEventListener("click", function(event) {
  event.preventDefault(); // Prevent form submission
  myWidget.open();
}, false);

// Function to fetch user data from Firestore
async function getUserData(uid) {
  const q = query(collection(db, "users"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  let userData = null;
  querySnapshot.forEach((doc) => {
    userData = doc.data();
  });
  return userData;
}

// Add data to Firestore on form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Validate input fields
  if (!textInput.value || !postBlogs) {
    alert("Please add blog content and upload an image.");
    return;
  }

  // Ensure the user is logged in
  if (!auth.currentUser) {
    alert("You must be logged in to post a blog.");
    return;
  }

  try {
    // Fetch user data from Firestore
    const userData = await getUserData(auth.currentUser.uid);
    if (!userData) {
      throw new Error("User data not found.");
    }

    // Add blog data to Firestore
    await addDoc(collection(db, "blogs"), {
      textInput: textInput.value,
      Blogs: postBlogs,
      uid: auth.currentUser.uid,
      time: Timestamp.now(),
      username: userData.fullname, // Use fullname from Firestore
      profilePic: userData.profilePic // Use profilePic from Firestore
    });

    alert("Blog added successfully!");
    textInput.value = ''; // Clear the input field
    postBlogs = null; // Reset the image URL
    // window.location = 'home.html'; // Uncomment to redirect after posting
  } catch (e) {
    console.error("Error adding document: ", e);
    alert("An error occurred. Please try again.");
  }
});