# Authentication Setup Guide - Key Trap

## Current Status

Your Firebase authentication is configured but **environment variables are not set**. Follow this guide to fix it.

## Issues Fixed

✓ Removed duplicate imports in Auth.jsx  
✓ Fixed AuthContext rendering (was blocking UI)  
✓ Enhanced Firebase initialization with better error logging  
✓ Added debugging to identify missing variables  

## Step 1: Get Your Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click **⚙️ Settings** → **Project Settings**
4. Under "Your apps", find your web app
5. Copy these values:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`
   - `measurementId` (optional)

## Step 2: Add to Vercel Environment

### Option A: Via Vercel Dashboard (RECOMMENDED)

1. Go to your project on [Vercel](https://vercel.com/dashboard)
2. Click **Settings** → **Environment Variables**
3. Add each variable with these exact names:
   ```
   VITE_FIREBASE_API_KEY
   VITE_FIREBASE_AUTH_DOMAIN
   VITE_FIREBASE_PROJECT_ID
   VITE_FIREBASE_STORAGE_BUCKET
   VITE_FIREBASE_MESSAGING_SENDER_ID
   VITE_FIREBASE_APP_ID
   VITE_FIREBASE_MEASUREMENT_ID
   ```
4. Make sure they're set for **Development**, **Preview**, and **Production**
5. Redeploy or restart dev server

### Option B: Local Development (.env.local)

Edit `.env.local` in your project root:

```bash
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

Then restart dev server:
```bash
pnpm run dev
```

## Step 3: Verify Setup

### Check Console Logs

Open browser console (F12) and look for one of these messages:

**✓ Working:**
```
[v0] Firebase initialized successfully
```

**✗ Not Working:**
```
[v0] Firebase configuration incomplete:
[v0] - API Key: ✗ Missing
[v0] - Project ID: ✗ Missing
[v0] - Auth Domain: ✗ Missing
```

### Test Authentication

1. Navigate to `http://localhost:8080/auth`
2. Try to **Register** with an email
3. Should see success message and redirect to home

## Troubleshooting

### Problem: "Firebase is not configured"
- Check browser console for `[v0]` logs
- Verify all 7 env variables are set
- Restart dev server: `pnpm run dev`
- Hard refresh browser (Ctrl+Shift+R)

### Problem: "Invalid API key"
- Double-check API key from Firebase Console
- Make sure there are no extra spaces in .env.local
- Verify it's the **Web API Key**, not a server key

### Problem: "Auth domain mismatch"
- Ensure authDomain matches exactly (include .firebaseapp.com)
- Example: `my-project.firebaseapp.com`

### Problem: Changes not applying in Vercel
- Go to Vercel Settings → Environment Variables
- Check if variables are set for your environment
- Redeploy: `git push` or click Deploy in Vercel
- Clear cache and hard refresh

## Firebase Console Setup (if new project)

If you don't have a Firebase project yet:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **Create a project**
3. Name it (e.g., "key-trap")
4. Disable Google Analytics (optional)
5. Click **Create project**
6. In left menu → **Authentication** → **Get started**
7. Enable **Email/Password**
8. Enable **Google** (optional)
9. Go to **Settings** → **Project Settings**
10. Create a Web app if not exists
11. Copy the credentials

## How Auth Works

1. User visits `/auth` page
2. Enters email and password
3. Firebase validates and creates/signs in user
4. User redirected to home page
5. Auth context maintains session

## Files Modified

- `src/lib/firebase.js` - Enhanced initialization with logging
- `src/context/AuthContext.jsx` - Fixed rendering logic
- `src/pages/Auth.jsx` - Fixed duplicate imports
- `.env.local` - Added comments for guidance

## Need Help?

Check these console messages to debug:
- `[v0] Firebase initialization started` - Config found
- `[v0] Firebase initialized successfully` - Setup complete
- `[v0] Firebase configuration incomplete` - Missing vars
- `[v0] Auth state changed:` - User signed in/out

Refresh browser and check console (F12) for these messages.
