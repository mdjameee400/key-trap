import React from "react";
import { AnimatePresence } from "framer-motion";
import { GameProvider, useGame } from "../context/GameContext";
import HeroScreen from "../components/game/HeroScreen";
import GameModeSelect from "../components/game/GameModeSelect";
import ModeSelect from "../components/game/memorize/ModeSelect";
import MemoryPhase from "../components/game/memorize/MemoryPhase";
import TypingPhase from "../components/game/typing/TypingPhase";
import TypingTest from "../components/game/typing/TypingTest";
import ResultScreen from "../components/game/ResultScreen";
import StarField from "../components/game/StarField";
import LuckyBox from "../components/game/lucky-box/LuckyBox";
import BattleMode from "../components/game/BattleMode";

function GameRouter() {
  const { phase } = useGame();

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <StarField />
      <div className="relative z-10 w-full h-full">
        <AnimatePresence mode="wait">
          {phase === "hero" && <HeroScreen key="hero" />}
          {phase === "game-mode-select" && <GameModeSelect key="game-mode" />}
          {phase === "mode-select" && <ModeSelect key="mode" />}
          {phase === "memory" && <MemoryPhase key="memory" />}
          {phase === "typing" && <TypingPhase key="typing" />}
          {phase === "typing-test" && <TypingTest key="typing-test" />}
          {phase === "battle" && <BattleMode key="battle" />}
          {phase === "lucky-box" && <LuckyBox key="lucky-box" />}
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
