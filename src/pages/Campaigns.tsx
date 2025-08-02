import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, DollarSign, Users, TrendingUp, Play, Pause, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { CampaignDetailsModal } from '@/components/modals/CampaignDetailsModal';

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

export default function Campaigns() {
  const { profile } = useAuth();
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleViewDetails = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (campaign) {
      setSelectedCampaign(campaign);
      setIsDetailsModalOpen(true);
    }
  };

  const handleUploadContent = (campaignId: string) => {
    toast({
      title: "Upload Content", 
      description: `Opening content upload for campaign ${campaignId}`,
    });
  };

  const handleAcceptCampaign = (campaignId: string) => {
    toast({
      title: "Campaign Accepted",
      description: `Successfully accepted campaign ${campaignId}`,
    });
  };

  const campaigns: Campaign[] = [
    {
      id: '1',
      title: 'Summer Fashion Collection Launch',
      brand: 'StyleCo',
      status: 'active',
      budget: 2500,
      deadline: '2024-08-15',
      progress: 65,
      deliverables: ['3 Instagram Posts', '2 Stories', '1 Reel'],
      description: 'Promote the new summer collection with authentic lifestyle content showcasing versatile pieces for young professionals.'
    },
    {
      id: '2',
      title: 'Tech Product Review Campaign',
      brand: 'TechNova',
      status: 'completed',
      budget: 1800,
      deadline: '2024-07-20',
      progress: 100,
      deliverables: ['1 YouTube Video', '2 Instagram Posts'],
      description: 'Create comprehensive review content for the latest smartphone launch, highlighting key features and user experience.'
    },
    {
      id: '3',
      title: 'Fitness App Promotion',
      brand: 'FitLife',
      status: 'pending',
      budget: 3200,
      deadline: '2024-09-01',
      progress: 0,
      deliverables: ['4 Instagram Posts', '3 Stories', '2 TikTok Videos'],
      description: 'Showcase the fitness app\'s features through workout routines and progress tracking content.'
    },
    {
      id: '4',
      title: 'Sustainable Beauty Brand',
      brand: 'EcoGlow',
      status: 'paused',
      budget: 1500,
      deadline: '2024-08-30',
      progress: 25,
      deliverables: ['2 Instagram Posts', '1 Blog Post'],
      description: 'Highlight the brand\'s commitment to sustainability and showcase their natural skincare products.'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'paused':
        return <Pause className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'completed':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'paused':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const activeCampaigns = campaigns.filter(c => c.status === 'active' || c.status === 'pending');
  const completedCampaigns = campaigns.filter(c => c.status === 'completed');
  const totalEarnings = campaigns.filter(c => c.status === 'completed').reduce((sum, c) => sum + c.budget, 0);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-3">
        <TrendingUp className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">Manage your ongoing and completed brand collaborations</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCampaigns.length}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCampaigns.length}</div>
            <p className="text-xs text-muted-foreground">Successfully finished</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From completed campaigns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95%</div>
            <p className="text-xs text-muted-foreground">Campaign completion rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Campaigns */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Active Campaigns</h2>
          <Button onClick={() => window.location.href = '/market'}>View All Opportunities</Button>
        </div>

        <div className="grid gap-6">
          {activeCampaigns.map((campaign) => (
            <Card key={campaign.id} className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      {campaign.title}
                      <Badge variant="outline" className={`${getStatusColor(campaign.status)} text-white border-none`}>
                        {getStatusIcon(campaign.status)}
                        <span className="ml-1 capitalize">{campaign.status}</span>
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      <span className="font-medium">{campaign.brand}</span> • 
                      <span className="ml-1">${campaign.budget.toLocaleString()}</span>
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Due: {new Date(campaign.deadline).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{campaign.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{campaign.progress}%</span>
                  </div>
                  <Progress value={campaign.progress} className="h-2" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Deliverables:</h4>
                  <div className="flex flex-wrap gap-2">
                    {campaign.deliverables.map((deliverable, index) => (
                      <Badge key={index} variant="secondary">
                        {deliverable}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" onClick={() => handleViewDetails(campaign.id)}>View Details</Button>
                  <Button size="sm" variant="outline" onClick={() => handleUploadContent(campaign.id)}>Upload Content</Button>
                  {campaign.status === 'pending' && (
                    <Button size="sm" variant="outline" onClick={() => handleAcceptCampaign(campaign.id)}>Accept Campaign</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Completed Campaigns */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Completed Campaigns</h2>
        
        <div className="grid gap-4">
          {completedCampaigns.map((campaign) => (
            <Card key={campaign.id} className="border-l-4 border-l-green-500">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{campaign.title}</h3>
                    <p className="text-sm text-muted-foreground">{campaign.brand}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-green-600">${campaign.budget.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">
                      Completed {new Date(campaign.deadline).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Campaign Details Modal */}
      <CampaignDetailsModal
        campaign={selectedCampaign}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedCampaign(null);
        }}
        onUploadContent={handleUploadContent}
        onAcceptCampaign={handleAcceptCampaign}
      />
    </div>
  );
}