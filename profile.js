import { auth } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


const BACKEND =
    "https://learn-smart-hub-backend.onrender.com";

const nameElement =
    document.getElementById("profileName");

const emailElement =
    document.getElementById("profileEmail");

const planElement =
    document.getElementById("profilePlan");

const memberSince =
    document.getElementById("profileSince");

const logoutButton =
    document.getElementById("logoutButton");


onAuthStateChanged(auth, async user => {

    if (!user) {

        window.location = "login.html";

        return;

    }


    const fallbackName =
        (user.email || "Student").split("@")[0];

    nameElement.textContent =
        user.displayName || fallbackName;

    emailElement.textContent =
        user.email || "Not available";


    if (memberSince) {

        const created =
            user.metadata?.creationTime;

        memberSince.textContent =
            created
                ? new Date(created).toLocaleDateString(
                    "en-KE",
                    { day: "numeric", month: "long", year: "numeric" }
                )
                : "Not available";

    }


    if (!planElement) {
        return;
    }


    try {

        const idToken =
            await user.getIdToken();


        const response =
            await fetch(
                `${BACKEND}/api/premium/status`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${idToken}`
                    }
                }
            );


        const result =
            await response.json();


        if (!response.ok || !result.success) {
            throw new Error(result.message || "Status unavailable");
        }


        const plan =
            result.plan === "none"
                ? "No Premium plan"
                : result.plan.charAt(0).toUpperCase() +
                  result.plan.slice(1) + " Premium";


        planElement.textContent =
            result.status === "active"
                ? plan + " (active)"
                : plan;


    } catch (error) {

        console.error("Profile premium error:", error);

        planElement.textContent =
            "Could not load Premium status";

    }

});


if (logoutButton) {

    logoutButton.addEventListener("click", async () => {

        logoutButton.disabled = true;

        try {

            await signOut(auth);
        try { localStorage.removeItem("lsh.signed-in"); } catch (e) {}

            window.location = "index.html";

        } catch (error) {

            console.error("Logout error:", error);

            logoutButton.disabled = false;

        }

    });

}
