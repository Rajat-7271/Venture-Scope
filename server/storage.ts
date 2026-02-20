import { db } from "./db";
import {
  metrics,
  activities,
  type Metric,
  type Activity,
} from "@shared/schema";
import { desc } from "drizzle-orm";

export interface IStorage {
  getMetrics(): Promise<Metric[]>;
  getRecentActivities(limit?: number): Promise<Activity[]>;
  createMetric(metric: Omit<Metric, "id">): Promise<Metric>;
  createActivity(activity: Omit<Activity, "id" | "time">): Promise<Activity>;
}

export class DatabaseStorage implements IStorage {
  async getMetrics(): Promise<Metric[]> {
    return await db.select().from(metrics);
  }

  async getRecentActivities(limit: number = 10): Promise<Activity[]> {
    return await db.select().from(activities).orderBy(desc(activities.time)).limit(limit);
  }

  async createMetric(metric: Omit<Metric, "id">): Promise<Metric> {
    const [newMetric] = await db.insert(metrics).values(metric).returning();
    return newMetric;
  }

  async createActivity(activity: Omit<Activity, "id" | "time">): Promise<Activity> {
    const [newActivity] = await db.insert(activities).values(activity).returning();
    return newActivity;
  }
}

export const storage = new DatabaseStorage();
