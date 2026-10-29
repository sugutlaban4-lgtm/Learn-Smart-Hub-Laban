# Learn Smart Hub

Study material for Kenyan secondary school students. Notes, past papers,
revision papers, video lessons and instantly marked quizzes for Mathematics,
Science, English, Kiswahili and Social Sciences, in one place, built to stay
useful on a slow or expensive connection.

**Live site:** https://sugutlaban4-lgtm.github.io/Learn-Smart-Hub-Laban/

## What is in the site

| Area | Pages |
| --- | --- |
| Public | `index.html`, `contact.html`, `privacy.html`, `refund.html`, `terms.html`, `offline.html` |
| Accounts | `login.html`, `signup.html`, `profile.html` |
| Product | `dashboard.html`, `premium.html`, `premium-materials.html`, `admin.html` |
| Subject hubs | `mathematics.html`, `science.html`, `english.html`, `kiswahili.html`, `social-sciences.html` |
| Resources | `notes.html`, `pastpapers.html`, `quiz.html`, `videos.html` and the per-subject `*-notes`, `*-pastpapers`, `*-quiz`, `*-videos` pages |

## How it is built

Plain HTML, CSS and JavaScript, served by GitHub Pages from the `main` branch.
There is no build step: push to `main` and the site deploys.

- `css/site.css` - design tokens, header, buttons, cards, forms, footer. Every page loads this.
- `css/study.css` - study screens: hub cards, notes, papers, quizzes, video grids.
- `css/dashboard.css`, `css/admin.css` - app and admin screens.
- `js/study.js` - renders notes, papers and quizzes from the files in `data/`.
- `js/videos.js` - renders video lesson lists from `data/*-videos.js`.
- `js/admin-app.js` - admin dashboard.
- `firebase.js` - single Firebase auth client, imported by `gate.js`, `login.html`, `premium.js` and the admin screens.
- `gate.js` - keeps study pages closed until a student is signed in, then remembers where they were going.
- `service-worker.js` - offline support: network first for pages, stale-while-revalidate for assets.

## Content

Subject content lives in `data/` as plain JavaScript modules, and downloadable
material lives in `Resources/`. To add a topic, paper or lesson, edit the
matching data file; no page markup needs to change.

## Payments

Premium is paid through M-Pesa STK push. The browser calls the backend in
`learn-smart-hub-backend`, which owns the Daraja credentials and confirms the
payment before premium access is granted.

## Local preview

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Conventions

- One design system: new pages use `site.css` plus, where relevant, `study.css`.
- No emoji as interface icons; icons are inline SVG with a text label.
- Keep pages light: system fonts, no framework, no blocking third-party requests.
- Study pages are `noindex` on purpose; only the public pages are indexed.
