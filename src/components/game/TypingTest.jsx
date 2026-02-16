import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../../context/GameContext";
import { RotateCcw, Timer, ArrowLeft, Home } from "lucide-react";

export default function TypingTest() {
    const { questions: words, finishTypingTest, startTypingTest, startTime: initialDuration, setPhase } = useGame();
    const [userInput, setUserInput] = useState("");
    const [timeLeft, setTimeLeft] = useState(initialDuration);
    const [isActive, setIsActive] = useState(false);
    const [isFocused, setIsFocused] = useState(true);
    const [mistakes, setMistakes] = useState(0);
    const [correctChars, setCorrectChars] = useState(0);
    const [caretPos, setCaretPos] = useState({ x: 0, y: 0 });
    const [lineOffset, setLineOffset] = useState(0);

    const inputRef = useRef(null);
    const charRefs = useRef([]);
    const containerRef = useRef(null);
    const wordsWrapperRef = useRef(null);

    // Update timeLeft when initialDuration changes
    useEffect(() => {
        setTimeLeft(initialDuration);
        setUserInput("");
        setIsActive(false);
        setMistakes(0);
        setCorrectChars(0);
        setLineOffset(0);
    }, [initialDuration, words]);

    const handleFinish = useCallback(() => {
        setIsActive(false);
        const duration = initialDuration;
        const totalTyped = userInput.length;

        const timeInMinutes = duration / 60;
        const wpm = Math.round((totalTyped / 5) / timeInMinutes);
        const accuracy = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 100;

        finishTypingTest({
            accuracy,
            wpm,
            mistakes,
            correctChars,
            totalTyped,
            duration
        });
    }, [userInput, initialDuration, correctChars, mistakes, finishTypingTest]);

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setTimeLeft((time) => {
                    if (time <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return time - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive]);

    useEffect(() => {
        if (timeLeft === 0 && isActive) {
            handleFinish();
        }
    }, [timeLeft, isActive, handleFinish]);

    // Handle Caret Positioning and Line Scrolling
    useEffect(() => {
        const currentCharIdx = userInput.length;
        const currentCharRef = charRefs.current[currentCharIdx];

        if (currentCharRef && wordsWrapperRef.current) {
            const charRect = currentCharRef.getBoundingClientRect();
            const wrapperRect = wordsWrapperRef.current.getBoundingClientRect();

            const newX = charRect.left - wrapperRect.left;
            const newY = charRect.top - wrapperRect.top;

            setCaretPos({ x: newX, y: newY });

            // Line scrolling logic: If y > 40ish (one line), shift up
            // Standard line height is around 48px here (1.6 * 32px)
            const lineHeight = 48;
            if (newY >= lineHeight) {
                setLineOffset(Math.floor(newY / lineHeight) * lineHeight);
            } else {
                setLineOffset(0);
            }
        } else if (userInput.length === 0 && charRefs.current[0] && wordsWrapperRef.current) {
            const charRect = charRefs.current[0].getBoundingClientRect();
            const wrapperRect = wordsWrapperRef.current.getBoundingClientRect();
            setCaretPos({
                x: charRect.left - wrapperRect.left,
                y: charRect.top - wrapperRect.top
            });
            setLineOffset(0);
        }
    }, [userInput]);

    const handleInputChange = (e) => {
        if (timeLeft === 0) return;

        const value = e.target.value;
        const allWords = words.join(" ");

        if (!isActive && value.length > 0) {
            setIsActive(true);
        }

        let correct = 0;
        let errs = 0;
        for (let i = 0; i < value.length; i++) {
            if (value[i] === allWords[i]) {
                correct++;
            } else {
                errs++;
            }
        }

        setCorrectChars(correct);
        setMistakes(errs);
        setUserInput(value);

        if (value.length >= allWords.length) {
            handleFinish();
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                startTypingTest(initialDuration);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [startTypingTest, initialDuration]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen px-4 font-mono select-none overflow-hidden relative"
            onClick={() => inputRef.current?.focus()}
        >

            <div className="w-full max-w-5xl space-y-12">
                {/* Duration Selection Menu - Centered & Premium */}
                <div className="flex flex-col items-center gap-6">
                    <div className="flex items-center gap-4 text-primary/40">
                        <div className="h-[1px] w-8 bg-current"></div>
                        <span className="text-[11px] font-display tracking-[0.5em] uppercase font-black">Select Time</span>
                        <div className="h-[1px] w-8 bg-current"></div>
                    </div>

                    <div className="flex gap-10 px-8 py-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        {[15, 30, 60].map(d => (
                            <button
                                key={d}
                                onClick={(e) => { e.stopPropagation(); startTypingTest(d); }}
                                className={`text-base font-bold tracking-widest transition-all duration-300 relative ${initialDuration === d ? "text-primary scale-125 drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]" : "text-muted-foreground/30 hover:text-muted-foreground/60"}`}
                            >
                                {d}
                                {initialDuration === d && (
                                    <motion.div layoutId="active-dot" className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Timer & Menu Area - Centered & Highly Visible */}
                <div className="flex items-center justify-center gap-12 h-16">
                    <div className="flex items-center gap-10">


                        <button
                            onClick={(e) => { e.stopPropagation(); setPhase("hero"); }}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all duration-300 group shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                            title="Back to Menu"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-[11px] font-display tracking-[0.3em] uppercase font-black">Menu</span>
                        </button>
                        <span className={`text-5xl font-bold transition-all duration-300 ${timeLeft <= 5 && isActive ? "text-neon-red animate-pulse" : "text-primary text-glow-cyan"}`}>
                            {timeLeft}
                        </span>
                    </div>
                </div>

                {/* Typing Area - High Visibility Text \& Smooth Scrolling */}
                <div ref={containerRef} className="relative leading-[1.6] text-3xl tracking-wide h-[155px] overflow-hidden">
                    <input
                        ref={inputRef}
                        type="text"
                        className="absolute opacity-0 pointer-events-none"
                        value={userInput}
                        onChange={handleInputChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        autoFocus
                    />

                    <AnimatePresence>
                        {!isFocused && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[3px] cursor-pointer rounded-xl"
                            >
                                <p className="text-primary font-display tracking-[0.3em] uppercase text-sm animate-pulse shadow-sm">
                                    Click here to focus
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Words Container with Y Offset Animation */}
                    <motion.div
                        ref={wordsWrapperRef}
                        className="relative flex flex-wrap gap-x-[0.6em] gap-y-4"
                        animate={{ y: -lineOffset }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        {/* The Smooth Caret */}
                        <motion.div
                            className="absolute w-[3px] h-[1.28em] bg-primary z-20 pointer-events-none"
                            style={{
                                boxShadow: "0 0 15px 2px rgba(34, 211, 238, 0.9)"
                            }}
                            animate={{
                                x: caretPos.x,
                                y: caretPos.y,
                                opacity: isFocused ? [1, 0.4, 1] : 0
                            }}
                            transition={{
                                x: { type: "spring", stiffness: 450, damping: 35 },
                                y: { type: "spring", stiffness: 450, damping: 35 },
                                opacity: { repeat: Infinity, duration: 1 }
                            }}
                        />

                        {words.map((word, wIdx) => {
                            const wordStartIdx = words.slice(0, wIdx).join(" ").length + (wIdx > 0 ? 1 : 0);
                            return (
                                <div key={wIdx} className="flex whitespace-nowrap">
                                    {word.split("").map((char, cIdx) => {
                                        const charIdx = wordStartIdx + cIdx;
                                        // Untyped text is ash color (text-muted-foreground)
                                        let colorClass = "text-muted-foreground/60";

                                        if (charIdx < userInput.length) {
                                            // Correct is blueish (primary), Wrong is Red
                                            colorClass = userInput[charIdx] === char ? "text-primary drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]" : "text-neon-red drop-shadow-[0_0_8px_rgba(234,67,147,0.5)]";
                                        }

                                        return (
                                            <span
                                                key={cIdx}
                                                ref={el => charRefs.current[charIdx] = el}
                                                className={`${colorClass} transition-colors duration-150 relative`}
                                            >
                                                {char}
                                            </span>
                                        );
                                    })}
                                    {/* Space handling */}
                                    {wIdx < words.length - 1 && (
                                        <span
                                            ref={el => charRefs.current[wordStartIdx + word.length] = el}
                                            className={`transition-colors duration-150 ${userInput.length > wordStartIdx + word.length ? (userInput[wordStartIdx + word.length] === " " ? "text-transparent" : "bg-neon-red/30 rounded-sm") : "text-transparent"}`}
                                        >
                                            &nbsp;
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </motion.div>
                </div>

                {/* Footer */}
                <div className="flex justify-center items-center pt-8">
                    <button
                        onClick={(e) => { e.stopPropagation(); startTypingTest(initialDuration); }}
                        className="p-4 rounded-xl hover:bg-white/5 text-muted-foreground/20 hover:text-primary transition-all group"
                        title="Restart Test (Esc)"
                    >
                        <RotateCcw className="w-8 h-8 group-hover:rotate-180 transition-transform duration-500" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
