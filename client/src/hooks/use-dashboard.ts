import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

// Infer types from the route schema
type DashboardData = z.infer<typeof api.dashboard.get.responses[200]>;

export function useDashboard() {
  return useQuery<DashboardData>({
    queryKey: [api.dashboard.get.path],
    queryFn: async () => {
      const res = await fetch(api.dashboard.get.path);
      if (!res.ok) {
        throw new Error("Failed to fetch dashboard data");
      }
      const data = await res.json();
      return api.dashboard.get.responses[200].parse(data);
    },
    // Refresh every 30 seconds for "live" feel
    refetchInterval: 30000, 
  });
}
