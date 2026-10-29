/**
 * Learn Smart Hub - Dashboard "Premium library" panel.
 *
 * Drop-in companion for the dashboard-premium-panel.html block. It asks the
 * backend for the student's Premium status once, then paints the subject
 * tiles with the unlocked or locked state. Dashboard.js keeps its own
 * Premium status call; this file stands alone so nothing has to be merged.
 */

import { auth } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const BACKEND = "https://learn-smart-hub-backend.onrender.com";

const SUBJECTS = [
    "Mathematics",
    "English",
    "Kiswahili",
    "Science",
    "Social Sciences"
];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* Wait for the pasted block to exist, in case this module runs first. */
async function findPanel(attempts = 20) {
    for (let i = 0; i < attempts; i += 1) {
        const panel = document.getElementById("pmPanelSubjects");
        if (panel) return panel;
        await wait(100);
    }
    return null;
}

function paintSubjects(panel, premium) {
    panel.innerHTML = SUBJECTS.map((subject) => {
        const href = `premium-materials.html?subject=${encodeURIComponent(subject)}`;

        return `
            <a class="pm-panel-tile${premium ? "" : " is-locked"}" href="${href}">
                <strong>${subject}</strong>
                <span>${premium ? "Premium shelf open" : "Premium required"}</span>
            </a>`;
    }).join("");
}

async function run() {
    const panel = await findPanel();
    if (!panel) return;

    const statusLine = document.getElementById("pmPanelStatus");
    const footLine = document.getElementById("pmPanelFoot");

    paintSubjects(panel, false);

    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            if (statusLine) statusLine.textContent = "Log in to see your Premium shelf.";
            if (footLine) footLine.textContent = "";
            paintSubjects(panel, false);
            return;
        }

        try {
            const idToken = await user.getIdToken();

            const response = await fetch(`${BACKEND}/api/premium/status`, {
                headers: { Authorization: `Bearer ${idToken}` }
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Premium status request failed");
            }

            const active = result.status === "active";
            const plan = result.plan && result.plan !== "none"
                ? result.plan.charAt(0).toUpperCase() + result.plan.slice(1)
                : null;

            if (statusLine) {
                statusLine.textContent = active
                    ? `Unlocked on the ${plan ? plan + " " : ""}plan. Every pack, workbook and quiz bank is open.`
                    : "You are on the free shelf. Premium opens 25 packs, schemes and masterclasses.";
            }

            if (footLine) {
                footLine.textContent = active
                    ? "Pick a subject to continue where you left off."
                    : "Upgrade on the Premium page to unlock everything at once.";
            }

            paintSubjects(panel, active);
        } catch (error) {
            console.error("Premium panel error:", error);
            if (statusLine) {
                statusLine.textContent = "Could not check your Premium shelf right now.";
            }
            paintSubjects(panel, false);
        }
    });
}

run();
