import { serial, text, timestamp, pgTable, integer, date, numeric, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm'; // Import relations

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  bio: text('bio'),
  favoriteColor: text('favorite_color'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const dailyReports = pgTable('daily_reports', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  reportDate: date('report_date').notNull(),
  mood: text('mood').notNull(),
  sleepHours: numeric('sleep_hours'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    userIdReportDateIdx: uniqueIndex('user_id_report_date_idx').on(table.userId, table.reportDate),
  };
});

export const weeklyReports = pgTable('weekly_reports', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  weekStartDate: date('week_start_date').notNull(),
  summary: text('summary').notNull(),
  achievements: text('achievements'),
  challenges: text('challenges'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    userIdWeekStartDateIdx: uniqueIndex('user_id_week_start_date_idx').on(table.userId, table.weekStartDate),
  };
});

// Define relations
export const usersRelations = relations(users, ({ one, many }) }) => ({
  profile: one(profiles, { fields: [users.id], references: [profiles.userId] }),
  dailyReports: many(dailyReports),
  weeklyReports: many(weeklyReports),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, { fields: [profiles.userId], references: [users.id] }),
}));

export const dailyReportsRelations = relations(dailyReports, ({ one }) => ({
  user: one(users, { fields: [dailyReports.userId], references: [users.id] }),
}));

export const weeklyReportsRelations = relations(weeklyReports, ({ one }) => ({
  user: one(users, { fields: [weeklyReports.userId], references: [users.id] }),
}));
