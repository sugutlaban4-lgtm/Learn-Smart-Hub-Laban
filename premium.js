import { auth } from "./firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
getFirestore,
doc,
getDoc,
setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const db = getFirestore();

onAuthStateChanged(auth, async (user) => {


const statusElement =
    document.getElementById("premiumStatus");

const planElement =
    document.getElementById("premiumPlan");


if (!user) {

    statusElement.textContent =
        "🔒 Premium Status: Not logged in";

    planElement.textContent =
        "Please log in to check Premium access.";

    return;
}


try {

    const premiumRef = doc(
        db,
        "premium_access",
        user.uid
    );


    const premiumSnap =
        await getDoc(premiumRef);


    if (premiumSnap.exists()) {

        const data =
            premiumSnap.data();


        const status =
            data.status || "inactive";

        const plan =
            data.plan || "none";


  if (status === "active") {

    statusElement.textContent =
        "⭐ Premium Status: Active";

} else {

    statusElement.textContent =
        "🔒 Premium Status: Inactive";

}

if (plan !== "none") {

    const selectedPlan =
        document.getElementById("selectedPlan");

    const formattedPlan =
        plan.charAt(0).toUpperCase() +
        plan.slice(1);

    if (selectedPlan) {

        selectedPlan.textContent =
            "Selected: " +
            formattedPlan +
            " Premium — KSh " +
            data.price +
            ". Payment verification is still required.";

    }

    planElement.textContent =
        "Plan: " + formattedPlan;

} else {

    planElement.textContent =
        "Plan: None";

}

    } else {

        statusElement.textContent =
            "🔒 Premium Status: Inactive";

        planElement.textContent =
            "Plan: None";

    }


} catch (error) {

    console.error(
        "Premium status error:",
        error
    );


    statusElement.textContent =
        "Unable to check Premium status.";

    planElement.textContent =
        "Please try again later.";

}


});

window.selectPremiumPlan =
async function (plan, price) {


    const selectedPlan =
        document.getElementById(
            "selectedPlan"
        );


    if (!selectedPlan) {

        console.error(
            "selectedPlan element not found."
        );

        return;
    }


    const user =
        auth.currentUser;


    if (!user) {

        selectedPlan.textContent =
            "Please log in before selecting a Premium plan.";

        return;
    }


    try {

        const premiumRef =
            doc(
                db,
                "premium_access",
                user.uid
            );


        await setDoc(
            premiumRef,
            {
                userId: user.uid,
                plan: plan,
                price: price,
                status: "inactive"
            },
            {
                merge: true
            }
        );


        const formattedPlan =
            plan.charAt(0).toUpperCase() +
            plan.slice(1);


        selectedPlan.textContent =
            "Selected: " +
            formattedPlan +
            " Premium — KSh " +
            price +
            ". Payment verification is still required.";

        console.log(
            "Premium plan saved:",
            plan,
            price
        );


    } catch (error) {

        console.error(
            "Premium plan save error:",
            error
        );


        selectedPlan.textContent =
            "Unable to save your selected plan. Please try again.";

    }

};
