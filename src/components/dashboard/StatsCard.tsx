import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  color?: "blue" | "green" | "orange" | "purple";
  className?: string;
}

const colorMap = {
  blue: "from-blue-500 to-blue-600",
  green: "from-emerald-500 to-emerald-600", 
  orange: "from-orange-500 to-orange-600",
  purple: "from-purple-500 to-purple-600",
};

export const StatsCard = ({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon: Icon, 
  color = "blue",
  className 
}: StatsCardProps) => {
  return (
    <Card className={cn("card-elevated p-6 relative overflow-hidden", className)}>
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
        <Icon className="w-full h-full" />
      </div>
      
      {/* Icon */}
      <div className={cn(
        "w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center mb-4",
        colorMap[color]
      )}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      
      {/* Content */}
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold text-foreground">{value}</h3>
          {change && (
            <span className={cn(
              "text-sm font-medium",
              changeType === "positive" && "text-success",
              changeType === "negative" && "text-destructive", 
              changeType === "neutral" && "text-muted-foreground"
            )}>
              {change}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};