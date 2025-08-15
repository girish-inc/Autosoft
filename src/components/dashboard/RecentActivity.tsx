import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

const activities = [
  {
    id: 1,
    type: "sale",
    message: "2023 BMW X5 sold to John Smith",
    time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    status: "completed",
  },
  {
    id: 2,
    type: "service",
    message: "Oil change completed for Honda Civic (Plate: ABC-123)",
    time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    status: "completed",
  },
  {
    id: 3,
    type: "inquiry",
    message: "New inquiry for 2024 Tesla Model 3",
    time: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    status: "pending",
  },
  {
    id: 4,
    type: "inventory",
    message: "2024 Mercedes C-Class added to inventory",
    time: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    status: "completed",
  },
  {
    id: 5,
    type: "appointment",
    message: "Service appointment scheduled for tomorrow",
    time: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    status: "scheduled",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-success text-success-foreground";
    case "pending":
      return "bg-warning text-warning-foreground";
    case "scheduled":
      return "bg-primary text-primary-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "sale":
      return "💰";
    case "service":
      return "🔧";
    case "inquiry":
      return "💬";
    case "inventory":
      return "🚗";
    case "appointment":
      return "📅";
    default:
      return "📋";
  }
};

export const RecentActivity = () => {
  return (
    <Card className="card-elevated p-6">
      <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="text-lg flex-shrink-0 mt-0.5">
              {getTypeIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground mb-1">{activity.message}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(activity.time, { addSuffix: true })}
                </span>
                <Badge variant="secondary" className={getStatusColor(activity.status)}>
                  {activity.status}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};