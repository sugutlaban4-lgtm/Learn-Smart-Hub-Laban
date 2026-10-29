/**
 * Learn Smart Hub - Premium materials catalogue.
 *
 * Every entry is a paid resource: notes packs, marking-scheme workbooks,
 * masterclass video lessons and topic quiz banks. The library page reads
 * this file, so adding a new premium resource means adding one object here
 * and nothing else.
 *
 * Body content is plain HTML. Keep it to headings, paragraphs, ordered and
 * unordered lists, tables and strong/em so the reader pane styles it well.
 */

window.PREMIUM_MATERIALS = [

    /* ================= MATHEMATICS ================= */
    {
        id: "math-algebra-pack",
        subject: "Mathematics",
        type: "Notes pack",
        title: "Algebra Mastery Pack: quadratics, surds and indices",
        summary: "The three algebra topics that carry the most marks in Paper 1, worked slowly with the traps marked.",
        meta: "24 pages · 4 topics",
        updated: "2026-10-27",
        body: `
            <h3>1. Quadratic equations</h3>
            <p>Every quadratic in KCSE can be handled by three routes. Choose in this order: factorise, complete the square, formula.</p>
            <ol>
                <li><strong>Factorise</strong> when the constant term has obvious factor pairs. Find two numbers that multiply to <em>ac</em> and add to <em>b</em>.</li>
                <li><strong>Complete the square</strong> when the question asks for the maximum or minimum, or for the turning point. Rewrite <em>ax² + bx + c</em> as <em>a(x + p)² + q</em>.</li>
                <li><strong>Formula</strong> when the numbers are ugly. Write the formula line first, then substitute, then simplify. Marks are given for the formula line.</li>
            </ol>
            <p><strong>Worked example.</strong> Solve 2x² − 7x + 3 = 0. Product ac = 6, so use −6 and −1: 2x² − 6x − x + 3 = 0, giving 2x(x − 3) − 1(x − 3) = 0, so (2x − 1)(x − 3) = 0 and x = ½ or x = 3.</p>
            <h3>2. The discriminant</h3>
            <p>b² − 4ac tells you the nature of the roots without solving. Positive: two distinct real roots. Zero: equal roots. Negative: no real roots. Exam questions often ask you to <em>find the value of k</em> for which a quadratic has equal roots, so set b² − 4ac = 0 and solve for k.</p>
            <h3>3. Surds</h3>
            <p>Rationalise by multiplying by the conjugate. For 1/(3 + √2), multiply top and bottom by (3 − √2) to get (3 − √2)/7. Never leave a surd in a denominator, and simplify √8 to 2√2 before adding.</p>
            <h3>4. Indices</h3>
            <p>Convert everything to the same base. 9^(x+1) = 27^(x−1) becomes 3^(2x+2) = 3^(3x−3), so 2x + 2 = 3x − 3 and x = 5. Marks are lost for jumping straight to the answer without showing the base conversion.</p>
            <h3>Common traps</h3>
            <ul>
                <li>Forgetting ± when taking a square root.</li>
                <li>Losing the sign when the coefficient of x² is negative.</li>
                <li>Giving x only, when the question asked for a pair of coordinates.</li>
            </ul>
        `
    },
    {
        id: "math-pastpapers-workbook",
        subject: "Mathematics",
        type: "Past papers",
        title: "KCSE Mathematics 2015 to 2025 with marking schemes",
        summary: "Eleven years of Paper 1 and Paper 2, grouped by topic, with the official marking scheme beside every question.",
        meta: "22 papers · full schemes",
        updated: "2026-10-26",
        body: `
            <h3>How the workbook is arranged</h3>
            <p>The papers are not in year order. They are regrouped by topic so you revise a weakness instead of a calendar year. Each topic section opens with the frequency table below.</p>
            <table>
                <thead><tr><th>Topic</th><th>Appearances (11 years)</th><th>Typical marks</th></tr></thead>
                <tbody>
                    <tr><td>Quadratic expressions and equations</td><td>11</td><td>4 – 6</td></tr>
                    <tr><td>Trigonometry (sine and cosine rules)</td><td>11</td><td>5 – 7</td></tr>
                    <tr><td>Statistics and probability</td><td>10</td><td>4 – 8</td></tr>
                    <tr><td>Three dimensional geometry</td><td>9</td><td>6 – 8</td></tr>
                    <tr><td>Matrices and transformations</td><td>9</td><td>4 – 6</td></tr>
                </tbody>
            </table>
            <h3>How to use a marking scheme properly</h3>
            <p>Do the question first with the scheme closed, then mark yourself line by line. A scheme mark lives on a method line, not on the final answer. If you reached the right answer by a route the scheme does not show, write your method next to it, because in the real exam you would still earn the method marks.</p>
            <h3>What the schemes reward</h3>
            <ul>
                <li>Stating a formula before substituting.</li>
                <li>Carrying units through working, especially in rates and money.</li>
                <li>Rounding only at the end, and stating the degree of accuracy.</li>
            </ul>
            <p>Start with the topic you scored lowest in your last mock. Two papers per topic, then move on. Finishing all 22 papers in the last three weeks is not the plan this workbook is built for.</p>
        `
    },
    {
        id: "math-masterclass-trig",
        subject: "Mathematics",
        type: "Video lessons",
        title: "Trigonometry masterclass: bearings, sine rule and cosine rule",
        summary: "Four recorded lessons on the topic students lose the most marks on, with a pause-and-try question in each lesson.",
        meta: "4 lessons · 58 min",
        updated: "2026-10-25",
        body: `
            <h3>Lesson 1 - Bearings without the confusion</h3>
            <p>Bearings are measured clockwise from North and written with three digits: 045°, 120°, 310°. The lesson builds a compass rose for every question before any calculation, which removes most sign errors.</p>
            <h3>Lesson 2 - Sine rule</h3>
            <p>Use it when you have a matching pair of side and opposite angle. Write the rule as a/sin A = b/sin B and fill it in before rearranging. The ambiguous case is covered, including when two triangles are possible.</p>
            <h3>Lesson 3 - Cosine rule</h3>
            <p>Use it when you have two sides and the included angle, or all three sides. Learn both forms: a² = b² + c² − 2bc cos A, and cos A = (b² + c² − a²)/2bc. The second form is the one that finds an angle and it is the one students forget.</p>
            <h3>Lesson 4 - Mixed exam questions</h3>
            <p>Three full past-paper questions worked in real time: a distance-across-a-river question, a height-of-a-tower question with two observation points, and a 3D question that needs both rules in the same triangle.</p>
            <h3>After each lesson</h3>
            <p>Do the pause-and-try question before watching the solution. If you get it wrong, rewind to the compass diagram, not the formula, because that is where the mistake usually starts.</p>
        `
    },
    {
        id: "math-topic-quiz-bank",
        subject: "Mathematics",
        type: "Quiz banks",
        title: "Topic quiz bank: 300 questions with instant marking",
        summary: "Short topic quizzes with worked solutions, scored instantly and tracked so you can see which topics are slipping.",
        meta: "300 questions · 18 topics",
        updated: "2026-10-24",
        body: `
            <h3>How the bank works</h3>
            <p>Each topic has 15 to 20 questions sorted easiest first. Every question is marked the moment you answer and comes with a short solution, so a wrong answer still teaches something.</p>
            <h3>Topics included</h3>
            <ul>
                <li>Numbers, fractions, decimals and standard form</li>
                <li>Algebraic expressions and factorisation</li>
                <li>Linear equations and inequalities</li>
                <li>Quadratic equations and graphs</li>
                <li>Matrices and transformations</li>
                <li>Circle theorems and geometry of solids</li>
                <li>Trigonometry, Pythagoras and bearings</li>
                <li>Statistics, probability and cumulative frequency</li>
                <li>Rates, ratio, proportion and commercial arithmetic</li>
            </ul>
            <h3>Suggested pattern</h3>
            <p>Ten questions a day is enough. Do the topic you learned most recently first, then the oldest topic, so nothing goes stale. When a topic falls below 70 percent, go back to the notes pack before trying the questions again.</p>
            <p>Attempt counts and scores are kept against your account, so the dashboard shows progress across the weeks rather than a single session.</p>
        `
    },
    {
        id: "math-revision-kit",
        subject: "Mathematics",
        type: "Revision kit",
        title: "Three-week Mathematics revision timetable",
        summary: "A dated plan covering every Paper 1 topic with daily question counts, so nothing is left until the last week.",
        meta: "21 days · printable",
        updated: "2026-10-23",
        body: `
            <h3>Week 1 - Fix the foundation</h3>
            <p>Days 1 to 7 cover numbers, algebraic expressions, linear equations, indices, logarithms and surds. Each day is 45 minutes of notes and 45 minutes of questions. Keep a single sheet for every formula you meet and add to it daily.</p>
            <h3>Week 2 - Heavy marks</h3>
            <p>Days 8 to 14 cover quadratics, matrices and transformations, trigonometry and three dimensional geometry. These are the topics that carry the highest marks per question, so they get the middle week when your concentration is still fresh.</p>
            <h3>Week 3 - Full papers</h3>
            <p>Days 15 to 21 are paper days. Sit one Paper 1 under timed conditions, mark it the same evening, and spend the next morning on the weakest topic it exposed. No new content in week 3.</p>
            <h3>Rules that make the timetable work</h3>
            <ul>
                <li>One topic per day, never two half topics.</li>
                <li>Mark your own work the same day, not the following week.</li>
                <li>Keep a mistakes page. Reread it before each paper.</li>
                <li>If a day is lost, do not compress the topic; move it to the free slot on day 21.</li>
            </ul>
        `
    },

    /* ================= ENGLISH ================= */
    {
        id: "eng-comprehension-pack",
        subject: "English",
        type: "Notes pack",
        title: "Comprehension and summary pack: how marks are actually given",
        summary: "The reading skills behind Paper 2 comprehension and the six-mark summary question, with model answers.",
        meta: "18 pages · 4 skills",
        updated: "2026-10-26",
        body: `
            <h3>Reading for the question, not the passage</h3>
            <p>The passage is not the point. Read the questions first, note the line reference in each, then read the passage. That way you read for evidence instead of reading for general meaning.</p>
            <h3>Comprehension technique</h3>
            <ol>
                <li>Underline the key word in each question: <em>state</em>, <em>explain</em>, <em>describe</em> or <em>in your own words</em>.</li>
                <li>Answer in complete sentences and keep the same order as the questions.</li>
                <li>Quote only where the question says quote. Otherwise paraphrase.</li>
                <li>For "explain the meaning of the phrase as used in the passage", give both the general meaning and what it means <em>in that sentence</em>.</li>
            </ol>
            <h3>The summary question</h3>
            <p>Six marks usually means six points, but the instruction will also cap the words. Common fault: copying whole sentences, which scores nothing because no point has been extracted. Train this by reading a paragraph and writing its point in five words.</p>
            <p><strong>Model answer habit.</strong> After each passage, write your answers without marks, then look at a model. Compare where marks sit: model answers are shorter and more direct than students expect.</p>
            <h3>Traps</h3>
            <ul>
                <li>Answering "yes" or "no" without the reason that carries the mark.</li>
                <li>Joining two points into one sentence and being marked for one.</li>
                <li>Exceeding the word limit, which voids the extra points.</li>
            </ul>
        `
    },
    {
        id: "eng-setbooks-pack",
        subject: "English",
        type: "Notes pack",
        title: "Set book companion: essay plans for all three texts",
        summary: "Character maps, theme tables and six full essay plans per text, all written to the Paper 3 marking grid.",
        meta: "32 pages · 3 texts",
        updated: "2026-10-25",
        body: `
            <h3>What the essay is marked on</h3>
            <p>Paper 3 rewards a stated position, evidence from the text, and analysis of the writer's technique. A plot retelling scores nothing extra no matter how accurate it is.</p>
            <h3>The plan that works</h3>
            <ol>
                <li><strong>Introduction.</strong> Answer the question in one sentence, then name the text and writer.</li>
                <li><strong>Four body paragraphs.</strong> One point each, opened by a topic sentence, supported by an incident, then explained as technique.</li>
                <li><strong>Conclusion.</strong> Restate the position without repeating the introduction wording.</li>
            </ol>
            <h3>Theme tables</h3>
            <p>Every set book question can be reduced to a theme: power, betrayal, family, education, identity, poverty or tradition versus change. For each theme the companion gives three incidents and a quotable phrase, so you are never stuck for evidence.</p>
            <h3>Character notes</h3>
            <p>Characters are mapped by relationship and by change over the text. Questions almost always ask about change, so note what each character believes at the start, at the middle and at the end.</p>
            <h3>Six plans per text</h3>
            <p>Each plan fits one page and includes the position, four points with evidence, and the technique to discuss in each paragraph. Practise writing one plan from memory in five minutes.</p>
        `
    },
    {
        id: "eng-functional-writing",
        subject: "English",
        type: "Notes pack",
        title: "Functional writing workbook: formats, tone and common faults",
        summary: "Every functional writing format in the syllabus, with model letters, memos, minutes and speeches marked up.",
        meta: "20 pages · 12 formats",
        updated: "2026-10-24",
        body: `
            <h3>Formats you must know cold</h3>
            <ul>
                <li>Formal and informal letters, including the difference in salutation and sign-off</li>
                <li>Memos, internal and external</li>
                <li>Minutes and agendas</li>
                <li>Notices, posters and advertisements</li>
                <li>Speeches, including a vote of thanks</li>
                <li>Curriculum vitae and application letters</li>
                <li>Book reviews, diaries and personal journals</li>
                <li>Questionnaires</li>
            </ul>
            <h3>Tone</h3>
            <p>Formal writing uses no contractions, no slang and no exclamation marks. A memo is short and impersonal. A speech may be warmer but still needs structure: greeting, purpose, three points, closing appeal.</p>
            <h3>The mark breakdown</h3>
            <p>Functional writing is marked for format, content and language. Format marks are the cheapest marks on the paper, so learn the skeleton of each document before trying to write one.</p>
            <h3>Common faults</h3>
            <ul>
                <li>Writing a memo with a letter's salutation.</li>
                <li>Putting the date in the wrong place in a letter.</li>
                <li>Forgetting the addressee in minutes and also forgetting the initials of the secretary.</li>
                <li>Writing a notice that never says where or when.</li>
            </ul>
            <p>Each format in the workbook comes with one model, one marked-up poor example and a two-minute drill.</p>
        `
    },
    {
        id: "eng-video-masterclass",
        subject: "English",
        type: "Video lessons",
        title: "Oral skills and listening masterclass",
        summary: "Three recorded lessons on pronunciation, oral literature and the oral exam, with the examiner's checklist.",
        meta: "3 lessons · 44 min",
        updated: "2026-10-23",
        body: `
            <h3>Lesson 1 - Sound patterns</h3>
            <p>Covers vowels, consonant clusters, minimal pairs and the errors that cost marks in the oral exam. Every sound is drilled twice, once alone and once inside a sentence.</p>
            <h3>Lesson 2 - Oral literature</h3>
            <p>Narratives, riddles, songs and proverbs, with the analysis language examiners expect: audience, occasion, function and performance features.</p>
            <h3>Lesson 3 - The oral exam itself</h3>
            <p>What happens in the room, how to handle a text you have not prepared, and how to keep speaking when you lose the thread. Includes the examiner's checklist and the four habits that lose marks.</p>
            <h3>Practice pairs</h3>
            <p>Each lesson ends with a pair practice: one person narrates, the other marks using the checklist. Ten minutes of pairs beats an hour of reading about oracy.</p>
        `
    },
    {
        id: "eng-pastpapers-workbook",
        subject: "English",
        type: "Past papers",
        title: "KCSE English papers with sample essays at three grades",
        summary: "Papers 1 to 3 from the last eight sessions, with the same essay written at a middle, a high and a top grade.",
        meta: "8 sessions · graded essays",
        updated: "2026-10-22",
        body: `
            <h3>Eight sessions, three papers each</h3>
            <p>Every paper is complete with the passage, the questions and the marking scheme. Papers are kept in session order because English papers reuse passage themes and question styles more than they reuse content.</p>
            <h3>The graded essays</h3>
            <p>For four of the composition prompts you get the same essay written at three levels: a middle-grade answer, a high-grade answer and a top-grade answer. Reading them side by side is the fastest way to see what raises a grade.</p>
            <h3>What separates the grades</h3>
            <ul>
                <li>Middle: tells a story with a beginning and an end but no clear point.</li>
                <li>High: has a controlling idea and organised paragraphs.</li>
                <li>Top: controls tone and sentence rhythm, and every paragraph develops the same idea.</li>
            </ul>
            <h3>How to mark your own composition</h3>
            <p>Read your essay aloud once. Anywhere you stumble is usually a sentence too long, a phrase that repeats, or a paragraph that changed subject. Fix those three, then ask about content.</p>
        `
    },

    /* ================= KISWAHILI ================= */
    {
        id: "kis-utungaji-mwongozo",
        subject: "Kiswahili",
        type: "Notes pack",
        title: "Mwongozo wa Insha: aina zote nane za utungaji",
        summary: "Miongozo ya insha za hoja, methali, masimulizi, maelezo, utaarifu na barua, pamoja na vielelezo vilivyopangwa.",
        meta: "22 kurasa · aina 8",
        updated: "2026-10-26",
        body: `
            <h3>Muundo wa jumla</h3>
            <p>Utungaji mzuri wa KCSE unahitaji utangulizi, mwili wenye hoja nne na hitimisho. Utangulizi unatoa msimamo, mwili unautetea kwa hoja na mifano, na hitimisho unafunga bila kurudia maneno ya utangulizi.</p>
            <h3>Insha ya hoja</h3>
            <ol>
                <li>Toa msimamo wako katika sentensi moja.</li>
                <li>Toa hoja nne, kila moja na sentensi ya mada.</li>
                <li>Tia mifano halisi: matukio, takwimu au matumizi ya kila siku.</li>
                <li>Shughulikia upande wa pili kwa aya moja, kisha ukanushe.</li>
            </ol>
            <h3>Insha ya methali</h3>
            <p>Eleza methali kwa ufupi, kisha ionyeshe katika maisha. Usiandike hadithi moja ndefu; toa mifano mitatu tofauti inayothibitisha methali hiyo.</p>
            <h3>Barua rasmi na isiyo rasmi</h3>
            <p>Barua rasmi ina anwani, tarehe, anwani ya mpokeaji, salamu, mada, mwili, na kufunga. Barua isiyo rasmi haina mada na lugha yake ni ya kirafiki lakini si ya ujeuri.</p>
            <h3>Makosa yanayopunguza alama</h3>
            <ul>
                <li>Kuchanganya ngeli katika sentensi moja.</li>
                <li>Kurudia maneno badala ya kutumia visawe.</li>
                <li>Kuandika aya moja ndefu yenye hoja tatu.</li>
                <li>Kuhitimisha kwa maneno yale yale ya utangulizi.</li>
            </ul>
        `
    },
    {
        id: "kis-fasihi-mwongozo",
        subject: "Kiswahili",
        type: "Notes pack",
        title: "Mwongozo wa Fasihi: riwaya, tamthilia na hadithi fupi",
        summary: "Maudhui, wahusika, mbinu za lugha na dondoo kwa kila kitabu cha fasihi kilichopendekezwa.",
        meta: "30 kurasa · vitabu 3",
        updated: "2026-10-25",
        body: `
            <h3>Maudhui</h3>
            <p>Kila riwaya au tamthilia ina maudhui makuu matano hadi sita: ukoloni, mapambano ya haki, umaskini, malezi, utamaduni na ujenzi wa taifa. Kwa kila maudhui, mwongozo unatoa matukio matatu na dondoo la kumnukuu.</p>
            <h3>Wahusika</h3>
            <p>Mhusika anajulikana kwa tabia, mabadiliko na uhusiano wake na wengine. Maswali mengi huluiza mabadiliko ya mhusika, kwa hivyo andika kile anachokiamini mwanzoni, katikati na mwishoni.</p>
            <h3>Mbinu za lugha</h3>
            <ul>
                <li>Tashbihi, sitiari na taswira</li>
                <li>Methali na misemo</li>
                <li>Uhuishaji na takriri</li>
                <li>Mazungumzo na tamthiliya ndani ya hadithi</li>
            </ul>
            <p>Kwa kila mbinu, toa mfano mmoja kutoka kitabuni na eleza kazi yake, siyo tu kuitambua.</p>
            <h3>Namna ya kujibu swali la insha ya fasihi</h3>
            <p>Anza kwa hoja, siyo kwa muhtasari wa kitabu. Kila aya inahitaji hoja, tukio, dondoo na uchambuzi wa mbinu. Hitimisho lirudie hoja kuu kwa maneno mapya.</p>
        `
    },
    {
        id: "kis-lugha-mazoezi",
        subject: "Kiswahili",
        type: "Quiz banks",
        title: "Mazoezi ya sarufi: ngeli, vitenzi na misemo",
        summary: "Mazoezi 240 ya sarufi yanayojipima papo hapo, yakigawanywa kwa mada na ngazi ya ugumu.",
        meta: "Maswali 240 · mada 14",
        updated: "2026-10-24",
        body: `
            <h3>Mada zilizomo</h3>
            <ul>
                <li>Ngeli za nomino na upatanisho</li>
                <li>Vitenzi na nyakati</li>
                <li>Viwakilishi na vivumishi</li>
                <li>Misemo, methali na nahau</li>
                <li>Ukanushaji na ugeuzaji</li>
                <li>Alama za uakifishaji</li>
            </ul>
            <h3>Jinsi ya kufanya mazoezi</h3>
            <p>Fanya maswali kumi kwa siku. Kila swali linahitaji jibu moja tu, na maelezo mafupi yanaonyeshwa papo hapo. Swali lolote linalokosewa mara mbili linaongezwa kwenye orodha yako ya marudio.</p>
            <h3>Ngeli ndio kiini</h3>
            <p>Makosa mengi ya sarufi yanatokana na ngeli. Kabla ya kujibu swali la upatanisho, tambua nomino kuu na ngeli yake, kisha linganisha kiambishi cha kitenzi au kivumishi.</p>
            <p>Alama zako zinahifadhiwa kwenye akaunti yako, kwa hivyo unaweza kuona mada zinazorudi nyuma.</p>
        `
    },
    {
        id: "kis-video-mazungumzo",
        subject: "Kiswahili",
        type: "Video lessons",
        title: "Masomo ya video: ufahamu na ufupisho",
        summary: "Masomo manne ya video kuhusu ufahamu, ufupisho na lugha ya ishara za mtihani.",
        meta: "Masomo 4 · dakika 52",
        updated: "2026-10-23",
        body: `
            <h3>Somo 1 - Ufahamu</h3>
            <p>Kusoma kwa lengo: soma maswali kwanza, ainisha kitenzi cha amri (<em>taja</em>, <em>eleza</em>, <em>fafanua</em>), kisha soma kifungu ukijua unachotafuta.</p>
            <h3>Somo 2 - Ufupisho</h3>
            <p>Ufupisho wa alama sita unahitaji hoja sita kwa maneno machache. Somo linaonyesha jinsi ya kuondoa mifano na kurudia, na kuacha hoja pekee.</p>
            <h3>Somo 3 - Methali na misemo</h3>
            <p>Kila methali ina maana ya moja kwa moja na maana ya kufichika. Somo linaonyesha jinsi ya kutoa zote mbili, na jinsi ya kuitumia katika insha.</p>
            <h3>Somo 4 - Majaribio ya jumla</h3>
            <p>Maswali matatu ya karatasi kamili yanafanywa kwa muda halisi, kisha yanafafanuliwa kwa kutumia mwongozo wa alama.</p>
        `
    },
    {
        id: "kis-pastpapers-workbook",
        subject: "Kiswahili",
        type: "Past papers",
        title: "Karatasi za KCSE Kiswahili na mwongozo wa alama",
        summary: "Karatasi tatu kwa kila kipindi cha miaka minane, pamoja na insha za vielelezo na mwongozo wa alama.",
        meta: "Vipindi 8 · miongozo",
        updated: "2026-10-22",
        body: `
            <h3>Muundo</h3>
            <p>Karatasi ya kwanza ni ufahamu, ufupisho na sarufi. Karatasi ya pili ni fasihi na utungaji. Karatasi ya tatu ni fasihi kwa kina. Mwongozo wa alama unaambatana na kila karatasi.</p>
            <h3>Insha za vielelezo</h3>
            <p>Kwa mada nane zinazorudi, kuna insha mbili: moja ya kiwango cha kati na moja ya kiwango cha juu. Linganisha muundo, mpangilio wa aya na matumizi ya misemo.</p>
            <h3>Namna ya kujipima</h3>
            <ol>
                <li>Fanya karatasi kwa muda halisi, bila kufungua mwongozo.</li>
                <li>Alama mwenyewe kwa kufuata mwongozo, aya kwa aya.</li>
                <li>Andika makosa matatu makuu kwenye ukurasa wa marudio.</li>
                <li>Rudia mada iliyokosa alama siku inayofuata, siyo mwezi ujao.</li>
            </ol>
        `
    },

    /* ================= SCIENCE ================= */
    {
        id: "sci-biology-practical",
        subject: "Science",
        type: "Notes pack",
        title: "Biology practical pack: drawings, tests and food analysis",
        summary: "The practical paper, drawn out step by step: magnification, food tests, drawings and how observations are scored.",
        meta: "26 pages · 5 skills",
        updated: "2026-10-27",
        body: `
            <h3>Drawings</h3>
            <p>Use a sharp pencil, continuous lines and no shading. Label with straight lines that touch the structure, and write labels horizontally. State the magnification under every drawing using magnification = drawing length ÷ actual length.</p>
            <h3>Food tests</h3>
            <table>
                <thead><tr><th>Test</th><th>Reagent</th><th>Positive result</th></tr></thead>
                <tbody>
                    <tr><td>Starch</td><td>Iodine solution</td><td>Blue-black colour</td></tr>
                    <tr><td>Reducing sugar</td><td>Benedict's solution, heated</td><td>Brick red precipitate</td></tr>
                    <tr><td>Protein</td><td>Biuret reagent</td><td>Purple colour</td></tr>
                    <tr><td>Lipid</td><td>Emulsion test with water</td><td>Milky emulsion</td></tr>
                </tbody>
            </table>
            <p>Always say what you observed, not what it proves. The observation earns the mark; the conclusion is a separate mark.</p>
            <h3>Experiments and controls</h3>
            <ul>
                <li>State the independent, dependent and controlled variables before writing a method.</li>
                <li>Name one control set-up and say why it is needed.</li>
                <li>Predict the result and give the biological reason.</li>
            </ul>
            <h3>Where practical marks are lost</h3>
            <p>Unlabelled diagrams, conclusions written without observations, and methods that give no quantities or times.</p>
        `
    },
    {
        id: "sci-chemistry-calculations",
        subject: "Science",
        type: "Notes pack",
        title: "Chemistry calculations: moles, titrations and gas laws",
        summary: "Every calculation type in the syllabus, with the working layout that earns method marks.",
        meta: "24 pages · 6 topics",
        updated: "2026-10-26",
        body: `
            <h3>The mole map</h3>
            <p>Almost every calculation starts at moles. Moles = mass ÷ molar mass, moles = concentration × volume in litres, and moles = gas volume ÷ 24 at room temperature. Draw the map once, then follow it.</p>
            <h3>Titration</h3>
            <ol>
                <li>Write the balanced equation.</li>
                <li>Find moles of the known solution: concentration × volume in dm³.</li>
                <li>Use the mole ratio from the equation.</li>
                <li>Divide by the volume of the unknown to get its concentration.</li>
            </ol>
            <p>Carry units through every line. A concentration in mol/dm³ that arrives from a volume in cm³ is wrong by a factor of 1000, and that error costs the whole question.</p>
            <h3>Gas laws</h3>
            <p>Convert temperature to kelvin first. P₁V₁/T₁ = P₂V₂/T₂ covers the combined law, and the same rule covers Boyle's, Charles' and pressure law questions.</p>
            <h3>Percentage yield and empirical formula</h3>
            <p>Percentage yield = actual ÷ theoretical × 100. For empirical formula, divide each mass by the molar mass, then divide all by the smallest, then multiply to whole numbers.</p>
        `
    },
    {
        id: "sci-physics-practical",
        subject: "Science",
        type: "Notes pack",
        title: "Physics paper 3: apparatus, graphs and error analysis",
        summary: "How to set up the common experiments, plot the graph examiners want, and write the conclusion that scores.",
        meta: "22 pages · 4 experiments",
        updated: "2026-10-25",
        body: `
            <h3>Reading apparatus</h3>
            <p>Record to the precision of the instrument: a metre rule to 0.1 cm, a vernier calliper to 0.01 cm, a micrometer screw gauge to 0.001 cm. Give units on every reading and repeat where the question says repeat.</p>
            <h3>Graphs</h3>
            <ul>
                <li>Label both axes with the quantity and its unit.</li>
                <li>Use a scale that fills at least half the grid.</li>
                <li>Plot points with small crosses, then draw a line of best fit, not point to point.</li>
                <li>Find the gradient from two points on the line, far apart, and show the substitution.</li>
            </ul>
            <h3>Errors</h3>
            <p>Name the error and its effect on the result: zero error shifts the intercept, parallax changes individual readings, and heat loss reduces measured efficiency. The question usually asks for one source and one way to reduce it.</p>
            <h3>Conclusion</h3>
            <p>Link the gradient to the physical quantity the theory predicts. "The current is directly proportional to the potential difference, and the gradient equals 1/resistance" earns more than "the graph was a straight line".</p>
        `
    },
    {
        id: "sci-video-masterclass",
        subject: "Science",
        type: "Video lessons",
        title: "Science masterclass: genetics, organic chemistry and electricity",
        summary: "Six recorded lessons on the three topics that decide most science grades, each with a past-paper walkthrough.",
        meta: "6 lessons · 74 min",
        updated: "2026-10-24",
        body: `
            <h3>Genetics</h3>
            <p>Two lessons covering monohybrid crosses, test crosses, sex linkage and pedigree diagrams. Every cross is drawn as a grid with parental genotypes stated first, because that is where the marks are.</p>
            <h3>Organic chemistry</h3>
            <p>Two lessons on homologous series, isomerism and reaction pathways. The pathway diagram is built on screen and reused for every conversion question, including ethanol to ethanoic acid and back.</p>
            <h3>Electricity</h3>
            <p>Two lessons on circuits: series and parallel combinations, internal resistance, and the potential divider. Each ends with a past-paper question worked fully, including the graph question that usually follows.</p>
        `
    },
    {
        id: "sci-quiz-bank",
        subject: "Science",
        type: "Quiz banks",
        title: "Science quiz bank: 400 questions across the three sciences",
        summary: "Biology, chemistry and physics questions sorted by topic, with instant feedback and explanation.",
        meta: "400 questions · 24 topics",
        updated: "2026-10-23",
        body: `
            <h3>Coverage</h3>
            <p>Biology: cells, transport, respiration, photosynthesis, genetics, ecology and reproduction. Chemistry: structure, bonding, the mole, acids and bases, organic chemistry and metals. Physics: mechanics, waves, electricity, magnetism and heat.</p>
            <h3>Format</h3>
            <p>Each question is one mark, answered in a few words or by choosing an option. Feedback explains the reasoning, so a lucky guess still teaches nothing and is counted as one.</p>
            <h3>Using the bank well</h3>
            <ul>
                <li>Fifteen questions a day, split across two sciences.</li>
                <li>Return to any topic below 70 percent before moving on.</li>
                <li>Keep a definitions sheet, because half of these questions test a definition.</li>
            </ul>
            <p>Scores feed the progress chart on your dashboard.</p>
        `
    },

    /* ================= SOCIAL SCIENCES ================= */
    {
        id: "soc-history-essays",
        subject: "Social Sciences",
        type: "Notes pack",
        title: "History essay pack: structured answers for every paper 2 theme",
        summary: "Essay skeletons and evidence banks for the themes that repeat, plus how the marking levels work.",
        meta: "24 pages · 8 themes",
        updated: "2026-10-24",
        body: `
            <h3>Themes that repeat</h3>
            <ul>
                <li>Colonial administration and African response</li>
                <li>Nationalism and independence movements</li>
                <li>The Cold War and non-alignment</li>
                <li>Regional cooperation and the East African Community</li>
                <li>Industrialisation and social change</li>
            </ul>
            <h3>Essay structure</h3>
            <p>Introduction states the position in one sentence. Each body paragraph covers one factor, explains it, and gives a specific example with names and dates. The conclusion weighs the factors rather than summarising them.</p>
            <h3>Evidence banks</h3>
            <p>For each theme the pack lists the dates, people, agreements and outcomes you need. A date used correctly is worth more than a paragraph of general description.</p>
            <h3>Marking levels</h3>
            <p>Level 1 describes. Level 2 explains. Level 3 explains and evaluates. Most students stop at level 1, which is why essays that feel long still score low.</p>
        `
    },
    {
        id: "soc-geography-maps",
        subject: "Social Sciences",
        type: "Notes pack",
        title: "Geography fieldwork and map work workbook",
        summary: "Map reading, photograph interpretation and fieldwork reports, with past-paper questions on each skill.",
        meta: "20 pages · 3 skills",
        updated: "2026-10-23",
        body: `
            <h3>Map work</h3>
            <p>Bearings, grid references, distances along roads, cross sections, drainage patterns and land use. Each skill has a worked example from a real 1:50,000 sheet, then three questions to try.</p>
            <h3>Photographs</h3>
            <p>Describe what is visible before interpreting it. Say whether it is a ground, aerial or satellite photograph, then describe the features in a set order: foreground, middle ground, background.</p>
            <h3>Fieldwork</h3>
            <p>A fieldwork report needs a hypothesis, a method with sampling technique, a results table, and a conclusion that answers the hypothesis. Practise writing this in twenty minutes.</p>
        `
    },
    {
        id: "soc-civics-pack",
        subject: "Social Sciences",
        type: "Notes pack",
        title: "Civics and government pack: constitution, rights and devolution",
        summary: "The civics content most often examined, with the definitions, institutions and case examples that carry marks.",
        meta: "18 pages · 5 topics",
        updated: "2026-10-22",
        body: `
            <h3>Coverage</h3>
            <ul>
                <li>The constitution: features, supremacy and amendment</li>
                <li>Human rights and the Bill of Rights</li>
                <li>Devolution: county government and its functions</li>
                <li>Democracy, elections and the rule of law</li>
                <li>National values and good governance</li>
            </ul>
            <h3>Definitions that earn marks</h3>
            <p>Learn the precise wording for devolution, separation of powers, and the rule of law. Civics questions reward the exact term, not a description of the idea.</p>
            <h3>Institutions</h3>
            <p>Know the functions of the county assembly, the executive committee, the senate and the judiciary, and know which one does what when a question gives a scenario.</p>
            <h3>Application questions</h3>
            <p>Most civics questions give a situation and ask which right or institution applies. Work through the twenty scenarios in the pack and name the answer in one line.</p>
        `
    },
    {
        id: "soc-quiz-bank",
        subject: "Social Sciences",
        type: "Quiz banks",
        title: "Social sciences quiz bank: 200 questions with explanations",
        summary: "History, geography and civics questions sorted by theme, marked instantly with short explanations.",
        meta: "200 questions · 12 themes",
        updated: "2026-10-21",
        body: `
            <h3>How it is sorted</h3>
            <p>Each subject has four themes. Questions move from definitions to application, so the last few in each set are scenario questions of the kind that appear in Paper 1.</p>
            <h3>Daily pattern</h3>
            <p>Ten questions a day across two subjects. Anything wrong twice is added to your review list, which appears on the dashboard.</p>
            <h3>Why explanations matter here</h3>
            <p>Social science answers are often close, and the difference between two plausible options is one word. The explanation names the word that decides it.</p>
        `
    },
    {
        id: "soc-video-lessons",
        subject: "Social Sciences",
        type: "Video lessons",
        title: "Documentary lessons: independence movements and regional cooperation",
        summary: "Five short documentary-style lessons that give the context the textbook compresses into one paragraph.",
        meta: "5 lessons · 62 min",
        updated: "2026-10-20",
        body: `
            <h3>Lessons</h3>
            <ol>
                <li>Trade unions and the road to nationalism</li>
                <li>Mau Mau and the emergency</li>
                <li>Independence conferences and constitutions</li>
                <li>The East African Community, from 1967 to today</li>
                <li>The Cold War in East Africa</li>
            </ol>
            <h3>How to watch for exams</h3>
            <p>Watch once for the story, then again with a notebook for names, dates and agreements. Each lesson ends with the three exam facts that come from it.</p>
            <h3>Linked practice</h3>
            <p>Every lesson points to one essay question in the History essay pack, so the context turns into marks rather than staying as background.</p>
        `
    }
];
