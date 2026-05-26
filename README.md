# CHS GPA Calculator

A polished dark-mode React dashboard for Coppell High School students to track weighted GPA across multiple school years.

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
