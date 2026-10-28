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
 * While the check runs, the veil in the page markup covers the content so
 * nothing flashes before the answer arrives.
 */

import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const LOGIN_PAGE = "login.html";
const NOT_LOGIN = /^(login|signup)\.html$/i;

let settled = false;

function pageName() {
    const name = (window.location.pathname.split("/").pop() || "index.html").trim();
    return /^[A-Za-z0-9._-]+\.html$/i.test(name) ? name : "";
}

function unlock() {
    if (settled) return;
    settled = true;
    document.body.classList.add("gate-ready");
    document.documentElement.classList.add("gate-ready");
    const veil = document.querySelector(".auth-veil");
    if (veil) veil.remove();
}

function toLogin() {
    if (settled) return;
    settled = true;

    const name = pageName();
    const safeNext = name && !NOT_LOGIN.test(name)
        ? name + window.location.search + window.location.hash
        : "";

    const url = LOGIN_PAGE + (safeNext
        ? "?next=" + encodeURIComponent(safeNext)
        : "?reason=login-required");

    window.location.replace(url);
}

try {
    onAuthStateChanged(auth, function (user) {
        if (user) unlock();
        else toLogin();
    });
} catch (error) {
    console.error("Session check failed:", error);
    toLogin();
}

// If Firebase never answers, say so instead of leaving the veil up for ever.
setTimeout(function () {
    if (settled) return;
    const text = document.querySelector(".auth-veil-text");
    if (text) {
        text.innerHTML = 'Still checking your session. <a href="login.html">Log in again</a> if this stays.';
    }
}, 9000);
