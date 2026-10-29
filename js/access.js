/* Learn Smart Hub - premium access check.
 *
 * Every content renderer (notes, papers, quizzes, videos) waits on
 * window.LSH_ACCESS before deciding how much to open. It resolves to
 * { premium, plan }:
 *
 *   premium  true only when the backend says the signed-in student has an
 *            active plan
 *   plan     "weekly" | "monthly" | "term" | "none"
 *
 * This is a plain script rather than a module so the promise exists before
 * study.js and videos.js run, which are plain scripts too. Firebase loads
 * with a dynamic import, and any failure resolves to free so a page always
 * renders something.
 */

window.LSH_ACCESS = (async () => {

    const FREE = { premium: false, plan: "none" };

    const BACKEND = "https://learn-smart-hub-backend.onrender.com";

    let auth;
    let onAuthStateChanged;

    try {

        const firebase = await import("../firebase.js");

        auth = firebase.auth;

        const authSdk = await import(
            "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js"
        );

        onAuthStateChanged = authSdk.onAuthStateChanged;

    } catch (error) {

        return FREE;

    }

    const user = await new Promise(resolve => {

        let settled = false;

        const finish = value => {

            if (settled) {
                return;
            }

            settled = true;

            resolve(value || null);

        };

        try {
            onAuthStateChanged(auth, current => finish(current));
        } catch (error) {
            finish(null);
        }

        if (auth && auth.currentUser) {
            finish(auth.currentUser);
        }

        setTimeout(() => finish(null), 4000);

    });

    if (!user) {
        return FREE;
    }

    try {

        const token = await user.getIdToken();

        const response = await fetch(BACKEND + "/api/premium/status", {
            headers: { Authorization: "Bearer " + token }
        });

        if (!response.ok) {
            return FREE;
        }

        const data = await response.json();

        return {
            premium: data.premium === true,
            plan: data.plan || "none"
        };

    } catch (error) {

        return FREE;

    }

})();
