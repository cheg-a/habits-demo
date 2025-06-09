import { db } from '../db/index';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export class AuthService {
  public async verifyUser(username: string, passwordAttempt: string): Promise<typeof users.$inferSelect | null> {
    const userArray = await db.select().from(users).where(eq(users.username, username)).limit(1);
    if (!userArray.length) {
      return null;
    }
    const user = userArray[0];

    const isPasswordCorrect = await bcrypt.compare(passwordAttempt, user.passwordHash);
    if (!isPasswordCorrect) {
      return null;
    }
    return user;
  }

  public async createUser(username: string, plainPassword: string): Promise<typeof users.$inferInsert> {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(plainPassword, saltRounds);
    const newUser = { username, passwordHash };
    await db.insert(users).values(newUser);
    return newUser;
  }

  public async findUserById(userId: number): Promise<Omit<typeof users.$inferSelect, 'passwordHash'> | null> {
    const userArray = await db.select({
      id: users.id,
      username: users.username,
      createdAt: users.createdAt
      // Add other fields as needed
    }).from(users).where(eq(users.id, userId)).limit(1);

    if (!userArray.length) {
      return null;
    }
    return userArray[0];
  }
}
