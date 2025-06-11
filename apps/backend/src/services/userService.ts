import db from "../db";
import { questionnaires, dailyReports, weeklyReports, users } from "../db/schema";
import { eq, desc, sql, and, gte, asc } from "drizzle-orm"; // Добавили asc для сортировки
import { alias } from 'drizzle-orm/pg-core';

// Интерфейсы (должны совпадать с предыдущими определениями, но с добавлением currentStreak)
interface QuestionnaireSummary {
  mainGoal?: string | null;
  values?: string[] | null;
  habitsToTrack?: string[] | null;
}

interface HabitProgress {
  name: string;
  completionRate: number; // 0-100
  currentStreak: number; // Новое поле для серий
}

interface MoodSummary {
  averageLastWeek?: number | null;
  trend?: "improving" | "declining" | "stable" | null;
}

interface ReportLink {
  date?: string | null;
  mood?: string | null;
  id?: number | null;
  weekNumber?: number | null;
  keyAchievement?: string | null;
}

export interface ProfileSummaryResponse {
  questionnaireSummary: QuestionnaireSummary | null;
  habitsProgress: HabitProgress[];
  moodSummary: MoodSummary | null;
  lastDailyReport: ReportLink | null;
  lastWeeklyReport: ReportLink | null;
  userName: string | null;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Вспомогательная функция для проверки, является ли привычка выполненной в отчете
function isHabitCompletedInReport(reportHabits: any, habitName: string): boolean {
  if (!reportHabits || !Array.isArray(reportHabits)) {
    return false;
  }
  const habitEntry = reportHabits.find(h => h.text === habitName);
  return habitEntry ? habitEntry.completed === true : false;
}

export async function getProfileSummary(userId: number): Promise<ProfileSummaryResponse | null> {
  console.log(`Запрос данных профиля (с сериями) для пользователя ${userId}`);

  const userQuery = await db.select({ userName: users.username }).from(users).where(eq(users.id, userId)).limit(1).execute();
  const userName = userQuery.length > 0 ? userQuery[0].userName : null;

  let questionnaireSummary: QuestionnaireSummary | null = null;
  const latestQuestionnaireQuery = await db
    .select({ answers: questionnaires.answers })
    .from(questionnaires)
    .where(eq(questionnaires.userId, userId))
    .orderBy(desc(questionnaires.createdAt))
    .limit(1)
    .execute();

  if (latestQuestionnaireQuery.length > 0 && latestQuestionnaireQuery[0].answers) {
    const answers = latestQuestionnaireQuery[0].answers as any;
    const mainGoal = answers.goal_setting || null;
    let values: string[] = [];
    if (answers.self_analysis && answers.self_analysis.summary) {
      if (typeof answers.self_analysis.summary === 'string') {
        values = answers.self_analysis.summary.split(',').map((s: string) => s.trim()).slice(0, 3);
      } else if (Array.isArray(answers.self_analysis.summary)) {
        values = answers.self_analysis.summary.slice(0, 3);
      }
    } else if (answers.qualities) {
        if (Array.isArray(answers.qualities)) values = answers.qualities.slice(0,3);
        else if (typeof answers.qualities === 'string') values = answers.qualities.split(',').map((s:string) => s.trim()).slice(0,3);
    }
    let habitsToTrack: string[] = [];
    if (answers.habits_analysis && answers.habits_analysis.habitsGood) {
       if (typeof answers.habits_analysis.habitsGood === 'string') {
        habitsToTrack = answers.habits_analysis.habitsGood.split(',').map((s: string) => s.trim());
      } else if (Array.isArray(answers.habits_analysis.habitsGood)) {
        habitsToTrack = answers.habits_analysis.habitsGood;
      }
    } else if (answers.kvdrch_formulation && answers.kvdrch_formulation.konkretna) {
        habitsToTrack = [answers.kvdrch_formulation.konkretna];
    }
    questionnaireSummary = {
      mainGoal: typeof mainGoal === 'string' ? mainGoal : (typeof mainGoal === 'object' && mainGoal?.goal_setting ? mainGoal.goal_setting : 'Цель не указана'),
      values: values.length > 0 ? values : ['Ценности не указаны'],
      habitsToTrack: habitsToTrack.length > 0 ? habitsToTrack : ['Привычки не указаны'],
    };
  }

  const habitsProgress: HabitProgress[] = [];
  const habitsToQuery = questionnaireSummary?.habitsToTrack || [];

  if (habitsToQuery.length > 0) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoFormatted = formatDate(thirtyDaysAgo);

    // Получаем все отчеты пользователя за последние ~30-40 дней для расчета серий и % (с запасом для серий)
    // Сортируем по дате ОТ СТАРОГО К НОВОМУ для удобного расчета серий
    const allRecentReports = await db
      .select({ habits: dailyReports.habits, date: dailyReports.date })
      .from(dailyReports)
      .where(and(
        eq(dailyReports.userId, userId)
        // gte(dailyReports.date, thirtyDaysAgoFormatted) // Пока получаем все, чтобы найти последнюю серию
      ))
      .orderBy(asc(dailyReports.date)) // Сортировка от старых к новым для расчета серий
      .execute();

    // Получаем все отчеты пользователя, отсортированные от НОВОГО К СТАРОМУ для расчета % выполнения за 30 дней
    const reportsForCompletionRate = await db
        .select({ habits: dailyReports.habits, date: dailyReports.date })
        .from(dailyReports)
        .where(and(
            eq(dailyReports.userId, userId),
            gte(dailyReports.date, thirtyDaysAgoFormatted)
        ))
        .orderBy(desc(dailyReports.date))
        .execute();

    for (const habitName of habitsToQuery) {
      // Расчет % выполнения за последние 30 дней
      let completedCount = 0;
      let totalRelevantReportsInPeriod = 0;
      reportsForCompletionRate.forEach(report => {
        if (new Date(report.date) >= thirtyDaysAgo) { // Убедимся, что отчет в пределах 30 дней
            const dailyHabits = report.habits as Array<{ text: string; completed: boolean; problem: boolean }>;
            const targetHabitEntry = dailyHabits?.find(h => h.text === habitName);
            if (targetHabitEntry) {
                totalRelevantReportsInPeriod++;
                if (targetHabitEntry.completed) {
                    completedCount++;
                }
            }
        }
      });
      const completionRate = totalRelevantReportsInPeriod > 0 ? Math.round((completedCount / totalRelevantReportsInPeriod) * 100) : 0;

      // Расчет текущей серии (простой вариант: непрерывная последовательность до последнего отчета)
      let currentStreak = 0;
      // Итерируемся по всем отчетам ОТ СТАРОГО К НОВОМУ
      // Чтобы найти ПОСЛЕДНЮЮ серию, лучше итерироваться от НОВОГО К СТАРОМУ
      let reportsReversedForStreak = [...allRecentReports].reverse(); // Копируем и переворачиваем для расчета серии

      // Логика для определения, был ли отчет "сегодня" или "вчера" для правильного старта серии
      // Это упрощенная логика, не учитывающая пропуски дней идеально.
      // Она считает непрерывные выполнения до первого "невыполнения" или отсутствия записи о привычке.
      for (const report of reportsReversedForStreak) {
        if (isHabitCompletedInReport(report.habits, habitName)) {
          currentStreak++;
        } else {
          // Если привычка не найдена в отчете или не выполнена, серия прерывается
          // (для самой последней серии)
           const dailyHabits = report.habits as Array<{ text: string; completed: boolean; problem: boolean }>;
           if (dailyHabits?.find(h => h.text === habitName)) { // Если привычка была в отчете, но не выполнена
             break;
           }
           // Если привычки просто не было в отчете за этот день, можно либо прерывать серию,
           // либо пропускать этот день (зависит от требований). Сейчас - прерываем.
           // break; // Раскомментировать, если отсутствие привычки в отчете прерывает серию.
                     // Если закомментировано, то дни без упоминания привычки не прерывают серию выполненных.
                     // Для строгого streak - нужно прерывать.
        }
      }

      // Коррекция если сегодня еще не было отчета и вчера привычка была выполнена
      // Эта логика усложняется и требует точного знания дат. Пока оставим простой подсчет.

      habitsProgress.push({
        name: habitName,
        completionRate: completionRate,
        currentStreak: currentStreak,
      });
    }
  }

  let moodSummary: MoodSummary | null = null;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysAgoFormatted = formatDate(sevenDaysAgo);

  const moodReports = await db
    .select({ mood: dailyReports.mood })
    .from(dailyReports)
    .where(and(
      eq(dailyReports.userId, userId),
      gte(dailyReports.date, sevenDaysAgoFormatted)
    ))
    .execute();

  const moodToScore = (moodText: string | null): number | null => {
    if (!moodText) return null;
    const mapping: { [key: string]: number } = {
      'Плохо': 1, '😢': 1,
      'Грустно': 2, '🙁': 2,
      'Нейтрально': 3, '😐': 3,
      'Хорошо': 4, '🙂': 4,
      'Отлично': 5, '😃': 5
    };
    return mapping[moodText] || null;
  };

  if (moodReports.length > 0) {
    let totalMoodScore = 0;
    let validMoodCount = 0;
    moodReports.forEach(report => {
      const score = moodToScore(report.mood as string | null);
      if (score !== null) {
        totalMoodScore += score;
        validMoodCount++;
      }
    });
    if (validMoodCount > 0) {
      moodSummary = { averageLastWeek: parseFloat((totalMoodScore / validMoodCount).toFixed(1)) };
    }
  }

  let lastDailyReport: ReportLink | null = null;
  const lastDailyReportQuery = await db
    .select({ id: dailyReports.id, date: dailyReports.date, mood: dailyReports.mood })
    .from(dailyReports)
    .where(eq(dailyReports.userId, userId))
    .orderBy(desc(dailyReports.date))
    .limit(1)
    .execute();

  if (lastDailyReportQuery.length > 0) {
    const report = lastDailyReportQuery[0];
    lastDailyReport = {
      id: report.id,
      date: report.date ? formatDate(new Date(report.date)) : null,
      mood: report.mood as string | null,
    };
  }

  let lastWeeklyReport: ReportLink | null = null;
  const lastWeeklyReportQuery = await db
    .select({ id: weeklyReports.id, weekNumber: weeklyReports.weekNumber, answers: weeklyReports.answers })
    .from(weeklyReports)
    .where(eq(weeklyReports.userId, userId))
    .orderBy(desc(weeklyReports.createdAt))
    .limit(1)
    .execute();

  if (lastWeeklyReportQuery.length > 0) {
    const report = lastWeeklyReportQuery[0];
    const answers = report.answers as any;
    const achievement = answers?.successfulStrategies || answers?.keyAchievement || "Достижения не указаны";
    lastWeeklyReport = {
      id: report.id,
      weekNumber: report.weekNumber,
      keyAchievement: typeof achievement === 'string' ? achievement.substring(0,100) : "Информация отсутствует",
    };
  }

  return {
    questionnaireSummary,
    habitsProgress,
    moodSummary,
    lastDailyReport,
    lastWeeklyReport,
    userName,
  };
}
