
import { auth } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


const db = getFirestore();


/* ================================
   AUTHENTICATION + PREMIUM STATUS
================================ */

onAuthStateChanged(auth, async (user) => {

    if (user) {

        document.getElementById("studentEmail").textContent =
            user.email;

        document.getElementById("studentName").textContent =
            user.displayName || "Student";


        const premiumStatusElement =
            document.getElementById("dashboardPremiumStatus");

        const premiumPlanElement =
            document.getElementById("dashboardPremiumPlan");


        try {

            const premiumRef =
                doc(
                    db,
                    "premium_access",
                    user.uid
                );


            const premiumSnap =
                await getDoc(premiumRef);


            if (premiumSnap.exists()) {

                const data =
                    premiumSnap.data();


                const status =
                    data.status || "inactive";


                const plan =
                    data.plan || "none";


                if (status === "active") {

                    premiumStatusElement.textContent =
                        "⭐ Premium Status: Active";

                } else {

                    premiumStatusElement.textContent =
                        "🔒 Premium Status: Inactive";

                }


                if (plan !== "none") {

                    const formattedPlan =
                        plan.charAt(0).toUpperCase() +
                        plan.slice(1);


                    premiumPlanElement.textContent =
                        "Plan: " +
                        formattedPlan +
                        " Premium";

                } else {

                    premiumPlanElement.textContent =
                        "Plan: No Premium plan selected";

                }


            } else {

                premiumStatusElement.textContent =
                    "🔒 Premium Status: Inactive";

                premiumPlanElement.textContent =
                    "Plan: No Premium plan selected";

            }


        } catch (error) {

            console.error(
                "Dashboard Premium status error:",
                error
            );


            premiumStatusElement.textContent =
                "Unable to check Premium status.";


            premiumPlanElement.textContent =
                "Please try again later.";

        }


    } else {

        window.location = "login.html";

    }

});


/* ================================
   RESOURCE SEARCH
================================ */

const searchInput =
    document.getElementById("resourceSearch");

const searchButton =
    document.getElementById("searchButton");

const searchMessage =
    document.getElementById("searchMessage");


const searchResources = () => {

    const search =
        searchInput.value.trim().toLowerCase();


    if (!search) {

        searchMessage.textContent =
            "Type something to search.";

        return;

    }


    const resources = [

        {
            keywords:
                "mathematics math maths notes papers past papers quizzes videos",

            name:
                "Mathematics",

            page:
                "mathematics.html"
        },


        {
            keywords:
                "science biology chemistry physics notes papers quizzes videos",

            name:
                "Science",

            page:
                "science.html"
        },


        {
            keywords:
                "past papers exams examination papers revision papers",

            name:
                "Past Papers",

            page:
                "pastpapers.html"
        },


        {
            keywords:
                "study notes notes revision resources",

            name:
                "Study Notes",

            page:
                "notes.html"
        },


        {
            keywords:
                "videos video lessons learning videos",

            name:
                "Video Lessons",

            page:
                "videos.html"
        }

    ];


    const result =
        resources.find(resource =>

            resource.keywords.includes(search) ||

            resource.name
                .toLowerCase()
                .includes(search)

        );


    if (result) {

        searchMessage.textContent =
            `Opening ${result.name}...`;


        window.location =
            result.page;


    } else {

        searchMessage.textContent =
            "No matching resource found. Try Mathematics, Science, Notes, Past Papers or Videos.";

    }

};


if (searchButton) {

    searchButton.addEventListener(
        "click",
        searchResources
    );

}


if (searchInput) {

    searchInput.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Enter") {

                searchResources();

            }

        }
    );

}


/* ================================
   QUIZ PROGRESS
================================ */

const quizzesCompleted =
    Number(
        localStorage.getItem(
            "quizzesCompleted"
        )
    ) || 0;


const bestQuizScore =
    Number(
        localStorage.getItem(
            "bestQuizScore"
        )
    ) || 0;


const averageQuizScore =
    Number(
        localStorage.getItem(
            "averageQuizScore"
        )
    ) || 0;


const completedElement =
    document.getElementById(
        "quizzesCompleted"
    );


const bestElement =
    document.getElementById(
        "bestQuizScore"
    );


const averageElement =
    document.getElementById(
        "averageQuizScore"
    );


if (completedElement) {

    completedElement.textContent =
        quizzesCompleted;

}


if (bestElement) {

    bestElement.textContent =
        (bestQuizScore * 10) +
        "%";

}


if (averageElement) {

    averageElement.textContent =
        (averageQuizScore * 10)
            .toFixed(0) +
        "%";

}
/* ================================
   STUDY PROGRESS + STREAK
================================ */

const today = new Date();
const todayKey = today.toISOString().split("T")[0];

const lastStudyDate =
    localStorage.getItem("lastStudyDate");

let currentStreak =
    Number(localStorage.getItem("currentStreak")) || 0;

let longestStreak =
    Number(localStorage.getItem("longestStreak")) || 0;

let studyDays =
    Number(localStorage.getItem("studyDays")) || 0;


/* =================================
   UPDATE STUDY STREAK
================================ */

if (lastStudyDate !== todayKey) {

    if (lastStudyDate) {

        const previousDate =
            new Date(lastStudyDate);

        const difference =
            Math.floor(
                (today - previousDate) /
                (1000 * 60 * 60 * 24)
            );

        if (difference === 1) {

            currentStreak++;

        } else {

            currentStreak = 1;

        }

    } else {

        currentStreak = 1;

    }


    studyDays++;


    if (currentStreak > longestStreak) {

        longestStreak =
            currentStreak;

    }


    localStorage.setItem(
        "lastStudyDate",
        todayKey
    );

    localStorage.setItem(
        "currentStreak",
        currentStreak
    );

    localStorage.setItem(
        "longestStreak",
        longestStreak
    );

    localStorage.setItem(
        "studyDays",
        studyDays
    );

}


/* =================================
   DISPLAY STUDY PROGRESS
================================ */

const streakElement =
    document.getElementById(
        "currentStudyStreak"
    );

const longestStreakElement =
    document.getElementById(
        "longestStudyStreak"
    );

const studyDaysElement =
    document.getElementById(
        "studyDays"
    );


if (streakElement) {

    streakElement.textContent =
        currentStreak;

}


if (longestStreakElement) {

    longestStreakElement.textContent =
        longestStreak;

}


if (studyDaysElement) {

    studyDaysElement.textContent =
        studyDays;

}/* ================================
   WEEKLY STUDY GOAL
================================ */

const weeklyStudyDaysElement =
    document.getElementById(
        "weeklyStudyDays"
    );

const weeklyProgressFill =
    document.getElementById(
        "weeklyProgressFill"
    );

const weeklyProgressText =
    document.getElementById(
        "weeklyProgressText"
    );


const weeklyGoal = 7;

const weeklyDays =
    Math.min(studyDays, weeklyGoal);

const weeklyPercentage =
    Math.round(
        (weeklyDays / weeklyGoal) * 100
    );


if (weeklyStudyDaysElement) {

    weeklyStudyDaysElement.textContent =
        weeklyDays;

}


if (weeklyProgressFill) {

    weeklyProgressFill.style.width =
        weeklyPercentage + "%";

}


if (weeklyProgressText) {

    weeklyProgressText.textContent =
        weeklyPercentage +
        "% complete";

}
/* ================================
   ACHIEVEMENTS + BADGES
================================ */

const achievementFirstStudy =
    document.getElementById("achievementFirstStudy");

const achievementThreeDay =
    document.getElementById("achievementThreeDay");

const achievementSevenDay =
    document.getElementById("achievementSevenDay");

const achievementTenDays =
    document.getElementById("achievementTenDays");

const achievementFirstQuiz =
    document.getElementById("achievementFirstQuiz");

const achievementQuizMaster =
    document.getElementById("achievementQuizMaster");

const achievementWeekly =
    document.getElementById("achievementWeekly");


/* ================================
   UNLOCK ACHIEVEMENTS
================================ */

if (studyDays >= 1 && achievementFirstStudy) {

    achievementFirstStudy.classList.add(
        "achievement-unlocked"
    );

}


if (currentStreak >= 3 && achievementThreeDay) {

    achievementThreeDay.classList.add(
        "achievement-unlocked"
    );

}


if (currentStreak >= 7 && achievementSevenDay) {

    achievementSevenDay.classList.add(
        "achievement-unlocked"
    );

}


if (studyDays >= 10 && achievementTenDays) {

    achievementTenDays.classList.add(
        "achievement-unlocked"
    );

}


if (quizzesCompleted >= 1 && achievementFirstQuiz) {

    achievementFirstQuiz.classList.add(
        "achievement-unlocked"
    );

}


if (quizzesCompleted >= 10 && achievementQuizMaster) {

    achievementQuizMaster.classList.add(
        "achievement-unlocked"
    );

}


if (weeklyDays >= 7 && achievementWeekly) {

    achievementWeekly.classList.add(
        "achievement-unlocked"
    );

}
/* ================================
   STUDENT LEARNING OVERVIEW
================================ */

const overviewQuizzes =
    document.getElementById("overviewQuizzes");

const overviewBestScore =
    document.getElementById("overviewBestScore");

const overviewAverageScore =
    document.getElementById("overviewAverageScore");

const overviewStreak =
    document.getElementById("overviewStreak");

const overviewBadges =
    document.getElementById("overviewBadges");

const overviewStudyDays =
    document.getElementById("overviewStudyDays");


/* =================================
   BADGES EARNED
================================ */

let badgesEarned = 0;


if (studyDays >= 1) {
    badgesEarned++;
}

if (currentStreak >= 3) {
    badgesEarned++;
}

if (currentStreak >= 7) {
    badgesEarned++;
}

if (studyDays >= 10) {
    badgesEarned++;
}

if (quizzesCompleted >= 1) {
    badgesEarned++;
}

if (quizzesCompleted >= 10) {
    badgesEarned++;
}

if (weeklyDays >= 7) {
    badgesEarned++;
}


/* =================================
   DISPLAY OVERVIEW
================================ */

if (overviewQuizzes) {

    overviewQuizzes.textContent =
        quizzesCompleted;

}


if (overviewBestScore) {

    overviewBestScore.textContent =
        (bestQuizScore * 10) + "%";

}


if (overviewAverageScore) {

    overviewAverageScore.textContent =
        (averageQuizScore * 10)
            .toFixed(0) + "%";

}


if (overviewStreak) {

    overviewStreak.textContent =
        currentStreak;

}


if (overviewBadges) {

    overviewBadges.textContent =
        badgesEarned;

}


if (overviewStudyDays) {

    overviewStudyDays.textContent =
        studyDays;

}
/* ================================
   CONTINUE LEARNING
================================ */

const continueLearningButton =
    document.getElementById("continueLearningButton");

const continueLearningTitle =
    document.getElementById("continueLearningTitle");

const continueLearningDescription =
    document.getElementById("continueLearningDescription");


/* Default learning area */

const continueLearningPage =
    localStorage.getItem("lastLearningPage") ||
    "mathematics.html";

const continueLearningName =
    localStorage.getItem("lastLearningName") ||
    "Mathematics";


if (continueLearningTitle) {

    continueLearningTitle.textContent =
        continueLearningName;

}


if (continueLearningDescription) {

    continueLearningDescription.textContent =
        `Continue studying ${continueLearningName} and improve your skills.`;

}


if (continueLearningButton) {

    continueLearningButton.addEventListener(
        "click",
        () => {

            window.location =
                continueLearningPage;

        }
    );

}/* ================================
   XP + LEVEL SYSTEM
================================ */

const studentLevel =
    document.getElementById("studentLevel");

const studentXP =
    document.getElementById("studentXP");

const nextLevelXP =
    document.getElementById("nextLevelXP");

const xpBarFill =
    document.getElementById("xpBarFill");

const xpMessage =
    document.getElementById("xpMessage");


/* =================================
   CALCULATE XP
================================ */

const studyXP =
    studyDays * 10;

const quizXP =
    quizzesCompleted * 20;

const totalXP =
    studyXP + quizXP;


/* =================================
   CALCULATE LEVEL
================================ */

const level =
    Math.floor(totalXP / 100) + 1;

const currentLevelXP =
    totalXP % 100;

const requiredForNextLevel =
    100;


/* =================================
   DISPLAY LEVEL
================================ */

if (studentLevel) {

    studentLevel.textContent =
        `Level ${level} — ${

            level === 1
                ? "Beginner"
                : level === 2
                    ? "Learner"
                    : level === 3
                        ? "Rising Scholar"
                        : "Smart Scholar"

        }`;

}


if (studentXP) {

    studentXP.textContent =
        currentLevelXP;

}


if (nextLevelXP) {

    nextLevelXP.textContent =
        requiredForNextLevel;

}


/* =================================
   XP PROGRESS BAR
================================ */

const xpPercentage =
    currentLevelXP;

if (xpBarFill) {

    xpBarFill.style.width =
        `${xpPercentage}%`;

}


/* =================================
   XP MESSAGE
================================ */

const xpRemaining =
    requiredForNextLevel -
    currentLevelXP;


if (xpMessage) {

    if (currentLevelXP === 0) {

        xpMessage.textContent =
            "Keep learning to reach the next level!";

    } else {

        xpMessage.textContent =
            `${xpRemaining} XP until Level ${level + 1}`;

    }

}
