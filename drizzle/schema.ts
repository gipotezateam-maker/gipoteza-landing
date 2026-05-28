import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// TODO: Add your tables here

// ─── Course tables ───────────────────────────────────────────────────────────

export const courseStudents = mysqlTable("course_students", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  accessToken: varchar("accessToken", { length: 128 }).notNull().unique(),
  isPaid: int("isPaid").default(0).notNull(), // 0 = free (lessons 1-3), 1 = paid (all)
  paymentId: varchar("paymentId", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const courseProgress = mysqlTable("course_progress", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("studentId").notNull(),
  lessonId: int("lessonId").notNull(), // 1-10
  completed: int("completed").default(0).notNull(),
  taskCompleted: int("taskCompleted").default(0).notNull(),
  completedAt: timestamp("completedAt"),
});

export type CourseStudent = typeof courseStudents.$inferSelect;
export type InsertCourseStudent = typeof courseStudents.$inferInsert;
export type CourseProgress = typeof courseProgress.$inferSelect;