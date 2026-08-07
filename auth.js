import { auth } from "./firebase.js";

import { 
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


window.createAccount = function() {

  const name = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;


  createUserWithEmailAndPassword(auth, email, password)

  .then((userCredential) => {

    updateProfile(userCredential.user, {
      displayName: name
    });

    alert("Account created successfully!");
    window.location = "login.html";

  })

  .catch((error) => {
    alert(error.message);
  });

};


window.loginUser = function() {

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;


  signInWithEmailAndPassword(auth, email, password)

  .then(() => {

    alert("Login successful!");
    window.location = "https://learnsmarthub.my.canva.site/dahroljpksa";

  })

  .catch((error) => {
    alert(error.message);
  });

};