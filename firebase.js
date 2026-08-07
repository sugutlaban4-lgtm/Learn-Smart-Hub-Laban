import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCTRqYqGMzqq6zvCiDijNSYdRwhqxVlXPo",
  authDomain: "learn-smart-hub-laban.firebaseapp.com",
  projectId:"learn-smart-hub-laban",
  storageBucket: "learn-smart-hub-laban.firebasestorage.app",
  messagingSenderId:  "707789494610",
  appId: "1:707789494610:web:ee7f3f9a6fddbc913e028b"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)