/**
 * Login gate for every study page.
 *
 * Notes, past papers, video lessons, quizzes and the account pages are only
 * meant to open for a signed-in student. Each of those pages ships a hidden
 * body (see the inline style in its <head>) and this module decides whether
 * to show it.
 *
 * Signed in  -> the page is revealed.
 * Signed out -> straight to login.html, remembering where they were going.
 *
 * A student who was signed in on this device recently sees the page straight
 * away while Firebase confirms the session in the background, so a slow
 * connection no longer means staring at the veil on every page. The session
 * is only remembered here; it never grants access on its own if Firebase
 * later reports that nobody is signed in.
 */

import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const LOGIN_PAGE = "login.html";
const NOT_LOGIN = /^(login|signup)\.html$/i;

/* Set by this module when Firebase confirms a session, read on the next page
 * load, and cleared on sign-out (see profile.js, js/admin-app.js,
 * js/premium-materials.js). */
const SESSION_KEY = "lsh.signed-in";
const SESSION_MAX_AGE = 30 * 24 * 60 * 60 * 1000;

let revealed = false;
let decided = false;

function pageName() {
    const name = (window.location.pathname.split("/").pop() || "index.html").trim();
    return /^[A-Za-z0-9._-]+\.html$/i.test(name) ? name : "";
}

function remember() {
    try {
        localStorage.setItem(SESSION_KEY, String(Date.now()));
    } catch (error) {
        /* private mode, storage full: the gate still works, just slower */
    }
}

function forget() {
    try {
        localStorage.removeItem(SESSION_KEY);
    } catch (error) {
        /* nothing to clear */
    }
}

function recentlySignedIn() {
    try {
        const at = Number(localStorage.getItem(SESSION_KEY));
        return Number.isFinite(at) && at > 0 && Date.now() - at < SESSION_MAX_AGE;
    } catch (error) {
        return false;
    }
}

function unlock() {
    if (revealed) return;
    revealed = true;
    document.body.classList.add("gate-ready");
    document.documentElement.classList.add("gate-ready");
    const veil = document.querySelector(".auth-veil");
    if (veil) veil.remove();
}

function toLogin() {
    if (decided) return;
    decided = true;

    const name = pageName();
    const safeNext = name && !NOT_LOGIN.test(name)
        ? name + window.location.search + window.location.hash
        : "";

    const url = LOGIN_PAGE + (safeNext
        ? "?next=" + encodeURIComponent(safeNext)
        : "?reason=login-required");

    window.location.replace(url);
}

function decide(user) {
    if (decided) return;
    decided = true;

    if (user) {
        remember();
        unlock();
        return;
    }

    forget();
    toLogin();
}

// Paint straight away for a student who was here recently.
if (recentlySignedIn()) {
    unlock();
}

try {
    onAuthStateChanged(auth, decide);
} catch (error) {
    console.error("Session check failed:", error);
    if (!revealed) toLogin();
}

/* Firebase reads a session back from storage through a hidden iframe. Some
 * browsers restrict that handshake, and then the answer never arrives and the
 * veil would sit there for ever. Give it a few seconds, then fall back to what
 * this device already knows: a student who was here recently keeps reading,
 * everyone else goes to login. */
setTimeout(function () {
    if (decided) return;

    // Already showing the page on a remembered session: do not interrupt.
    if (revealed) return;

    if (auth.currentUser) {
        remember();
        unlock();
        return;
    }

    toLogin();
}, 5000);
