import { calculateStats, calculateConsistency } from '../src/lib/typingStats.js';

let passed = 0;
let failed = 0;

function assertEqual(description, actual, expected) {
    if (actual === expected) {
        console.log(`✅ PASS: ${description}`);
        passed++;
    } else {
        console.error(`❌ FAIL: ${description} | Expected: ${expected}, Got: ${actual}`);
        failed++;
    }
}

console.log("==================================================");
console.log("🧪 RUNNING MONKEYTYPE MATH ENGINE UNIT TESTS");
console.log("==================================================\n");

// Test Case 1: Prompt Example (250 correct, 260 total, 30s)
console.log("--- Test Case 1: Standard Prompt Example (250 correct, 260 total, 30s) ---");
const result1 = calculateStats({
    correctChars: 250,
    totalChars: 260,
    timeInSeconds: 30,
    extraChars: 0,
    missedChars: 0
});
assertEqual("Net WPM calculation", result1.wpm, 100);
assertEqual("Raw WPM calculation", result1.rawWpm, 104);
assertEqual("Accuracy (%) calculation", result1.accuracy, 96.15);
assertEqual("CharStats [correct, incorrect, extra, missed]", JSON.stringify(result1.charStats), "[250,10,0,0]");

// Test Case 2: API Example (120 correct, 2 incorrect, 0 extra, 0 missed, 30s)
console.log("\n--- Test Case 2: Monkeytype API Sample Data (120 correct, 122 total, 30s) ---");
const result2 = calculateStats({
    correctChars: 120,
    totalChars: 122,
    timeInSeconds: 30,
    extraChars: 0,
    missedChars: 0
});
assertEqual("Net WPM calculation", result2.wpm, 48);
assertEqual("Raw WPM calculation", result2.rawWpm, 48.8);
assertEqual("Accuracy (%) calculation", result2.accuracy, 98.36);

// Test Case 3: 60 Second Test (400 correct, 400 total)
console.log("\n--- Test Case 3: Perfect Score 60 Seconds (400 correct, 400 total) ---");
const result3 = calculateStats({
    correctChars: 400,
    totalChars: 400,
    timeInSeconds: 60,
    extraChars: 0,
    missedChars: 0
});
assertEqual("Net WPM calculation", result3.wpm, 80);
assertEqual("Raw WPM calculation", result3.rawWpm, 80);
assertEqual("Accuracy (%) calculation", result3.accuracy, 100);

// Test Case 4: Consistency Calculation
console.log("\n--- Test Case 4: Consistency Calculation ---");
const wpmHistory = [80, 82, 78, 80, 81];
const consistencyScore = calculateConsistency(wpmHistory, 80.2);
assertEqual("Consistency score calculated", typeof consistencyScore, "number");

console.log("\n==================================================");
console.log(`📊 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log("==================================================");

if (failed > 0) {
    process.exit(1);
}
