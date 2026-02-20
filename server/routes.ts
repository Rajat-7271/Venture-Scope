import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.dashboard.get.path, async (_req, res) => {
    try {
      const [metrics, recentActivities] = await Promise.all([
        storage.getMetrics(),
        storage.getRecentActivities(5),
      ]);
      res.json({ metrics, recentActivities });
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Seed the database
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  try {
    const existingMetrics = await storage.getMetrics();
    if (existingMetrics.length === 0) {
      console.log("Seeding metrics...");
      await storage.createMetric({ name: "Total Revenue", value: "$45,231.89", change: "+20.1% from last month", trend: "up" });
      await storage.createMetric({ name: "Subscriptions", value: "+2350", change: "+180.1% from last month", trend: "up" });
      await storage.createMetric({ name: "Sales", value: "+12,234", change: "+19% from last month", trend: "up" });
      await storage.createMetric({ name: "Active Now", value: "+573", change: "+201 since last hour", trend: "up" });
    }

    const existingActivities = await storage.getRecentActivities(1);
    if (existingActivities.length === 0) {
      console.log("Seeding activities...");
      await storage.createActivity({ user: "Olivia Martin", action: "created", target: "a new project" });
      await storage.createActivity({ user: "Jackson Lee", action: "updated", target: "their billing plan" });
      await storage.createActivity({ user: "Isabella Nguyen", action: "joined", target: "the team" });
      await storage.createActivity({ user: "William Kim", action: "completed", target: "onboarding" });
      await storage.createActivity({ user: "Sofia Davis", action: "invited", target: "2 new members" });
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
