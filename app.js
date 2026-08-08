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
