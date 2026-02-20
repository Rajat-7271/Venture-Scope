import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  index?: number;
}

export function StatsCard({ title, value, change, trend, index = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className={cn(
          "px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1",
          trend === "up" && "bg-green-500/10 text-green-600",
          trend === "down" && "bg-red-500/10 text-red-600",
          trend === "neutral" && "bg-gray-500/10 text-gray-600"
        )}>
          {trend === "up" && <ArrowUpRight className="w-3 h-3" />}
          {trend === "down" && <ArrowDownRight className="w-3 h-3" />}
          {trend === "neutral" && <Minus className="w-3 h-3" />}
          {change}
        </div>
      </div>
      <div className="text-3xl font-display font-bold text-foreground tracking-tight">
        {value}
      </div>
    </motion.div>
  );
}
