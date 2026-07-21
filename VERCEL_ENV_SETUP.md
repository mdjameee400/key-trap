# Setting Up Environment Variables on Vercel

## Why Auth Isn't Working

Your Firebase environment variables are **empty** or **not set in Vercel**. The `.env.local` file you see in the project is only for **local development** and is NOT uploaded to Vercel.

## Quick Fix: Set Variables on Vercel

### Step 1: Go to Project Settings

1. Open [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **key-trap** project
3. Click **Settings** (top menu)

### Step 2: Add Environment Variables

1. Click **Environment Variables** (left sidebar)
2. Click **Add New**
3. Fill in the form for each variable:

| Variable Name | Value | Example |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | Your Firebase API Key | `AIzaSyC1X2Y3Z4... ` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Your Firebase Auth Domain | `my-project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Your Firebase Project ID | `my-project-123456` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Your Firebase Storage Bucket | `my-project.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Your Messaging Sender ID | `123456789` |
| `VITE_FIREBASE_APP_ID` | Your Firebase App ID | `1:123456789:web:abc...` |
| `VITE_FIREBASE_MEASUREMENT_ID` | Your Measurement ID (optional) | `G-XXXXXXXXXX` |

### Step 3: Select Environments

For each variable, check these boxes:
- ✓ Production
- ✓ Preview  
- ✓ Development

### Step 4: Save and Redeploy

1. Click **Save**
2. Go to **Deployments** tab
3. Find the latest deployment
4. Click **Redeploy** button
5. Wait for deployment to complete

## Getting Firebase Values

### From Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click **⚙️ Settings** → **Project Settings**
4. Scroll to "Your apps"
5. Find your web app (look for `</>` icon)
6. Click on it to see configuration
7. Copy each value

### Example Firebase Config
```javascript
{
  apiKey: "AIzaSyC1X2Y3Z4...",           // VITE_FIREBASE_API_KEY
  authDomain: "my-project.firebaseapp.com",  // VITE_FIREBASE_AUTH_DOMAIN
  projectId: "my-project-123456",        // VITE_FIREBASE_PROJECT_ID
  storageBucket: "my-project.appspot.com", // VITE_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123456789",         // VITE_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123456789:web:abc...",        // VITE_FIREBASE_APP_ID
  measurementId: "G-XXXXXXXXXX"           // VITE_FIREBASE_MEASUREMENT_ID
}
```

## Verify Setup

After redeploying:

1. Open your deployed app
2. Press **F12** (open browser console)
3. Look for one of these messages:

**✓ Success:**
```
[v0] Firebase initialized successfully
```

**✗ Failed:**
```
[v0] Firebase configuration incomplete:
[v0] - API Key: ✗ Missing
[v0] - Project ID: ✗ Missing
[v0] - Auth Domain: ✗ Missing
```

## Troubleshooting

### Variables set but not working

**Solution:** The environment variables are cached. You need to **redeploy**:

1. Go to **Deployments** 
2. Click **Redeploy** on latest deployment
3. Wait for new build

### Still not working after redeploy

**Check these:**

1. **Are all 6 required variables set?**
   - Settings → Environment Variables
   - Should see at least 6 `VITE_FIREBASE_*` variables

2. **Are they checked for all environments?**
   - Each variable should have ✓ Production, ✓ Preview, ✓ Development

3. **Did you copy values correctly?**
   - No extra spaces or quotes
   - Exact values from Firebase Console

4. **Is it a new app?**
   - If Firebase project is new, may take 1-2 min to activate

### Deployment logs show errors

Check deployment logs:

1. Go to **Deployments**
2. Click on deployment
3. Click **Logs**
4. Look for any Firebase errors

Common errors:
- `invalid-api-key` → Wrong API key copied
- `project-not-found` → Wrong project ID
- `auth/configuration-not-found` → Missing auth domain

## Local Development

For local testing (not Vercel):

1. Edit `.env.local` in project root
2. Add all 6 variables with your Firebase credentials
3. Run: `pnpm run dev`
4. Should see `[v0] Firebase initialized successfully` in console

## After This Works

Once Firebase auth is working:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Authentication** → **Settings**
4. Set Authorized domains:
   - Add your Vercel URL (e.g., `key-trap-git-main-yourname.vercel.app`)
   - Add localhost (e.g., `localhost:8080` for development)

This prevents "Domain not authorized" errors.

## Still Having Issues?

1. Check `AUTH_SETUP_GUIDE.md` for detailed instructions
2. Run `pnpm run check-env` to validate local setup
3. Verify Firebase project exists and is active
4. Check browser console (F12) for error messages starting with `[v0]`
