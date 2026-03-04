import React from "react";
import { motion } from "framer-motion";
import { useGame } from "../../context/GameContext";
import { ArrowLeft, Brain, Sparkles } from "lucide-react";

export default function GameModeSelect() {
    const { setPhase } = useGame();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen gap-8 px-4"
        >
            <div className="relative w-full max-w-2xl flex items-center justify-center mb-4">
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
                    className="text-3xl md:text-4xl font-display font-bold tracking-wider text-glow-cyan text-primary uppercase"
                >
                    Choose Mission
                </motion.h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
                {/* Memorize Mode */}
                <motion.button
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPhase("mode-select")}
                    className="group relative flex flex-col items-center gap-6 p-8 rounded-xl neon-border-cyan bg-card/30 backdrop-blur-md transition-all duration-500 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                    <div className="relative z-10 p-4 rounded-full bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 transition-transform duration-500">
                        <Brain className="w-12 h-12" />
                    </div>
                    <div className="relative z-10 text-center space-y-2">
                        <h3 className="text-2xl font-display font-black uppercase tracking-widest text-primary text-glow-cyan">
                            Memorize
                        </h3>
                        <p className="text-sm font-body text-muted-foreground uppercase tracking-wider">
                            Test your recall and typing speed
                        </p>
                    </div>
                    <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </motion.button>

                {/* Guess Mode (Coming Soon) */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="group relative flex flex-col items-center gap-6 p-8 rounded-xl border border-white/5 bg-white/5 opacity-60 cursor-not-allowed overflow-hidden"
                >
                    <div className="relative z-10 p-4 rounded-full bg-white/5 text-muted-foreground border border-white/10">
                        <Sparkles className="w-12 h-12" />
                    </div>
                    <div className="relative z-10 text-center space-y-2">
                        <h3 className="text-2xl font-display font-black uppercase tracking-widest text-muted-foreground">
                            Guess
                        </h3>
                        <p className="text-sm font-body text-muted-foreground uppercase tracking-wider">
                            Coming Soon
                        </p>
                    </div>
                    <div className="absolute top-4 right-4 rotate-12">
                        <span className="px-2 py-1 text-[10px] font-display font-bold bg-muted/20 text-muted-foreground border border-white/10 rounded uppercase tracking-tighter">
                            Locked
                        </span>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
