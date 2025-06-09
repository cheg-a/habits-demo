/* import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' }); // Ensure .env is in the root of 'api' directory or adjust path

const runMigrations = async () => {
  const dbUrl = process.env.DATABASE_URL; // DATABASE_URL=postgresql://user:password@host:port/database

  if (!dbUrl) {
    console.error('🔴 DATABASE_URL environment variable is not set.');
    process.exit(1);
  }

  console.log('🟠 Connecting to database for migration...');

  let migrationClient;
  try {
    // Drizzle Kit's migrator needs a separate client that can execute DDL statements.
    // For postgres.js, this means not using a connection pool for migrations if possible,
    // or ensuring the pool user has rights to alter schema.
    // A direct connection string is often simplest for migrations.
    migrationClient = postgres(dbUrl, { max: 1 }); // max: 1 is important for migrations

    console.log('🟢 Database connection established for migration.');
    console.log('🟠 Running migrations...');

    await migrate(drizzle(migrationClient), { migrationsFolder: './drizzle' });

    console.log('🟢 Migrations completed successfully.');
  } catch (error) {
    console.error('🔴 Error running migrations:', error);
    process.exit(1);
  } finally {
    if (migrationClient) {
      console.log('🔵 Closing migration client connection...');
      await migrationClient.end();
      console.log('🔵 Migration client connection closed.');
    }
  }
};

runMigrations();
 */