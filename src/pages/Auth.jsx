import React, { useState, useEffect } from "react";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithPopup,
    GoogleAuthProvider
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "../lib/firebase";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User as UserIcon } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Auth.css";

const Auth = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isToggled, setIsToggled] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isFirebaseConfigured) {
            toast.error("Firebase is not configured. Please check your environment variables.");
            setTimeout(() => navigate("/"), 2000);
        }
    }, [navigate]);

    // Sign In States
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    // Sign Up States
    const [registerUsername, setRegisterUsername] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!isFirebaseConfigured) {
            toast.error("Firebase is not configured");
            return;
        }
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
            toast.success("Welcome back!");
            navigate("/", { state: { autoStart: location.state?.redirect === "game" } });
        } catch (error) {
            toast.error(error.message || "Failed to login");
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!isFirebaseConfigured) {
            toast.error("Firebase is not configured");
            return;
        }
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
            await updateProfile(userCredential.user, { displayName: registerUsername });
            toast.success("Account created successfully!");
            navigate("/", { state: { autoStart: location.state?.redirect === "game" } });
        } catch (error) {
            toast.error(error.message || "Failed to register");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        if (!isFirebaseConfigured) {
            toast.error("Firebase is not configured");
            return;
        }
        const provider = new GoogleAuthProvider();
        setLoading(true);
        try {
            await signInWithPopup(auth, provider);
            toast.success("Signed in with Google!");
            navigate("/", { state: { autoStart: location.state?.redirect === "game" } });
        } catch (error) {
            toast.error(error.message || "Google sign-in failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className={`auth-wrapper ${isToggled ? "toggled" : ""}`}>
                <div className="background-shape"></div>
                <div className="secondary-shape"></div>

                <div className="credentials-panel signin">
                    <h2 className="slide-element">Login</h2>
                    <form onSubmit={handleLogin}>
                        <div className="field-wrapper slide-element">
                            <input
                                type="email"
                                placeholder=" "
                                required
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                            />
                            <label>Email</label>
                            <Mail className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5" />
                        </div>

                        <div className="field-wrapper slide-element">
                            <input
                                type="password"
                                placeholder=" "
                                required
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                            />
                            <label>Password</label>
                            <Lock className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5" />
                        </div>

                        <div className="flex items-center gap-4 mt-6 slide-element">
                            <button className="submit-button !mt-0" type="submit" disabled={loading}>
                                {loading ? "Processing..." : "Login"}
                            </button>
                            <button
                                type="button"
                                className="google-icon-button flex-shrink-0"
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                                title="Sign in with Google"
                            >
                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" width="24" />
                            </button>
                        </div>

                        <div className="switch-link slide-element">
                            <p>Don't have an account? <br />
                                <button type="button" onClick={() => setIsToggled(true)}>Sign Up</button>
                            </p>
                        </div>
                    </form>
                </div>

                <div className="welcome-section signin">
                    <h2 className="slide-element">WELCOME BACK!</h2>
                </div>

                <div className="credentials-panel signup">
                    <h2 className="slide-element">Register</h2>
                    <form onSubmit={handleRegister}>
                        <div className="field-wrapper slide-element">
                            <input
                                type="text"
                                placeholder=" "
                                required
                                value={registerUsername}
                                onChange={(e) => setRegisterUsername(e.target.value)}
                            />
                            <label>Username</label>
                            <UserIcon className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5" />
                        </div>

                        <div className="field-wrapper slide-element">
                            <input
                                type="email"
                                placeholder=" "
                                required
                                value={registerEmail}
                                onChange={(e) => setRegisterEmail(e.target.value)}
                            />
                            <label>Email</label>
                            <Mail className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5" />
                        </div>

                        <div className="field-wrapper slide-element">
                            <input
                                type="password"
                                placeholder=" "
                                required
                                value={registerPassword}
                                onChange={(e) => setRegisterPassword(e.target.value)}
                            />
                            <label>Password</label>
                            <Lock className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5" />
                        </div>

                        <div className="flex items-center gap-4 mt-6 slide-element">
                            <button className="submit-button !mt-0" type="submit" disabled={loading}>
                                {loading ? "Creating..." : "Register"}
                            </button>
                            <button
                                type="button"
                                className="google-icon-button flex-shrink-0"
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                                title="Sign up with Google"
                            >
                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" width="24" />
                            </button>
                        </div>

                        <div className="switch-link slide-element">
                            <p>Already have an account? <br />
                                <button type="button" onClick={() => setIsToggled(false)}>Sign In</button>
                            </p>
                        </div>
                    </form>
                </div>

                <div className="welcome-section signup">
                    <h2 className="slide-element">WELCOME!</h2>
                </div>
            </div>
        </div>
    );
};

export default Auth;
