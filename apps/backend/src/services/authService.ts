import { db } from "../db/index";
import { users, questionnaires, dailyReports } from "../db/schema";
import { eq, and, sql } from "drizzle-orm";
import { omit, pickBy, pick } from "lodash";
import bcrypt from "bcrypt";

export class AuthService {
  public async verifyUser(username: string, passwordAttempt: string) {
    const userArray = await db
      .select({
        id: users.id,
        username: users.username,
        passwordHash: users.passwordHash,
      })
      .from(users)
      .where(eq(users.username, username));
    if (!userArray.length) {
      return null;
    }
    const user = userArray[0];

    const isPasswordCorrect = await bcrypt.compare(
      passwordAttempt,
      user.passwordHash,
    );
    if (!isPasswordCorrect) {
      return null;
    }
    return this.findUserById(user.id);
  }

  public async createUser(
    username: string,
    plainPassword: string,
  ): Promise<typeof users.$inferInsert> {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(plainPassword, saltRounds);
    const newUser = { username, passwordHash };
    await db.insert(users).values(newUser);
    return newUser;
  }

  public async findUserById(userId: number) {
    const userArray = await db
      .select({
        id: users.id,
        username: users.username,
        createdAt: users.createdAt,
        isDefaultPassword: users.isDefaultPassword,
        dailyReport: dailyReports,
        questionnaires,
        reportNum: sql`ROW_NUMBER() OVER (PARTITION BY users.id ORDER BY daily_reports.created_at ASC)`,
        // Add other fields as needed
      })
      .from(users)
      .where(eq(users.id, userId))
      .leftJoin(questionnaires, eq(users.id, questionnaires.userId))
      .leftJoin(
        dailyReports,
        and(
          eq(users.id, dailyReports.userId),
          sql`date = to_char(current_date, 'dd/mm/yyyy')`,
        ),
      )
      .limit(1);

    if (!userArray.length) {
      return null;
    }

    const user = userArray[0];
    return {
      ...pick(user, ["id", "username", "createdAt", "isDefaultPassword"]),
      dailyReport: user.dailyReport
        ? { ...user.dailyReport, reportNum: user.reportNum }
        : null,
      needQuestionnaire: !user.questionnaires,
    };
  }

  public async updatePassword(
    userId: number,
    newPassword: string,
  ): Promise<boolean> {
    try {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(newPassword, saltRounds);

      await db
        .update(users)
        .set({
          passwordHash,
          isDefaultPassword: false,
        })
        .where(eq(users.id, userId));

      return true;
    } catch (error) {
      console.error("Error updating password:", error);
      return false;
    }
  }
}
