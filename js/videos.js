/* Learn Smart Hub - video lesson pages
 *
 * One renderer for every subject's video page. Each page loads its own
 * data file first (window.LSH_VIDEOS), so a missing data file leaves an empty
 * page rather than a broken one.
 *
 * Nothing is embedded until a lesson is tapped: the card shows a thumbnail
 * from m.ytimg.com and only then swaps in the youtube-nocookie player. That
 * keeps the page light on a phone and stops YouTube setting cookies on load.
 */

(function () {
    "use strict";

    var data = window.LSH_VIDEOS;
    var mount = document.getElementById("videoList");
    if (!mount || !data || !data.videos || !data.videos.length) {
        if (mount) {
            mount.innerHTML =
                '<p class="empty">Video lessons for this subject are being checked. ' +
                'The notes and past papers are ready in the meantime.</p>';
        }
        return;
    }

    var FREE_VIDEOS = 2;

    var videos = [];
    var gatedOut = 0;
    var topicOrder = [];

    var activeTopic = "all";
    var query = "";

    /* ---------------------------------------------------------------- tools */

    function thumb(id) {
        return "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg";
    }

    function el(tag, cls, text) {
        var n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text) n.textContent = text;
        return n;
    }

    function matches(v) {
        if (activeTopic !== "all" && v.topic !== activeTopic) return false;
        if (!query) return true;
        var hay = (v.title + " " + v.channel + " " + v.topic).toLowerCase();
        return hay.indexOf(query) !== -1;
    }

    /* ----------------------------------------------------------------- card */

    function card(v) {
        var wrap = el("article", "video-card");
        wrap.setAttribute("data-topic", v.topic);

        var btn = el("button", "video-thumb");
        btn.type = "button";
        btn.setAttribute("aria-label", "Play: " + v.title);

        var img = el("img");
        img.src = thumb(v.id);
        img.alt = "";
        img.loading = "lazy";
        img.width = 480;
        img.height = 360;
        btn.appendChild(img);
        btn.appendChild(el("span", "video-play"));

        var body = el("div", "video-body");
        body.appendChild(el("span", "video-topic", v.topic));
        body.appendChild(el("h3", "video-title", v.title));
        body.appendChild(el("p", "video-channel", v.channel));
        if (v.why) body.appendChild(el("p", "video-why", v.why));

        var open = el("a", "video-link", "Open on YouTube");
        open.href = "https://www.youtube.com/watch?v=" + v.id;
        open.target = "_blank";
        open.rel = "noopener";
        body.appendChild(open);

        btn.addEventListener("click", function () {
            var frame = el("div", "video-frame");
            var iframe = document.createElement("iframe");
            iframe.src =
                "https://www.youtube-nocookie.com/embed/" +
                encodeURIComponent(v.id) +
                "?autoplay=1&rel=0&modestbranding=1";
            iframe.title = v.title;
            iframe.allow =
                "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            iframe.allowFullscreen = true;
            iframe.loading = "lazy";
            frame.appendChild(iframe);
            btn.replaceWith(frame);
            var note = el("p", "video-note", "Playing from YouTube. Close the tab to stop the video.");
            frame.insertAdjacentElement("afterend", note);
        });

        wrap.appendChild(btn);
        wrap.appendChild(body);
        return wrap;
    }

    /* --------------------------------------------------------------- layout */

    var toolbar = el("div", "study-toolbar");
    var chips = el("div", "chips");
    var search = el("input", "study-search");
    search.type = "search";
    search.placeholder = "Find a lesson";
    search.setAttribute("aria-label", "Find a video lesson");
    toolbar.appendChild(chips);
    toolbar.appendChild(search);

    var grid = el("div", "video-grid");
    var count = el("p", "study-count");

    function renderChips() {
        chips.innerHTML = "";
        if (topicOrder.length < 2) return;
        chips.setAttribute("role", "group");
        chips.setAttribute("aria-label", "Filter lessons by topic");

        function addChip(label, value) {
            var b = el("button", "chip", label);
            b.type = "button";
            b.setAttribute("aria-pressed", activeTopic === value ? "true" : "false");
            b.addEventListener("click", function () {
                activeTopic = value;
                renderChips();
                renderGrid();
            });
            chips.appendChild(b);
        }

        addChip("All topics", "all");
        topicOrder.forEach(function (t) {
            addChip(t, t);
        });
    }

    function renderGrid() {
        grid.innerHTML = "";
        var shown = videos.filter(matches);
        if (!shown.length) {
            grid.appendChild(
                el("p", "empty", "No lesson matches that. Try a different word or topic.")
            );
        } else {
            shown.forEach(function (v) {
                grid.appendChild(card(v));
            });
        }
        count.textContent =
            shown.length + (shown.length === 1 ? " lesson" : " lessons") + " for " + data.label;
    }

    search.addEventListener("input", function () {
        query = search.value.trim().toLowerCase();
        renderGrid();
    });

    mount.appendChild(toolbar);
    mount.appendChild(count);
    mount.appendChild(grid);
    count.textContent = "Loading lessons…";

    /* How much opens depends on the plan, so the first paint waits for the
       access check. Signed out or unreachable backend resolves to free. */
    (window.LSH_ACCESS || Promise.resolve({ premium: false })).then(function (access) {

        videos = access.premium
            ? data.videos.slice()
            : data.videos.slice(0, FREE_VIDEOS);

        gatedOut = data.videos.length - videos.length;

        videos.forEach(function (v) {
            if (topicOrder.indexOf(v.topic) === -1) topicOrder.push(v.topic);
        });

        renderChips();
        renderGrid();

        if (gatedOut > 0) {
            var lock = el("div", "topic-card lock-card");
            lock.innerHTML =
                '<span class="lock-badge">Premium</span>' +
                "<h2>" + gatedOut + " more lessons are Premium</h2>" +
                '<p class="lock-copy">The lessons above are free. Premium opens all ' +
                data.videos.length + " for this subject.</p>" +
                '<a class="btn btn-primary" href="premium.html">Unlock every lesson</a>';
            mount.appendChild(lock);
        }

    });
})();
