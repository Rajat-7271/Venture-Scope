import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const metrics = pgTable("metrics", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  value: text("value").notNull(),
  change: text("change").notNull(),
  trend: text("trend", { enum: ["up", "down", "neutral"] }).notNull(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  user: text("user").notNull(),
  action: text("action").notNull(),
  target: text("target").notNull(),
  time: timestamp("time").notNull().defaultNow(),
});

// Zod schemas for inserting
export const insertMetricSchema = createInsertSchema(metrics).omit({ id: true });
export const insertActivitySchema = createInsertSchema(activities).omit({ id: true });

// Types
export type Metric = typeof metrics.$inferSelect;
export type InsertMetric = z.infer<typeof insertMetricSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

// API Request/Response Types
export type DashboardDataResponse = {
  metrics: Metric[];
  recentActivities: Activity[];
};
