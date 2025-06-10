import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db/index';
import { dailyReports } from '../db/schema';
import { z } from 'zod';
import { sql } from 'drizzle-orm';

// Zod schema for habit objects
const habitSchema = z.object({
  text: z.string().min(1, 'Habit text cannot be empty'),
  problem: z.boolean().default(false),
  completed: z.boolean().default(false),
});

// Zod schema for the daily report body
const dailyReportBodySchema = z.object({
  date: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Date must be in dd/mm/yyyy format'), // dd/mm/yyyy
  gratitude: z.string().min(1, 'Gratitude statement is required'),
  goal: z.string().min(1, 'Goal statement is required'),
  motivation: z.number().int().min(1).max(5).nullable().optional(), // Assuming 1-5 scale, can be null
  mood: z.string().nullable().optional(), // Emoji or label, can be null
  influence: z.string().nullable().optional(), // Can be null or empty string
  habits: z.array(habitSchema).min(1, 'At least one habit is required'),
});

export const saveDailyReportHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    // Авторизация уже проверена в middleware, userId точно существует
    const userId = request.session.userId!;

    const parsedBody = dailyReportBodySchema.safeParse(request.body);

    if (!parsedBody.success) {
      return reply.status(400).send({
        message: 'Invalid daily report data.',
        errors: parsedBody.error.flatten().fieldErrors,
      });
    }

    const { date, gratitude, goal, motivation, mood, influence, habits } = parsedBody.data;

    // Check for existing report for the same user and date to prevent duplicates
    const existingReport = await db
      .select()
      .from(dailyReports)
      .where(
        sql`${dailyReports.userId} = ${userId} AND ${dailyReports.date} = ${date}`
      )
      .limit(1);

    if (existingReport.length > 0) {
      return reply.status(409).send({ message: `A daily report for ${date} already exists.` });
    }

    const [savedReport] = await db
      .insert(dailyReports)
      .values({
        userId,
        date,
        gratitude,
        goal,
        motivation: motivation ?? null, // Ensure null if undefined
        mood: mood ?? null,           // Ensure null if undefined
        influence: influence ?? null, // Ensure null if undefined
        habits,
      })
      .returning();

    return reply.status(201).send(savedReport);

  } catch (error) {
    request.log.error(error, 'Error saving daily report');
    // Consider more specific error handling, e.g., unique constraint violation if not handled by above check
    return reply.status(500).send({ message: 'Internal Server Error while saving daily report.' });
  }
};
