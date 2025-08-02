import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, Filter, TrendingUp, DollarSign, Clock, Users, Star, ArrowRight, CheckCircle2 } from 'lucide-react';
import { MarketCampaignDetailsModal } from '@/components/modals/MarketCampaignDetailsModal';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationToast } from '@/components/ui/notification-toast';

interface Partnership {
  id: number;
  brand: string;
  campaign: string;
  budget: string;
  category: string;
  requirements: string;
  deadline: string;
  relevance: number;
  status: string;
  description: string;
  tags: string[];
  // Extended details for the details modal
  detailedDescription?: string;
  objectives?: string[];
  deliverables?: string[];
  timeline?: string[];
  targetAudience?: string;
  brandValues?: string[];
  campaignDuration?: string;
  contentGuidelines?: string[];
  exclusivityRequirements?: string;
  performanceMetrics?: string[];
}

const partnerships: Partnership[] = [
  {
    id: 1,
    brand: 'Nike',
    campaign: 'Summer Sports Collection',
    budget: '$50,000 - $100,000',
    category: 'Sports & Fitness',
    requirements: 'Fitness influencers with 100K+ followers',
    deadline: '2024-03-15',
    relevance: 95,
    status: 'Active',
    description: 'Promote our new summer sports collection with authentic workout content',
    tags: ['Sports', 'Fitness', 'Lifestyle'],
    detailedDescription: 'Nike is launching its most innovative summer sports collection to date, featuring cutting-edge Dri-FIT technology and sustainable materials. We\'re looking for authentic fitness creators who embody the "Just Do It" spirit to showcase these products in real workout scenarios.',
    objectives: ['Increase brand awareness among 18-35 fitness enthusiasts', 'Drive sales of summer collection', 'Showcase product performance in real scenarios', 'Build community around active lifestyle'],
    deliverables: ['3 Instagram posts featuring collection pieces', '2 Instagram Stories workout sessions', '1 YouTube video review/workout', '1 TikTok challenge participation'],
    timeline: ['Week 1: Product delivery and briefing', 'Week 2-3: Content creation', 'Week 4: Content review and approval', 'Week 5-6: Content publication'],
    targetAudience: 'Fitness enthusiasts aged 18-35, both beginners and advanced athletes',
    brandValues: ['Performance Excellence', 'Innovation', 'Sustainability', 'Inclusivity', 'Inspiration'],
    campaignDuration: '6 weeks',
    contentGuidelines: ['Authentic workout demonstrations', 'Natural lighting preferred', 'Include performance benefits', 'Show product versatility', 'Maintain positive, motivational tone'],
    exclusivityRequirements: 'No competing sportswear brand partnerships during campaign period',
    performanceMetrics: ['Engagement rate (min 4%)', 'Reach metrics', 'Brand mention sentiment', 'Click-through to product pages', 'User-generated content']
  },
  {
    id: 2,
    brand: 'Coca-Cola',
    campaign: 'Share a Coke Moments',
    budget: '$30,000 - $75,000',
    category: 'Food & Beverage',
    requirements: 'Lifestyle content creators',
    deadline: '2024-04-01',
    relevance: 88,
    status: 'Active',
    description: 'Create content showing special moments with Coca-Cola',
    tags: ['Lifestyle', 'Food', 'Social']
  },
  {
    id: 3,
    brand: 'Adidas',
    campaign: 'Originals Street Style',
    budget: '$40,000 - $80,000',
    category: 'Fashion',
    requirements: 'Fashion & streetwear influencers',
    deadline: '2024-03-30',
    relevance: 92,
    status: 'Active',
    description: 'Showcase Adidas Originals in urban street style content',
    tags: ['Fashion', 'Streetwear', 'Urban']
  },
  {
    id: 4,
    brand: 'Apple',
    campaign: 'iPhone Photography Challenge',
    budget: '$75,000 - $150,000',
    category: 'Technology',
    requirements: 'Photography and tech content creators',
    deadline: '2024-04-15',
    relevance: 85,
    status: 'Active',
    description: 'Demonstrate iPhone camera capabilities through creative photography',
    tags: ['Technology', 'Photography', 'Creative']
  },
  {
    id: 5,
    brand: 'Sephora',
    campaign: 'Beauty Trends 2024',
    budget: '$25,000 - $60,000',
    category: 'Beauty',
    requirements: 'Beauty and makeup influencers',
    deadline: '2024-03-20',
    relevance: 90,
    status: 'Active',
    description: 'Showcase the latest beauty trends and Sephora products',
    tags: ['Beauty', 'Makeup', 'Trends']
  }
];

export default function Market() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [selectedPartnership, setSelectedPartnership] = useState<Partnership | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [applyingPartnerships, setApplyingPartnerships] = useState<Set<number>>(new Set());
  const { notifications, removeNotification, showSuccess } = useNotifications();

  const categories = ['all', 'Sports & Fitness', 'Food & Beverage', 'Fashion', 'Technology', 'Beauty'];

  const filteredPartnerships = partnerships
    .filter(p => 
      (selectedCategory === 'all' || p.category === selectedCategory) &&
      (searchTerm === '' || p.brand.toLowerCase().includes(searchTerm.toLowerCase()) || 
       p.campaign.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'relevance':
          return b.relevance - a.relevance;
        case 'budget':
          return parseInt(b.budget.split('$')[1].split(',').join('')) - parseInt(a.budget.split('$')[1].split(',').join(''));
        case 'deadline':
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        default:
          return 0;
      }
    });

  const handleApplyNow = (partnership: Partnership) => {
    setApplyingPartnerships(prev => new Set(prev).add(partnership.id));
    
    // Simulate application process
    setTimeout(() => {
      // Success animation and feedback
      const partnershipElement = document.querySelector(`[data-partnership-id="${partnership.id}"]`);
      if (partnershipElement) {
        partnershipElement.classList.add('bg-green-50', 'border-green-200', 'transition-all', 'duration-500');
      }
      
      showSuccess('🎉 Application submitted successfully!');
      
      // Remove from applying state and show message modal
      setTimeout(() => {
        setApplyingPartnerships(prev => {
          const newSet = new Set(prev);
          newSet.delete(partnership.id);
          return newSet;
        });
        
        setSelectedPartnership(partnership);
        setIsDetailsModalOpen(true);
      }, 1500);
    }, 2000);
  };

  const handleViewDetails = (partnership: Partnership) => {
    setSelectedPartnership(partnership);
    setIsDetailsModalOpen(true);
  };

  const handleApplyForCampaign = (partnership: Partnership) => {
    setIsDetailsModalOpen(false);
    handleApplyNow(partnership);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Partnership Market</h1>
          <Badge variant="secondary">
            {filteredPartnerships.length} opportunities available
          </Badge>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search brands or campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="budget">Budget</SelectItem>
              <SelectItem value="deadline">Deadline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="grid" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPartnerships.map(partnership => (
              <Card key={partnership.id} data-partnership-id={partnership.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{partnership.brand}</CardTitle>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">{partnership.relevance}%</span>
                    </div>
                  </div>
                  <CardDescription>{partnership.campaign}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">{partnership.budget}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span className="text-sm">Deadline: {partnership.deadline}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {partnership.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {partnership.description}
                  </p>
                  
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1" 
                      size="sm"
                      onClick={() => handleApplyNow(partnership)}
                      disabled={applyingPartnerships.has(partnership.id)}
                    >
                      {applyingPartnerships.has(partnership.id) ? (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4 animate-spin" />
                          Applying...
                        </>
                      ) : (
                        'Apply Now'
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(partnership)}
                    >
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="list" className="space-y-4">
          {filteredPartnerships.map(partnership => (
            <Card key={partnership.id} data-partnership-id={partnership.id}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{partnership.brand}</h3>
                      <Badge variant="outline">{partnership.category}</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">{partnership.relevance}%</span>
                      </div>
                    </div>
                    
                    <h4 className="text-base font-medium text-muted-foreground">
                      {partnership.campaign}
                    </h4>
                    
                    <p className="text-sm text-muted-foreground">
                      {partnership.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span>{partnership.budget}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span>Deadline: {partnership.deadline}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      onClick={() => handleApplyNow(partnership)}
                      disabled={applyingPartnerships.has(partnership.id)}
                    >
                      {applyingPartnerships.has(partnership.id) ? (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4 animate-spin" />
                          Applying...
                        </>
                      ) : (
                        'Apply Now'
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(partnership)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Campaign Details Modal */}
      <MarketCampaignDetailsModal
        partnership={selectedPartnership}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedPartnership(null);
        }}
        onApply={handleApplyForCampaign}
      />

      {/* Notifications */}
      <NotificationToast 
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
}