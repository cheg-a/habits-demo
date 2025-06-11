import { desc, sql } from "drizzle-orm";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { db } from "../db/index";
import { dailyReports } from "../db/schema";

// Zod schema for habit objects
const habitSchema = z.object({
  text: z.string().min(1, "Habit text cannot be empty"),
  problem: z.boolean().default(false),
  completed: z.boolean().default(false),
});

// Zod schema for the daily report body
const dailyReportBodySchema = z.object({
  gratitude: z.string().min(1, "Gratitude statement is required"),
  goal: z.string().min(1, "Goal statement is required"),
  motivation: z.number().int().min(1).max(5).nullable().optional(), // Assuming 1-5 scale, can be null
  mood: z.string().nullable().optional(), // Emoji or label, can be null
  influence: z.string().nullable().optional(), // Can be null or empty string
  habits: z.array(habitSchema).min(1, "At least one habit is required"),
});

export const saveDailyReportHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    // Авторизация уже проверена в middleware, userId точно существует
    const userId = request.session.userId!;

    const parsedBody = dailyReportBodySchema.safeParse(request.body);

    if (!parsedBody.success) {
      return reply.status(400).send({
        message: "Invalid daily report data.",
        errors: parsedBody.error.flatten().fieldErrors,
      });
    }

    const { gratitude, goal, motivation, mood, influence, habits } =
      parsedBody.data;

    // Генерируем текущую дату в формате dd/mm/yyyy
    const today = new Date();
    const formattedDate = [
      String(today.getDate()).padStart(2, '0'),
      String(today.getMonth() + 1).padStart(2, '0'),
      today.getFullYear()
    ].join('/');

    // Используем дату с бэкенда вместо переданной с фронтенда
    // Check for existing report for the same user and date to prevent duplicates
    const existingReport = await db
      .select()
      .from(dailyReports)
      .where(
        sql`${dailyReports.userId} = ${userId} AND ${dailyReports.date} = ${formattedDate}`,
      )
      .limit(1);

    if (existingReport.length > 0) {
      return reply
        .status(409)
        .send({ message: `A daily report for ${formattedDate} already exists.` });
    }

    const [lastReport] = await db
      .select()
      .from(dailyReports)
      .where(sql`${dailyReports.userId} = ${userId}`)
      .orderBy(desc(dailyReports.createdAt))
      .limit(1);

    const [savedReport] = await db
      .insert(dailyReports)
      .values({
        userId,
        date: formattedDate,
        gratitude,
        goal,
        motivation: motivation ?? null, // Ensure null if undefined
        mood: mood ?? null, // Ensure null if undefined
        influence: influence ?? null, // Ensure null if undefined
        habits,
        number: lastReport?.number,
      })
      .returning();

    return reply.status(201).send(savedReport);
  } catch (error) {
    request.log.error(error, "Error saving daily report");
    // Consider more specific error handling, e.g., unique constraint violation if not handled by above check
    return reply
      .status(500)
      .send({ message: "Internal Server Error while saving daily report." });
  }
};

// Обработчик для получения ежедневных отчетов пользователя за месяц
interface GetMonthlyDailyReportsQuery {
  month: string;
  year: string;
}

export const getMonthlyDailyReportsHandler = async (
  request: FastifyRequest<{ Querystring: GetMonthlyDailyReportsQuery }>,
  reply: FastifyReply,
) => {
  try {
    // Авторизация уже проверена в middleware, userId точно существует
    const userId = request.session.userId!;
    // Получаем месяц и год из параметров запроса
    const { month, year } = request.query;

    // Преобразуем параметры в числа
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    // Проверяем корректность параметров
    if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12) {
      return reply.status(400).send({
        message: "Invalid month or year parameter.",
      });
    }

    // Получаем все отчеты пользователя
    const userReports = await db
      .select()
      .from(dailyReports)
      .where(sql`${dailyReports.userId} = ${userId}`)
      .orderBy(dailyReports.date);

    // Фильтруем отчеты по указанному месяцу и году
    // Формат даты в БД: dd/mm/yyyy
    const monthlyReports = userReports.filter((report) => {
      const [day, reportMonth, reportYear] = report.date
        .split("/")
        .map(Number);
      return reportMonth === monthNum && reportYear === yearNum;
    });

    // Преобразуем в формат, удобный для фронтенда
    const result = monthlyReports.map((report) => {
      const [day] = report.date.split("/").map(Number);
      return {
        id: report.id,
        day,
        date: report.date,
        mood: report.mood,
        // Добавляем только нужные поля, которые будут использоваться на фронтенде
      };
    });

    return reply.status(200).send(result);
  } catch (error) {
    request.log.error(error, "Error fetching monthly daily reports");
    return reply.status(500).send({
      message: "Internal Server Error while fetching monthly daily reports.",
    });
  }
};
