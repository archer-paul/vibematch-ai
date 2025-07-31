import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { TrendingUp, Users, Eye, Heart } from 'lucide-react';

const engagementData = [
  { month: 'Jan', engagement: 4.2, followers: 45000, views: 120000 },
  { month: 'Feb', engagement: 4.8, followers: 48000, views: 140000 },
  { month: 'Mar', engagement: 5.1, followers: 52000, views: 165000 },
  { month: 'Apr', engagement: 4.9, followers: 56000, views: 180000 },
  { month: 'May', engagement: 5.4, followers: 61000, views: 210000 },
  { month: 'Jun', engagement: 5.8, followers: 67000, views: 245000 },
];

const campaignData = [
  { month: 'Jan', campaigns: 2, revenue: 3200 },
  { month: 'Feb', campaigns: 3, revenue: 4800 },
  { month: 'Mar', campaigns: 4, revenue: 7200 },
  { month: 'Apr', campaigns: 3, revenue: 5400 },
  { month: 'May', campaigns: 5, revenue: 9600 },
  { month: 'Jun', campaigns: 6, revenue: 12800 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg p-3 shadow-lg">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.dataKey}: {entry.value.toLocaleString()}
            {entry.dataKey === 'engagement' && '%'}
            {entry.dataKey === 'revenue' && '$'}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function PerformanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Performance Analytics
        </CardTitle>
        <CardDescription>
          Track your growth and campaign performance over time
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="engagement" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="engagement" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Engagement
            </TabsTrigger>
            <TabsTrigger value="growth" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Growth
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Campaigns
            </TabsTrigger>
          </TabsList>

          <TabsContent value="engagement" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="month" 
                    className="text-muted-foreground"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    className="text-muted-foreground"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="engagement" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">5.8%</div>
                <div className="text-sm text-muted-foreground">Current Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">+1.6%</div>
                <div className="text-sm text-muted-foreground">vs Last Month</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="growth" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="month" 
                    className="text-muted-foreground"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    className="text-muted-foreground"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="followers" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="views" 
                    stroke="rgb(59, 130, 246)" 
                    fill="rgb(59, 130, 246)"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">67K</div>
                <div className="text-sm text-muted-foreground">Total Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">245K</div>
                <div className="text-sm text-muted-foreground">Monthly Views</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campaignData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="month" 
                    className="text-muted-foreground"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    className="text-muted-foreground"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="revenue" 
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">$12.8K</div>
                <div className="text-sm text-muted-foreground">This Month</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">6</div>
                <div className="text-sm text-muted-foreground">Active Campaigns</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}