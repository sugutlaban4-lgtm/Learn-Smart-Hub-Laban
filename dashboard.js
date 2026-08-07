import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {

  if (user) {

    document.getElementById("studentEmail").textContent = user.email;

    document.getElementById("studentName").textContent =
      user.displayName || "Student";

  } else {

    window.location = "login.html";

  }

});