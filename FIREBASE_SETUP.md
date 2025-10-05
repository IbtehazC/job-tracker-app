# Firebase Integration Guide

This app now uses Firebase for authentication and data storage. Follow this guide to get started.

## What Changed?

The app has been migrated from localStorage mock data to Firebase:
- **Firebase Authentication** for user sign-up, login, and Google OAuth
- **Cloud Firestore** for storing users, applications, and challenges
- **Real-time updates** - all data syncs automatically across users

## Initial Setup

### 1. Initialize Firebase Challenge

Run this command once to create the initial challenge in Firestore:

```bash
npm run firebase:init
```

This will create the "Apply to 100 Jobs" challenge with a deadline of next Monday.

### 2. Start the App

```bash
npm run dev
```

Visit http://localhost:3000 and you're ready to go!

## Firebase Configuration

The Firebase configuration is already set up in `lib/firebase/config.ts`. The app uses:

- **Project ID**: job-tracker-app-a3f9d
- **Auth Domain**: job-tracker-app-a3f9d.firebaseapp.com

### Firebase Console Access

You can view and manage your data at:
https://console.firebase.google.com/project/job-tracker-app-a3f9d

## Firestore Database Structure

### Collections

#### `users`
```typescript
{
  uid: string              // Firebase Auth UID
  email: string
  username: string
  displayName?: string
  photoURL?: string
  applicationCount: number
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

#### `applications`
```typescript
{
  id: string              // Auto-generated
  userId: string          // Reference to user
  username: string
  userPhotoURL?: string
  jobTitle: string
  company: string
  jobUrl: string
  appliedAt: Timestamp
  createdAt: Timestamp
}
```

#### `challenges`
```typescript
{
  id: string              // Auto-generated
  name: string
  description: string
  targetCount: number
  startDate: Timestamp
  endDate: Timestamp
  isActive: boolean
  createdAt: Timestamp
}
```

## Security Rules

Configure Firestore security rules in the Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read all user documents
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Applications are public read, but users can only write their own
    match /applications/{appId} {
      allow read: if true;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    // Challenges are read-only for users (admin-only write)
    match /challenges/{challengeId} {
      allow read: if true;
      allow write: if false; // Admin only via Firebase Console
    }
  }
}
```

## Authentication

### Supported Methods

1. **Email/Password** - Traditional signup and login
2. **Google OAuth** - One-click sign in with Google

### How Authentication Works

1. User signs up via email/password or Google OAuth
2. Firebase Auth creates the authentication record
3. App automatically creates a Firestore user document
4. User profile includes auto-generated username and avatar

## Real-time Features

All data updates in real-time:
- **Leaderboard** - Rankings update instantly when anyone adds an application
- **Feed** - New applications appear immediately for all users
- **Application Count** - Your personal count updates automatically
- **Challenge Progress** - Track progress updates live

## Development vs Production

### Development (localhost)
- Firebase works automatically with your localhost
- No additional configuration needed

### Production (Cloudflare Pages)
Since the Firebase config is hardcoded in the app, no environment variables are needed. However, make sure your Firebase project allows your production domain:

1. Go to Firebase Console → Authentication → Settings
2. Add your Cloudflare Pages domain to authorized domains
3. Example: `job-tracker-app.pages.dev`

## Managing Challenges

### Creating a New Challenge

Currently, challenges must be created via the initialization script or Firebase Console.

To create a challenge via Firebase Console:
1. Go to Firestore Database
2. Select `challenges` collection
3. Add a new document with these fields:
   - `name`: "Your Challenge Name"
   - `description`: "Challenge description"
   - `targetCount`: 100
   - `startDate`: Timestamp
   - `endDate`: Timestamp
   - `isActive`: true
   - `createdAt`: Timestamp

### Deactivating Old Challenges

To end a challenge:
1. Go to Firebase Console → Firestore
2. Find the challenge document
3. Set `isActive` to `false`

## Troubleshooting

### "Permission denied" errors
- Check your Firestore security rules
- Make sure you're signed in
- Verify the rule allows the operation you're trying

### Authentication not working
- Check Firebase Console → Authentication is enabled
- Verify Email/Password and Google providers are enabled
- Check authorized domains include localhost and your production domain

### Data not updating
- Check browser console for errors
- Verify Firestore indexes are created (Firebase will auto-create them)
- Check network tab for failed requests

### Build errors
- Make sure all Firebase packages are installed: `npm install`
- Check Next.js config has `output: 'export'` removed (not compatible with Firebase)

## Next Steps

1. **Set up security rules** in Firebase Console (see above)
2. **Enable Google OAuth** in Firebase Console → Authentication → Sign-in methods
3. **Create custom challenges** as needed
4. **Monitor usage** in Firebase Console

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Cloud Firestore Guide](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
