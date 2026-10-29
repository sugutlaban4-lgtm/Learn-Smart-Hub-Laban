/* Renders the free resources library from data/resources.js.
 *
 * The list is plain data so adding a link means editing one small file. Every
 * row is a normal link with target="_blank", so a student can open a resource
 * in a new tab without losing their place in the hub.
 */

(function () {

    var LIST = window.LSH_RESOURCES;

    var mount = document.getElementById("resourceGroups");
    var chips = document.getElementById("resourceChips");
    var counter = document.getElementById("resourceCount");

    if (!LIST || !mount) {
        return;
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    var total = 0;

    var sections = LIST.map(function (group) {

        total += group.items.length;

        var rows = group.items.map(function (item) {

            return '' +
                '<li class="res-item">' +
                    '<a class="res-link" href="' + escapeHtml(item.url) + '" target="_blank" rel="noopener">' +
                        '<span class="res-name">' + escapeHtml(item.name) + '</span>' +
                        '<span class="res-meta">' + escapeHtml(item.meta) + '</span>' +
                    '</a>' +
                    '<span class="res-tag">' + escapeHtml(item.tag) + '</span>' +
                '</li>';

        }).join("");

        return '' +
            '<section class="res-group" id="' + escapeHtml(group.id) + '">' +
                '<div class="res-head">' +
                    '<h2>' + escapeHtml(group.name) + '</h2>' +
                    '<p>' + escapeHtml(group.blurb) + '</p>' +
                '</div>' +
                '<ul class="res-list">' + rows + '</ul>' +
                '<p class="res-note">' + group.items.length + ' links in ' + escapeHtml(group.name) + '</p>' +
            '</section>';

    }).join("");

    mount.innerHTML = sections;

    if (chips) {

        chips.innerHTML = LIST.map(function (group) {
            return '<a class="chip" href="#' + escapeHtml(group.id) + '">' + escapeHtml(group.name) + '</a>';
        }).join("");

    }

    if (counter) {
        counter.textContent = total + " free resources, checked and grouped by subject.";
    }

})();
