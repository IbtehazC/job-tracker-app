/**
 * Script to seed mock data into Firebase for testing
 * Run this to populate the database with sample users and applications
 *
 * Usage: npx tsx scripts/seedMockData.ts
 */

import { createChallenge, createUser, createApplication } from '../lib/firebase/firestore';
import { getNextMonday } from '../lib/utils/date';

const mockUsers = [
  {
    uid: 'user1',
    email: 'alex@example.com',
    username: 'alex_dev',
    displayName: 'Alex Developer',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
  },
  {
    uid: 'user2',
    email: 'sarah@example.com',
    username: 'sarah_js',
    displayName: 'Sarah Johnson',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
  },
  {
    uid: 'user3',
    email: 'mike@example.com',
    username: 'mike_code',
    displayName: 'Mike Chen',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
  },
];

const mockCompanies = [
  'Google', 'Meta', 'Amazon', 'Microsoft', 'Apple',
  'Netflix', 'Tesla', 'Spotify', 'Airbnb', 'Stripe',
  'Shopify', 'Uber', 'Lyft', 'Twitter', 'LinkedIn',
];

const mockTitles = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Engineer',
  'Full Stack Developer',
  'DevOps Engineer',
  'Data Engineer',
  'Machine Learning Engineer',
  'Product Manager',
  'UI/UX Designer',
  'QA Engineer',
];

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomDate(daysAgo: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date;
}

async function seedMockData() {
  console.log('🌱 Seeding mock data into Firebase...\n');

  try {
    // 1. Create the challenge
    console.log('📋 Creating challenge...');
    const challengeId = await createChallenge({
      name: 'Apply to 100 Jobs',
      description: 'Submit 100 job applications before the deadline',
      targetCount: 100,
      startDate: new Date(),
      endDate: getNextMonday(),
      isActive: true,
    });
    console.log(`✅ Challenge created with ID: ${challengeId}\n`);

    // 2. Create mock users (without auth, just Firestore records)
    console.log('👥 Creating mock users...');
    for (const user of mockUsers) {
      await createUser(user.uid, {
        ...user,
        applicationCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`✅ Created user: ${user.username}`);
    }
    console.log();

    // 3. Create mock applications
    console.log('📝 Creating mock applications...');
    let totalApps = 0;

    for (const user of mockUsers) {
      // Each user gets a random number of applications (5-15)
      const numApps = Math.floor(Math.random() * 11) + 5;

      for (let i = 0; i < numApps; i++) {
        const company = getRandomItem(mockCompanies);
        const title = getRandomItem(mockTitles);

        await createApplication({
          userId: user.uid,
          username: user.username,
          userPhotoURL: user.photoURL,
          jobTitle: title,
          company: company,
          jobUrl: `https://careers.${company.toLowerCase()}.com/jobs/${Date.now()}`,
          appliedAt: getRandomDate(7), // Applications within the last 7 days
        });

        totalApps++;
      }

      console.log(`✅ Created ${numApps} applications for ${user.username}`);
    }

    console.log();
    console.log('🎉 Mock data seeded successfully!');
    console.log(`   Total users: ${mockUsers.length}`);
    console.log(`   Total applications: ${totalApps}`);
    console.log(`   Challenge deadline: ${getNextMonday().toLocaleDateString()}\n`);

    console.log('Next steps:');
    console.log('1. Start the dev server: npm run dev');
    console.log('2. Visit http://localhost:3000');
    console.log('3. Sign up for a new account to test');
    console.log('4. View the leaderboard and feed to see mock data\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding mock data:', error);
    process.exit(1);
  }
}

seedMockData();
