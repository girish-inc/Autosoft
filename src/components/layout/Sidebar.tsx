import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Car, 
  Users, 
  DollarSign, 
  Wrench, 
  UserCheck, 
  MessageSquare, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Home
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: Car, label: "Vehicle Inventory", path: "/inventory" },
  { icon: Users, label: "Customers", path: "/customers" },
  { icon: DollarSign, label: "Sales Tracking", path: "/sales" },
  { icon: Wrench, label: "Service & Repairs", path: "/service" },
  { icon: UserCheck, label: "Employee Records", path: "/employees" },
  { icon: MessageSquare, label: "Inquiries", path: "/inquiries" },
  { icon: BarChart3, label: "Reports & Analytics", path: "/reports" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export const Sidebar = ({ className }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const activeItem = location.pathname;

  return (
    <div className={cn(
      "flex flex-col h-full bg-gradient-to-b from-primary to-primary-glow border-r border-border/50 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent-glow rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-lg text-primary-foreground">
              Autosoft
            </span>
          </div>
        )}
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-primary-foreground transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.path;
            
            return (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-white/20 text-primary-foreground shadow-lg"
                      : "text-primary-foreground/70 hover:bg-white/10 hover:text-primary-foreground"
                  )}
                >
                  <Icon className={cn("w-5 h-5 flex-shrink-0")} />
                  {!isCollapsed && (
                    <span className="font-medium truncate">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        {!isCollapsed && (
          <div className="text-xs text-primary-foreground/60 text-center">
            © 2024 Autosoft
            <br />
            Dealership Suite
          </div>
        )}
      </div>
    </div>
  );
};