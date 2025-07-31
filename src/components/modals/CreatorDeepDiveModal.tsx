import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
  AreaChart,
  Area
} from "recharts";
import {
  Star,
  MapPin,
  Calendar,
  Users,
  TrendingUp,
  Heart,
  MessageCircle,
  Share,
  AlertTriangle,
  Shield,
  CheckCircle,
  X,
  Plus,
  MessageSquare,
  Bookmark,
  ExternalLink,
  BarChart3,
  Target
} from "lucide-react";

interface CreatorDeepDiveProps {
  isOpen: boolean;
  onClose: () => void;
  creatorId?: string;
}

const mockCreatorData = {
  id: "1",
  name: "Sarah Chen",
  avatar: "/placeholder.svg",
  verified: true,
  rating: 4.9,
  location: "Los Angeles, CA",
  memberSince: "2019",
  followers: 125000,
  engagement: 4.2,
  niches: ["Fashion", "Lifestyle", "Beauty"],
  platforms: ["Instagram", "TikTok", "YouTube"],
  bio: "Fashion & lifestyle content creator passionate about sustainable fashion and authentic storytelling. Collaborating with brands that align with my values.",
  stats: {
    totalPosts: 1247,
    avgLikes: 21500,
    avgComments: 1420,
    avgShares: 750,
    reachGrowth: 15,
    followerQuality: 87,
    brandSafety: 95
  },
  demographics: {
    age: [
      { range: "18-24", percentage: 35, male: 45, female: 55 },
      { range: "25-34", percentage: 40, male: 42, female: 58 },
      { range: "35-44", percentage: 20, male: 48, female: 52 },
      { range: "45+", percentage: 5, male: 50, female: 50 }
    ],
    locations: [
      { country: "United States", percentage: 45 },
      { country: "Canada", percentage: 15 },
      { country: "United Kingdom", percentage: 12 },
      { country: "Australia", percentage: 10 },
      { country: "Germany", percentage: 8 },
      { country: "Others", percentage: 10 }
    ]
  },
  recentPosts: [
    { id: 1, type: "image", likes: 24500, comments: 1820, shares: 890, engagement: 4.8 },
    { id: 2, type: "video", likes: 31200, comments: 2150, shares: 1240, engagement: 5.2 },
    { id: 3, type: "carousel", likes: 18900, comments: 1340, shares: 670, engagement: 3.9 },
    { id: 4, type: "story", likes: 15600, comments: 890, shares: 430, engagement: 3.2 }
  ],
  campaignHistory: [
    { brand: "Zara", type: "Fashion", roi: 4.2, reach: 450000, engagement: 4.8, date: "2024-03" },
    { brand: "Nike", type: "Sportswear", roi: 3.8, reach: 380000, engagement: 4.5, date: "2024-02" },
    { brand: "Sephora", type: "Beauty", roi: 5.1, reach: 520000, engagement: 5.2, date: "2024-01" }
  ],
  riskFactors: [
    { factor: "Fake Followers", risk: "Low", score: 5 },
    { factor: "Brand Safety", risk: "Very Low", score: 2 },
    { factor: "Engagement Drop", risk: "Low", score: 8 },
    { factor: "Content Consistency", risk: "Very Low", score: 3 }
  ]
};

export function CreatorDeepDiveModal({ isOpen, onClose }: CreatorDeepDiveProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const creator = mockCreatorData;

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'very low': return 'text-green-600 bg-green-50 border-green-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={creator.avatar} alt={creator.name} />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-3">
                  <DialogTitle className="text-2xl">{creator.name}</DialogTitle>
                  {creator.verified && (
                    <Badge className="bg-blue-500 text-white">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-medium">{creator.rating}</span>
                  </div>
                </div>
                <div className="flex gap-4 text-sm text-gray-600 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {creator.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Member since {creator.memberSince}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {creator.followers.toLocaleString()} followers
                  </span>
                </div>
                <div className="flex gap-1 mt-2">
                  {creator.niches.map((niche, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{niche}</Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Message
              </Button>
              <Button variant="outline" className="gap-2">
                <Bookmark className="h-4 w-4" />
                Save
              </Button>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add to Campaign
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 mt-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="audience">Audience</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto mt-4 space-y-6">
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6 m-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Creator Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Creator Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{creator.stats.totalPosts}</div>
                          <div className="text-sm text-gray-600">Total Posts</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{creator.engagement}%</div>
                          <div className="text-sm text-gray-600">Engagement</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">{creator.stats.avgLikes.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">Avg Likes</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">{creator.stats.avgComments.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">Avg Comments</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quality Scores */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Shield className="h-5 w-5 text-green-500" />
                        Quality Scores
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Follower Quality</span>
                            <span>{creator.stats.followerQuality}%</span>
                          </div>
                          <Progress value={creator.stats.followerQuality} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Brand Safety</span>
                            <span>{creator.stats.brandSafety}%</span>
                          </div>
                          <Progress value={creator.stats.brandSafety} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Reach Growth</span>
                            <span>+{creator.stats.reachGrowth}%</span>
                          </div>
                          <Progress value={75} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Risk Assessment */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        Risk Assessment
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {creator.riskFactors.map((risk, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded-lg border">
                          <span className="text-sm font-medium">{risk.factor}</span>
                          <Badge className={getRiskColor(risk.risk)}>
                            {risk.risk}
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Bio Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{creator.bio}</p>
                    <div className="flex gap-2 mt-4">
                      {creator.platforms.map((platform, i) => (
                        <Badge key={i} variant="outline" className="gap-1">
                          <ExternalLink className="h-3 w-3" />
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Content Tab */}
              <TabsContent value="content" className="space-y-6 m-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Posts Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {creator.recentPosts.map((post, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                <BarChart3 className="h-6 w-6 text-gray-500" />
                              </div>
                              <div>
                                <div className="font-medium capitalize">{post.type} Post</div>
                                <div className="text-sm text-gray-600">{post.engagement}% engagement</div>
                              </div>
                            </div>
                            <div className="text-right text-sm">
                              <div className="flex items-center gap-3 text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Heart className="h-3 w-3" />
                                  {post.likes.toLocaleString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageCircle className="h-3 w-3" />
                                  {post.comments.toLocaleString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Share className="h-3 w-3" />
                                  {post.shares.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Content Style Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { style: "Product Showcases", percentage: 40, color: "#3b82f6" },
                          { style: "Lifestyle Content", percentage: 30, color: "#10b981" },
                          { style: "Behind the Scenes", percentage: 20, color: "#f59e0b" },
                          { style: "Educational", percentage: 10, color: "#ef4444" }
                        ].map((style, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{style.style}</span>
                              <span>{style.percentage}%</span>
                            </div>
                            <Progress value={style.percentage} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Performance Tab */}
              <TabsContent value="performance" className="space-y-6 m-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Campaign History & ROI</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {creator.campaignHistory.map((campaign, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-medium">{campaign.brand}</h4>
                              <p className="text-sm text-gray-600">{campaign.type} • {campaign.date}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-600">{campaign.roi}x ROI</div>
                              <div className="text-sm text-gray-600">Return on Investment</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Reach: </span>
                              <span className="font-medium">{campaign.reach.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Engagement: </span>
                              <span className="font-medium">{campaign.engagement}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Audience Tab */}
              <TabsContent value="audience" className="space-y-6 m-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Age Demographics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {creator.demographics.age.map((age, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{age.range}</span>
                              <span>{age.percentage}%</span>
                            </div>
                            <Progress value={age.percentage} className="h-2" />
                            <div className="flex gap-4 text-xs text-gray-600">
                              <span>Male: {age.male}%</span>
                              <span>Female: {age.female}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Geographic Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {creator.demographics.locations.map((location, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm">{location.country}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full" 
                                  style={{ width: `${location.percentage}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600 w-10 text-right">
                                {location.percentage}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}