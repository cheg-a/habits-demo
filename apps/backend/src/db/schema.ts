import {
  serial,
  text,
  timestamp,
  pgTable,
  integer,
  date,
  numeric,
  boolean,
  uniqueIndex,
  jsonb,
} from "drizzle-orm/pg-core"; // Added jsonb
import { relations } from "drizzle-orm"; // Import relations

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  isDefaultPassword: boolean("is_default_password").default(true).notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  bio: text("bio"),
  favoriteColor: text("favorite_color"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const dailyReports = pgTable(
  "daily_reports",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    date: text("date").notNull(), // Renamed from reportDate, changed to text
    gratitude: text("gratitude").notNull(),
    goal: text("goal").notNull(),
    motivation: integer("motivation"), // Assuming integer for motivation level value
    number: integer("number").default(1).notNull(), // Assuming this is a report number or ID
    mood: text("mood"), // Kept as text, can store emoji or label
    influence: text("influence"),
    habits: jsonb("habits").notNull(), // To store array of habit objects
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      userIdDateIdx: uniqueIndex("user_id_date_idx").on(
        table.userId,
        table.date,
      ), // Updated index
    };
  },
);

export const questionnaires = pgTable("questionnaires", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  answers: jsonb("answers").notNull(), // Using jsonb to store questionnaire answers
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const weeklyReports = pgTable(
  "weekly_reports",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    date: text("date").notNull(),
    successfulStrategies: text("successful_strategies").notNull(),
    difficulties: text("difficulties").notNull(),
    influences: text("influences").notNull(),
    changes: text("changes").notNull(),
    copingStrategies: text("coping_strategies").notNull(),
    nextWeekGoals: text("next_week_goals").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      weeklyUserIdDateIdx: uniqueIndex("weekly_user_id_date_idx").on(
        table.userId,
        table.date,
      ),
    };
  },
);

export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  city: text("city"),
  latitude: numeric("latitude"),
  longitude: numeric("longitude"),
  description: text("description").notNull(),
  category: text("category"),
  filePath: text("file_path").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Define relations
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, { fields: [users.id], references: [profiles.userId] }),
  dailyReports: many(dailyReports),
  weeklyReports: many(weeklyReports),
  questionnaires: many(questionnaires), // Added relation to questionnaires
  photos: many(photos),
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

export const photosRelations = relations(photos, ({ one }) => ({
  user: one(users, { fields: [photos.userId], references: [users.id] }),
}));

// Schema for Questionnaires
// Relations for Questionnaires
export const questionnairesRelations = relations(questionnaires, ({ one }) => ({
  user: one(users, { fields: [questionnaires.userId], references: [users.id] }),
}));
