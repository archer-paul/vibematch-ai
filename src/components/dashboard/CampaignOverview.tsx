import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PerformanceChart } from "./PerformanceChart";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Target, 
  AlertTriangle,
  Plus,
  Filter,
  Download
} from "lucide-react";

const kpiData = [
  {
    title: "Total Budget",
    value: "$125,000",
    change: "+12.5%",
    trend: "up" as const,
    icon: DollarSign,
    description: "Active campaigns budget"
  },
  {
    title: "Active Campaigns",
    value: "8",
    change: "+2",
    trend: "up" as const,
    icon: Target,
    description: "Currently running"
  },
  {
    title: "Engaged Creators",
    value: "42",
    change: "+15%",
    trend: "up" as const,
    icon: Users,
    description: "This month"
  },
  {
    title: "Avg. ROI",
    value: "3.2x",
    change: "-0.1x",
    trend: "down" as const,
    icon: TrendingUp,
    description: "Return on investment"
  }
];

const alerts = [
  {
    type: "warning" as const,
    title: "Campaign Budget Alert",
    message: "Summer Collection campaign is 85% through budget",
    action: "Review Budget"
  },
  {
    type: "success" as const,
    title: "High Performance",
    message: "Tech Review campaign exceeded engagement targets by 120%",
    action: "View Details"
  },
  {
    type: "info" as const,
    title: "New Recommendations",
    message: "5 new creator matches available for your Fashion campaign",
    action: "View Creators"
  }
];

const quickActions = [
  { label: "Create Campaign", icon: Plus, variant: "default" as const },
  { label: "Filter Reports", icon: Filter, variant: "outline" as const },
  { label: "Export Data", icon: Download, variant: "outline" as const }
];

export function CampaignOverview() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-corporate-gray-dark">Campaign Overview</h2>
          <p className="text-corporate-gray">Monitor your active campaigns and performance metrics</p>
        </div>
        <div className="flex gap-2">
          {quickActions.map((action, index) => (
            <Button key={index} variant={action.variant} size="sm" className="gap-2">
              <action.icon className="h-4 w-4" />
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="border border-border hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-corporate-blue/10 rounded-lg">
                    <kpi.icon className="h-5 w-5 text-corporate-blue" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-corporate-gray">{kpi.title}</p>
                    <p className="text-2xl font-bold text-corporate-gray-dark">{kpi.value}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    kpi.trend === 'up' ? 'text-corporate-success' : 'text-corporate-danger'
                  }`}>
                    {kpi.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {kpi.change}
                  </div>
                  <p className="text-xs text-corporate-gray mt-1">{kpi.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Chart and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-corporate-gray-dark">Campaign Performance</CardTitle>
            <CardDescription>Revenue and engagement over time</CardDescription>
          </CardHeader>
          <CardContent>
            <PerformanceChart />
          </CardContent>
        </Card>

        {/* Alerts & Notifications */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-corporate-gray-dark flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-corporate-warning" />
              Alerts & Notifications
            </CardTitle>
            <CardDescription>Important updates and recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg border border-border">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  alert.type === 'warning' ? 'bg-corporate-warning' :
                  alert.type === 'success' ? 'bg-corporate-success' :
                  'bg-corporate-blue'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-corporate-gray-dark">{alert.title}</p>
                  <p className="text-sm text-corporate-gray">{alert.message}</p>
                  <Button variant="link" size="sm" className="h-auto p-0 mt-1 text-corporate-blue">
                    {alert.action}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Campaign Status Overview */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="text-corporate-gray-dark">Active Campaign Status</CardTitle>
          <CardDescription>Track progress of your current campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "Summer Collection Launch", budget: 45000, spent: 38250, status: "active", progress: 85 },
              { name: "Tech Product Reviews", budget: 25000, spent: 15000, status: "active", progress: 60 },
              { name: "Fashion Week Coverage", budget: 35000, spent: 8750, status: "planning", progress: 25 }
            ].map((campaign, index) => (
              <div key={index} className="p-4 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-corporate-gray-dark">{campaign.name}</h4>
                  <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                    {campaign.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-corporate-gray">
                    <span>Budget: ${campaign.budget.toLocaleString()}</span>
                    <span>Spent: ${campaign.spent.toLocaleString()}</span>
                  </div>
                  <Progress value={campaign.progress} className="h-2" />
                  <p className="text-xs text-corporate-gray">{campaign.progress}% of budget used</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}