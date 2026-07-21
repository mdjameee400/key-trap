# Firebase Setup Guide for Key Trap

## Overview
This guide will help you set up Firebase authentication for Key Trap. Firebase is required for user authentication and managing user data.

## Prerequisites
- Firebase account (free tier available at https://firebase.google.com)
- Your Key Trap project running locally

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project" or "Create a project"
3. Enter your project name (e.g., "KeyTrap")
4. Click "Continue"
5. Disable Google Analytics (optional) and click "Create project"
6. Wait for the project to be created

## Step 2: Create a Web App

1. In the Firebase console, click the "Web" icon (</>) to register a web app
2. Enter your app name (e.g., "Key Trap Web")
3. Check "Also set up Firebase Hosting for this app" (optional)
4. Click "Register app"
5. Copy the configuration object - you'll need these values

## Step 3: Get Your Firebase Configuration

The Firebase SDK initialization code will look like this:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

## Step 4: Configure Environment Variables

1. Open `.env.local` in your Key Trap project root
2. Fill in the Firebase configuration values:

```env
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

3. Save the file

## Step 5: Enable Authentication Methods

1. In Firebase Console, go to "Authentication" → "Sign-in method"
2. Click "Email/Password" and enable it
3. Click "Google" and enable it (you'll need to configure OAuth consent screen)
4. Save changes

### For Google Sign-In:

1. Click "Google" in the Sign-in method list
2. Enable it
3. Click "Configure in Google Cloud Console" or use the provided link
4. Configure the OAuth consent screen (if not already done)
5. Return to Firebase and save

## Step 6: Test the Setup

1. Start the development server:
   ```bash
   pnpm run dev
   ```

2. Navigate to http://localhost:8080

3. Click "Login" and try creating a new account

4. If you see the auth page and can create an account, Firebase is working!

## Troubleshooting

### Error: "Firebase: Error (auth/invalid-api-key)"

**Cause:** Firebase configuration is incomplete or incorrect

**Solution:**
- Double-check all values in `.env.local` match your Firebase console exactly
- Make sure no extra spaces or quotes are in the values
- Check that `VITE_FIREBASE_API_KEY` and `VITE_FIREBASE_PROJECT_ID` are not empty

### Error: "Firebase: Quota exceeded"

**Cause:** You've exceeded the free tier limits

**Solution:**
- Upgrade to a paid plan in Firebase console
- Or wait until quota resets (usually daily)

### Error: "PopupBlockedError"

**Cause:** Browser blocked the Google sign-in popup

**Solution:**
- Allow popups for localhost
- Try a different browser
- Use incognito mode

### Not seeing the auth page

**Cause:** Firebase config is missing, app skips to home screen

**Solution:**
- Check `.env.local` has all Firebase variables
- Check browser console for errors (F12)
- Restart the dev server

## Next Steps

Once Firebase is configured:

1. Sign up for a new account
2. Go to "Start Game" and play!
3. Your progress will be saved in Firebase

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Web Setup](https://firebase.google.com/docs/web/setup)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Console](https://console.firebase.google.com)

## Need Help?

If you're still having issues:

1. Check `.env.local` for typos
2. Verify all variables are set (not empty)
3. Check browser console for error messages
4. Visit your Firebase console and verify settings
5. Try clearing browser cache and restarting the dev server

---

**Note:** Never commit `.env.local` to version control. It contains sensitive API keys.
