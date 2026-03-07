import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Gift } from "lucide-react";
import { useGame } from "../../../context/GameContext";

export default function LuckyBox() {
    const { setPhase } = useGame();
    const [boxes, setBoxes] = useState(Array(9).fill(null));
    const [prizeIndex, setPrizeIndex] = useState(-1);
    const [clicked, setClicked] = useState(false);
    const [winStreak, setWinStreak] = useState(0);
    const [totalWins, setTotalWins] = useState(0);
    const [message, setMessage] = useState({ text: "", type: "" });

    const initGame = () => {
        setBoxes(Array(9).fill(null));
        setPrizeIndex(Math.floor(Math.random() * 9));
        setClicked(false);
        setMessage({ text: "", type: "" });
    };

    useEffect(() => {
        initGame();
    }, []);

    const handleBoxClick = (index) => {
        if (clicked) return;
        setClicked(true);

        const newBoxes = [...boxes];
        const isWinner = index === prizeIndex;

        newBoxes[index] = isWinner ? "winner" : "loser";
        setBoxes(newBoxes);

        if (isWinner) {
            setWinStreak(prev => prev + 1);
            setTotalWins(prev => prev + 1);
            setMessage({ text: "You Win!", type: "success" });
        } else {
            setWinStreak(0);
            setMessage({ text: "Game Over! Better luck next time.", type: "error" });
        }

        setTimeout(initGame, 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen gap-8 px-4 py-12"
        >
            <div className="relative w-full max-w-3xl flex items-center justify-center mb-4 text-center">
                <motion.button
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setPhase("game-mode-select")}
                    className="absolute left-0 p-2 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </motion.button>
                <motion.h2
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-3xl md:text-5xl font-display font-bold tracking-wider text-glow-cyan text-primary uppercase flex items-center gap-4"
                >
                    <Gift className="w-10 h-10 text-neon-orange" />
                    Lucky Box
                </motion.h2>
            </div>

            <p className="text-muted-foreground font-body text-center max-w-md uppercase tracking-widest text-sm">
                Choose wisely! Only one box contains the prize.
            </p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex gap-8 my-4"
            >
                <div className="flex flex-col items-center p-4 rounded-xl bg-primary/5 border border-primary/20 min-w-[120px]">
                    <span className="text-3xl font-display font-bold text-glow-cyan text-primary">{winStreak}</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider mt-2">☆ Win Streak</span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-xl bg-primary/5 border border-primary/20 min-w-[120px]">
                    <span className="text-3xl font-display font-bold text-neon-orange">{totalWins}</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider mt-2">🏆 Total Wins</span>
                </div>
            </motion.div>

            {message.text && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`px-6 py-3 rounded-lg font-display tracking-widest uppercase text-sm font-bold ${message.type === 'success'
                            ? 'bg-neon-green/20 text-neon-green border border-neon-green/50'
                            : 'bg-destructive/20 text-destructive border border-destructive/50'
                        }`}
                >
                    {message.text}
                </motion.div>
            )}

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-3 gap-4"
            >
                {boxes.map((status, i) => (
                    <motion.div
                        key={i}
                        whileHover={!clicked ? { scale: 1.05 } : {}}
                        whileTap={!clicked ? { scale: 0.95 } : {}}
                        onClick={() => handleBoxClick(i)}
                        className={`w-20 h-20 md:w-24 md:h-24 rounded-xl flex items-center justify-center text-4xl cursor-pointer transition-all duration-300 ${status === null
                                ? 'bg-primary/10 border-2 border-primary/30 hover:bg-primary/20 hover:neon-border-cyan text-primary/50'
                                : status === 'winner'
                                    ? 'bg-neon-green/20 border-2 border-neon-green text-neon-green neon-border-green'
                                    : 'bg-destructive/20 border-2 border-destructive text-destructive neon-border-red'
                            }`}
                        style={{ pointerEvents: clicked ? 'none' : 'auto' }}
                    >
                        {status === null ? "?" : status === 'winner' ? "🎉" : "✗"}
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
}
