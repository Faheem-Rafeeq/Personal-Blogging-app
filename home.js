import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { query, where, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { auth, db } from "./firebaseconfig.js";

// Call elements from HTML
let btn = document.querySelector(".logout-btn");
let userName = document.querySelector(".username");
let profileImage = document.querySelector(".user-image");

// Logout functionality
btn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      window.location = 'login.html';
    })
    .catch((error) => {
      console.log("An error happened.");
    });
});

// Get data from Firestore and display it on the page
async function getDataFromFireBase() {
  let user = null;
  const q = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    user = doc.data();
  });
  return user;
}

// Check if user is logged in or not
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid;
    console.log(uid);
// if user is logged in, display user data on the page
    let users = await getDataFromFireBase(); 
    console.log(users);
    userName.innerHTML = users.fullname; 
    profileImage.src = users.profilePic; 
  } else {
    window.location = 'login.html';
  }
});



let DashBoardbtn = document.querySelector(".DashBoard");
DashBoardbtn.addEventListener("click", () => {
  window.location = 'dashboard.html';


})
