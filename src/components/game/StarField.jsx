import React, { useMemo } from "react";

export default function StarField() {
    const stars = useMemo(() =>
        Array.from({ length: 80 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.7 + 0.3,
            duration: Math.random() * 3 + 2,
        })),
        []
    );

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-black">
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="absolute rounded-full bg-white animate-pulse"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: star.size,
                        height: star.size,
                        opacity: star.opacity,
                        animationDuration: `${star.duration}s`,
                    }}
                />
            ))}
        </div>
    );
}
