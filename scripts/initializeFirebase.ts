/**
 * Script to initialize Firebase with the default challenge
 * Run this once to set up your Firestore database
 *
 * Usage: npx tsx scripts/initializeFirebase.ts
 */

import { createChallenge } from '../lib/firebase/firestore';
import { getNextMonday } from '../lib/utils/date';

async function initializeFirebase() {
  console.log('🔥 Initializing Firebase with default data...\n');

  try {
    // Create the initial challenge
    const challengeId = await createChallenge({
      name: 'Apply to 100 Jobs',
      description: 'Submit 100 job applications before the deadline',
      targetCount: 100,
      startDate: new Date(),
      endDate: getNextMonday(),
      isActive: true,
    });

    console.log('✅ Challenge created successfully!');
    console.log(`   Challenge ID: ${challengeId}`);
    console.log(`   Target: 100 applications`);
    console.log(`   Deadline: ${getNextMonday().toLocaleDateString()}\n`);

    console.log('🎉 Firebase initialized successfully!');
    console.log('\nNext steps:');
    console.log('1. Start the dev server: npm run dev');
    console.log('2. Sign up for an account');
    console.log('3. Start tracking your job applications!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing Firebase:', error);
    process.exit(1);
  }
}

initializeFirebase();
