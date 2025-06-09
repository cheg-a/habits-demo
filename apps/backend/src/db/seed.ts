/* import { eq, and } from 'drizzle-orm'; // Ensure this is at the top
import { db } from './db';
import { AuthService } from '../services/authService'; // To use createUser for hashing
import { users, profiles, dailyReports } from './schema'; // Import schema
import * as dotenv from 'dotenv';

dotenv.config(); // Load .env file for database connection

const authService = new AuthService();

async function main() {
  console.log('🟠 Starting database seeding...');

  try {
    // Create a sample user
    console.log('🟡 Creating sample user...');
    const user1Username = 'testuser';
    const user1Password = 'password123'; // Keep this secure, only for local seeding

    let existingUserArray = await db.select().from(users).where(eq(users.username, user1Username)).limit(1);
    if (existingUserArray.length > 0) {
        console.log(`🟢 User '${user1Username}' already exists. Skipping creation.`);
    } else {
        await authService.createUser(user1Username, user1Password);
        console.log(`🟢 User '${user1Username}' created successfully.`);
        existingUserArray = await db.select().from(users).where(eq(users.username, user1Username)).limit(1);
    }

    const user1 = existingUserArray[0];

    if (user1) {
      console.log(`🟡 Creating profile for ${user1.username}...`);
      const existingProfile = await db.select().from(profiles).where(eq(profiles.userId, user1.id)).limit(1);
      if (existingProfile.length > 0) {
          console.log(`🟢 Profile for '${user1.username}' already exists. Skipping creation.`);
      } else {
          await db.insert(profiles).values({
            userId: user1.id,
            bio: 'This is a test user bio.',
            favoriteColor: 'blue',
          });
          console.log(`🟢 Profile for ${user1.username} created successfully.`);
      }

      console.log(`🟡 Creating daily report for ${user1.username}...`);
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const existingReport = await db.select().from(dailyReports).where(and(eq(dailyReports.userId, user1.id), eq(dailyReports.reportDate, today))).limit(1);
      if (existingReport.length > 0) {
          console.log(`🟢 Daily report for '${user1.username}' on ${today} already exists. Skipping creation.`);
      } else {
          await db.insert(dailyReports).values({
            userId: user1.id,
            reportDate: today,
            mood: 'happy',
            sleepHours: '8', // Drizzle schema has this as numeric, ensure string '8' is fine or use Number(8) if strictly needed by DB/driver
            notes: 'Had a productive day!',
          });
          console.log(`🟢 Daily report for ${user1.username} on ${today} created successfully.`);
      }
    } else {
        console.warn(`🔴 Could not create dependent data because user '${user1Username}' was not found or created.`)
    }

    console.log('🟢 Database seeding completed successfully.');
  } catch (error) {
    console.error('🔴 Error during database seeding:', error);
    process.exit(1); // Exit with error code
  } finally {
    console.log('🔵 Seed script finished.');
    // No explicit process.exit(0) here, allow natural exit unless issues are found.
    // If the script hangs, it's often due to an open DB connection pool.
    // For postgres.js, ensure 'client.end()' is called on the query client if it's not version 3+ which handles this better.
    // However, our db.ts uses a single client for queries which should end when the script ends.
    // The migration client in migrate.ts does explicitly end.
    // If this seed script hangs, we may need to explicitly end the 'client' from db.ts here.
    // For now, let's assume it will exit cleanly.
  }
}

main().catch(e => { // Catch any unhandled promise rejections from main
  console.error('🔴 Unhandled error in main execution:', e);
  process.exit(1);
});
 */