#!/usr/bin/env node

/**
 * Test script to verify Battle Mode WebSocket connections
 * Run with: node test-battle-connection.js
 */

import { io } from 'socket.io-client';

const SOCKET_SERVER = process.env.VITE_SOCKET_SERVER || 'http://localhost:3001';

console.log(`🔍 Testing Battle Mode Socket Connection`);
console.log(`📡 Connecting to: ${SOCKET_SERVER}\n`);

const socket = io(SOCKET_SERVER, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5
});

let testsPassed = 0;
let testsFailed = 0;

socket.on('connect', () => {
    console.log('✅ Connected successfully');
    testsPassed++;
    console.log(`📍 Socket ID: ${socket.id}\n`);

    // Test 1: Register user
    console.log('🧪 Test 1: Registering user...');
    socket.emit('register-user', {
        userId: 'test-user-' + Date.now(),
        username: 'TestUser'
    }, (response) => {
        if (response && response.stats) {
            console.log('✅ User registration successful');
            console.log(`   Rating: ${response.stats.rating}, Wins: ${response.stats.wins}, Losses: ${response.stats.losses}`);
            testsPassed++;
        } else {
            console.log('❌ User registration failed');
            testsFailed++;
        }
    });

    socket.on('user-registered', (data) => {
        console.log('✅ Received user-registered event');
        testsPassed++;
    });

    // Test 2: Create battle room
    setTimeout(() => {
        console.log('\n🧪 Test 2: Creating battle room...');
        socket.emit('create-battle-room', (response) => {
            if (response.success && response.roomId) {
                console.log('✅ Battle room created successfully');
                console.log(`   Room ID: ${response.roomId}`);
                testsPassed++;
            } else {
                console.log('❌ Failed to create battle room');
                testsFailed++;
            }
        });
    }, 500);

    // Test 3: Join matchmaking
    setTimeout(() => {
        console.log('\n🧪 Test 3: Joining matchmaking queue...');
        socket.emit('join-queue', (response) => {
            if (response.success) {
                console.log('✅ Successfully joined matchmaking queue');
                testsPassed++;
            } else {
                console.log('❌ Failed to join matchmaking');
                testsFailed++;
            }
        });
    }, 1000);

    // Summary after tests
    setTimeout(() => {
        console.log('\n' + '='.repeat(50));
        console.log('📊 Test Summary');
        console.log('='.repeat(50));
        console.log(`✅ Passed: ${testsPassed}`);
        console.log(`❌ Failed: ${testsFailed}`);
        
        if (testsFailed === 0) {
            console.log('\n🎉 All tests passed! Battle Mode is ready to use.\n');
        } else {
            console.log('\n⚠️  Some tests failed. Check the output above.\n');
        }

        // Print server stats
        fetch(`${SOCKET_SERVER.replace('http://', 'http://').split(':').slice(0, 2).join(':')}/stats`)
            .then(r => r.json())
            .then(stats => {
                console.log('📈 Server Stats:');
                console.log(`   Active Users: ${stats.activeUsers}`);
                console.log(`   Active Battles: ${stats.activeBattles}`);
                console.log(`   Queue Size: ${stats.queueSize}`);
                process.exit(testsFailed === 0 ? 0 : 1);
            })
            .catch(() => {
                process.exit(testsFailed === 0 ? 0 : 1);
            });
    }, 1500);
});

socket.on('connect_error', (error) => {
    console.log('❌ Connection error:', error.message);
    testsFailed++;
    process.exit(1);
});

socket.on('error', (error) => {
    console.log('❌ Socket error:', error);
    testsFailed++;
});

socket.on('disconnect', (reason) => {
    console.log(`\n⚠️  Disconnected: ${reason}`);
});

// Timeout after 10 seconds
setTimeout(() => {
    console.log('\n⏱️  Test timeout - connection took too long');
    process.exit(1);
}, 10000);
