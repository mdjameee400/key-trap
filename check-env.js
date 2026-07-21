#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('\n========================================');
console.log('  Environment Variables Check');
console.log('========================================\n');

const envFile = path.join(__dirname, '.env.local');
const envExists = fs.existsSync(envFile);

if (!envExists) {
    console.log('❌ .env.local file not found');
    console.log('   Run: cp .env.example .env.local\n');
    process.exit(1);
}

const envContent = fs.readFileSync(envFile, 'utf-8');
const lines = envContent.split('\n').filter(line => line && !line.startsWith('#'));

const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
];

const optionalVars = [
    'VITE_FIREBASE_MEASUREMENT_ID'
];

console.log('REQUIRED VARIABLES:');
let missingRequired = 0;
requiredVars.forEach(varName => {
    const line = lines.find(l => l.startsWith(varName + '='));
    const value = line ? line.split('=')[1]?.trim() : '';
    
    if (!value || value === '') {
        console.log(`  ❌ ${varName} - MISSING`);
        missingRequired++;
    } else {
        const displayValue = value.substring(0, 20) + (value.length > 20 ? '...' : '');
        console.log(`  ✓ ${varName} - SET`);
    }
});

console.log('\nOPTIONAL VARIABLES:');
optionalVars.forEach(varName => {
    const line = lines.find(l => l.startsWith(varName + '='));
    const value = line ? line.split('=')[1]?.trim() : '';
    
    if (!value || value === '') {
        console.log(`  ⚠ ${varName} - NOT SET (optional)`);
    } else {
        console.log(`  ✓ ${varName} - SET`);
    }
});

console.log('\n========================================');

if (missingRequired === 0) {
    console.log('✓ All required variables are set!');
    console.log('\nNext steps:');
    console.log('  1. Restart dev server: pnpm run dev');
    console.log('  2. Check browser console for [v0] logs');
    console.log('  3. Go to http://localhost:8080/auth to test');
} else {
    console.log(`❌ ${missingRequired} required variable(s) missing!`);
    console.log('\nTo fix:');
    console.log('  1. Edit .env.local');
    console.log('  2. Get values from Firebase Console');
    console.log('  3. Visit: https://console.firebase.google.com');
    console.log('  4. See AUTH_SETUP_GUIDE.md for details');
}

console.log('========================================\n');
process.exit(missingRequired > 0 ? 1 : 0);
