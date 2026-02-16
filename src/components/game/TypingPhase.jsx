import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../../context/GameContext";
import { GAME_MODES } from "../../lib/gameData";

export default function TypingPhase() {
    const { difficulty, questions, currentQuestionIndex, submitAnswer, nextQuestion, finishGame } = useGame();
    const mode = GAME_MODES[difficulty];
    const [timeLeft, setTimeLeft] = useState(mode ? mode.typingTimePerQuestion : 15);
    const [input, setInput] = useState("");
    const inputRef = useRef(null);
    const isLastQuestion = currentQuestionIndex >= questions.length;

    useEffect(() => {
        setInput("");
        if (mode) setTimeLeft(mode.typingTimePerQuestion);
        inputRef.current?.focus();
    }, [currentQuestionIndex, mode]);

    const handleSubmit = () => {
        submitAnswer(input);
        if (currentQuestionIndex >= questions.length - 1) {
            finishGame();
        } else {
            nextQuestion();
        }
    };

    useEffect(() => {
        if (isLastQuestion) return;
        if (timeLeft <= 0) {
            handleSubmit();
            return;
        }
        const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
        return () => clearTimeout(timer);
    }, [timeLeft, isLastQuestion]);

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
        }
    }

    if (isLastQuestion) return null;

    const question = questions[currentQuestionIndex];
    const progress = mode ? timeLeft / mode.typingTimePerQuestion : 0;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen gap-8 px-4"
        >
            <div className="flex gap-2">
                {questions.map((_, i) => (
                    <div
                        key={i}
                        className={`w-8 h-1.5 rounded-full transition-colors ${i < currentQuestionIndex ? "bg-neon-green" : i === currentQuestionIndex ? "bg-primary" : "bg-muted"
                            }`}
                    />
                ))}
            </div>

            <div className="text-sm font-body text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
            </div>

            <div className="w-full max-w-md h-32 flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key="question"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="text-center p-6 rounded-lg bg-card/60 backdrop-blur-sm border border-border w-full"
                    >
                        <p className="text-2xl font-display font-bold text-foreground text-glow-cyan">
                            {question.question}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2 font-body italic tracking-wider">
                            Type the answer now!
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="w-full max-w-md">
                <motion.div
                    className="relative"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type the answer here..."
                        autoFocus
                        className="w-full px-5 py-4 bg-card/60 border border-primary/40 rounded-lg
              font-body text-xl text-foreground placeholder:text-muted-foreground/50
              focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50
              backdrop-blur-sm transition-all shadow-[0_0_20px_rgba(34,211,238,0.1)]"
                    />
                    <button
                        onClick={handleSubmit}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-md
              bg-primary/20 text-primary font-display text-sm font-bold
              hover:bg-primary/30 transition-colors"
                    >
                        Enter
                    </button>
                </motion.div>
            </div>

            <div className="flex flex-col items-center gap-2">
                <div className="w-48 h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                        className="h-full rounded-full"
                        animate={{
                            width: `${progress * 100}%`,
                            background: timeLeft <= 3
                                ? "linear-gradient(90deg, hsl(var(--neon-orange)), hsl(var(--neon-red)))"
                                : "linear-gradient(90deg, hsl(var(--neon-cyan)), hsl(var(--neon-green)))"
                        }}
                        transition={{ duration: 1, ease: "linear" }}
                    />
                </div>
                <span className={`text-2xl font-display font-black ${timeLeft <= 3 ? "text-neon-red text-glow-red" : "text-primary text-glow-cyan"}`}>
                    {timeLeft}s
                </span>
            </div>
        </motion.div>
    );
}
