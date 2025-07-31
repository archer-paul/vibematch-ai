import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  Heart, 
  MessageCircle, 
  Share, 
  DollarSign,
  Star,
  AlertCircle,
  Target,
  MapPin,
  Calendar
} from "lucide-react";

const audienceData = [
  { age: "18-24", percentage: 35, gender: { male: 45, female: 55 } },
  { age: "25-34", percentage: 40, gender: { male: 42, female: 58 } },
  { age: "35-44", percentage: 20, gender: { male: 48, female: 52 } },
  { age: "45+", percentage: 5, gender: { male: 50, female: 50 } }
];

const engagementData = [
  { month: "Jan", likes: 12000, comments: 850, shares: 420, saves: 680 },
  { month: "Feb", likes: 15000, comments: 920, shares: 580, saves: 750 },
  { month: "Mar", likes: 18000, comments: 1200, shares: 690, saves: 890 },
  { month: "Apr", likes: 22000, comments: 1350, shares: 780, saves: 920 },
  { month: "May", likes: 25000, comments: 1580, shares: 850, saves: 1100 },
  { month: "Jun", likes: 28000, comments: 1720, shares: 920, saves: 1250 }
];

const locationData = [
  { country: "United States", percentage: 45, color: "#3b82f6" },
  { country: "Canada", percentage: 15, color: "#10b981" },
  { country: "United Kingdom", percentage: 12, color: "#f59e0b" },
  { country: "Australia", percentage: 10, color: "#ef4444" },
  { country: "Germany", percentage: 8, color: "#8b5cf6" },
  { country: "Others", percentage: 10, color: "#6b7280" }
];

const performanceMetrics = [
  { metric: "Engagement Rate", value: "4.2%", trend: "+0.3%", status: "good" },
  { metric: "Reach Growth", value: "+15%", trend: "+2%", status: "excellent" },
  { metric: "Follower Quality", value: "87%", trend: "-1%", status: "good" },
  { metric: "Brand Safety", value: "95%", trend: "+0%", status: "excellent" }
];

const riskFactors = [
  { factor: "Engagement Drop", risk: "Low", impact: "Medium", probability: 20 },
  { factor: "Follower Authenticity", risk: "Very Low", impact: "High", probability: 5 },
  { factor: "Content Consistency", risk: "Medium", impact: "Low", probability: 40 },
  { factor: "Brand Alignment", risk: "Low", impact: "Medium", probability: 15 }
];

const roiPredictions = [
  { campaign: "Fashion", investment: 5000, predicted: 16500, confidence: 85 },
  { campaign: "Tech Review", investment: 3000, predicted: 12000, confidence: 92 },
  { campaign: "Lifestyle", investment: 4000, predicted: 14800, confidence: 78 }
];

export function CreatorAnalytics() {
  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'very low': return 'text-corporate-success';
      case 'low': return 'text-corporate-success';
      case 'medium': return 'text-corporate-warning';
      case 'high': return 'text-corporate-danger';
      default: return 'text-corporate-gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-corporate-success';
      case 'good': return 'text-corporate-blue';
      case 'average': return 'text-corporate-warning';
      case 'poor': return 'text-corporate-danger';
      default: return 'text-corporate-gray';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-corporate-gray-dark">Creator Analytics Deep Dive</h2>
          <p className="text-corporate-gray">Comprehensive analysis of creator performance and audience insights</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="sarah-chen">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Creator" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sarah-chen">Sarah Chen</SelectItem>
              <SelectItem value="marcus-rodriguez">Marcus Rodriguez</SelectItem>
              <SelectItem value="emma-thompson">Emma Thompson</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">Generate Report</Button>
        </div>
      </div>

      {/* Creator Overview */}
      <Card className="border border-border">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg" alt="Sarah Chen" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-corporate-gray-dark">Sarah Chen</h3>
                <Badge className="bg-corporate-success text-white">Verified</Badge>
                <div className="flex items-center gap-1 text-corporate-warning">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-medium">4.9</span>
                </div>
              </div>
              <div className="flex gap-4 text-sm text-corporate-gray">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Los Angeles, CA
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Member since 2019
                </span>
              </div>
              <div className="flex gap-1 mt-2">
                {["Fashion", "Lifestyle", "Beauty"].map((tag, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-corporate-gray-dark">125K</div>
              <div className="text-sm text-corporate-gray">Followers</div>
              <div className="text-sm text-corporate-success">+12% this month</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="audience" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="roi">ROI & Risk</TabsTrigger>
        </TabsList>

        {/* Audience Demographics */}
        <TabsContent value="audience" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-corporate-gray-dark">Age Distribution</CardTitle>
                <CardDescription>Audience breakdown by age groups</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {audienceData.map((age, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-corporate-gray-dark">{age.age}</span>
                        <span className="text-corporate-gray">{age.percentage}%</span>
                      </div>
                      <Progress value={age.percentage} className="h-2" />
                      <div className="flex gap-4 text-xs text-corporate-gray">
                        <span>Male: {age.gender.male}%</span>
                        <span>Female: {age.gender.female}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-corporate-gray-dark">Geographic Distribution</CardTitle>
                <CardDescription>Top locations of followers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={locationData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="percentage"
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                      >
                        {locationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Engagement Patterns */}
        <TabsContent value="engagement" className="space-y-6">
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-corporate-gray-dark">Engagement Trends</CardTitle>
              <CardDescription>Monthly engagement metrics over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="likes" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="comments" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="shares" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: "Avg. Likes", value: "21.5K", icon: Heart, color: "text-corporate-danger" },
              { label: "Avg. Comments", value: "1.4K", icon: MessageCircle, color: "text-corporate-blue" },
              { label: "Avg. Shares", value: "750", icon: Share, color: "text-corporate-success" },
              { label: "Engagement Rate", value: "4.2%", icon: TrendingUp, color: "text-corporate-warning" }
            ].map((metric, index) => (
              <Card key={index} className="border border-border">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <metric.icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-corporate-gray-dark">{metric.value}</div>
                  <div className="text-sm text-corporate-gray">{metric.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Performance Metrics */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-corporate-gray-dark">Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators and trends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div>
                      <div className="font-medium text-corporate-gray-dark">{metric.metric}</div>
                      <div className={`text-lg font-bold ${getStatusColor(metric.status)}`}>
                        {metric.value}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${
                        metric.trend.startsWith('+') ? 'text-corporate-success' : 'text-corporate-danger'
                      }`}>
                        {metric.trend}
                      </div>
                      <Badge variant={metric.status === 'excellent' ? 'default' : 'secondary'}>
                        {metric.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-corporate-gray-dark">Content Performance</CardTitle>
                <CardDescription>Best performing content types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: "Product Showcases", performance: 95, avgEngagement: "5.2%" },
                    { type: "Behind the Scenes", performance: 87, avgEngagement: "4.8%" },
                    { type: "Tutorials", performance: 82, avgEngagement: "4.1%" },
                    { type: "Lifestyle Posts", performance: 79, avgEngagement: "3.9%" }
                  ].map((content, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-corporate-gray-dark">{content.type}</span>
                        <span className="text-corporate-gray">{content.avgEngagement}</span>
                      </div>
                      <Progress value={content.performance} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ROI & Risk Assessment */}
        <TabsContent value="roi" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-corporate-gray-dark flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-corporate-success" />
                  ROI Predictions
                </CardTitle>
                <CardDescription>Projected returns for different campaign types</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {roiPredictions.map((prediction, index) => (
                  <div key={index} className="p-4 rounded-lg border border-border">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-corporate-gray-dark">{prediction.campaign}</h4>
                      <Badge variant="outline" className="text-corporate-blue">
                        {prediction.confidence}% confidence
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-corporate-gray">Investment</span>
                        <div className="font-bold text-corporate-gray-dark">
                          ${prediction.investment.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-corporate-gray">Predicted Return</span>
                        <div className="font-bold text-corporate-success">
                          ${prediction.predicted.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-sm">
                      <span className="text-corporate-gray">ROI: </span>
                      <span className="font-bold text-corporate-success">
                        {((prediction.predicted / prediction.investment - 1) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-corporate-gray-dark flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-corporate-warning" />
                  Risk Assessment
                </CardTitle>
                <CardDescription>Potential risks and mitigation strategies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {riskFactors.map((risk, index) => (
                  <div key={index} className="p-4 rounded-lg border border-border">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-corporate-gray-dark">{risk.factor}</h4>
                      <Badge className={`${getRiskColor(risk.risk)} bg-transparent border`}>
                        {risk.risk}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-corporate-gray">Impact: {risk.impact}</span>
                        <span className="text-corporate-gray">Probability: {risk.probability}%</span>
                      </div>
                      <Progress value={risk.probability} className="h-2" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}