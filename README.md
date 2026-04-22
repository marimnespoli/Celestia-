# Celestia — Horoscope PWA

A Progressive Web App for daily horoscopes, zodiac compatibility, and celestial profiles. Built with React (CDN), vanilla CSS, and a dark mystical aesthetic.

## Features

- Daily horoscope for all 12 zodiac signs (Today / Tomorrow / Month)
- Love, Emotions, Mentality & Career energy rings
- Zodiac compatibility calculator with orbital animation
- Celestial Profile — save your sign and birth date (LocalStorage)
- Installable PWA with offline support

## Tech Stack

- React 18 (UMD via CDN)
- Babel Standalone (JSX in browser)
- Vanilla CSS with glassmorphism
- LocalStorage for data persistence
- Service Worker for offline caching

## Run Locally

No build step needed — open directly in a browser or use a local server:

```bash
npx serve .
```

Then open `http://localhost:3000`.

## Generate Icons

```bash
node generate-icons.js
```

This creates `icons/icon-192.png` and `icons/icon-512.png` using only Node.js built-ins (no npm install required).

## Deploy

Recommended: [Vercel](https://vercel.com) or [Netlify](https://netlify.com)

1. Push this repo to GitHub
2. Import the repo on Vercel/Netlify
3. Deploy (no build command needed — it's a static site)

> **Note:** The service worker requires HTTPS to function. It will not activate on `http://localhost` but will work on Vercel/Netlify.
