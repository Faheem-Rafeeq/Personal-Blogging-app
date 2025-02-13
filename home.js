import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { query, where, collection, getDocs, orderBy, updateDoc, doc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { auth, db } from "./firebaseconfig.js";

// Call elements from HTML
let btn = document.querySelector(".logout-btn");
let userName = document.querySelector(".username");
let profileImage = document.querySelector(".user-image");
let container = document.querySelector('.container');
let DashBoardbtn = document.querySelector(".DashBoard");

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

// Dashboard button functionality
DashBoardbtn.addEventListener("click", () => {
  window.location = 'dashboard.html';
});

// Get user data from Firestore
async function getDataFromFireBase() {
  let user = null;
  const q = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    user = doc.data();
  });
  return user;
}

// Fetch and render blogs from Firestore
async function callDataFromFireBase() {
  const q = query(collection(db, "blogs") ,orderBy("time", "desc"));
  const querySnapshot = await getDocs(q);
  const arr = [];
  querySnapshot.forEach((doc) => {
    arr.push({ 
      ...doc.data(), 
      id: doc.id,
    });
  });

  renderPosts(arr);
}

// Render posts dynamically
function renderPosts(posts) {
  container.innerHTML = ''; // Clear the container before rendering

  posts.forEach((item) => {
    const postElement = document.createElement('div');
    postElement.classList.add('feed');
    postElement.innerHTML = `
      <div id="postsContainer">
        <!-- Nav -->
        <div class="nav">
          <img src="${item.profilePic}" alt="Profile Picture">
          <div class="info">
            <h4 id="name">${item.username }</h4>
            <p id="time">${new Date(item.time?.toDate()).toLocaleString()}</p>
          </div>
        </div>
        <!-- Text -->
        <div class="text">
          <p id="para">${item.textInput}</p>
        </div>
        <!-- Image -->
        <div id="postImg">
          <img src="${item.Blogs}" id="image" alt="Post Image">
        </div>
        <!-- Like Button -->
        <button class="like-btn" id="likeBtn-${item.id}">
          Like <span id="likeCount-${item.id}">${item.likes || 0}</span>
        </button>
      </div>
     
    `;
    container.appendChild(postElement);

    // Add event listener for the like button
    const likeBtn = document.getElementById(`likeBtn-${item.id}`);
    const likeCount = document.getElementById(`likeCount-${item.id}`);

    likeBtn.addEventListener('click', async () => {
      // Update likes in Firebase
      const postRef = doc(db, "blogs", item.id);
      const newLikes = (item.likes || 0) + 1;
      await updateDoc(postRef, { likes: newLikes });

      // Update the UI
      likeCount.textContent = newLikes;
      item.likes = newLikes; // Update local data
    });
  });
}

// Check if user is logged in or not
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid;
    console.log(uid);

    // If user is logged in, display user data on the page
    let users = await getDataFromFireBase();
    console.log(users);
    userName.innerHTML = users.fullname;
    profileImage.src = users.profilePic;

    // Fetch and render blogs
    await callDataFromFireBase(); // Pass users object to callDataFromFireBase
  } else {
    window.location = 'login.html';
  }
});