// Shows an Admin shortcut in the dashboard header for the owner account only.
// The admin page itself is still gated by the backend, so this is just a
// convenience so nobody has to remember the /admin.html URL.

import { auth } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const OWNER_EMAILS = ["sugutlaban4@gmail.com"];

const link = document.getElementById("adminLink");

if (link) {
    onAuthStateChanged(auth, (user) => {
        const email = String(user?.email || "").toLowerCase();
        link.hidden = !OWNER_EMAILS.includes(email);
    });
}
