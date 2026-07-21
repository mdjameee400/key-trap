import React from "react";
import { motion } from "framer-motion";
import { useGame } from "../../context/GameContext";
import { ArrowLeft, Brain, Sparkles, Gift, Zap } from "lucide-react";

export default function GameModeSelect() {
    const { setPhase } = useGame();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen gap-8 px-4"
        >
            <div className="relative w-full max-w-4xl flex items-center justify-center mb-4 text-center">
                <motion.button
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setPhase("hero")}
                    className="absolute left-0 p-2 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </motion.button>
                <motion.h2
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-3xl md:text-5xl font-display font-bold tracking-wider text-glow-cyan text-primary uppercase"
                >
                    Choose Mission
                </motion.h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
                {/* Memorize Mode */}
                <motion.button
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPhase("mode-select")}
                    className="group relative flex flex-col items-center gap-6 p-8 rounded-xl neon-border-cyan bg-card/30 backdrop-blur-md transition-all duration-500 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10 p-5 rounded-2xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 group-hover:neon-border-cyan transition-all duration-500">
                        <Brain className="w-12 h-12 text-glow-cyan" />
                    </div>
                    <div className="relative z-10 text-center space-y-3">
                        <h3 className="text-3xl font-display font-black uppercase tracking-[0.2em] text-primary text-glow-cyan">
                            Memorize
                        </h3>
                        <p className="text-xs font-body text-muted-foreground uppercase tracking-widest leading-relaxed">
                            Master your mind &<br />conquer the keys
                        </p>
                    </div>
                    <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                </motion.button>

                {/* Guess Mode (Coming Soon) */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="group relative flex flex-col items-center gap-6 p-8 rounded-xl border border-white/5 bg-white/5 opacity-40 grayscale-[0.5] cursor-not-allowed overflow-hidden"
                >
                    <div className="relative z-10 p-5 rounded-2xl bg-white/5 text-muted-foreground border border-white/10">
                        <Sparkles className="w-12 h-12 opacity-50" />
                    </div>
                    <div className="relative z-10 text-center space-y-3">
                        <h3 className="text-3xl font-display font-black uppercase tracking-[0.2em] text-muted-foreground">
                            Guess
                        </h3>
                        <p className="text-xs font-body text-muted-foreground uppercase tracking-widest leading-relaxed">
                            A new challenge<br />is calibrating...
                        </p>
                    </div>
                    <div className="absolute top-4 right-4 -rotate-12 group-hover:rotate-0 transition-transform duration-500">
                        <span className="px-3 py-1 text-[10px] font-display font-bold bg-muted/20 text-muted-foreground border border-white/10 rounded-full uppercase tracking-tighter">
                            Restricted
                        </span>
                    </div>
                </motion.div>

                {/* Battle Mode */}
                <motion.button
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPhase("battle")}
                    className="group relative flex flex-col items-center gap-6 p-8 rounded-xl neon-border-orange bg-card/30 backdrop-blur-md transition-all duration-500 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10 p-5 rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 group-hover:scale-110 group-hover:neon-border-orange transition-all duration-500">
                        <Zap className="w-12 h-12" />
                    </div>
                    <div className="relative z-10 text-center space-y-3">
                        <h3 className="text-3xl font-display font-black uppercase tracking-[0.2em] text-destructive">
                            Battle Mode
                        </h3>
                        <p className="text-xs font-body text-muted-foreground uppercase tracking-widest leading-relaxed">
                            Challenge a friend<br />in real-time typing
                        </p>
                    </div>
                    <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-destructive to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                </motion.button>

                {/* Lucky Box Mode */}
                <motion.button
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPhase("lucky-box")}
                    className="group relative flex flex-col items-center gap-6 p-8 rounded-xl neon-border-orange bg-card/30 backdrop-blur-md transition-all duration-500 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-orange/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10 p-5 rounded-2xl bg-neon-orange/10 text-neon-orange border border-neon-orange/20 group-hover:scale-110 group-hover:neon-border-orange transition-all duration-500">
                        <Gift className="w-12 h-12 text-glow-orange" />
                    </div>
                    <div className="relative z-10 text-center space-y-3">
                        <h3 className="text-3xl font-display font-black uppercase tracking-[0.2em] text-neon-orange text-glow-orange">
                            Lucky Box
                        </h3>
                        <p className="text-xs font-body text-muted-foreground uppercase tracking-widest leading-relaxed">
                            Choose wisely &<br />win the prize
                        </p>
                    </div>
                    <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-neon-orange to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                </motion.button>
            </div>
        </motion.div>
    );
}
