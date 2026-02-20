import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Activity } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface ActivityListProps {
  activities: Activity[];
}

export function ActivityList({ activities }: ActivityListProps) {
  return (
    <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border/50 bg-secondary/20">
        <h3 className="font-display font-bold text-lg">Recent Activity</h3>
      </div>
      <div className="divide-y divide-border/50">
        {activities.map((activity) => (
          <div key={activity.id} className="p-4 flex items-center gap-4 hover:bg-secondary/30 transition-colors">
            <Avatar className="h-10 w-10 border border-border">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activity.user}`} />
              <AvatarFallback>{activity.user.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                <span className="font-bold">{activity.user}</span> {activity.action} <span className="text-primary font-medium">{activity.target}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No recent activity found.
          </div>
        )}
      </div>
    </div>
  );
}
