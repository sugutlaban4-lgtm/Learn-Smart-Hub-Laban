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


// Render M-Pesa backend
const MPESA_BACKEND =
    "https://learn-smart-hub-backend.onrender.com";


let selectedPlanName = null;
let selectedPlanPrice = null;


// Elements
const selectedPlanElement =
    document.getElementById("selectedPlan");

const paymentMessage =
    document.getElementById("paymentMessage");

const paymentButton =
    document.getElementById("payPremiumButton");

const phoneInput =
    document.getElementById("mpesaPhone");


// ================================
// AUTHENTICATION + PREMIUM STATUS
// ================================

onAuthStateChanged(auth, async (user) => {

    const statusElement =
        document.getElementById("premiumStatus");

    const planElement =
        document.getElementById("premiumPlan");


    if (!user) {

        statusElement.textContent =
            "🔒 Premium Status: Not logged in";

        planElement.textContent =
            "Please log in to use Premium.";

        if (paymentButton) {
            paymentButton.disabled = true;
        }

        return;
    }


    try {

        const premiumRef =
            doc(
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

                const formattedPlan =
                    plan.charAt(0).toUpperCase() +
                    plan.slice(1);


                planElement.textContent =
                    "Plan: " +
                    formattedPlan +
                    " Premium";

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


// ================================
// SELECT PREMIUM PLAN
// ================================

window.selectPremiumPlan =
async function (plan, price) {

    const user =
        auth.currentUser;


    if (!user) {

        selectedPlanElement.textContent =
            "Please log in before selecting a Premium plan.";

        paymentMessage.textContent =
            "🔒 Please log in first.";

        return;
    }


    selectedPlanName = plan;
    selectedPlanPrice = price;


    const formattedPlan =
        plan.charAt(0).toUpperCase() +
        plan.slice(1);


    selectedPlanElement.textContent =
        "Selected: " +
        formattedPlan +
        " Premium — KSh " +
        price;


    paymentMessage.textContent =
        "✅ " +
        formattedPlan +
        " Premium selected. Enter your M-Pesa number.";


    paymentButton.disabled = false;


    // Highlight selected plan

    document
        .querySelectorAll(".premium-plan-card")
        .forEach(card => {

            card.classList.remove("selected");

        });


    const planButton =
        document.getElementById(
            plan + "Plan"
        );


    if (planButton) {

        planButton.classList.add("selected");

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


        paymentMessage.textContent =
            "Unable to save your selected plan.";

    }

};


// ================================
// M-PESA STK PUSH
// ================================

if (paymentButton) {

    paymentButton.addEventListener(
        "click",
        async () => {

            const user =
                auth.currentUser;


            if (!user) {

                paymentMessage.textContent =
                    "🔒 Please log in before making a payment.";

                return;

            }


            if (!selectedPlanName ||
                !selectedPlanPrice) {

                paymentMessage.textContent =
                    "Please select a Premium plan first.";

                return;

            }


            const phone =
                phoneInput.value.trim();


            if (!phone) {

                paymentMessage.textContent =
                    "📱 Enter your M-Pesa phone number.";

                phoneInput.focus();

                return;

            }


            // Accept 07XXXXXXXX,
            // 01XXXXXXXX,
            // 2547XXXXXXXX,
            // 2541XXXXXXXX

            const phonePattern =
                /^(?:254|0)(?:7|1)\d{8}$/;


            if (!phonePattern.test(phone)) {

                paymentMessage.textContent =
                    "❌ Enter a valid Kenyan M-Pesa number.";

                phoneInput.focus();

                return;

            }


            paymentButton.disabled = true;

            paymentButton.textContent =
                "⏳ Sending payment request...";


            paymentMessage.textContent =
                "📱 Connecting to M-Pesa...";


            try {

                const idToken =
                    await user.getIdToken();


                const response =
                    await fetch(
                        `${MPESA_BACKEND}/api/mpesa/stkpush`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${idToken}`
                            },

                            body: JSON.stringify({
                                plan: selectedPlanName,
                                phoneNumber: phone,
                                amount: selectedPlanPrice
                            })
                        }
                    );


                const result =
                    await response.json();


                console.log(
                    "STK Push response:",
                    result
                );


                if (result.success) {

                    paymentMessage.textContent =
                        "📱 M-Pesa prompt sent. Check your phone and complete the payment.";

                } else {

                    paymentMessage.textContent =
                        "❌ M-Pesa request failed: " +
                        (
                            result.error?.errorMessage ||
                            result.message ||
                            "Unknown error"
                        );

                }


            } catch (error) {

                console.error(
                    "M-Pesa connection error:",
                    error
                );


                paymentMessage.textContent =
                    "❌ Unable to connect to the M-Pesa payment service.";

            }


            paymentButton.disabled = false;

            paymentButton.textContent =
                "💳 Continue to Payment";

        }
    );

}


// ================================
// PREMIUM RESOURCE BUTTONS
// ================================

window.openPremiumResource =
async function (resource) {

    const user =
        auth.currentUser;

    if (!user) {

        alert(
            "Please log in to access Premium resources."
        );

        return;

    }

    try {

        const premiumRef =
            doc(
                db,
                "premium_access",
                user.uid
            );

        const premiumSnap =
            await getDoc(premiumRef);

        if (
            !premiumSnap.exists() ||
            premiumSnap.data().status !== "active"
        ) {

            alert(
                "🔒 This Premium resource is locked. Complete your Premium payment first."
            );

            return;

        }

        const resources = {

            papers:
                "pastpapers.html",

            notes:
                "notes.html",

            quizzes:
                "quiz.html",

            videos:
                "videos.html"

        };

        const destination =
            resources[resource];

        if (!destination) {

            alert(
                "Premium resource not found."
            );

            return;

        }

        window.location.href =
            destination;

    } catch (error) {

        console.error(
            "Premium resource access error:",
            error
        );

        alert(
            "Unable to verify Premium access. Please try again."
        );

    }

};