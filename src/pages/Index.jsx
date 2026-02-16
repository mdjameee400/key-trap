import React from "react";
import { AnimatePresence } from "framer-motion";
import { GameProvider, useGame } from "../context/GameContext";
import HeroScreen from "../components/game/HeroScreen";
import ModeSelect from "../components/game/ModeSelect";
import MemoryPhase from "../components/game/MemoryPhase";
import TypingPhase from "../components/game/TypingPhase";
import ResultScreen from "../components/game/ResultScreen";
import TypingTest from "../components/game/TypingTest";
import StarField from "../components/game/StarField";

function GameRouter() {
  const { phase } = useGame();

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <StarField />
      <div className="relative z-10 w-full h-full">
        <AnimatePresence mode="wait">
          {phase === "hero" && <HeroScreen key="hero" />}
          {phase === "mode-select" && <ModeSelect key="mode" />}
          {phase === "memory" && <MemoryPhase key="memory" />}
          {phase === "typing" && <TypingPhase key="typing" />}
          {phase === "typing-test" && <TypingTest key="typing-test" />}
          {phase === "result" && <ResultScreen key="result" />}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Index() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
}
