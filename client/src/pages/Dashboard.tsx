import { Sidebar } from "@/components/Sidebar";
import { StatsCard } from "@/components/StatsCard";
import { RevenueChart } from "@/components/RevenueChart";
import { ActivityList } from "@/components/ActivityList";
import { useDashboard } from "@/hooks/use-dashboard";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-destructive font-medium">
        Failed to load dashboard data.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Welcome back, here's what's happening today.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <Calendar className="w-4 h-4" />
                <span>Last 30 Days</span>
              </Button>
              <Button className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </Button>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {data?.metrics.map((metric, i) => (
              <StatsCard
                key={metric.id}
                index={i}
                title={metric.name}
                value={metric.value}
                change={metric.change}
                trend={metric.trend as "up" | "down" | "neutral"}
              />
            ))}
          </div>

          {/* Charts & Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2"
            >
              <RevenueChart />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-1"
            >
              <ActivityList activities={data?.recentActivities || []} />
            </motion.div>
          </div>

        </div>
      </main>
    </div>
  );
}
