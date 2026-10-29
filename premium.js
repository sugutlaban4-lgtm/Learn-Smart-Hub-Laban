import { auth } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// Firestore is not touched from the browser any more: Premium status and plan
// choice go through the backend, so the database stays closed to clients.

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

const pochiForm =
    document.getElementById("pochiForm");

const pochiCodeInput =
    document.getElementById("pochiCode");

const pochiSubmit =
    document.getElementById("pochiSubmit");

const pochiMessage =
    document.getElementById("pochiMessage");

const pochiAmount =
    document.getElementById("pochiAmount");

const pochiNumber =
    document.getElementById("pochiNumber");


// The Pochi wallet number lives on the backend so it can change without a
// website deploy. The page still works if the call fails: it keeps the number
// already in the markup.
const POCHI_FALLBACK_NUMBER = "0710 974 423";


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
            "Not logged in";

        planElement.textContent =
            "Please log in to use Premium.";

        if (paymentButton) {
            paymentButton.disabled = true;
        }

        return;
    }


    try {

        const idToken =
            await user.getIdToken();


        const response =
            await fetch(
                `${MPESA_BACKEND}/api/premium/status`,
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

            throw new Error(
                result.message ||
                "Premium status request failed"
            );

        }


        const status =
            result.status || "inactive";

        const plan =
            result.plan || "none";


        if (status === "active") {

            statusElement.textContent =
                "Active";

        } else {

            statusElement.textContent =
                "Inactive";

        }


        if (plan !== "none") {

            const formattedPlan =
                plan.charAt(0).toUpperCase() +
                plan.slice(1);


            planElement.textContent =
                formattedPlan +
                " premium";

        } else {

            planElement.textContent =
                "None";

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
            "Please log in first.";

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
        " premium, KSh " +
        price;


    paymentMessage.textContent =
        formattedPlan +
        " premium selected. Enter your M-Pesa number.";


    paymentButton.disabled = false;


    if (pochiAmount) {

        pochiAmount.textContent =
            "KSh " + price;

    }


    if (pochiMessage) {

        pochiMessage.textContent = "";

    }


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

        const idToken =
            await user.getIdToken();


        const response =
            await fetch(
                `${MPESA_BACKEND}/api/premium/plan`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${idToken}`
                    },

                    body: JSON.stringify({
                        plan: plan
                    })
                }
            );


        const result =
            await response.json();


        if (!response.ok || !result.success) {

            throw new Error(
                result.message ||
                "Unable to save your plan"
            );

        }


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
                    "Please log in before making a payment.";

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
                    "Enter your M-Pesa phone number.";

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
                    "Enter a valid Kenyan M-Pesa number.";

                phoneInput.focus();

                return;

            }


            paymentButton.disabled = true;

            paymentButton.textContent =
                "Sending payment request...";


            paymentMessage.textContent =
                "Connecting to M-Pesa...";


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
                        "M-Pesa prompt sent. Check your phone and complete the payment.";

                } else {

                    paymentMessage.textContent =
                        "M-Pesa request failed: " +
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
                    "Unable to connect to the M-Pesa payment service.";

            }


            paymentButton.disabled = false;

            paymentButton.textContent =
                "Pay with M-Pesa";

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

        const idToken =
            await user.getIdToken();

        const statusResponse =
            await fetch(
                `${MPESA_BACKEND}/api/premium/status`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${idToken}`
                    }
                }
            );

        const statusResult =
            await statusResponse.json();

        if (
            !statusResponse.ok ||
            !statusResult.success ||
            statusResult.status !== "active"
        ) {

            alert(
                "This Premium resource is locked. Complete your Premium payment first."
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

// ================================
// POCHI LA BIASHARA PAYMENT
// ================================

// Pochi has no API to confirm a payment, so the student sends the M-Pesa code
// and the backend holds it for approval. Premium opens when it is approved,
// which is the same premium_access record the STK callback writes.

async function loadPochiDetails() {

    if (!pochiNumber) {
        return;
    }


    pochiNumber.textContent =
        POCHI_FALLBACK_NUMBER;


    try {

        const response =
            await fetch(`${MPESA_BACKEND}/api/mpesa/pochi`);

        const result =
            await response.json();


        if (result?.success && result.number) {

            // 0710974423 reads better as 0710 974 423
            const digits =
                String(result.number).replace(/\D/g, "");

            pochiNumber.textContent =
                digits.length === 10
                    ? `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`
                    : String(result.number);

        }

    } catch (error) {

        // The markup already shows the number, so this is not worth a message.

        console.warn(
            "Pochi details could not be refreshed:",
            error
        );

    }

}


if (pochiForm) {

    loadPochiDetails();


    pochiForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const user =
                auth.currentUser;


            if (!user) {

                pochiMessage.textContent =
                    "Please log in before sending a payment code.";

                return;

            }


            if (!selectedPlanName || !selectedPlanPrice) {

                pochiMessage.textContent =
                    "Choose a plan above first, so the amount is right.";

                return;

            }


            const code =
                (pochiCodeInput.value || "")
                    .replace(/[^A-Za-z0-9]/g, "")
                    .toUpperCase();


            if (code.length < 8) {

                pochiMessage.textContent =
                    "Enter the code from the M-Pesa SMS, for example TG45KD9XQ2.";

                pochiCodeInput.focus();

                return;

            }


            pochiSubmit.disabled = true;

            pochiSubmit.textContent =
                "Sending...";


            try {

                const idToken =
                    await user.getIdToken();


                const response =
                    await fetch(
                        `${MPESA_BACKEND}/api/mpesa/pochi/claim`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type": "application/json",

                                Authorization: `Bearer ${idToken}`
                            },

                            body: JSON.stringify({
                                plan: selectedPlanName,
                                code: code
                            })
                        }
                    );


                const result =
                    await response.json();


                if (result.success) {

                    pochiMessage.textContent =
                        result.alreadyOpen
                            ? "That code is already with us. Premium opens as soon as it is checked."
                            : "Code received. Premium opens as soon as the payment shows in the Pochi wallet.";

                    pochiCodeInput.value = "";

                } else {

                    pochiMessage.textContent =
                        result.message ||
                        "That code could not be sent. Check it and try again.";

                }

            } catch (error) {

                console.error(
                    "Pochi claim error:",
                    error
                );

                pochiMessage.textContent =
                    "Could not reach the payment service. Check your connection and try again.";

            }


            pochiSubmit.disabled = false;

            pochiSubmit.textContent =
                "Send code for checking";

        }
    );

}
