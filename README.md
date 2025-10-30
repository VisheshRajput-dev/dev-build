# RealDesk

Practice real developer work: tickets, code in the browser, AI feedback, and XP. A mini internship in your browser.

## Features
- Auth + Dashboard
  - Google sign-in (Firebase Auth)
  - XP/Level tracking, recent submissions
- Tasks
  - Browse tasks with search, category, and difficulty filters
  - Task detail with brief, acceptance criteria, hints
  - Monaco editor (multi-file), local autosave per task
- Checks + Submission
  - Static checks per rubric (presence/heuristics)
  - Optional AI review (BYO Gemini key, off by default)
  - Score computation and XP award
  - History page with past submissions
- Inbox
  - Simulated client messages per task (context drip)
- UI
  - Tailwind + shadcn/ui components, Vite + React + TypeScript

## Tech Stack
- Frontend: React + Vite + TypeScript, Tailwind, shadcn/ui
- Editor: Monaco
- State: local component state (lightweight), localStorage for autosave
- Data: Firebase (Auth + Firestore)
- AI (optional): Gemini (bring-your-own key, client-side, off by default)

## Getting Started

### 1) Requirements
- Node 20.x+
- Firebase project (Auth + Firestore enabled)

### 2) Install dependencies
```bash
npm install
```

### 3) Environment variables
Create `.env` at the project root with your Firebase credentials:
```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```
Optional Gemini (BYO key, stored locally via Profile page; not required in `.env`).

### 4) Firebase setup
- In the Firebase console:
  - Enable Authentication → Sign-in method → Google
  - Create a Web App → copy config values into `.env`
  - Firestore → Start in production mode → create database
- Recommended Firestore rules (basic, signed-in only read/write of own data):
```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() { return request.auth != null; }

    match /users/{uid} {
      allow read, write: if isSignedIn() && request.auth.uid == uid;
    }

    match /submissions/{id} {
      allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
      allow read: if isSignedIn() && resource.data.userId == request.auth.uid;
    }

    // Public seed data can be hosted client-side (JSON). If stored in Firestore, make read-only:
    match /tasks/{id} { allow read: if true; }
    match /messages/{id} { allow read: if true; }
  }
}
```

### 5) Run locally
```bash
npm run dev
```
Open the URL printed by Vite.

## Optional: AI Review (Gemini)
- Go to Profile → toggle AI review → paste your Gemini API key → Save & Validate.
- Rate-limited (client-side) and off by default.
- Score blending: 60% static checks + 40% AI review (when enabled).

## Deploy
You can deploy to Vercel or Netlify.

### Vercel
1. Push your repo to GitHub/GitLab/Bitbucket.
2. Import the project on Vercel.
3. Set Environment Variables (Project Settings → Environment Variables):
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
4. Build & deploy (Vercel will run `npm install` and `npm run build`).
5. Add your deployed origin to Firebase Auth authorized domains.

### Netlify
1. Push your repo and connect on Netlify.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add the same VITE_ environment variables in Site settings → Environment.
5. Add your deployed origin to Firebase Auth authorized domains.

## Project Structure
```
src/
  components/
    editor/EditorPane.tsx
    layout/AppShell.tsx
    ui/button.tsx
  data/
    tasks.json
    messages.json
  lib/
    ai.ts
    auth.tsx
    checks.ts
    firebase.ts
    firestore.ts
    scoring.ts
    storage.ts
  routes/
    Landing.tsx
    Dashboard.tsx
    Tasks.tsx
    TaskDetail.tsx
    Inbox.tsx
    History.tsx
    Profile.tsx
  App.tsx
  main.tsx
  index.css
```

## Usage Guide (MVP)
1. Sign in with Google.
2. Open Tasks → filter and pick one.
3. Read acceptance criteria and edit code in the editor.
4. Run checks (static) → fix issues → Submit for XP.
5. View XP and recent submissions on Dashboard; see full list in History.
6. (Optional) Enable AI review in Profile and re-submit.

## Notes
- Seed data for tasks and messages is bundled as JSON for the MVP.
- No server-side code execution; evaluation uses static checks + optional AI review.
- AI calls are client-side and rate-limited; BYO key stored locally.

## License
MIT
