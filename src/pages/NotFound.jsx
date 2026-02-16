import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
    const location = useLocation();

    useEffect(() => {
        console.error(
            "404 Error: User attempted to access non-existent route:",
            location.pathname
        );
    }, [location.pathname]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4">
            <div className="text-center space-y-6">
                <h1 className="text-6xl md:text-8xl font-display font-black text-primary text-glow-cyan animate-pulse">404</h1>
                <p className="text-xl text-muted-foreground font-body">Oops! Page not found</p>
                <Link
                    to="/"
                    className="inline-block px-8 py-3 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all font-display font-bold uppercase tracking-wider"
                >
                    Return Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
