import { auth } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

function nextTarget() {
  const raw = new URLSearchParams(window.location.search).get("next") || "";
  return /^[A-Za-z0-9._-]+\.html(\?[^#]*)?(#.*)?$/.test(raw) ? raw : "";
}

function loginUrl() {
  const next = nextTarget();
  return next ? "login.html?next=" + encodeURIComponent(next) : "login.html";
}

window.createAccount = function () {
  const name = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      return updateProfile(userCredential.user, {
        displayName: name
      });
    })
    .then(() => {
      alert("Account created successfully!");
      window.location = loginUrl();
    })
    .catch((error) => {
      alert(error.message);
    });
};

window.loginUser = function () {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      try { localStorage.setItem("lsh.signed-in", String(Date.now())); } catch (e) {}
      alert("Login successful!");
      window.location = nextTarget() || "dashboard.html";
    })
    .catch((error) => {
      alert(error.message);
    });
};
