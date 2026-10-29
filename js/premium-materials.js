/**
 * Learn Smart Hub - Premium library page.
 *
 * Two gates sit on top of each other:
 *   1. gate.js sends signed-out visitors to login.html.
 *   2. this file asks the M-Pesa backend whether the signed-in student has
 *      an active Premium plan, and only then opens a material.
 *
 * Nothing here reads Firestore. Premium status comes from
 * GET /api/premium/status with the Firebase ID token, same as premium.js.
 */

import { auth } from "../firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const BACKEND = "https://learn-smart-hub-backend.onrender.com";

const MATERIALS = window.PREMIUM_MATERIALS || [];

const state = {
    user: null,
    premium: false,
    plan: "none",
    subject: "All",
    level: "All",
    type: "All",
    query: ""
};

/* ---------------------------------------------------------------- elements */

const el = (id) => document.getElementById(id);

const grid = el("materialGrid");
const countLine = el("materialCount");
const searchInput = el("premiumSearch");
const subjectChips = el("subjectChips");
const typeSelect = el("typeFilter");
const levelSelect = el("levelFilter");
const statusPill = el("premiumPill");
const paywall = el("paywallBanner");
const reader = el("reader");
const readerTitle = el("readerTitle");
const readerMeta = el("readerMeta");
const readerBody = el("readerBody");
const emptyState = el("emptyState");
const toast = el("premiumToast");

/* ------------------------------------------------------------- small utils */

function say(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-on");
    clearTimeout(say._t);
    say._t = setTimeout(() => toast.classList.remove("is-on"), 3200);
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function formatDate(iso) {
    if (!iso) return "";
    const d = new Date(iso + "T00:00:00");
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

/* ----------------------------------------------------------- premium check */

async function loadPremiumStatus(user) {
    if (!user) {
        state.premium = false;
        state.plan = "none";
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

        state.premium = result.status === "active";
        state.plan = result.plan || "none";
    } catch (error) {
        console.error("Premium status error:", error);
        state.premium = false;
        state.plan = "none";
        say("Could not confirm Premium status. Materials stay locked for now.");
    }
}

function paintStatus() {
    if (!statusPill) return;

    if (!state.user) {
        statusPill.textContent = "Not signed in";
        statusPill.dataset.state = "out";
        return;
    }

    if (state.premium) {
        const plan = state.plan !== "none"
            ? state.plan.charAt(0).toUpperCase() + state.plan.slice(1)
            : "Active";

        statusPill.textContent = `Premium ${plan}`;
        statusPill.dataset.state = "active";
        return;
    }

    statusPill.textContent = "Free account";
    statusPill.dataset.state = "free";
}

/* ---------------------------------------------------------------- filters */

function subjects() {
    return ["All", ...new Set(MATERIALS.map((m) => m.subject))];
}

function types() {
    return ["All", ...new Set(MATERIALS.map((m) => m.type))];
}

/* Class levels, ordered by the number in the label (Grade 7 before Grade 12). */
function levels() {
    const seen = [...new Set(MATERIALS.map((m) => m.level).filter(Boolean))];

    const rank = (value) => {
        const digits = String(value).replace(/\D+/g, "");
        const number = digits ? parseInt(digits, 10) : 0;
        return /^pp/i.test(value) ? number - 100 : number;
    };

    return ["All", ...seen.sort((a, b) => rank(a) - rank(b))];
}

function paintLevelFilter() {
    if (!levelSelect) return;

    levelSelect.innerHTML = levels().map((level) => `
        <option value="${escapeHtml(level)}"${level === state.level ? " selected" : ""}>
            ${level === "All" ? "All class levels" : escapeHtml(level)}
        </option>
    `).join("");
}

function paintChips() {
    if (!subjectChips) return;

    subjectChips.innerHTML = subjects().map((subject) => `
        <button class="pm-chip" type="button" data-subject="${escapeHtml(subject)}"
            aria-pressed="${subject === state.subject ? "true" : "false"}">
            ${escapeHtml(subject)}
        </button>
    `).join("");

    subjectChips.querySelectorAll(".pm-chip").forEach((chip) => {
        chip.addEventListener("click", () => {
            state.subject = chip.dataset.subject;
            paintChips();
            paintGrid();
        });
    });
}

function paintTypeFilter() {
    if (!typeSelect) return;

    typeSelect.innerHTML = types().map((type) => `
        <option value="${escapeHtml(type)}"${type === state.type ? " selected" : ""}>
            ${escapeHtml(type)}
        </option>
    `).join("");
}

/* ------------------------------------------------------------------ render */

function visibleMaterials() {
    const q = state.query.trim().toLowerCase();

    return MATERIALS.filter((item) => {
        if (state.subject !== "All" && item.subject !== state.subject) return false;
        if (state.level !== "All" && item.level !== state.level) return false;
        if (state.type !== "All" && item.type !== state.type) return false;

        if (!q) return true;

        return (
            item.title.toLowerCase().includes(q) ||
            item.summary.toLowerCase().includes(q) ||
            item.subject.toLowerCase().includes(q) ||
            String(item.level || "").toLowerCase().includes(q) ||
            item.type.toLowerCase().includes(q)
        );
    });
}

function paintGrid() {
    if (!grid) return;

    const items = visibleMaterials();
    const total = MATERIALS.length;

    if (countLine) {
        countLine.textContent = state.premium
            ? `Showing ${items.length} of ${total} premium resources.`
            : `Showing ${items.length} of ${total} premium resources. ${total} unlock with Premium.`;
    }

    if (!items.length) {
        grid.innerHTML = "";
        if (emptyState) emptyState.hidden = false;
        return;
    }

    if (emptyState) emptyState.hidden = true;

    grid.innerHTML = items.map((item) => {
        const unlocked = state.premium;
        const lockedClass = unlocked ? "is-open" : "is-locked";

        return `
        <article class="pm-card ${lockedClass}">
            <div class="pm-card-top">
                <span class="pm-tag pm-tag-${item.subject.split(" ")[0].toLowerCase()}">${escapeHtml(item.subject)}</span>
                <span class="pm-type">${escapeHtml(item.level || "Grade 10")} · ${escapeHtml(item.type)}</span>
            </div>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.summary)}</p>
            <p class="pm-meta">${escapeHtml(item.meta)} · Updated ${formatDate(item.updated)}</p>
            <div class="pm-card-foot">
                ${unlocked
                    ? `<button class="btn btn-primary btn-sm" type="button" data-open="${item.id}">Open material</button>`
                    : `<button class="btn btn-primary btn-sm" type="button" data-lock="${item.id}">Unlock with Premium</button>`
                }
                <span class="pm-lock" aria-hidden="true">${unlocked ? "Open" : "Locked"}</span>
            </div>
        </article>`;
    }).join("");

    grid.querySelectorAll("[data-open]").forEach((button) => {
        button.addEventListener("click", () => openReader(button.dataset.open));
    });

    grid.querySelectorAll("[data-lock]").forEach((button) => {
        button.addEventListener("click", () => {
            const item = MATERIALS.find((m) => m.id === button.dataset.lock);
            showPaywall(item);
        });
    });
}

/* ------------------------------------------------------------------ reader */

function openReader(id) {
    const item = MATERIALS.find((m) => m.id === id);
    if (!item || !reader) return;

    if (!state.premium) {
        showPaywall(item);
        return;
    }

    readerTitle.textContent = item.title;
    readerMeta.textContent = `${item.subject} · ${item.level || "Grade 10"} · ${item.type} · ${item.meta} · Updated ${formatDate(item.updated)}`;
    readerBody.innerHTML = `<div class="pm-prose">${item.body}</div>`;

    reader.hidden = false;
    reader.setAttribute("aria-hidden", "false");
    document.body.classList.add("pm-no-scroll");
    reader.scrollTop = 0;
    el("readerClose")?.focus();

    if (history.replaceState) {
        history.replaceState(null, "", `?material=${encodeURIComponent(item.id)}`);
    }
}

function closeReader() {
    if (!reader) return;
    reader.hidden = true;
    reader.setAttribute("aria-hidden", "true");
    document.body.classList.remove("pm-no-scroll");

    if (history.replaceState) {
        const subject = state.subject === "All" ? "" : `?subject=${encodeURIComponent(state.subject)}`;
        history.replaceState(null, "", subject || location.pathname);
    }
}

/* ----------------------------------------------------------------- paywall */

function showPaywall(item) {
    if (!paywall) return;

    const name = el("paywallMaterial");
    if (name) {
        name.textContent = item
            ? item.title
            : "this premium resource";
    }

    paywall.hidden = false;
    paywall.setAttribute("aria-hidden", "false");
    document.body.classList.add("pm-no-scroll");
    el("paywallClose")?.focus();
}

function closePaywall() {
    if (!paywall) return;
    paywall.hidden = true;
    paywall.setAttribute("aria-hidden", "true");
    document.body.classList.remove("pm-no-scroll");
}

/* --------------------------------------------------------------- lifecycle */

function wire() {
    searchInput?.addEventListener("input", () => {
        state.query = searchInput.value;
        paintGrid();
    });

    typeSelect?.addEventListener("change", () => {
        state.type = typeSelect.value;
        paintGrid();
    });

    levelSelect?.addEventListener("change", () => {
        state.level = levelSelect.value;
        paintGrid();
    });

    el("readerClose")?.addEventListener("click", closeReader);
    el("paywallClose")?.addEventListener("click", closePaywall);
    el("paywallDismiss")?.addEventListener("click", closePaywall);

    el("logoutButton")?.addEventListener("click", async () => {
        await signOut(auth);
        location.replace("login.html");
    });

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        if (reader && !reader.hidden) closeReader();
        if (paywall && !paywall.hidden) closePaywall();
    });
}

function applyUrlState() {
    const params = new URLSearchParams(location.search);
    const subject = params.get("subject");

    if (subject) {
        const match = subjects().find(
            (s) => s.toLowerCase() === subject.toLowerCase()
        );
        if (match) state.subject = match;
    }

    const materialId = params.get("material");
    if (materialId) {
        setTimeout(() => openReader(materialId), 0);
    }
}

/* Keep the hero stats and paywall copy in step with the catalogue. */
function paintStats() {
    const levelSet = new Set(MATERIALS.map((m) => m.level).filter(Boolean));
    const subjectSet = new Set(MATERIALS.map((m) => m.subject));

    const subjectSlot = el("statSubjects");
    const resourceSlot = el("statResources");
    const levelSlot = el("statLevels");
    const paywallCount = el("paywallCount");

    if (subjectSlot) subjectSlot.textContent = `${subjectSet.size} subjects`;
    if (resourceSlot) resourceSlot.textContent = `${MATERIALS.length} premium resources`;
    if (levelSlot) levelSlot.textContent = `${levelSet.size} class levels`;
    if (paywallCount) {
        paywallCount.textContent = `All ${MATERIALS.length} premium resources, every subject and class level`;
    }
}

async function start() {
    wire();
    paintTypeFilter();
    paintLevelFilter();
    paintStats();
    paintChips();
    applyUrlState();
    paintStatus();
    paintGrid();

    const nameSlot = el("studentName");

    onAuthStateChanged(auth, async (user) => {
        state.user = user;

        if (nameSlot) {
            nameSlot.textContent = user
                ? (user.displayName || (user.email || "").split("@")[0] || "Student")
                : "Student";
        }

        if (!user) {
            state.premium = false;
            paintStatus();
            paintGrid();
            return;
        }

        if (statusPill) statusPill.textContent = "Checking Premium...";

        await loadPremiumStatus(user);

        paintStatus();
        paintGrid();
    });
}

start();
