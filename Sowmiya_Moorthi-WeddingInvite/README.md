# Sowmiya & Moorthi — Wedding Invitation

Open `index.html` in a browser, or upload the whole folder to any static host
(Netlify, Vercel, GitHub Pages, Firebase Hosting, cPanel). No build step.

## Editing content
Everything lives in **`js/config.js`**: names, date/time, venue, Maps link,
family names, events, story text, gallery photos and music.

- **Our Story** text is placeholder copy. Replace the four `story` entries with the couple's own words.
- **Adding an event** (e.g. engagement): copy the commented template in `events`, fill it in, set `confirmed: true`.
- **Photos**: put files in `assets/images/`, add them to `gallery` with their pixel width/height (keeps proportions exact).

## Music
Add your licensed copy of the song as `assets/audio/mangalyam.mp3`
(or change `music.src`). The floating music button appears automatically once the
file loads; with no file, the button stays hidden. Music starts softly only after the
guest taps "Open Invitation" (set `playOnOpen: false` to require the music button).

## WhatsApp preview
After hosting, uncomment the `og:image` tag in `index.html` and point it at an
absolute URL of a photo so the link shows a thumbnail in WhatsApp.

## Files
index.html · css/style.css · js/config.js · js/animations.js · js/scratch-card.js ·
js/countdown.js · js/gallery.js · js/main.js · assets/images · assets/audio
