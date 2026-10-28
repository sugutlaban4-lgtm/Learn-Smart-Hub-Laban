/* ================================
   STUDY ENGINE
   Renders notes, past papers and quizzes from data/<subject>.js.
   The page sets data-study and data-subject on <body>, so every subject page
   is a short shell and all the content lives in one file per subject.
================================ */

(function () {

    const body = document.body;

    const mode = body.getAttribute("data-study");

    const subjectId = body.getAttribute("data-subject");

    const quizId = body.getAttribute("data-quiz");


    function esc(value) {

        return String(value === null || value === undefined ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");

    }


    function data() {

        const subject = window.LSH_SUBJECT;

        if (!subject) {

            return null;

        }

        return subject;

    }


    function fail(target, message) {

        target.innerHTML =
            '<p class="loading-note">' + esc(message) + "</p>";

    }


    /* -------------------------------
       NOTES
    ------------------------------- */

    function renderNotes() {

        const target = document.getElementById("studyNotes");

        const subject = data();

        if (!target) {
            return;
        }

        if (!subject || !Array.isArray(subject.notes) || !subject.notes.length) {

            fail(target, "These notes are being prepared. Try the practice questions or the quiz instead.");

            return;
        }


        const levels = [];

        subject.notes.forEach(topic => {

            const level = topic.level || "Notes";

            if (levels.indexOf(level) === -1) {
                levels.push(level);
            }

        });


        const toolbar =
            levels.length > 1
                ? '<div class="study-toolbar" role="group" aria-label="Filter notes by level">' +
                  '<button class="chip" data-level="all" aria-pressed="true" type="button">All topics</button>' +
                  levels.map(level =>
                      '<button class="chip" data-level="' + esc(level) + '" aria-pressed="false" type="button">' +
                      esc(level) + "</button>"
                  ).join("") +
                  "</div>"
                : "";


        const cards = subject.notes.map((topic, index) => {

            const points = (topic.points || [])
                .map(point => "<li>" + esc(point) + "</li>")
                .join("");

            const formula = topic.formula
                ? '<p class="formula">' + esc(topic.formula) + "</p>"
                : "";

            const example = topic.example
                ? '<div class="example">' +
                  "<h3>Worked example</h3>" +
                  '<p class="q">' + esc(topic.example.question) + "</p>" +
                  '<p class="a">' + esc(topic.example.solution) + "</p>" +
                  "</div>"
                : "";

            return (
                '<article class="topic-card" data-level="' + esc(topic.level || "Notes") + '">' +
                '<span class="topic-level">' + esc(topic.level || "Notes") + "</span>" +
                "<h2>" + (index + 1) + ". " + esc(topic.topic) + "</h2>" +
                '<p class="topic-summary">' + esc(topic.summary || "") + "</p>" +
                '<ul class="topic-points">' + points + "</ul>" +
                formula +
                example +
                "</article>"
            );

        }).join("");


        target.innerHTML =
            toolbar +
            '<div class="topic-grid" id="topicGrid">' + cards + "</div>";


        target.querySelectorAll(".chip").forEach(chip => {

            chip.addEventListener("click", () => {

                const level = chip.getAttribute("data-level");

                target.querySelectorAll(".chip").forEach(other => {

                    other.setAttribute(
                        "aria-pressed",
                        String(other === chip)
                    );

                });

                target.querySelectorAll(".topic-card").forEach(card => {

                    const show =
                        level === "all" ||
                        card.getAttribute("data-level") === level;

                    card.hidden = !show;

                });

            });

        });

    }


    /* -------------------------------
       PAST PAPERS
    ------------------------------- */

    function renderPapers() {

        const target = document.getElementById("studyPapers");

        const subject = data();

        if (!target) {
            return;
        }

        if (!subject || !Array.isArray(subject.papers) || !subject.papers.length) {

            fail(target, "Papers for this subject are being added. The notes and quiz are ready to use.");

            return;
        }


        function sectionHtml(section, counter) {

            const questions = (section.questions || []).map(question => {

                counter.n += 1;

                return (
                    '<div class="question">' +
                    '<div class="q-row">' +
                    '<span class="q-num">' + counter.n + ".</span>" +
                    "<div>" +
                    '<p class="q-text">' + esc(question.q) +
                    '<span class="marks">' + esc(question.marks) + " marks</span>" +
                    "</p>" +
                    (question.answer
                        ? "<details><summary>Show answer</summary>" +
                          '<p class="a-text">' + esc(question.answer) + "</p>" +
                          "</details>"
                        : "") +
                    "</div>" +
                    "</div>" +
                    "</div>"
                );

            }).join("");

            return (
                '<div class="paper-section">' +
                "<h3>" + esc(section.heading || "Questions") + "</h3>" +
                questions +
                "</div>"
            );

        }


        function paperHtml(paper) {

            const counter = { n: 0 };

            const sections = (paper.sections || [])
                .map(section => sectionHtml(section, counter))
                .join("");

            let total = 0;

            (paper.sections || []).forEach(section => {

                (section.questions || []).forEach(question => {

                    total += Number(question.marks) || 0;

                });

            });

            return (
                '<article class="paper-card">' +
                "<h2>" + esc(paper.title) + "</h2>" +
                '<p class="paper-meta">' + esc(paper.meta || "") + "</p>" +
                '<p class="paper-note">' + esc(paper.instructions || "") + "</p>" +
                sections +
                '<p class="marks-total">Total: ' + total + " marks. " +
                "Tap a question to check your answer, but try it on paper first.</p>" +
                "</article>"
            );

        }


        const switcher =
            subject.papers.length > 1
                ? '<div class="study-toolbar" role="group" aria-label="Choose a paper">' +
                  subject.papers.map((paper, index) =>
                      '<button class="chip" data-paper="' + index + '" aria-pressed="' +
                      (index === 0 ? "true" : "false") + '" type="button">' +
                      esc(paper.title) + "</button>"
                  ).join("") +
                  "</div>"
                : "";


        target.innerHTML =
            switcher +
            '<div id="paperHolder">' + paperHtml(subject.papers[0]) + "</div>";


        target.querySelectorAll("[data-paper]").forEach(chip => {

            chip.addEventListener("click", () => {

                const index = Number(chip.getAttribute("data-paper"));

                target.querySelectorAll("[data-paper]").forEach(other => {

                    other.setAttribute(
                        "aria-pressed",
                        String(other === chip)
                    );

                });

                document.getElementById("paperHolder").innerHTML =
                    paperHtml(subject.papers[index]);

                window.scrollTo({ top: 0, behavior: "smooth" });

            });

        });

    }


    /* -------------------------------
       QUIZ
    ------------------------------- */

    function renderQuiz() {

        const target = document.getElementById("quizApp");

        const subject = data();

        if (!target) {
            return;
        }

        const bank =
            subject &&
            subject.quizzes &&
            (subject.quizzes[quizId] ||
                subject.quizzes[Object.keys(subject.quizzes)[0]]);

        if (!bank || !Array.isArray(bank.questions) || !bank.questions.length) {

            fail(target, "This quiz is being rebuilt. The notes and past papers are ready while we finish it.");

            return;
        }


        const questions = bank.questions;

        const storageKey = "lsh-best-" + (subjectId || "quiz") + "-" + (quizId || "quiz");

        let best = 0;

        try {
            best = Number(window.localStorage.getItem(storageKey)) || 0;
        } catch (error) {
            best = 0;
        }


        const state = {
            answered: 0,
            score: 0,
            done: false
        };


        const questionsHtml = questions.map((question, index) => {

            const choices = (question.options || []).map((option, optionIndex) =>
                '<button class="quiz-choice" type="button" data-q="' + index +
                '" data-o="' + optionIndex + '">' +
                String.fromCharCode(65 + optionIndex) + ". " + esc(option) +
                "</button>"
            ).join("");

            return (
                '<section class="quiz-question">' +
                "<h2><span>Question " + (index + 1) + " of " + questions.length + "</span>" +
                esc(question.q) + "</h2>" +
                choices +
                '<p class="quiz-why" id="why' + index + '"></p>' +
                "</section>"
            );

        }).join("");


        target.innerHTML =
            '<div class="quiz-shell">' +
            '<div class="quiz-panel">' +
            '<div class="quiz-stats">' +
            '<div class="stat-pill">Answered<strong id="answeredCount">0/' + questions.length + "</strong></div>" +
            '<div class="stat-pill">Score<strong id="scoreCount">0/' + questions.length + "</strong></div>" +
            '<div class="stat-pill">XP<strong id="xpCount">0</strong></div>' +
            '<div class="stat-pill">Best<strong id="bestCount">' + best + "/" + questions.length + "</strong></div>" +
            "</div>" +
            '<div class="progress-track"><div class="progress-fill" id="progressFill"></div></div>' +
            "</div>" +
            questionsHtml +
            '<div class="quiz-panel">' +
            '<div class="quiz-actions">' +
            '<button class="btn btn-primary" id="submitQuiz" type="button">Finish quiz</button>' +
            '<button class="btn btn-ghost" id="resetQuiz" type="button">Start again</button>' +
            "</div>" +
            '<div class="quiz-result" id="quizResult"></div>' +
            "</div>" +
            "</div>";


        const answeredCount = document.getElementById("answeredCount");

        const scoreCount = document.getElementById("scoreCount");

        const xpCount = document.getElementById("xpCount");

        const bestCount = document.getElementById("bestCount");

        const progressFill = document.getElementById("progressFill");

        const result = document.getElementById("quizResult");


        function paint() {

            answeredCount.textContent =
                state.answered + "/" + questions.length;

            scoreCount.textContent =
                state.score + "/" + questions.length;

            xpCount.textContent =
                String(state.score * 20);

            progressFill.style.width =
                Math.round((state.answered / questions.length) * 100) + "%";

        }


        target.querySelectorAll(".quiz-choice").forEach(button => {

            button.addEventListener("click", () => {

                if (state.done) {
                    return;
                }

                const index = Number(button.getAttribute("data-q"));

                const option = Number(button.getAttribute("data-o"));

                const question = questions[index];

                const section = button.closest(".quiz-question");

                const buttons = section.querySelectorAll(".quiz-choice");

                if (button.disabled) {
                    return;
                }

                const correctIndex = Number(question.answer);

                const isCorrect = option === correctIndex;

                state.answered += 1;

                if (isCorrect) {
                    state.score += 1;
                }

                buttons.forEach((choiceButton, choiceIndex) => {

                    choiceButton.disabled = true;

                    if (choiceIndex === correctIndex) {

                        choiceButton.classList.add("is-correct");

                    } else if (choiceIndex === option) {

                        choiceButton.classList.add("is-wrong");

                    }

                });


                const why = document.getElementById("why" + index);

                if (why) {

                    why.textContent =
                        (isCorrect ? "Correct. " : "Not quite. ") +
                        (question.why || "");

                    why.classList.add("show");

                }

                paint();

            });

        });


        document.getElementById("submitQuiz")
            .addEventListener("click", () => {

                state.done = true;

                const total = questions.length;

                const percent = Math.round((state.score / total) * 100);

                let message;

                if (percent >= 80) {
                    message = "Strong work. Move on to the next topic or try the past paper.";
                } else if (percent >= 50) {
                    message = "Getting there. Read the notes for the questions you missed, then try again.";
                } else {
                    message = "Start with the notes for this subject, then come back. It gets easier.";
                }

                if (state.score > best) {

                    best = state.score;

                    try {
                        window.localStorage.setItem(storageKey, String(best));
                    } catch (error) {
                        best = state.score;
                    }

                }

                bestCount.textContent = best + "/" + total;

                result.innerHTML =
                    "<strong>You scored " + state.score + " out of " + total +
                    " (" + percent + "%).</strong>" +
                    "<p>" + message + "</p>";

                result.classList.add("show");

                result.scrollIntoView({ behavior: "smooth", block: "center" });

            });


        document.getElementById("resetQuiz")
            .addEventListener("click", () => {

                state.answered = 0;

                state.score = 0;

                state.done = false;

                target.querySelectorAll(".quiz-choice").forEach(button => {

                    button.disabled = false;

                    button.classList.remove("is-correct", "is-wrong");

                });

                target.querySelectorAll(".quiz-why").forEach(why => {

                    why.textContent = "";

                    why.classList.remove("show");

                });

                result.classList.remove("show");

                result.innerHTML = "";

                paint();

                window.scrollTo({ top: 0, behavior: "smooth" });

            });


        paint();

    }


    function start() {

        if (mode === "notes") {
            renderNotes();
        } else if (mode === "papers") {
            renderPapers();
        } else if (mode === "quiz") {
            renderQuiz();
        }

    }


    if (document.readyState === "loading") {

        document.addEventListener("DOMContentLoaded", start);

    } else {

        start();

    }

})();
