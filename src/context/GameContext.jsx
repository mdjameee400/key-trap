import React, { createContext, useContext, useState, useCallback } from "react";
import { getRandomQuestions, GAME_MODES, calculateScore, getRandomWords } from "../lib/gameData";

const GameContext = createContext(null);

export function useGame() {
    const ctx = useContext(GameContext);
    if (!ctx) throw new Error("useGame must be within GameProvider");
    return ctx;
}

export function GameProvider({ children }) {
    const [state, setState] = useState({
        phase: "hero",
        difficulty: null,
        questions: [],
        currentQuestionIndex: 0,
        userAnswers: [],
        startTime: 0,
        totalCharsTyped: 0,
        result: null,
        battlePhase: null,
    });

    const setPhase = useCallback((phase) => {
        setState((s) => ({ ...s, phase }));
    }, []);

    const selectMode = useCallback((difficulty) => {
        const mode = GAME_MODES[difficulty];
        const questions = getRandomQuestions(difficulty, mode.questionCount);
        setState((s) => ({
            ...s,
            difficulty,
            questions,
            currentQuestionIndex: 0,
            userAnswers: [],
            totalCharsTyped: 0,
            result: null,
            phase: "memory",
        }));
    }, []);

    const startTyping = useCallback(() => {
        setState((s) => ({ ...s, phase: "typing", startTime: Date.now(), currentQuestionIndex: 0 }));
    }, []);

    const submitAnswer = useCallback((answer) => {
        setState((s) => ({
            ...s,
            userAnswers: [...s.userAnswers, answer],
            totalCharsTyped: s.totalCharsTyped + answer.length,
        }));
    }, []);

    const nextQuestion = useCallback(() => {
        setState((s) => ({ ...s, currentQuestionIndex: s.currentQuestionIndex + 1 }));
    }, []);

    const finishGame = useCallback(() => {
        setState((s) => {
            const totalTime = (Date.now() - s.startTime) / 1000;
            const answers = s.questions.map((q, i) => ({
                question: q.question,
                correctAnswer: q.answer,
                userAnswer: s.userAnswers[i] || "",
                isCorrect: (s.userAnswers[i] || "").toLowerCase().trim() === q.answer.toLowerCase().trim(),
            }));
            const correct = answers.filter((a) => a.isCorrect).length;
            const wrong = answers.length - correct;
            const accuracy = Math.round((correct / (answers.length || 1)) * 100);
            const wpm = totalTime > 0 ? Math.round((s.totalCharsTyped / 5) / (totalTime / 60)) : 0;
            const score = calculateScore(correct, answers.length, totalTime, s.totalCharsTyped, s.difficulty);

            return {
                ...s,
                phase: "result",
                result: {
                    correct,
                    wrong,
                    totalQuestions: answers.length,
                    accuracy,
                    wpm,
                    mistakes: wrong,
                    score,
                    difficulty: s.difficulty,
                    answers
                },
            };
        });
    }, []);

    const resetGame = useCallback(() => {
        setState({
            phase: "hero",
            difficulty: null,
            questions: [],
            currentQuestionIndex: 0,
            userAnswers: [],
            startTime: 0,
            totalCharsTyped: 0,
            result: null,
            battlePhase: null,
        });
    }, []);

    const startTypingTest = useCallback((duration = 15) => {
        const words = getRandomWords(100);
        setState((s) => ({
            ...s,
            phase: "typing-test",
            questions: words,
            startTime: duration, // We'll use this to store the chosen duration initially
            userAnswers: [],
            totalCharsTyped: 0,
            result: null
        }));
    }, []);

    const finishTypingTest = useCallback((stats) => {
        const { accuracy, wpm, rawWpm, mistakes, correctChars, totalTyped, duration, charStats, consistency } = stats;
        const score = calculateScore(correctChars, totalTyped, duration, totalTyped, null);

        setState((s) => ({
            ...s,
            phase: "result",
            result: {
                ...stats,
                correct: correctChars,
                wrong: mistakes,
                totalQuestions: totalTyped,
                accuracy,
                wpm,
                rawWpm,
                charStats,
                consistency,
                mistakes,
                score,
                difficulty: "typing-test",
                duration,
                answers: []
            }
        }));
    }, []);

    return (
        <GameContext.Provider value={{
            ...state,
            setPhase,
            selectMode,
            startTyping,
            startTypingTest,
            submitAnswer,
            nextQuestion,
            finishGame,
            finishTypingTest,
            resetGame
        }}>
            {children}
        </GameContext.Provider>
    );
}
