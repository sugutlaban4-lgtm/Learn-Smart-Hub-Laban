/**
 * Learn Smart Hub - sharing and search metadata.
 *
 * Two jobs, both done without touching every page by hand:
 *
 *   1. A "Share with a classmate" strip at the end of the content, with
 *      WhatsApp, the phone's own share sheet where it exists, and copy-link.
 *      WhatsApp is where students actually pass links, so it leads.
 *   2. JSON-LD structured data so Google can tell notes, quizzes, papers and
 *      videos apart instead of seeing 40 identical pages.
 *
 * Nothing here fetches anything, so it cannot break offline or on a slow
 * connection. If anything is missing it quietly does nothing.
 */

(function () {
    "use strict";

    var path = window.location.pathname;
    var file = (path.split("/").pop() || "index.html").toLowerCase();

    /* Pages where a share strip or a search entry makes no sense. */
    var SKIP_SHARE = /^(admin|login|signup|404|offline|onboarding)/;

    var BACKEND_FREE = true;

    function cleanUrl() {
        return window.location.origin + window.location.pathname;
    }

    function pageTitle() {
        var h1 = document.querySelector("main h1, h1");
        var raw = h1 ? h1.textContent : document.title;

        return raw
            .replace(/\s+/g, " ")
            .replace(/^-+\s*|\s*-+$/g, "")
            .trim();
    }

    /* ------------------------------------------------------------ share ---- */

    function buildShare() {
        if (SKIP_SHARE.test(file)) return;

        var main = document.querySelector("main");
        if (!main) return;
        if (document.getElementById("lshShareStrip")) return;

        var title = pageTitle();
        var url = cleanUrl();
        var text = title
            ? title + " - Learn Smart Hub"
            : "Learn Smart Hub - free notes, papers, quizzes and videos";

        var strip = document.createElement("section");
        strip.id = "lshShareStrip";
        strip.className = "lsh-share";
        strip.setAttribute("aria-label", "Share this page");

        var label = document.createElement("p");
        label.className = "lsh-share-label";
        label.textContent = "Found this useful? Send it to a classmate.";
        strip.appendChild(label);

        var row = document.createElement("div");
        row.className = "lsh-share-row";

        var wa = document.createElement("a");
        wa.className = "lsh-share-btn lsh-share-wa";
        wa.href = "https://wa.me/?text=" + encodeURIComponent(text + " " + url);
        wa.target = "_blank";
        wa.rel = "noopener";
        wa.textContent = "Share on WhatsApp";
        row.appendChild(wa);

        if (navigator.share) {
            var native = document.createElement("button");
            native.type = "button";
            native.className = "lsh-share-btn";
            native.textContent = "Share";
            native.addEventListener("click", function () {
                navigator.share({ title: "Learn Smart Hub", text: text, url: url })
                    .catch(function () { /* student backed out, nothing to do */ });
            });
            row.appendChild(native);
        }

        var copy = document.createElement("button");
        copy.type = "button";
        copy.className = "lsh-share-btn lsh-share-copy";
        copy.textContent = "Copy link";
        copy.addEventListener("click", function () {
            var done = function (ok) {
                copy.textContent = ok ? "Link copied" : "Copy failed";
                setTimeout(function () { copy.textContent = "Copy link"; }, 2200);
            };

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(url).then(function () { done(true); }, function () { done(fallbackCopy(url)); });
            } else {
                done(fallbackCopy(url));
            }
        });
        row.appendChild(copy);

        strip.appendChild(row);

        var footer = main.querySelector("footer") || document.querySelector("footer");
        if (footer && footer.parentElement) {
            footer.parentElement.insertBefore(strip, footer);
        } else {
            main.appendChild(strip);
        }
    }

    function fallbackCopy(value) {
        try {
            var area = document.createElement("textarea");
            area.value = value;
            area.setAttribute("readonly", "");
            area.style.position = "fixed";
            area.style.opacity = "0";
            document.body.appendChild(area);
            area.select();
            var ok = document.execCommand("copy");
            area.remove();
            return ok;
        } catch (error) {
            return false;
        }
    }

    /* ------------------------------------------------------- structured ---- */

    function resourceType() {
        if (/quiz/.test(file)) return "Quiz";
        if (/pastpaper|revisionpaper|past-paper/.test(file)) return "Exam paper";
        if (/video/.test(file)) return "Video lesson";
        if (/notes/.test(file)) return "Study notes";
        if (/premium/.test(file)) return "Course";
        if (/resource/.test(file)) return "Reference";
        return "WebPage";
    }

    function buildStructuredData() {
        if (SKIP_SHARE.test(file)) return;

        var title = document.title.split("|")[0].trim();
        var description = (document.querySelector('meta[name="description"]') || {}).content || "";
        var url = cleanUrl();

        var org = {
            "@type": "EducationalOrganization",
            "@id": window.location.origin + "/#org",
            name: "Learn Smart Hub",
            url: window.location.origin + "/",
            description: "Kenyan secondary school revision notes, past papers, quizzes and video lessons."
        };

        var graph = [org];

        if (file === "index.html" || file === "") {
            graph.push({
                "@type": "WebSite",
                "@id": window.location.origin + "/#website",
                url: window.location.origin + "/",
                name: "Learn Smart Hub",
                publisher: { "@id": window.location.origin + "/#org" },
                inLanguage: "en-KE"
            });
        }

        var type = resourceType();

        var page = {
            "@type": type === "WebPage" ? "WebPage" : "LearningResource",
            "@id": url + "#content",
            url: url,
            name: title || "Learn Smart Hub",
            description: description,
            inLanguage: "en-KE",
            isPartOf: { "@id": window.location.origin + "/#website" },
            publisher: { "@id": window.location.origin + "/#org" }
        };

        if (type !== "WebPage") {
            page.learningResourceType = type;
            page.educationalLevel = "Secondary school";
            page.audience = { "@type": "EducationalAudience", educationalRole: "student" };
            page.isAccessibleForFree = true;
        }

        graph.push(page);

        var script = document.createElement("script");
        script.type = "application/ld+json";
        script.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
        document.head.appendChild(script);
    }

    /* ----------------------------------------------------------- style ---- */

    function addStyles() {
        if (document.getElementById("lshShareStyles")) return;

        var style = document.createElement("style");
        style.id = "lshShareStyles";
        style.textContent = [
            ".lsh-share { margin: 26px 0 8px; padding: 16px 18px; border: 1px solid var(--line, #dbe6f5);",
            "  border-radius: 14px; background: var(--brand-50, #eef5ff); }",
            ".lsh-share-label { margin: 0 0 10px; font-size: 0.9rem; font-weight: 600; color: var(--ink, #10213f); }",
            ".lsh-share-row { display: flex; flex-wrap: wrap; gap: 8px; }",
            ".lsh-share-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px;",
            "  min-height: 40px; padding: 8px 14px; border-radius: 10px; border: 1px solid var(--line, #dbe6f5);",
            "  background: #fff; color: var(--brand-700, #0d47a1); font: inherit; font-size: 0.88rem;",
            "  font-weight: 600; text-decoration: none; cursor: pointer; }",
            ".lsh-share-btn:hover { border-color: var(--brand-300, #64b5f6); }",
            ".lsh-share-wa { background: #128c7e; border-color: #128c7e; color: #fff; }",
            ".lsh-share-wa:hover { background: #0f7a6d; border-color: #0f7a6d; }",
            "@media (max-width: 420px) { .lsh-share-row .lsh-share-btn { flex: 1 1 45%; } }"
        ].join("\n");
        document.head.appendChild(style);
    }

    function run() {
        addStyles();
        buildShare();
        buildStructuredData();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", run);
    } else {
        run();
    }
}());
