/**
 * Standard Monkeytype Math Calculations Module
 * 
 * Formulas:
 * 1. Net WPM = (Correct Characters / 5) * (60 / Time in Seconds)
 * 2. Raw WPM = (Total Characters / 5) * (60 / Time in Seconds)
 * 3. Accuracy (%) = (Correct Keypresses / Total Keypresses) * 100
 * 4. CharStats = [correct, incorrect, extra, missed]
 * 5. Consistency (%) = 100 - (Standard Deviation of WPM / Mean WPM) * 100
 */

export function calculateStats({
    correctChars = 0,
    totalChars = 0,
    timeInSeconds = 1,
    extraChars = 0,
    missedChars = 0,
    wpmHistory = []
}) {
    const safeTime = Math.max(timeInSeconds, 0.1);
    const timeInMinutes = safeTime / 60;

    // Standard Monkeytype calculation formulas
    const netWpmVal = (correctChars / 5) / timeInMinutes;
    const rawWpmVal = (totalChars / 5) / timeInMinutes;
    const accuracyVal = totalChars > 0 ? (correctChars / totalChars) * 100 : 100;

    // Format stats with two decimal places and rounded integers
    const wpm = Number(netWpmVal.toFixed(2));
    const rawWpm = Number(rawWpmVal.toFixed(2));
    const accuracy = Number(accuracyVal.toFixed(2));

    const wpmDisplay = Math.max(0, Math.round(netWpmVal));
    const rawWpmDisplay = Math.max(0, Math.round(rawWpmVal));
    const accuracyDisplay = Math.round(accuracyVal);

    // Incorrect characters = total typed - correct
    const incorrectChars = Math.max(0, totalChars - correctChars);

    // Consistency score standard deviation calculation
    const consistency = calculateConsistency(wpmHistory, rawWpmVal);

    return {
        wpm,
        rawWpm,
        accuracy,
        wpmDisplay,
        rawWpmDisplay,
        accuracyDisplay,
        charStats: [correctChars, incorrectChars, extraChars, missedChars],
        consistency
    };
}

export function calculateConsistency(wpmSamples = [], averageWpm = 0) {
    if (!wpmSamples || wpmSamples.length < 2 || averageWpm <= 0) {
        return 100;
    }

    const n = wpmSamples.length;
    const mean = wpmSamples.reduce((a, b) => a + b, 0) / n;
    const variance = wpmSamples.reduce((sq, val) => sq + Math.pow(val - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);

    if (mean === 0) return 100;

    // Consistency percentage based on coefficient of variation
    const cv = (stdDev / mean) * 100;
    const score = Math.max(0, Math.min(100, Math.round(100 - cv)));
    return score;
}
