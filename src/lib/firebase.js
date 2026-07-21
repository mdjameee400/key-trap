import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ""
};

// Check if Firebase config is properly configured
const isFirebaseConfigured = !!(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.authDomain);

let app, auth, db, analytics;

if (isFirebaseConfigured) {
    try {
        console.log("[v0] Firebase initialization started with projectId:", firebaseConfig.projectId);
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        
        if (typeof window !== "undefined") {
            try {
                analytics = getAnalytics(app);
            } catch (e) {
                console.warn("[v0] Analytics not available:", e.message);
            }
        }
        console.log("[v0] Firebase initialized successfully");
    } catch (error) {
        console.error("[v0] Firebase initialization error:", error);
    }
} else {
    console.warn("[v0] Firebase configuration incomplete:");
    console.warn("[v0] - API Key:", firebaseConfig.apiKey ? "✓ Set" : "✗ Missing");
    console.warn("[v0] - Project ID:", firebaseConfig.projectId ? "✓ Set" : "✗ Missing");
    console.warn("[v0] - Auth Domain:", firebaseConfig.authDomain ? "✓ Set" : "✗ Missing");
    console.warn("[v0] Please set VITE_FIREBASE_* environment variables in .env.local or Vercel");
}

export { app, auth, db, analytics, isFirebaseConfigured };
