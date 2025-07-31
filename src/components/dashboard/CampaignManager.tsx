import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Calendar,
  DollarSign,
  Users,
  BarChart3,
  Settings,
  Play,
  Pause,
  MoreHorizontal,
  TrendingUp,
  Target,
  Clock,
  CheckCircle
} from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  creators: number;
  reach: number;
  engagement: number;
  conversions: number;
  description: string;
  objectives: string[];
}

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Summer Collection Launch",
    status: "active",
    budget: 45000,
    spent: 38250,
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    creators: 8,
    reach: 2400000,
    engagement: 4.2,
    conversions: 1250,
    description: "Promoting our new summer fashion line with lifestyle influencers",
    objectives: ["Brand Awareness", "Sales", "Engagement"]
  },
  {
    id: "2",
    name: "Tech Product Reviews",
    status: "active",
    budget: 25000,
    spent: 15000,
    startDate: "2024-07-15",
    endDate: "2024-09-15",
    creators: 5,
    reach: 1800000,
    engagement: 5.8,
    conversions: 850,
    description: "Getting our new tech products reviewed by top tech influencers",
    objectives: ["Product Reviews", "Credibility", "Sales"]
  },
  {
    id: "3",
    name: "Fashion Week Coverage",
    status: "draft",
    budget: 35000,
    spent: 0,
    startDate: "2024-09-01",
    endDate: "2024-09-30",
    creators: 0,
    reach: 0,
    engagement: 0,
    conversions: 0,
    description: "Fashion week event coverage and behind-the-scenes content",
    objectives: ["Event Coverage", "Brand Presence", "Content Creation"]
  }
];

const campaignTemplates = [
  {
    name: "Product Launch",
    description: "Comprehensive product launch campaign template",
    budget: "$15K - $50K",
    duration: "6-8 weeks",
    creators: "5-10 creators"
  },
  {
    name: "Brand Awareness",
    description: "Build brand recognition and reach new audiences",
    budget: "$10K - $30K",
    duration: "4-6 weeks",
    creators: "8-15 creators"
  },
  {
    name: "Event Coverage",
    description: "Real-time event coverage and content creation",
    budget: "$5K - $20K",
    duration: "1-2 weeks",
    creators: "3-8 creators"
  }
];

export function CampaignManager() {
  const [selectedTab, setSelectedTab] = useState("active");

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-corporate-success text-white';
      case 'draft': return 'bg-corporate-gray text-white';
      case 'paused': return 'bg-corporate-warning text-white';
      case 'completed': return 'bg-corporate-blue text-white';
      default: return 'bg-corporate-gray text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="h-3 w-3" />;
      case 'draft': return <Clock className="h-3 w-3" />;
      case 'paused': return <Pause className="h-3 w-3" />;
      case 'completed': return <CheckCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const filteredCampaigns = mockCampaigns.filter(campaign => {
    if (selectedTab === 'all') return true;
    return campaign.status === selectedTab;
  });

  return (
    <Card className="border border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-corporate-gray-dark">Campaign Manager</CardTitle>
            <CardDescription>Create, manage, and optimize your influencer campaigns</CardDescription>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Templates
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Campaign Templates</DialogTitle>
                  <DialogDescription>
                    Choose from pre-built templates to quickly create new campaigns
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {campaignTemplates.map((template, index) => (
                    <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <h3 className="font-medium text-corporate-gray-dark mb-2">{template.name}</h3>
                        <p className="text-sm text-corporate-gray mb-3">{template.description}</p>
                        <div className="space-y-1 text-xs text-corporate-gray">
                          <div>Budget: {template.budget}</div>
                          <div>Duration: {template.duration}</div>
                          <div>Creators: {template.creators}</div>
                        </div>
                        <Button size="sm" className="w-full mt-3">Use Template</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Create Campaign
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="paused">Paused</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="mt-6">
            <div className="space-y-4">
              {filteredCampaigns.map((campaign) => (
                <Card key={campaign.id} className="border border-border hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-corporate-gray-dark">
                            {campaign.name}
                          </h3>
                          <Badge className={`${getStatusColor(campaign.status)} gap-1`}>
                            {getStatusIcon(campaign.status)}
                            {campaign.status}
                          </Badge>
                        </div>
                        <p className="text-corporate-gray text-sm mb-3">{campaign.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {campaign.objectives.map((objective, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {objective}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Campaign Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                      <div className="text-center p-3 bg-corporate-gray-light rounded-lg">
                        <div className="flex items-center justify-center gap-1 text-corporate-gray mb-1">
                          <DollarSign className="h-4 w-4" />
                          <span className="text-xs">Budget</span>
                        </div>
                        <div className="text-lg font-bold text-corporate-gray-dark">
                          ${formatNumber(campaign.budget)}
                        </div>
                        <div className="text-xs text-corporate-gray">
                          ${formatNumber(campaign.spent)} spent
                        </div>
                      </div>

                      <div className="text-center p-3 bg-corporate-gray-light rounded-lg">
                        <div className="flex items-center justify-center gap-1 text-corporate-gray mb-1">
                          <Users className="h-4 w-4" />
                          <span className="text-xs">Creators</span>
                        </div>
                        <div className="text-lg font-bold text-corporate-gray-dark">
                          {campaign.creators}
                        </div>
                      </div>

                      <div className="text-center p-3 bg-corporate-gray-light rounded-lg">
                        <div className="flex items-center justify-center gap-1 text-corporate-gray mb-1">
                          <Target className="h-4 w-4" />
                          <span className="text-xs">Reach</span>
                        </div>
                        <div className="text-lg font-bold text-corporate-gray-dark">
                          {formatNumber(campaign.reach)}
                        </div>
                      </div>

                      <div className="text-center p-3 bg-corporate-gray-light rounded-lg">
                        <div className="flex items-center justify-center gap-1 text-corporate-gray mb-1">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-xs">Engagement</span>
                        </div>
                        <div className="text-lg font-bold text-corporate-gray-dark">
                          {campaign.engagement}%
                        </div>
                      </div>

                      <div className="text-center p-3 bg-corporate-gray-light rounded-lg">
                        <div className="flex items-center justify-center gap-1 text-corporate-gray mb-1">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-xs">Conversions</span>
                        </div>
                        <div className="text-lg font-bold text-corporate-gray-dark">
                          {formatNumber(campaign.conversions)}
                        </div>
                      </div>
                    </div>

                    {/* Progress and Timeline */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm text-corporate-gray">
                        <span>Budget Progress</span>
                        <span>{Math.round((campaign.spent / campaign.budget) * 100)}% used</span>
                      </div>
                      <Progress 
                        value={(campaign.spent / campaign.budget) * 100} 
                        className="h-2"
                      />
                      
                      <div className="flex items-center justify-between text-sm text-corporate-gray mt-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{campaign.startDate} - {campaign.endDate}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View Details</Button>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredCampaigns.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-corporate-gray-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-corporate-gray" />
                </div>
                <h3 className="text-lg font-medium text-corporate-gray-dark mb-2">
                  No {selectedTab} campaigns
                </h3>
                <p className="text-corporate-gray mb-4">
                  Get started by creating your first campaign
                </p>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Campaign
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}