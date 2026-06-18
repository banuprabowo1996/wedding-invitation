# AGENTS.md — wedding-invitation

Static HTML/CSS/JS landing page + subdirectory templates for **Nikahanmu**, a digital wedding invitation service.

## Commands / Tooling

- **No build, no package manager, no TypeScript.** Pure static files. Edit HTML/CSS/JS directly.
- No test, lint, format, or typecheck commands exist.
- .vscode/settings.json only: `editor.linkedEditing: true`.
- All dependencies loaded via CDN (Bootstrap 5.3.3, Bootstrap Icons, Google Fonts, AOS, simplyCountdown, Tailwind CSS v4 in annisa-bagas only).

## Project Structure

```
/                        # Landing / sales page (index.html, styles.css)
template-1.0/            # Single-page invitation with countdown, gallery, RSVP
template-2.0/            # Same structure as 1.0
template-3.0/            # Same structure as 1.0
template-4.0/            # Multi-page layout (index.html, detail.html, story.html + css/ subfolder)
annisa-bagas/            # Most elaborate template (index.html, styles.css, index.js, video/)
```

Every template has `index.html`. Template-1.0/2.0/3.0 have vendored `countdown/simplyCountdown.min.js`. annisa-bagas has its own `index.js` with custom countdown, AOS init, and comment/RSVP form handling.

## Deployment

- **Vercel** at `https://wedding-invitation-mocha.vercel.app` — static file hosting, no config file in repo.
- **Backend API** at `https://be-wedding-inv.onrender.com` (comments), deployed separately on Render.
- RSVP forms post to a Google Apps Script endpoint.

## Template Conventions

- `?to=Nama` query param personalizes the greeting ("Kepada [Nama]").
- Scroll is locked until user clicks "Open Invitation" / "Lihat Undangan".
- Audio autoplay on invite open (fixed spinning disc icon).
- Sections: Cover → Couple → Info/Date → Story → Gallery → RSVP → Gifts → Comments → Footer.
- 5 breakpoints: 1200px, 992px, 768px, 576px, 420px.
- Copyright: "(c) 2024 Nikahanmu. All Rights Reserved."
- Social links all point to `banuprabowoo` accounts.

## Quirks

- `dump.rdb` (Redis dump) is tracked in git — likely accidental. No `.gitignore` exists.
- `viewTemplate()` in root `index.html` maps template names to subdirectories:
  - `"bagas"` → `annisa-bagas/`
  - `"copy"` → `annisa-bagas-copy/` (no longer in repo)
  - Other params → `template-{params}/`
