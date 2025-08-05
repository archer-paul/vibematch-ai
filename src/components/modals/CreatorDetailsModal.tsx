import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Eye, 
  Heart, 
  MessageSquare, 
  Share2, 
  TrendingUp, 
  MapPin, 
  Calendar,
  Star,
  Instagram,
  Youtube,
  Twitter,
  Plus,
  Send
} from 'lucide-react';
import { SimpleMessageModal } from './SimpleMessageModal';
import { useNotifications } from '@/hooks/useNotifications';

interface Creator {
  id: string;
  name: string;
  avatar: string;
  platform: string;
  followers: string;
  engagement: number;
  niche: string;
  location: string;
  rating: number;
  price_range: string;
  bio?: string;
  verified?: boolean;
  tags?: string[];
}

interface CreatorDetailsModalProps {
  creator: Creator | null;
  isOpen: boolean;
  onClose: () => void;
}

const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'instagram': return Instagram;
    case 'youtube': return Youtube;
    case 'twitter': return Twitter;
    case 'tiktok': return Users;
    default: return Users;
  }
};

const mockPerformanceData = [
  { title: 'Tech Review: iPhone 15 Pro', views: '2.3M', engagement: '8.5%', platform: 'YouTube' },
  { title: 'Morning Routine 2024', views: '1.8M', engagement: '9.2%', platform: 'Instagram' },
  { title: 'Productivity Hacks', views: '950K', engagement: '7.1%', platform: 'TikTok' },
  { title: 'Travel Essentials', views: '1.2M', engagement: '6.8%', platform: 'Instagram' },
];

const mockAudienceData = [
  { age: '18-24', percentage: 35 },
  { age: '25-34', percentage: 45 },
  { age: '35-44', percentage: 15 },
  { age: '45+', percentage: 5 },
];

export function CreatorDetailsModal({ creator, isOpen, onClose }: CreatorDetailsModalProps) {
  const [showMessageModal, setShowMessageModal] = useState(false);
  const { showSuccess } = useNotifications();

  if (!creator) return null;

  const PlatformIcon = getPlatformIcon(creator.platform);

  const handleAddToCampaign = () => {
    showSuccess(`${creator.name} added to your campaign!`);
  };

  const handleSendMessage = (message: string) => {
    showSuccess(`Message sent to ${creator.name}!`);
    setShowMessageModal(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={creator.avatar} />
                <AvatarFallback>{creator.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">{creator.name}</span>
                  {creator.verified && <Badge variant="default">Verified</Badge>}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <PlatformIcon className="h-4 w-4" />
                  <span>{creator.platform}</span>
                  <span>•</span>
                  <MapPin className="h-4 w-4" />
                  <span>{creator.location}</span>
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Followers</span>
                  </div>
                  <div className="text-2xl font-bold">{creator.followers}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Engagement</span>
                  </div>
                  <div className="text-2xl font-bold">{creator.engagement}%</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Rating</span>
                  </div>
                  <div className="text-2xl font-bold">{creator.rating}/5</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Price Range</span>
                  </div>
                  <div className="text-lg font-bold">{creator.price_range}</div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button onClick={handleAddToCampaign} className="flex-1">
                <Plus className="mr-2 h-4 w-4" />
                Add to Campaign
              </Button>
              <Button variant="outline" onClick={() => setShowMessageModal(true)} className="flex-1">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </div>

            {/* Detailed Information */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="audience">Audience</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {creator.bio || "Passionate content creator specializing in tech reviews and lifestyle content. Based in Los Angeles with a focus on authentic storytelling and engaging visuals."}
                    </p>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium">Specialties:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {(creator.tags || ['Tech Reviews', 'Lifestyle', 'Product Demos', 'Tutorials']).map((tag, index) => (
                            <Badge key={index} variant="secondary">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Languages:</span>
                        <span className="ml-2 text-muted-foreground">English, Spanish</span>
                      </div>
                      <div>
                        <span className="font-medium">Availability:</span>
                        <span className="ml-2 text-muted-foreground">Available for new projects</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="content" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Content Performance</CardTitle>
                    <CardDescription>Top performing content from the last 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockPerformanceData.map((content, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium">{content.title}</h4>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {content.views} views
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                {content.engagement} engagement
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {content.platform}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="audience" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Age Demographics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {mockAudienceData.map((demo, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{demo.age}</span>
                            <span>{demo.percentage}%</span>
                          </div>
                          <Progress value={demo.percentage} className="h-2" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Audience Insights</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-primary">62%</div>
                          <div className="text-sm text-muted-foreground">Female</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-primary">38%</div>
                          <div className="text-sm text-muted-foreground">Male</div>
                        </div>
                      </div>
                      <div className="pt-4 border-t">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">United States</span>
                            <span className="text-sm">45%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Canada</span>
                            <span className="text-sm">20%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">United Kingdom</span>
                            <span className="text-sm">15%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Other</span>
                            <span className="text-sm">20%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center">Avg. Views</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="text-3xl font-bold text-primary">1.2M</div>
                      <div className="text-sm text-muted-foreground">per post</div>
                      <div className="flex items-center justify-center gap-1 mt-2 text-green-500">
                        <TrendingUp className="h-3 w-3" />
                        <span className="text-xs">+15% vs last month</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center">Engagement Rate</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="text-3xl font-bold text-primary">{creator.engagement}%</div>
                      <div className="text-sm text-muted-foreground">average</div>
                      <div className="flex items-center justify-center gap-1 mt-2 text-green-500">
                        <TrendingUp className="h-3 w-3" />
                        <span className="text-xs">+2.3% vs last month</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center">Follower Growth</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="text-3xl font-bold text-primary">+12K</div>
                      <div className="text-sm text-muted-foreground">this month</div>
                      <div className="flex items-center justify-center gap-1 mt-2 text-green-500">
                        <TrendingUp className="h-3 w-3" />
                        <span className="text-xs">+8% growth rate</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      <SimpleMessageModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        onSend={handleSendMessage}
        recipientName={creator.name}
        recipientAvatar={creator.avatar}
      />
    </>
  );
}