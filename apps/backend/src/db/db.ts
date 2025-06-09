/* import { drizzle } from 'drizzle-orm/node-postgres';
import * as dotenv from 'dotenv';
import * as schema from './schema'; // Import all exports from schema

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('🔴 DATABASE_URL environment variable is not set.');
  process.exit(1);
}

// For query client
// For migrations, you might want a separate client or ensure this user has DDL rights
// const migrationClient = postgres(connectionString, { max: 1 });


export const db = drizzle(client, { schema }); // Pass schema to drizzle
// export const migrationDb = drizzle(migrationClient); // If using separate client for migrations

 */