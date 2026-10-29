/**
 * Learn Smart Hub - admin app.
 *
 * One data source: GET /api/admin/overview on the Render backend, the same
 * endpoint the old admin page used, so nothing on the server has to change.
 *
 *   students  { total, activePremium }
 *   revenue   { allTime, thisMonth, paidCount, pendingCount, failedCount }
 *   payments  [{ amount, plan, phoneNumber, createdAt, status }]
 *   openSupport, support [{ id, topic, email, message, mpesaCode, status, createdAt }]
 *   currentAdmin
 *
 * Views are client-side and hash-addressed, so the whole app is one page.
 */

import { auth } from "../firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const BACKEND = "https://learn-smart-hub-backend.onrender.com";

const MATERIALS = window.PREMIUM_MATERIALS || [];

/* ------------------------------------------------------------------ config */

const VIEWS = {
    progress: { title: "Progress", sub: "Where Learn Smart Hub stands today" },
    revenue: { title: "Revenue", sub: "M-Pesa payments, all time and this month" },
    students: { title: "Students", sub: "Registration and upgrade numbers" },
    support: { title: "Support", sub: "Messages from students and parents" },
    content: { title: "Content", sub: "What each subject has, free and premium" }
};

/**
 * Launch checklist. `state` is what is true today, `weight` is how much of the
 * launch it accounts for. Update the states here as work lands; the readiness
 * score recalculates itself.
 */
const CHECKLIST = [
    {
        id: "site",
        title: "Site live on GitHub Pages",
        note: "Every page returns 200 on the custom Pages URL.",
        state: "done",
        weight: 10
    },
    {
        id: "login",
        title: "Login gate on all study pages",
        note: "Signed-out visitors land on login.html with a next= link back.",
        state: "done",
        weight: 8
    },
    {
        id: "firestore",
        title: "Firestore closed to browser reads",
        note: "Premium status and plan choice go through the backend only.",
        state: "done",
        weight: 8
    },
    {
        id: "premium-library",
        title: "Premium library published",
        note: "Premium shelf across five subjects and Grades 7 to 12, with the dashboard shelf.",
        state: "done",
        weight: 8
    },
    {
        id: "mpesa-live",
        title: "M-Pesa on live credentials",
        note: "Still sandbox, so a checkout will not charge a real number.",
        state: "blocked",
        weight: 26
    },
    {
        id: "paywall",
        title: "Paid checkout tested end to end",
        note: "One real payment from premium.html, then Premium active on the dashboard.",
        state: "blocked",
        weight: 18
    },
    {
        id: "pricing",
        title: "Plan prices confirmed",
        note: "Termly and yearly amounts checked against the pay button.",
        state: "active",
        weight: 6
    },
    {
        id: "support",
        title: "Support inbox cleared",
        note: "Counted from the live overview: open messages below.",
        state: "active",
        weight: 8,
        dynamic: "support"
    },
    {
        id: "backup",
        title: "Weekly data backup",
        note: "An export of users and payments kept somewhere you can restore from.",
        state: "active",
        weight: 8
    }
];

/** Free pages that ship in the repo, checked when the admin app was built. */
const CONTENT = [
    {
        subject: "Mathematics",
        hub: "mathematics.html",
        pages: ["Notes", "Past papers", "Quizzes", "Video lessons"]
    },
    {
        subject: "English",
        hub: "english.html",
        pages: ["Notes", "Past papers", "Quizzes", "Video lessons"]
    },
    {
        subject: "Kiswahili",
        hub: "kiswahili.html",
        pages: ["Notes", "Past papers", "Quizzes", "Video lessons"]
    },
    {
        subject: "Science",
        hub: "science.html",
        pages: ["Notes", "Past papers", "Quizzes", "Video lessons"]
    },
    {
        subject: "Social Sciences",
        hub: "social-sciences.html",
        pages: ["Notes", "Past papers", "Quizzes", "Video lessons"]
    }
];

/* ------------------------------------------------------------------- state */

const state = {
    user: null,
    data: null,
    loadedAt: null,
    error: null,
    view: "progress",
    paymentFilter: "all",
    denied: false
};

/* ---------------------------------------------------------------- elements */

const $ = (id) => document.getElementById(id);

const main = $("adminView");

/* ----------------------------------------------------------------- helpers */

const money = (v) => "KSh " + Number(v || 0).toLocaleString("en-KE");

const when = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString("en-KE", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
    });
};

const pct = (part, whole) => {
    if (!whole) return 0;
    return Math.round((part / whole) * 100);
};

const esc = (v) =>
    String(v == null ? "" : v)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

function toast(message) {
    const el = $("adminToast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("is-on");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove("is-on"), 2600);
}

function pill(status) {
    const safe = ["paid", "pending", "failed", "resolved", "open"].includes(status)
        ? status
        : "pending";
    return `<span class="a-pill ${safe}">${esc(status)}</span>`;
}

/** Readiness score from the checklist, with the support item read live. */
function checklist() {
    const open = state.data ? Number(state.data.openSupport || 0) : null;

    return CHECKLIST.map((item) => {
        if (item.dynamic !== "support" || open === null) return { ...item };

        return {
            ...item,
            state: open === 0 ? "done" : "active",
            note:
                open === 0
                    ? "Nothing waiting in the support inbox."
                    : `${open} message${open === 1 ? "" : "s"} still waiting for a reply.`
        };
    });
}

function readiness(items) {
    const total = items.reduce((sum, i) => sum + i.weight, 0);
    const done = items
        .filter((i) => i.state === "done")
        .reduce((sum, i) => sum + i.weight, 0);

    return { total, done, percent: total ? Math.round((done / total) * 100) : 0 };
}

function premiumCounts() {
    const map = new Map();
    MATERIALS.forEach((m) => {
        map.set(m.subject, (map.get(m.subject) || 0) + 1);
    });
    return map;
}

/* ------------------------------------------------------------------- views */

function viewProgress() {
    const d = state.data;
    const items = checklist();
    const ready = readiness(items);
    const students = d.students || {};
    const revenue = d.revenue || {};

    const outstanding = items.filter((i) => i.state !== "done");
    const biggest = outstanding.sort((a, b) => b.weight - a.weight)[0];

    const conversion = pct(students.activePremium || 0, students.total || 0);

    const recent = (d.payments || []).slice(0, 5);
    const waiting = (d.support || []).filter((s) => s.status !== "resolved").slice(0, 3);

    return `
        <section class="a-card">
            <div class="a-readiness">
                <div>
                    <p class="a-big-number">${ready.percent}<span>%</span></p>
                    <p class="a-big-note">
                        Launch readiness across ${items.length} checks.
                        ${biggest
                            ? `Biggest gap: <strong>${esc(biggest.title)}</strong>.`
                            : "Everything on the list is done."}
                    </p>
                    <div class="a-bar ${ready.percent >= 80 ? "is-good" : ready.percent >= 50 ? "is-warn" : "is-bad"}">
                        <span style="width:${ready.percent}%"></span>
                    </div>
                </div>

                <ul class="a-checklist">
                    ${items.map((item) => `
                        <li data-state="${item.state}">
                            <span class="tick" aria-hidden="true">${item.state === "done" ? "✓" : item.state === "blocked" ? "!" : "·"}</span>
                            <div>
                                <p class="item-title">${esc(item.title)}
                                    <span class="weight">· ${item.weight} pts</span>
                                </p>
                                <p class="item-note">${esc(item.note)}</p>
                            </div>
                        </li>
                    `).join("")}
                </ul>
            </div>
        </section>

        <div class="a-grid" style="margin-top:14px">
            <div class="a-kpi">
                <p class="label">Students</p>
                <p class="value">${students.total === null || students.total === undefined ? "—" : students.total}</p>
                <p class="note">Accounts registered on the site</p>
            </div>
            <div class="a-kpi ${conversion > 0 ? "is-good" : ""}">
                <p class="label">Premium active</p>
                <p class="value">${students.activePremium ?? 0} <small>${conversion}% of students</small></p>
                <p class="note">Plan confirmed by the backend</p>
            </div>
            <div class="a-kpi">
                <p class="label">Collected this month</p>
                <p class="value">${money(revenue.thisMonth)}</p>
                <p class="note">All time ${money(revenue.allTime)}</p>
            </div>
            <div class="a-kpi ${Number(d.openSupport) > 0 ? "is-warn" : "is-good"}">
                <p class="label">Waiting for a reply</p>
                <p class="value">${d.openSupport ?? 0}</p>
                <p class="note">${Number(d.openSupport) > 0 ? "Answer these in Support" : "Inbox is clear"}</p>
            </div>
        </div>

        <div class="a-grid two" style="margin-top:14px">
            <section class="a-card">
                <h2>Upgrade funnel</h2>
                <p class="a-lead">Registered accounts, then the ones actually paying.</p>

                <div style="margin-bottom:12px">
                    <div style="display:flex;justify-content:space-between;font-size:0.82rem;color:var(--ink-soft);margin-bottom:5px">
                        <span>Registered</span><span>${students.total ?? 0}</span>
                    </div>
                    <div class="a-bar"><span style="width:100%"></span></div>
                </div>

                <div>
                    <div style="display:flex;justify-content:space-between;font-size:0.82rem;color:var(--ink-soft);margin-bottom:5px">
                        <span>Premium</span><span>${students.activePremium ?? 0}</span>
                    </div>
                    <div class="a-bar is-good"><span style="width:${Math.max(conversion, 1)}%"></span></div>
                </div>

                <p class="a-hint">
                    ${conversion === 0
                        ? "Nobody has upgraded yet. That is the M-Pesa credential swap, not the shelf itself."
                        : `${conversion}% of registered students are on a paid plan.`}
                </p>
            </section>

            <section class="a-card">
                <h2>Payments</h2>
                <p class="a-lead">
                    ${revenue.paidCount || 0} paid · ${revenue.pendingCount || 0} pending ·
                    ${revenue.failedCount || 0} failed
                </p>

                ${recent.length
                    ? `<table class="a-table">
                        <thead><tr><th>Amount</th><th>Plan</th><th>When</th><th class="num">Status</th></tr></thead>
                        <tbody>
                            ${recent.map((p) => `
                                <tr>
                                    <td>${money(p.amount)}</td>
                                    <td>${esc(p.plan || "—")}</td>
                                    <td>${esc(when(p.createdAt)) || "—"}</td>
                                    <td class="num">${pill(p.status)}</td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>`
                    : `<p class="a-empty">No payments yet. The first one lands here the moment someone pays.</p>`}
            </section>
        </div>

        <section class="a-card" style="margin-top:14px">
            <h2>Waiting on you</h2>
            <p class="a-lead">The messages that need an answer before anything else.</p>

            ${waiting.length
                ? waiting.map((item) => `
                    <div class="a-message">
                        <div class="body">
                            <span class="topic">${esc(item.topic || "Message")}</span>
                            <span class="meta"> · ${esc(item.email || "unknown")} · ${esc(when(item.createdAt))}</span>
                            <p class="text">${esc(item.message)}</p>
                        </div>
                        ${pill(item.status || "open")}
                    </div>
                `).join("")
                : `<p class="a-empty">Nothing waiting. The inbox is clear.</p>`}
        </section>
    `;
}

function viewRevenue() {
    const d = state.data;
    const revenue = d.revenue || {};
    const all = d.payments || [];
    const filtered =
        state.paymentFilter === "all"
            ? all
            : all.filter((p) => p.status === state.paymentFilter);

    const filters = ["all", "paid", "pending", "failed"];

    return `
        <div class="a-grid">
            <div class="a-kpi">
                <p class="label">Collected all time</p>
                <p class="value">${money(revenue.allTime)}</p>
                <p class="note">${revenue.paidCount || 0} successful payments</p>
            </div>
            <div class="a-kpi">
                <p class="label">This month</p>
                <p class="value">${money(revenue.thisMonth)}</p>
                <p class="note">Resets on the 1st</p>
            </div>
            <div class="a-kpi ${Number(revenue.pendingCount) ? "is-warn" : ""}">
                <p class="label">Pending</p>
                <p class="value">${revenue.pendingCount || 0}</p>
                <p class="note">Started but not confirmed</p>
            </div>
            <div class="a-kpi ${Number(revenue.failedCount) ? "is-bad" : ""}">
                <p class="label">Failed</p>
                <p class="value">${revenue.failedCount || 0}</p>
                <p class="note">Cancelled or rejected</p>
            </div>
        </div>

        <section class="a-card" style="margin-top:14px">
            <h2>Payment history</h2>
            <p class="a-lead">Newest first. ${all.length} record${all.length === 1 ? "" : "s"} in this view.</p>

            <div class="a-filters">
                ${filters.map((f) => `
                    <button type="button" data-filter="${f}" aria-pressed="${state.paymentFilter === f}">
                        ${f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                `).join("")}
            </div>

            ${filtered.length
                ? `<table class="a-table">
                    <thead>
                        <tr><th>Amount</th><th>Plan</th><th>Phone</th><th>When</th><th class="num">Status</th></tr>
                    </thead>
                    <tbody>
                        ${filtered.map((p) => `
                            <tr>
                                <td>${money(p.amount)}</td>
                                <td>${esc(p.plan || "—")}</td>
                                <td>${esc(p.phoneNumber || "—")}</td>
                                <td>${esc(when(p.createdAt)) || "—"}</td>
                                <td class="num">${pill(p.status)}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>`
                : `<p class="a-empty">Nothing with that status yet.</p>`}
        </section>
    `;
}

function viewStudents() {
    const d = state.data;
    const students = d.students || {};
    const conversion = pct(students.activePremium || 0, students.total || 0);
    const free = Math.max((students.total || 0) - (students.activePremium || 0), 0);

    return `
        <div class="a-grid">
            <div class="a-kpi">
                <p class="label">Registered</p>
                <p class="value">${students.total ?? "—"}</p>
                <p class="note">Every account created</p>
            </div>
            <div class="a-kpi is-good">
                <p class="label">Premium</p>
                <p class="value">${students.activePremium ?? 0}</p>
                <p class="note">${conversion}% of the base</p>
            </div>
            <div class="a-kpi">
                <p class="label">Free accounts</p>
                <p class="value">${free}</p>
                <p class="note">The upgrade target</p>
            </div>
            <div class="a-kpi">
                <p class="label">Students per premium</p>
                <p class="value">${students.activePremium ? Math.round((students.total || 0) / students.activePremium) : "—"}</p>
                <p class="note">Lower is better</p>
            </div>
        </div>

        <section class="a-card" style="margin-top:14px">
            <h2>Who they are</h2>
            <p class="a-lead">The overview endpoint returns totals only, so this page shows what the backend actually knows.</p>

            <table class="a-table">
                <thead><tr><th>Group</th><th class="num">Accounts</th><th class="num">Share</th></tr></thead>
                <tbody>
                    <tr>
                        <td>Registered</td>
                        <td class="num">${students.total ?? 0}</td>
                        <td class="num">100%</td>
                    </tr>
                    <tr>
                        <td>Premium active</td>
                        <td class="num">${students.activePremium ?? 0}</td>
                        <td class="num">${conversion}%</td>
                    </tr>
                    <tr>
                        <td>Free</td>
                        <td class="num">${free}</td>
                        <td class="num">${100 - conversion}%</td>
                    </tr>
                </tbody>
            </table>

            <p class="a-hint">
                A student-by-student list, with email, plan and last active date, needs one more
                backend route (<code>/api/admin/students</code>). Tell me and I will add it to the
                Render app; this page will pick it up without a redesign.
            </p>
        </section>
    `;
}

function viewSupport() {
    const d = state.data;
    const list = d.support || [];
    const openCount = Number(d.openSupport ?? list.filter((s) => s.status !== "resolved").length);

    return `
        <div class="a-grid">
            <div class="a-kpi ${openCount ? "is-warn" : "is-good"}">
                <p class="label">Waiting</p>
                <p class="value">${openCount}</p>
                <p class="note">Unresolved messages</p>
            </div>
            <div class="a-kpi">
                <p class="label">In this view</p>
                <p class="value">${list.length}</p>
                <p class="note">Newest first</p>
            </div>
            <div class="a-kpi">
                <p class="label">Resolved</p>
                <p class="value">${list.filter((s) => s.status === "resolved").length}</p>
                <p class="note">Marked handled</p>
            </div>
        </div>

        <section class="a-card" style="margin-top:14px">
            <h2>Messages</h2>
            <p class="a-lead">Marking one handled removes it from the waiting count.</p>

            ${list.length
                ? list.map((item) => `
                    <div class="a-message">
                        <div class="body">
                            <span class="topic">${esc(item.topic || "Message")}</span>
                            <span class="meta"> · ${esc(item.email || "unknown")} · ${esc(when(item.createdAt))}</span>
                            ${item.mpesaCode ? `<div class="meta">M-Pesa: ${esc(item.mpesaCode)}</div>` : ""}
                            <p class="text">${esc(item.message)}</p>
                        </div>
                        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
                            ${pill(item.status || "open")}
                            ${item.status === "resolved"
                                ? ""
                                : `<button class="btn btn-ghost btn-sm" type="button" data-resolve="${esc(item.id)}">Mark handled</button>`}
                        </div>
                    </div>
                `).join("")
                : `<p class="a-empty">No messages yet.</p>`}
        </section>
    `;
}

function viewContent() {
    const counts = premiumCounts();
    const totalPremium = MATERIALS.length;
    const subjects = new Set(MATERIALS.map((m) => m.subject));

    return `
        <div class="a-grid">
            <div class="a-kpi">
                <p class="label">Subjects</p>
                <p class="value">${CONTENT.length}</p>
                <p class="note">Five KCSE subject areas</p>
            </div>
            <div class="a-kpi">
                <p class="label">Free pages</p>
                <p class="value">${CONTENT.reduce((n, c) => n + c.pages.length, 0)}</p>
                <p class="note">Notes, papers, quizzes, videos</p>
            </div>
            <div class="a-kpi is-good">
                <p class="label">Premium resources</p>
                <p class="value">${totalPremium}</p>
                <p class="note">Across ${subjects.size} subjects</p>
            </div>
            <div class="a-kpi">
                <p class="label">Average per subject</p>
                <p class="value">${totalPremium ? Math.round(totalPremium / CONTENT.length) : 0}</p>
                <p class="note">Premium items</p>
            </div>
        </div>

        <section class="a-card" style="margin-top:14px">
            <h2>Coverage by subject</h2>
            <p class="a-lead">Free pages come from the repository as committed; premium counts are read live from the Premium library data.</p>

            <table class="a-table">
                <thead>
                    <tr><th>Subject</th><th>Free pages</th><th class="num">Premium</th><th>Hub</th></tr>
                </thead>
                <tbody>
                    ${CONTENT.map((row) => `
                        <tr>
                            <td><strong>${esc(row.subject)}</strong></td>
                            <td>${row.pages.map((p) => `<span class="a-pill done" style="margin:2px 4px 2px 0">${esc(p)}</span>`).join("")}</td>
                            <td class="num">${counts.get(row.subject) || 0}</td>
                            <td><a href="${esc(row.hub)}">${esc(row.hub)}</a></td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>

            <p class="a-hint">
                The premium shelf itself is at <a href="premium-materials.html">premium-materials.html</a>,
                linked from the dashboard panel and from premium.html.
            </p>
        </section>
    `;
}

const RENDERERS = {
    progress: viewProgress,
    revenue: viewRevenue,
    students: viewStudents,
    support: viewSupport,
    content: viewContent
};

/* ---------------------------------------------------------------- painting */

function paintChrome() {
    const meta = VIEWS[state.view] || VIEWS.progress;
    $("viewTitle").textContent = meta.title;
    $("viewSub").textContent = meta.sub;

    document.querySelectorAll(".admin-nav button").forEach((button) => {
        if (button.dataset.view === state.view) {
            button.setAttribute("aria-current", "page");
        } else {
            button.removeAttribute("aria-current");
        }
    });

    const openDot = $("navDotSupport");
    if (openDot) {
        const open = state.data ? Number(state.data.openSupport || 0) : 0;
        openDot.textContent = open > 0 ? String(open) : "";
        openDot.className = open > 0 ? "a-pill open" : "";
    }

    const stamp = $("lastUpdated");
    if (stamp) {
        stamp.textContent = state.loadedAt
            ? "Updated " + state.loadedAt.toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" })
            : "";
    }
}

function paint() {
    paintChrome();

    if (state.denied) {
        paintDenied();
        return;
    }

    if (state.error) {
        paintError();
        return;
    }

    if (!state.data) {
        main.innerHTML = `
            <div class="a-grid">
                ${[1, 2, 3, 4].map(() => `
                    <div class="a-kpi">
                        <div class="a-skeleton" style="width:60%"></div>
                        <div class="a-skeleton" style="width:40%;height:26px;margin-top:10px"></div>
                    </div>
                `).join("")}
            </div>
            <div class="a-card" style="margin-top:14px">
                <div class="a-skeleton" style="width:80%"></div>
                <div class="a-skeleton" style="width:95%;margin-top:10px"></div>
                <div class="a-skeleton" style="width:70%;margin-top:10px"></div>
            </div>`;
        return;
    }

    if (state.view === "revenue") {
        main.innerHTML = RENDERERS.revenue();
        main.querySelectorAll("[data-filter]").forEach((button) => {
            button.addEventListener("click", () => {
                state.paymentFilter = button.dataset.filter;
                paint();
            });
        });
        return;
    }

    main.innerHTML = RENDERERS[state.view]();

    main.querySelectorAll("[data-resolve]").forEach((button) => {
        button.addEventListener("click", () => resolveSupport(button));
    });
}

/* ------------------------------------------------------------------ actions */

async function loadOverview() {
    if (!state.user) return;

    const refresh = $("refreshButton");
    if (refresh) refresh.disabled = true;

    state.serverMessage = "";
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25000);

    try {
        const idToken = await state.user.getIdToken();

        const response = await fetch(`${BACKEND}/api/admin/overview`, {
            headers: { Authorization: `Bearer ${idToken}` },
            signal: controller.signal
        });

        if (response.status === 403) {
            const body = await response.json().catch(() => ({}));
            state.serverMessage = body.message || "";
            state.error = null;
            state.data = null;
            state.denied = true;
            return;
        }

        if (response.status === 401) {
            throw new Error("SESSION_EXPIRED");
        }

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || `the overview route returned ${response.status}`);
        }

        state.data = data;
        state.error = null;
        state.denied = false;
        state.loadedAt = new Date();

        const copy = $("copySummary");
        if (copy) copy.hidden = false;

        const who = $("whoAmI");
        if (who) who.textContent = data.currentAdmin || state.user.email || "Owner";
    } catch (error) {
        console.error("Admin overview error:", error);

        if (error.name === "AbortError") {
            state.error = "TIMEOUT";
        } else if (error.message === "SESSION_EXPIRED") {
            state.error = "SESSION_EXPIRED";
        } else if (error instanceof TypeError) {
            state.error = "NETWORK";
        } else {
            state.error = "SERVER";
            state.serverMessage = error.message;
        }
    } finally {
        clearTimeout(timer);
        if (refresh) refresh.disabled = false;
        paint();
    }
}

function errorCopy() {
    if (state.error === "TIMEOUT") {
        return "The backend did not answer within 25 seconds. The Render free instance sleeps when nobody visits, and the first visit back can take a minute.";
    }
    if (state.error === "SESSION_EXPIRED") {
        return "Your sign-in has expired. Sign in again and the numbers will load.";
    }
    if (state.error === "NETWORK") {
        return "The page could not reach the backend at all. Check the connection on this device, then try again.";
    }
    if (state.serverMessage) {
        return `The backend answered: ${state.serverMessage}`;
    }
    return "The backend answered, but the numbers could not be read from the response.";
}

function paintError() {
    main.innerHTML = `
        <section class="a-card">
            <h2>Could not load the overview</h2>
            <p class="a-lead">${esc(errorCopy())}</p>
            <div class="a-actions">
                <button class="a-btn a-btn-primary" type="button" data-retry>Try again</button>
                <a class="a-btn" href="login.html?next=admin.html">Sign in again</a>
                <a class="a-btn" href="dashboard.html">Back to the site</a>
            </div>
            <p class="a-hint">Signed in as ${esc(state.user?.email || "unknown")}.</p>
        </section>`;

    main.querySelectorAll("[data-retry]").forEach((button) => {
        button.addEventListener("click", () => {
            state.error = null;
            state.loading = true;
            paint();
            loadOverview();
        });
    });
}

function paintDenied() {
    const copy = $("copySummary");
    if (copy) copy.hidden = true;

    main.innerHTML = `
        <section class="a-card">
            <h2>The backend did not accept this account as admin</h2>
            <p class="a-lead">
                You are signed in as ${esc(state.user?.email || "your account")}. The backend refused
                the request for that account${state.serverMessage ? `: ${esc(state.serverMessage)}` : ""}.
            </p>
            <div class="a-actions">
                <a class="a-btn a-btn-primary" href="login.html?next=admin.html">Sign in as the owner</a>
                <a class="a-btn" href="dashboard.html">Back to the site</a>
            </div>
            <p class="a-hint">
                If that email is the right one, the Render service still has a different admin
                email in its environment settings, so the fix is on the backend, not here.
            </p>
        </section>`;
}

async function resolveSupport(button) {
    button.disabled = true;

    try {
        const idToken = await state.user.getIdToken();

        const response = await fetch(
            `${BACKEND}/api/admin/support/${button.dataset.resolve}/resolve`,
            {
                method: "POST",
                headers: { Authorization: `Bearer ${idToken}` }
            }
        );

        if (!response.ok) throw new Error("Resolve failed");

        toast("Marked as handled");
        await loadOverview();
    } catch (error) {
        console.error("Resolve error:", error);
        button.disabled = false;
        toast("Could not mark that one. Try again.");
    }
}

function summaryText() {
    const d = state.data;
    if (!d) return "";

    const items = checklist();
    const ready = readiness(items);
    const outstanding = items.filter((i) => i.state !== "done");

    const lines = [
        `Learn Smart Hub - progress ${new Date().toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}`,
        `Launch readiness: ${ready.percent}% (${ready.done}/${ready.total} points)`,
        `Students: ${d.students?.total ?? 0} registered, ${d.students?.activePremium ?? 0} on Premium`,
        `Revenue: ${money(d.revenue?.allTime)} all time, ${money(d.revenue?.thisMonth)} this month`,
        `Payments: ${d.revenue?.paidCount || 0} paid, ${d.revenue?.pendingCount || 0} pending, ${d.revenue?.failedCount || 0} failed`,
        `Support: ${d.openSupport || 0} waiting`,
        "",
        "Still open:",
        ...outstanding.map((i) => `- ${i.title}: ${i.note}`)
    ];

    return lines.join("\n");
}

async function copySummary() {
    const text = summaryText();
    if (!text) return;

    try {
        await navigator.clipboard.writeText(text);
        toast("Summary copied");
    } catch (error) {
        const area = document.createElement("textarea");
        area.value = text;
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        area.remove();
        toast("Summary copied");
    }
}

/* -------------------------------------------------------------------- boot */

function setView(view, push = true) {
    state.view = RENDERERS[view] ? view : "progress";
    if (push && location.hash !== "#" + state.view) {
        history.replaceState(null, "", "#" + state.view);
    }
    paint();
}

function wire() {
    document.querySelectorAll(".admin-nav button").forEach((button) => {
        button.addEventListener("click", () => setView(button.dataset.view));
    });

    $("refreshButton")?.addEventListener("click", loadOverview);
    $("copySummary")?.addEventListener("click", copySummary);

    $("signOutButton")?.addEventListener("click", async () => {
        await signOut(auth);
        location.replace("login.html");
    });

    document.addEventListener("keydown", (event) => {
        if (event.target.matches("input, textarea, select")) return;
        if (event.key === "r" && !event.metaKey && !event.ctrlKey) loadOverview();
        const order = Object.keys(VIEWS);
        if (/^[1-9]$/.test(event.key)) {
            const target = order[Number(event.key) - 1];
            if (target) setView(target);
        }
    });

    window.addEventListener("hashchange", () => {
        setView(location.hash.replace("#", ""), false);
    });
}

function start() {
    document.body.classList.add("admin-ready");
    wire();
    setView(location.hash.replace("#", "") || "progress", false);
    paint();

    onAuthStateChanged(auth, (user) => {
        state.user = user;

        if (!user) {
            $("whoAmI").textContent = "Not signed in";
            main.innerHTML = `
                <section class="a-card">
                    <h2>Sign in to open the admin app</h2>
                    <p class="a-lead">The overview reads your admin token from the backend.</p>
                    <a class="btn btn-primary btn-sm" href="login.html">Go to login</a>
                </section>`;
            return;
        }

        const who = $("whoAmI");
        if (who) who.textContent = user.email || "Owner";

        loadOverview();
    });
}

start();
