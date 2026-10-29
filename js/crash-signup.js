/* Learn Smart Hub - December crash course sign-up.
 *
 * There is no backend here on purpose. The form collects the four things
 * Laban needs, then hands the message to WhatsApp so the student sends it
 * themselves: nothing is charged, and no personal detail leaves the browser
 * until they press send.
 */

(function () {

    const OWNER_WA = "254703511022";

    const priceFor = {
        "Mathematics": "KSh 700",
        "Chemistry": "KSh 700",
        "Both": "KSh 1,200"
    };

    function cleanPhone(value) {
        const digits = String(value || "").replace(/[^0-9]/g, "");
        if (digits.length === 10 && /^(07|01)/.test(digits)) {
            return digits;
        }
        if (digits.length === 12 && digits.startsWith("254")) {
            return "0" + digits.slice(3);
        }
        if (digits.length === 9 && /^(7|1)/.test(digits)) {
            return "0" + digits;
        }
        return null;
    }

    const form = document.getElementById("crashForm");
    const note = document.getElementById("crashNote");

    if (form) {
        form.addEventListener("submit", event => {

            event.preventDefault();

            const name = (document.getElementById("cName").value || "").trim();
            const phoneRaw = document.getElementById("cPhone").value;
            const school = (document.getElementById("cSchool").value || "").trim();
            const picked = form.querySelector('input[name="subject"]:checked');
            const subject = picked ? picked.value : "Mathematics";
            const phone = cleanPhone(phoneRaw);

            function warn(message) {
                note.textContent = message;
                note.classList.add("is-error");
            }

            if (name.length < 2) {
                warn("Put your name in first, even just two letters.");
                return;
            }

            if (!phone) {
                warn("That phone number does not look right. Use 07XX XXX XXX.");
                return;
            }

            const lines = [
                "Hi Laban, I want a place in the December crash course.",
                "",
                "Name: " + name,
                "Phone: " + phone,
                "School: " + (school || "not given"),
                "Subject: " + subject + " (" + priceFor[subject] + ")",
                "",
                "I am ready to pay " + priceFor[subject] + " on Pochi la Biashara."
            ];

            const url = "https://wa.me/" + OWNER_WA + "?text=" + encodeURIComponent(lines.join("\n"));

            note.classList.remove("is-error");
            note.textContent = "Opening WhatsApp with your details filled in. Press send there and Laban will reply with the payment steps.";

            window.open(url, "_blank", "noopener");
        });
    }

    const copy = document.getElementById("pochiCopy");
    const pochiNote = document.getElementById("pochiNote");
    const number = "0710974423";

    if (copy) {
        copy.addEventListener("click", async () => {

            let done = false;

            try {
                await navigator.clipboard.writeText(number);
                done = true;
            } catch (error) {
                const field = document.createElement("textarea");
                field.value = number;
                field.setAttribute("readonly", "");
                field.style.position = "fixed";
                field.style.opacity = "0";
                document.body.appendChild(field);
                field.select();
                try {
                    done = document.execCommand("copy");
                } catch (fallbackError) {
                    done = false;
                }
                document.body.removeChild(field);
            }

            if (pochiNote) {
                pochiNote.textContent = done
                    ? "Copied. Paste it in M-Pesa."
                    : "Select the number above and copy it by hand.";
            }
        });
    }

})();
