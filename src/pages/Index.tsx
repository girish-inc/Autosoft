import { MainLayout } from "@/components/layout/MainLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Car, Users, DollarSign, Wrench, TrendingUp, Calendar } from "lucide-react";
import dealershipHero from "@/assets/dealership-hero.jpg";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Index = () => {
  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) return "Good Morning";
    if (currentHour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Welcome Section with Hero */}
        <div 
          className="relative rounded-xl overflow-hidden bg-gradient-to-r from-primary via-primary-glow to-accent p-8 text-primary-foreground"
          style={{
            backgroundImage: `linear-gradient(135deg, hsla(var(--primary), 0.95), hsla(var(--primary-glow), 0.85)), url(${dealershipHero})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                  {getGreeting()}, John! 👋
                </h1>
                <p className="text-lg opacity-90 mb-4">
                  Welcome back to Autosoft. Here's what's happening at your dealership today.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                    View Sales Report
                  </Button>
                  <Button variant="outline" className="bg-transparent text-white border-white/50 hover:bg-white/10">
                    Schedule Meeting
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-4 text-right">
                <div>
                  <div className="text-sm opacity-80">Today's Date</div>
                  <div className="text-xl font-semibold">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long',
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Vehicles"
            value={248}
            change="+12 this week"
            changeType="positive"
            icon={Car}
            color="blue"
          />
          <StatsCard
            title="Active Customers"
            value={1856}
            change="+8.2%"
            changeType="positive"
            icon={Users}
            color="green"
          />
          <StatsCard
            title="Monthly Sales"
            value="$486K"
            change="+15.3%"
            changeType="positive"
            icon={DollarSign}
            color="purple"
          />
          <StatsCard
            title="Service Orders"
            value={42}
            change="6 pending"
            changeType="neutral"
            icon={Wrench}
            color="orange"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <QuickActions />
            
            {/* Sales Performance Chart Placeholder */}
            <Card className="card-elevated p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Sales Performance</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="w-4 h-4" />
                  +12% from last month
                </div>
              </div>
              <div className="h-64 bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg flex items-center justify-center">
                <div className="text-center space-y-2">
                  <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">Sales Chart Component</p>
                  <p className="text-sm text-muted-foreground">Interactive charts coming soon</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <RecentActivity />
            
            {/* Upcoming Appointments */}
            <Card className="card-elevated p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg">Today's Schedule</h3>
              </div>
              <div className="space-y-3">
                {[
                  { time: "9:00 AM", event: "Team Meeting", type: "meeting" },
                  { time: "11:30 AM", event: "Customer Consultation", type: "appointment" },
                  { time: "2:00 PM", event: "Vehicle Inspection", type: "service" },
                  { time: "4:30 PM", event: "Sales Follow-up", type: "call" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="w-2 h-8 bg-gradient-to-b from-primary to-primary-glow rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.event}</div>
                      <div className="text-xs text-muted-foreground">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
