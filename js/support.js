/**
 * Learn Smart Hub - support contact.
 *
 * Students kept asking "who do I tell when my payment does not show", so the
 * WhatsApp line now sits in the footer of every public page instead of being
 * buried on the contact page. One link, tab-able, with the number in the text
 * so it can still be read if the link is copied by hand.
 */

(function () {
    "use strict";

    var NUMBER_LOCAL = "0703 511 022";
    var WHATSAPP = "https://wa.me/254703511022";

    var file = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    if (/^(admin|login|signup|404|offline)/.test(file)) return;

    function buildLink() {
        if (document.getElementById("lshSupportLink")) return;

        var base = document.querySelector("footer .footer-base") || document.querySelector("footer");
        if (!base) return;

        var link = document.createElement("a");
        link.id = "lshSupportLink";
        link.className = "lsh-support-link";
        link.href = WHATSAPP + "?text=" + encodeURIComponent("Hi Learn Smart Hub, I need help.");
        link.target = "_blank";
        link.rel = "noopener";
        link.textContent = "Support: WhatsApp " + NUMBER_LOCAL;

        var holder = document.createElement("span");
        holder.className = "lsh-support";
        holder.appendChild(link);
        base.appendChild(holder);
    }

    function addStyles() {
        if (document.getElementById("lshSupportStyles")) return;
        var style = document.createElement("style");
        style.id = "lshSupportStyles";
        style.textContent = [
            ".lsh-support { display: inline-flex; align-items: center; }",
            ".lsh-support-link { color: var(--brand-700, #0d47a1); font-weight: 600; text-decoration: none;",
            "  min-height: 32px; display: inline-flex; align-items: center; }",
            ".lsh-support-link:hover, .lsh-support-link:focus-visible { text-decoration: underline; }"
        ].join("\n");
        document.head.appendChild(style);
    }

    function run() { addStyles(); buildLink(); }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", run);
    } else {
        run();
    }
}());
