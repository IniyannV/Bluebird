# Bluebird

A polished dark-mode React dashboard for students to track weighted GPA across multiple school years.

## Setup

1. Create a Firebase project at https://console.firebase.google.com.
2. Enable Google in Authentication > Sign-in method.
3. Create a Firestore database.
4. Copy `.env.example` to `.env` and fill in your Firebase web app values.
5. Install and run:

```bash
npm install
npm run dev
```

## Firestore Shape

The app stores all GPA tabs at:

```text
users/{userId}/gpaData/tabs
```

The saved document contains:

```js
{ tabs: [] }
```

## Scripts

- `npm run dev` starts the Vite dev server.
- `npm run build` creates a production build.
- `npm run preview` serves the production build locally.
- `npm run preview:pages` serves the production build with the GitHub Pages base path.

## GitHub Pages

This project is configured to deploy from GitHub Actions to GitHub Pages.

1. Push the repository to GitHub as `Bluebird`.
2. In GitHub, open Settings > Pages.
3. Set Source to `GitHub Actions`.
4. Add these repository variables under Settings > Secrets and variables > Actions > Variables:

```text
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

5. In Firebase Authentication > Settings > Authorized domains, add `<username>.github.io`.
6. Push to `main`, or run the `Deploy to GitHub Pages` workflow manually.

The production build uses `/Bluebird/` as its base path so static assets resolve correctly at `https://<username>.github.io/Bluebird/`.
