import { Plus, Search, FileText, Users, Car, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const actions = [
  { icon: Plus, label: "Add Vehicle", variant: "gradient" as const },
  { icon: Users, label: "New Customer", variant: "metallic" as const },
  { icon: Search, label: "Search Inventory", variant: "outline" as const },
  { icon: FileText, label: "Create Report", variant: "secondary" as const },
  { icon: Wrench, label: "Schedule Service", variant: "outline" as const },
  { icon: Car, label: "Vehicle Check-in", variant: "premium" as const },
];

export const QuickActions = () => {
  return (
    <Card className="card-elevated p-6">
      <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.label}
              variant={action.variant}
              className="h-12 flex-col gap-1 text-xs"
            >
              <Icon className="w-4 h-4" />
              {action.label}
            </Button>
          );
        })}
      </div>
    </Card>
  );
};