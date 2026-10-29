import { auth } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


const BACKEND =
    "https://learn-smart-hub-backend.onrender.com";

/* ================================
   PROFILE PHOTO
================================ */

// The browser crops and shrinks the picture before it leaves the phone, so the
// upload is a few dozen kilobytes and the stored copy is a square that looks
// right in every circle on the site. The photo is kept on the student's
// Firestore document by the backend and mirrored in this browser so the
// dashboard shows it immediately on the next visit, even offline.

const PHOTO_LIMIT_BYTES = 190 * 1024;

const PHOTO_SIZE = 320;

const photoElements = {
    image: document.getElementById("profilePhoto"),
    fallback: document.getElementById("profilePhotoFallback"),
    status: document.getElementById("photoStatus"),
    choose: document.getElementById("photoChoose"),
    remove: document.getElementById("photoRemove"),
    input: document.getElementById("photoInput")
};


function photoCacheKey(uid) {

    return `lsh.photo.${uid}`;

}


function readPhotoCache(uid) {

    try {
        return localStorage.getItem(photoCacheKey(uid));
    } catch (error) {
        return null;
    }

}


function savePhotoCache(uid, dataUrl) {

    try {

        if (dataUrl) {
            localStorage.setItem(photoCacheKey(uid), dataUrl);
        } else {
            localStorage.removeItem(photoCacheKey(uid));
        }

    } catch (error) {
        /* storage full or private mode: the server copy still works */
    }

}


function paintPhoto(dataUrl) {

    if (!photoElements.image) {
        return;
    }

    if (dataUrl) {

        photoElements.image.src = dataUrl;
        photoElements.image.hidden = false;

        if (photoElements.fallback) {
            photoElements.fallback.hidden = true;
        }

        if (photoElements.remove) {
            photoElements.remove.hidden = false;
        }

    } else {

        photoElements.image.removeAttribute("src");
        photoElements.image.hidden = true;

        if (photoElements.fallback) {
            photoElements.fallback.hidden = false;
        }

        if (photoElements.remove) {
            photoElements.remove.hidden = true;
        }

    }

}


function setPhotoStatus(message, tone) {

    if (!photoElements.status) {
        return;
    }

    photoElements.status.textContent = message;
    photoElements.status.dataset.tone = tone || "";
}


function busyPhoto(isBusy) {

    [photoElements.choose, photoElements.remove].forEach((button) => {

        if (button) {
            button.disabled = isBusy;
        }

    });

}


function loadPhotoFromDisk(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = () => {

            const image = new Image();

            image.onload = () => resolve(image);
            image.onerror = () => reject(new Error("That image could not be read"));

            image.src = String(reader.result);

        };

        reader.onerror = () => reject(new Error("That image could not be read"));

        reader.readAsDataURL(file);

    });

}


/* Centre-crops the picture to a square and shrinks it, stepping the JPEG
   quality down until it fits the size the backend accepts. */
function squarePhoto(image) {

    const side =
        Math.min(image.naturalWidth || image.width, image.naturalHeight || image.height);

    if (!side) {
        throw new Error("That image could not be read");
    }

    const canvas =
        document.createElement("canvas");

    canvas.width = PHOTO_SIZE;
    canvas.height = PHOTO_SIZE;

    const context =
        canvas.getContext("2d");

    context.imageSmoothingQuality = "high";

    context.drawImage(
        image,
        ((image.naturalWidth || image.width) - side) / 2,
        ((image.naturalHeight || image.height) - side) / 2,
        side,
        side,
        0,
        0,
        PHOTO_SIZE,
        PHOTO_SIZE
    );

    let quality = 0.85;

    let dataUrl = canvas.toDataURL("image/jpeg", quality);

    while (dataUrl.length > PHOTO_LIMIT_BYTES && quality > 0.45) {

        quality -= 0.1;

        dataUrl = canvas.toDataURL("image/jpeg", quality);

    }

    return dataUrl;

}


async function fetchStoredPhoto(user) {

    try {

        const idToken = await user.getIdToken();

        const response = await fetch(
            `${BACKEND}/api/profile`,
            { headers: { Authorization: `Bearer ${idToken}` } }
        );

        if (!response.ok) {
            return;
        }

        const result = await response.json();

        const photo =
            result?.profile?.photo || null;

        savePhotoCache(user.uid, photo);

        paintPhoto(photo);

        setPhotoStatus(
            photo
                ? "Your photo appears on your dashboard."
                : "A photo makes your dashboard feel like yours.",
            ""
        );

    } catch (error) {

        console.error("Profile photo load error:", error);

    }

}


async function uploadPhoto(file, user) {

    if (!file) {
        return;
    }

    if (!file.type.startsWith("image/")) {
        setPhotoStatus("Choose a picture file (JPEG, PNG or WebP).", "warn");
        return;
    }

    if (file.size > 12 * 1024 * 1024) {
        setPhotoStatus("That picture is too large. Try one under 12 MB.", "warn");
        return;
    }

    busyPhoto(true);
    setPhotoStatus("Preparing your photo...", "");

    try {

        const image = await loadPhotoFromDisk(file);

        const dataUrl = squarePhoto(image);

        paintPhoto(dataUrl);
        savePhotoCache(user.uid, dataUrl);

        setPhotoStatus("Saving...", "");

        const idToken = await user.getIdToken();

        const response = await fetch(
            `${BACKEND}/api/profile/photo`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${idToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ photo: dataUrl })
            }
        );

        if (response.status === 404) {
            setPhotoStatus("Saved on this device. Sync starts once the server is updated.", "warn");
            return;
        }

        const result = await response.json().catch(() => ({}));

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Upload failed");
        }

        setPhotoStatus("Photo saved. It now shows on your dashboard.", "good");

    } catch (error) {

        console.error("Profile photo upload error:", error);

        setPhotoStatus(
            error.message === "That image could not be read"
                ? error.message
                : "Saved on this device. It will sync when you are back online.",
            "warn"
        );

    } finally {

        busyPhoto(false);

        if (photoElements.input) {
            photoElements.input.value = "";
        }

    }

}


async function removePhoto(user) {

    busyPhoto(true);
    setPhotoStatus("Removing...", "");

    try {

        const idToken = await user.getIdToken();

        const response = await fetch(
            `${BACKEND}/api/profile/photo`,
            {
                method: "DELETE",
                headers: { Authorization: `Bearer ${idToken}` }
            }
        );

        if (!response.ok && response.status !== 404) {
            throw new Error("Remove failed");
        }

        savePhotoCache(user.uid, null);
        paintPhoto(null);
        setPhotoStatus("Photo removed.", "");

    } catch (error) {

        console.error("Profile photo remove error:", error);
        setPhotoStatus("Could not remove the photo. Try again in a moment.", "warn");

    } finally {

        busyPhoto(false);

    }

}


function wirePhoto(user) {

    if (!photoElements.choose || !photoElements.input) {
        return;
    }

    const cached =
        readPhotoCache(user.uid);

    if (cached) {
        paintPhoto(cached);
    }

    fetchStoredPhoto(user);

    photoElements.choose.addEventListener("click", () => {
        photoElements.input.click();
    });

    photoElements.input.addEventListener("change", (event) => {
        uploadPhoto(event.target.files?.[0], user);
    });

    if (photoElements.remove) {
        photoElements.remove.addEventListener("click", () => {
            removePhoto(user);
        });
    }

}


onAuthStateChanged(auth, (user) => {

    if (user) {
        wirePhoto(user);
    }

});



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
