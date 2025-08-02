import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Eye, Heart, MessageSquare, Users, Calendar, Target } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Analytics() {
  const { profile } = useAuth();

  const analyticsData = [
    { label: 'Profile Views', value: 2847, change: +12, icon: Eye },
    { label: 'Likes Received', value: 1235, change: +8, icon: Heart },
    { label: 'Messages', value: 89, change: -3, icon: MessageSquare },
    { label: 'Followers Growth', value: 156, change: +15, icon: Users },
  ];

  const monthlyData = [
    { month: 'Jan', views: 1200, likes: 800, messages: 45 },
    { month: 'Feb', views: 1850, likes: 950, messages: 62 },
    { month: 'Mar', views: 2100, likes: 1100, messages: 78 },
    { month: 'Apr', views: 2450, likes: 1200, messages: 85 },
    { month: 'May', views: 2847, likes: 1235, messages: 89 },
  ];

  const topPerformingContent = [
    { title: 'Tech Review: Latest Smartphone', views: 12500, engagement: 8.2 },
    { title: 'Morning Routine for Productivity', views: 9800, engagement: 7.5 },
    { title: 'Travel Vlog: Japan Adventure', views: 8200, engagement: 9.1 },
    { title: 'Fitness Challenge Week 1', views: 6700, engagement: 6.8 },
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-3">
        <TrendingUp className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Track your performance and engagement metrics</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsData.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value.toLocaleString()}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {metric.change > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={metric.change > 0 ? 'text-green-500' : 'text-red-500'}>
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>Your engagement metrics over the last 5 months</CardDescription>
        </CardHeader>
        <CardContent>
          <PerformanceChart />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Top Performing Content
            </CardTitle>
            <CardDescription>Your most successful posts this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topPerformingContent.map((content, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-1">{content.title}</h4>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {content.views.toLocaleString()} views
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {content.engagement}% engagement
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Engagement Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Engagement Breakdown
            </CardTitle>
            <CardDescription>How your audience interacts with your content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Likes</span>
                <span>68%</span>
              </div>
              <Progress value={68} className="h-2" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Comments</span>
                <span>22%</span>
              </div>
              <Progress value={22} className="h-2" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Shares</span>
                <span>10%</span>
              </div>
              <Progress value={10} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audience Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Audience Insights</CardTitle>
          <CardDescription>Understanding your audience demographics and behavior</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h4 className="font-medium mb-2">Top Age Group</h4>
              <div className="text-2xl font-bold text-primary">25-34</div>
              <p className="text-sm text-muted-foreground">42% of your audience</p>
            </div>
            <div className="text-center">
              <h4 className="font-medium mb-2">Primary Gender</h4>
              <div className="text-2xl font-bold text-primary">Female</div>
              <p className="text-sm text-muted-foreground">58% of your audience</p>
            </div>
            <div className="text-center">
              <h4 className="font-medium mb-2">Top Location</h4>
              <div className="text-2xl font-bold text-primary">United States</div>
              <p className="text-sm text-muted-foreground">35% of your audience</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}