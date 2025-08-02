import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, 
  DollarSign, 
  Target, 
  Users, 
  Clock, 
  Upload, 
  CheckCircle2, 
  MessageSquare,
  Star,
  Award,
  TrendingUp,
  MapPin,
  Globe
} from 'lucide-react';

interface Campaign {
  id: string;
  title: string;
  brand: string;
  status: 'active' | 'completed' | 'pending' | 'paused';
  budget: number;
  deadline: string;
  progress: number;
  deliverables: string[];
  description: string;
}

interface CampaignDetailsModalProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
  onUploadContent: (campaignId: string) => void;
  onAcceptCampaign: (campaignId: string) => void;
}

// Extended campaign data for detailed view
const getExtendedCampaignData = (campaign: Campaign) => ({
  ...campaign,
  brandInfo: {
    logo: '/placeholder.svg',
    website: 'https://stylecostore.com',
    employees: '50-100',
    location: 'New York, USA',
    rating: 4.8,
    description: 'StyleCo is a leading fashion brand focused on sustainable and affordable clothing for young professionals.',
    values: ['Sustainability', 'Quality', 'Affordability', 'Innovation']
  },
  campaignDetails: {
    objectives: ['Brand Awareness', 'Product Launch', 'Engagement'],
    targetAudience: 'Fashion-conscious millennials and Gen Z',
    platforms: ['Instagram', 'TikTok', 'YouTube'],
    contentGuidelines: [
      'Authentic lifestyle content',
      'Show products in natural settings',
      'Include brand hashtags #StyleCoLife #SustainableFashion',
      'Maintain brand voice: casual, inspiring, eco-conscious'
    ],
    metrics: {
      expectedReach: '100K+',
      engagementTarget: '5%',
      conversions: '500+'
    }
  },
  timeline: [
    { phase: 'Briefing & Content Planning', duration: '3 days', status: 'completed' },
    { phase: 'Content Creation', duration: '7 days', status: 'active' },
    { phase: 'Review & Feedback', duration: '2 days', status: 'pending' },
    { phase: 'Publishing & Promotion', duration: '5 days', status: 'pending' }
  ],
  compensation: {
    baseRate: campaign.budget * 0.7,
    bonusOpportunities: campaign.budget * 0.3,
    paymentTerms: 'Net 30 after content approval'
  }
});

export function CampaignDetailsModal({ 
  campaign, 
  isOpen, 
  onClose, 
  onUploadContent, 
  onAcceptCampaign 
}: CampaignDetailsModalProps) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!campaign) return null;

  const extendedData = getExtendedCampaignData(campaign);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'paused': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={extendedData.brandInfo.logo} alt={campaign.brand} />
              <AvatarFallback>{campaign.brand.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-2xl">{campaign.title}</DialogTitle>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant="outline" className={`${getStatusColor(campaign.status)} text-white border-none`}>
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{extendedData.brandInfo.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{extendedData.brandInfo.location}</span>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="compensation">Compensation</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Budget</span>
                  </div>
                  <div className="text-2xl font-bold">${campaign.budget.toLocaleString()}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Deadline</span>
                  </div>
                  <div className="text-lg font-semibold">{new Date(campaign.deadline).toLocaleDateString()}</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">Progress</span>
                  </div>
                  <div className="text-lg font-semibold">{campaign.progress}%</div>
                  <Progress value={campaign.progress} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Campaign Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{campaign.description}</p>
                <p className="text-sm">{extendedData.brandInfo.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Deliverables</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {campaign.deliverables.map((deliverable, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{deliverable}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Objectives</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {extendedData.campaignDetails.objectives.map((objective, index) => (
                    <Badge key={index} variant="secondary">{objective}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {extendedData.campaignDetails.contentGuidelines.map((guideline, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      <span className="text-sm">{guideline}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expected Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{extendedData.campaignDetails.metrics.expectedReach}</div>
                    <div className="text-sm text-muted-foreground">Expected Reach</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{extendedData.campaignDetails.metrics.engagementTarget}</div>
                    <div className="text-sm text-muted-foreground">Engagement Target</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{extendedData.campaignDetails.metrics.conversions}</div>
                    <div className="text-sm text-muted-foreground">Target Conversions</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {extendedData.timeline.map((phase, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className={`w-4 h-4 rounded-full ${
                        phase.status === 'completed' ? 'bg-green-500' : 
                        phase.status === 'active' ? 'bg-blue-500' : 'bg-gray-300'
                      }`} />
                      <div className="flex-1">
                        <div className="font-medium">{phase.phase}</div>
                        <div className="text-sm text-muted-foreground">{phase.duration}</div>
                      </div>
                      <Badge variant={phase.status === 'completed' ? 'default' : 'outline'}>
                        {phase.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compensation" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Structure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-700">
                      ${extendedData.compensation.baseRate.toLocaleString()}
                    </div>
                    <div className="text-sm text-green-600">Base Rate</div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-700">
                      ${extendedData.compensation.bonusOpportunities.toLocaleString()}
                    </div>
                    <div className="text-sm text-blue-600">Bonus Opportunities</div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="font-medium">Payment Terms</div>
                  <div className="text-sm text-muted-foreground">{extendedData.compensation.paymentTerms}</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {campaign.status === 'pending' && (
            <Button onClick={() => onAcceptCampaign(campaign.id)} className="bg-green-600 hover:bg-green-700">
              <Award className="mr-2 h-4 w-4" />
              Accept Campaign
            </Button>
          )}
          <Button onClick={() => onUploadContent(campaign.id)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Content
          </Button>
          <Button variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" />
            Contact Brand
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}