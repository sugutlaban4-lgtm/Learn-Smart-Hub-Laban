if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("service-worker.js")
            .then(() => {
                console.log("Learn Smart Hub service worker registered.");
            })
            .catch(error => {
                console.error("Service worker registration failed:", error);
            });
    });
}

/* ------------------------------------------------------------------- install
 *
 * Students can keep Learn-Smart-Hub-Laban on their home screen. Android and
 * desktop Chrome hand us a prompt we can fire from the bar; iPhone has no such
 * event, so there the bar explains the Share sheet instead. One bar, shown on
 * every page this file runs on, dismissed for a month when a student says no.
 */
(function () {
    const DISMISS_KEY = "lsh.install-dismissed";
    const DISMISS_DAYS = 30;

    const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true;

    if (standalone) return;

    const agent = navigator.userAgent;
    const ios = /iPad|iPhone|iPod/.test(agent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const iosSafari = ios && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(agent);

    let promptEvent = null;
    let bar = null;

    function dismissed() {
        try {
            const when = Number(localStorage.getItem(DISMISS_KEY) || 0);
            return when && (Date.now() - when) < DISMISS_DAYS * 24 * 60 * 60 * 1000;
        } catch (error) {
            return false;
        }
    }

    function dismiss() {
        try {
            localStorage.setItem(DISMISS_KEY, String(Date.now()));
        } catch (error) {
            /* private mode: just hide it for this visit */
        }
        hide();
    }

    function hide() {
        if (bar) bar.remove();
        bar = null;
        document.body.classList.remove("has-install-bar");
    }

    function show() {
        if (bar || dismissed()) return;
        if (!document.body) return;

        bar = document.createElement("div");
        bar.id = "installBar";
        bar.className = "install-bar";
        bar.setAttribute("role", "region");
        bar.setAttribute("aria-label", "Install Learn-Smart-Hub-Laban");

        bar.innerHTML = `
            <span class="install-bar-mark" aria-hidden="true">LS</span>
            <p class="install-bar-copy">
                <strong>Keep Learn-Smart-Hub-Laban</strong>
                <span>Opens like an app, with your notes kept for offline study.</span>
            </p>
            <button type="button" class="btn btn-primary btn-sm" id="installBarAction">Install</button>
            <button type="button" class="install-bar-close" id="installBarClose" aria-label="Not now">&times;</button>`;

        document.body.appendChild(bar);
        document.body.classList.add("has-install-bar");

        bar.querySelector("#installBarAction").addEventListener("click", ask);
        bar.querySelector("#installBarClose").addEventListener("click", dismiss);
    }

    async function ask() {
        if (promptEvent && typeof promptEvent.prompt === "function") {
            promptEvent.prompt();
            try {
                await promptEvent.userChoice;
            } catch (error) {
                console.error("Install prompt failed:", error);
            }
            promptEvent = null;
            hide();
            return;
        }

        showHelp();
    }

    function showHelp() {
        if (document.getElementById("installHelp")) return;

        const panel = document.createElement("div");
        panel.id = "installHelp";
        panel.className = "install-help";
        panel.setAttribute("role", "dialog");
        panel.setAttribute("aria-modal", "true");
        panel.setAttribute("aria-label", "Install Learn-Smart-Hub-Laban");

        const steps = iosSafari
            ? `<li>Tap the <strong>Share</strong> button in Safari.</li>
               <li>Scroll down and choose <strong>Add to Home Screen</strong>.</li>
               <li>Tap <strong>Add</strong>. It appears next to your other apps.</li>`
            : `<li>Open the browser menu (the three dots).</li>
               <li>Choose <strong>Install app</strong> or <strong>Add to Home screen</strong>.</li>
               <li>Confirm. It appears next to your other apps.</li>`;

        panel.innerHTML = `
            <div class="install-help-card">
                <h2>Add Learn-Smart-Hub-Laban to your home screen</h2>
                <p>It then opens like an app, without the address bar, and your notes stay on the device for studying offline.</p>
                <ol>${steps}</ol>
                <div class="install-help-actions">
                    <button type="button" class="btn btn-primary btn-sm" data-close>Got it</button>
                </div>
            </div>`;

        panel.addEventListener("click", (event) => {
            if (event.target === panel || event.target.hasAttribute("data-close")) {
                panel.remove();
            }
        });

        document.addEventListener("keydown", function escape(event) {
            if (event.key === "Escape") {
                panel.remove();
                document.removeEventListener("keydown", escape);
            }
        });

        document.body.appendChild(panel);
    }

    window.addEventListener("beforeinstallprompt", (event) => {
        event.preventDefault();
        promptEvent = event;
        show();
    });

    window.addEventListener("appinstalled", () => {
        promptEvent = null;
        hide();
    });

    // iPhone never fires beforeinstallprompt, so offer the Share sheet route.
    if (iosSafari) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", show);
        } else {
            show();
        }
    }
})();
