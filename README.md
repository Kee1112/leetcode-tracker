# Accountability App

Stay accountable with a partner. Set one daily task (e.g. Leetcode, Exercise, Read), mark it done each day, and get an in-app notification when your partner completes theirs. Calendar shows green for days you completed your task.

## Tech stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, shadcn-style UI, react-calendar, date-fns
- **Backend:** Firebase Auth, Firestore

## Setup

1. **Clone and install**

   ```bash
   cd leetcode_tracker
   npm install --legacy-peer-deps
   ```

2. **Firebase project**

   - Create a project at [Firebase Console](https://console.firebase.google.com).
   - Enable **Authentication** > Sign-in method > **Email/Password**.
   - Create a **Firestore** database (production mode).
   - In Project settings > General, add a web app and copy the config.

3. **Environment variables**

   Copy `.env.example` to `.env.local` and fill in your Firebase config:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```

4. **Firestore rules and indexes**

   - In Firestore > Rules, paste the contents of `firestore.rules`.
   - In Firestore > Indexes, create composite indexes (or deploy via Firebase CLI):
     - Collection `completions`: fields `userId` (Ascending), `date` (Ascending).
     - Collection `invites`: fields `toUserEmail` (Ascending), `status` (Ascending).

5. **Run the app**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). Sign up, set your task in Settings, link a partner by email, and use Today to mark done. Check Calendar for your history.

## Features

- **Today:** One daily task; “Mark done today” records completion. Partner’s completion for today is shown and triggers an in-app toast.
- **Calendar:** Green = completed that day; white = not completed.
- **Settings:** Edit your task name; link partner by email (instant if they have an account, or invite if they sign up later with that email).
