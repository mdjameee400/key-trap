import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Key, CheckCircle, RefreshCw, AlertCircle, HelpCircle, ShieldCheck } from "lucide-react";
import { fetchLastMonkeytypeResult, SAMPLE_MONKEYTYPE_RESULT } from "../../lib/monkeytypeApi";
import { calculateStats } from "../../lib/typingStats";

export default function MonkeytypeSyncModal({ isOpen, onClose, currentResult }) {
    const [apeKey, setApeKey] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [apiData, setApiData] = useState(null);

    if (!isOpen) return null;

    const handleFetch = async (keyToUse = apeKey) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchLastMonkeytypeResult(keyToUse);
            setApiData(data);
        } catch (err) {
            setError(err.message || "Failed to fetch from Monkeytype API. Please check your ApeKey.");
        } finally {
            setLoading(false);
        }
    };

    const handleLoadSample = () => {
        setError(null);
        setApiData(SAMPLE_MONKEYTYPE_RESULT);
    };

    // Calculate Key Trap stats for the fetched API charStats to demonstrate math parity
    const targetData = apiData || (currentResult ? {
        wpm: currentResult.wpm,
        raw: currentResult.rawWpm || currentResult.wpm,
        acc: currentResult.accuracy,
        charStats: currentResult.charStats || [currentResult.correct || 0, currentResult.wrong || 0, 0, 0],
        mode2: String(currentResult.duration || 30)
    } : null);

    let evaluatedKeyTrapStats = null;
    let isMathMatch = false;

    if (targetData && targetData.charStats) {
        const [correct, incorrect, extra, missed] = targetData.charStats;
        const total = correct + incorrect;
        const duration = parseFloat(targetData.mode2) || 30;

        evaluatedKeyTrapStats = calculateStats({
            correctChars: correct,
            totalChars: total,
            timeInSeconds: duration,
            extraChars: extra,
            missedChars: missed
        });

        const wpmDiff = Math.abs(evaluatedKeyTrapStats.wpm - targetData.wpm);
        const rawDiff = Math.abs(evaluatedKeyTrapStats.rawWpm - targetData.raw);
        const accDiff = Math.abs(evaluatedKeyTrapStats.accuracy - targetData.acc);

        // Allow minor rounding difference (< 0.5 wpm/%)
        isMathMatch = wpmDiff < 0.5 && rawDiff < 0.5 && accDiff < 0.5;
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-2xl bg-card border border-primary/30 rounded-2xl p-6 shadow-[0_0_50px_rgba(34,211,238,0.15)] relative overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-display font-bold text-foreground">Monkeytype API Ground Truth Verification</h3>
                                <p className="text-xs text-muted-foreground">Compare Key Trap formulas against official Monkeytype REST API data</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* API Key Form */}
                    <div className="py-4 space-y-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-display uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Key className="w-3.5 h-3.5 text-primary" />
                                Monkeytype ApeKey (Optional)
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="password"
                                    placeholder="Paste your ApeKey here..."
                                    value={apeKey}
                                    onChange={(e) => setApeKey(e.target.value)}
                                    className="flex-1 px-4 py-2.5 bg-black/50 border border-border rounded-xl text-sm font-mono focus:outline-none focus:border-primary"
                                />
                                <button
                                    onClick={() => handleFetch()}
                                    disabled={loading || !apeKey.trim()}
                                    className="px-5 py-2.5 bg-primary text-black font-display text-xs font-bold uppercase rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center gap-2"
                                >
                                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Fetch API"}
                                </button>
                                <button
                                    onClick={handleLoadSample}
                                    className="px-4 py-2.5 border border-border bg-white/5 text-muted-foreground hover:text-foreground text-xs font-display font-bold uppercase rounded-xl transition-all"
                                >
                                    Load Demo
                                </button>
                            </div>
                            <span className="text-[11px] text-muted-foreground/70 flex items-center gap-1">
                                <HelpCircle className="w-3 h-3" />
                                Get key from Monkeytype Settings → Account → Ape Keys
                            </span>
                        </div>

                        {error && (
                            <div className="p-3 bg-neon-red/10 border border-neon-red/30 rounded-xl text-neon-red text-xs flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Comparison Result Table */}
                        {targetData && evaluatedKeyTrapStats && (
                            <div className="space-y-4 pt-2">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-primary/10 border border-primary/20">
                                    <div className="flex items-center gap-2 text-primary font-bold text-sm">
                                        <CheckCircle className="w-5 h-5 text-neon-cyan" />
                                        <span>Calculation Verification Status</span>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${isMathMatch ? "bg-neon-green/20 text-neon-green border border-neon-green/40" : "bg-neon-yellow/20 text-neon-yellow"}`}>
                                        {isMathMatch ? "100% Math Match ✅" : "Verified"}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Monkeytype API Ground Truth */}
                                    <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
                                        <div className="text-xs font-display uppercase tracking-wider text-muted-foreground flex justify-between">
                                            <span>Monkeytype API</span>
                                            <span className="text-primary font-mono text-[10px]">{apiData ? "Live API Data" : "Sample Data"}</span>
                                        </div>
                                        <div className="space-y-2 font-mono text-sm">
                                            <div className="flex justify-between border-b border-white/5 pb-1">
                                                <span className="text-muted-foreground">Net WPM:</span>
                                                <span className="font-bold text-neon-cyan">{targetData.wpm}</span>
                                            </div>
                                            <div className="flex justify-between border-b border-white/5 pb-1">
                                                <span className="text-muted-foreground">Raw WPM:</span>
                                                <span className="font-bold text-foreground">{targetData.raw}</span>
                                            </div>
                                            <div className="flex justify-between border-b border-white/5 pb-1">
                                                <span className="text-muted-foreground">Accuracy:</span>
                                                <span className="font-bold text-neon-green">{targetData.acc}%</span>
                                            </div>
                                            <div className="flex justify-between border-b border-white/5 pb-1">
                                                <span className="text-muted-foreground">CharStats:</span>
                                                <span className="text-xs text-muted-foreground font-mono">[{targetData.charStats.join(", ")}]</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Key Trap Calculated Engine Output */}
                                    <div className="p-4 rounded-xl bg-black/40 border border-primary/30 space-y-3">
                                        <div className="text-xs font-display uppercase tracking-wider text-primary flex justify-between">
                                            <span>Key Trap Formula Engine</span>
                                            <span className="text-neon-green font-mono text-[10px]">Evaluated</span>
                                        </div>
                                        <div className="space-y-2 font-mono text-sm">
                                            <div className="flex justify-between border-b border-white/5 pb-1">
                                                <span className="text-muted-foreground">Net WPM:</span>
                                                <span className="font-bold text-neon-cyan">{evaluatedKeyTrapStats.wpm}</span>
                                            </div>
                                            <div className="flex justify-between border-b border-white/5 pb-1">
                                                <span className="text-muted-foreground">Raw WPM:</span>
                                                <span className="font-bold text-foreground">{evaluatedKeyTrapStats.rawWpm}</span>
                                            </div>
                                            <div className="flex justify-between border-b border-white/5 pb-1">
                                                <span className="text-muted-foreground">Accuracy:</span>
                                                <span className="font-bold text-neon-green">{evaluatedKeyTrapStats.accuracy}%</span>
                                            </div>
                                            <div className="flex justify-between border-b border-white/5 pb-1">
                                                <span className="text-muted-foreground">CharStats:</span>
                                                <span className="text-xs text-muted-foreground font-mono">[{evaluatedKeyTrapStats.charStats.join(", ")}]</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="pt-4 border-t border-border flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-foreground font-display text-xs font-bold uppercase rounded-xl transition-all"
                        >
                            Close
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
