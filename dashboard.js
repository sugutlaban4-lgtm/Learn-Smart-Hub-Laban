import { auth } from "./firebase.js";
import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {

    if (user) {

        document.getElementById("studentEmail").textContent = user.email;

        document.getElementById("studentName").textContent =
            user.displayName || "Student";

    } else {

        window.location = "login.html";

    }

});


const searchInput = document.getElementById("resourceSearch");
const searchButton = document.getElementById("searchButton");
const searchMessage = document.getElementById("searchMessage");

const searchResources = () => {

    const search = searchInput.value.trim().toLowerCase();

    if (!search) {
        searchMessage.textContent = "Type something to search.";
        return;
    }

    const resources = [
        {
            keywords: "mathematics math maths notes papers past papers quizzes videos",
            name: "Mathematics",
            page: "mathematics.html"
        },
        {
            keywords: "science biology chemistry physics notes papers quizzes videos",
            name: "Science",
            page: "science.html"
        },
        {
            keywords: "past papers exams examination papers revision papers",
            name: "Past Papers",
            page: "pastpapers.html"
        },
        {
            keywords: "study notes notes revision resources",
            name: "Study Notes",
            page: "notes.html"
        },
        {
            keywords: "videos video lessons learning videos",
            name: "Video Lessons",
            page: "videos.html"
        }
    ];

    const result = resources.find(resource =>
        resource.keywords.includes(search) ||
        resource.name.toLowerCase().includes(search)
    );

    if (result) {

        searchMessage.textContent =
            `Opening ${result.name}...`;

        window.location = result.page;

    } else {

        searchMessage.textContent =
            "No matching resource found. Try Mathematics, Science, Notes, Past Papers or Videos.";

    }

};


searchButton.addEventListener("click", searchResources);


searchInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        searchResources();

    }

});
// QUIZ PROGRESS

const quizzesCompleted =
    Number(localStorage.getItem("quizzesCompleted")) || 0;

const bestQuizScore =
    Number(localStorage.getItem("bestQuizScore")) || 0;

const averageQuizScore =
    Number(localStorage.getItem("averageQuizScore")) || 0;

const completedElement =
    document.getElementById("quizzesCompleted");

const bestElement =
    document.getElementById("bestQuizScore");

const averageElement =
    document.getElementById("averageQuizScore");

if (completedElement) {
    completedElement.textContent = quizzesCompleted;
}

if (bestElement) {
    bestElement.textContent =
        (bestQuizScore * 10) + "%";
}

if (averageElement) {
    averageElement.textContent =
        (averageQuizScore * 10).toFixed(0) + "%";
}