import { useState } from 'react';
import { SponsorDetailsModal } from '@/components/modals/SponsorDetailsModal';
import { SendMessageModal } from '@/components/modals/SendMessageModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, X, ExternalLink, Filter, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationToast } from '@/components/ui/notification-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Sponsor {
  id: string;
  name: string;
  logo: string;
  industry: string;
  budgetRange: string;
  compatibilityScore: number;
  description: string;
  requirements: string[];
  campaignType: string;
  deadline: string;
}

const mockSponsors: Sponsor[] = [
  {
    id: '1',
    name: 'TechFlow',
    logo: '/placeholder.svg',
    industry: 'Technology',
    budgetRange: '$5,000 - $15,000',
    compatibilityScore: 94,
    description: 'Looking for tech creators to showcase our new productivity app',
    requirements: ['Tech Content', '50K+ Followers', 'High Engagement'],
    campaignType: 'Product Review',
    deadline: '2024-02-15'
  },
  {
    id: '2',
    name: 'EcoLife Brands',
    logo: '/placeholder.svg',
    industry: 'Sustainability',
    budgetRange: '$3,000 - $8,000',
    compatibilityScore: 89,
    description: 'Sustainable lifestyle brand seeking authentic eco-influencers',
    requirements: ['Lifestyle Content', 'Eco-Friendly', '25K+ Followers'],
    campaignType: 'Brand Partnership',
    deadline: '2024-02-20'
  },
  {
    id: '3',
    name: 'FitnessPro',
    logo: '/placeholder.svg',
    industry: 'Health & Fitness',
    budgetRange: '$2,000 - $6,000',
    compatibilityScore: 85,
    description: 'Fitness equipment company looking for workout content creators',
    requirements: ['Fitness Content', 'Active Lifestyle', '30K+ Followers'],
    campaignType: 'Product Integration',
    deadline: '2024-02-25'
  }
];

export function RecommendedSponsors() {
  const [sponsors, setSponsors] = useState(mockSponsors);
  const [filter, setFilter] = useState('all');
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartnership, setSelectedPartnership] = useState<any>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [applyingSponsors, setApplyingSponsors] = useState<Set<string>>(new Set());
  const [likedSponsors, setLikedSponsors] = useState<Set<string>>(new Set());
  const { notifications, removeNotification, showLike, showSuccess } = useNotifications();

  const handleLike = (sponsorId: string) => {
    // Toggle like state
    setLikedSponsors(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(sponsorId)) {
        newLiked.delete(sponsorId);
        return newLiked;
      } else {
        newLiked.add(sponsorId);
        showLike('❤️ Liked sponsor! Match probability increased.');
        return newLiked;
      }
    });
    
    // Add visual feedback
    const sponsorElement = document.querySelector(`[data-sponsor-id="${sponsorId}"]`);
    if (sponsorElement) {
      sponsorElement.classList.add('animate-pulse');
      setTimeout(() => sponsorElement.classList.remove('animate-pulse'), 500);
    }
    
    console.log('Liked sponsor:', sponsorId);
  };

  const handleDislike = (sponsorId: string) => {
    // Add fade out animation then remove
    const sponsorElement = document.querySelector(`[data-sponsor-id="${sponsorId}"]`);
    if (sponsorElement) {
      sponsorElement.classList.add('opacity-50', 'scale-95', 'transition-all', 'duration-300');
      setTimeout(() => {
        setSponsors(prev => prev.filter(s => s.id !== sponsorId));
      }, 300);
    } else {
      setSponsors(prev => prev.filter(s => s.id !== sponsorId));
    }
  };

  const handleViewDetails = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor);
    setIsModalOpen(true);
  };

  const handleApply = (sponsorId: string) => {
    // Find the sponsor and convert to partnership format
    const sponsor = sponsors.find(s => s.id === sponsorId);
    if (sponsor) {
      const partnership = {
        id: parseInt(sponsorId),
        brand: sponsor.name,
        campaign: sponsor.campaignType,
        budget: sponsor.budgetRange,
        category: sponsor.industry,
        requirements: sponsor.requirements.join(', '),
        deadline: sponsor.deadline,
        relevance: sponsor.compatibilityScore,
        status: 'available',
        description: sponsor.description,
        tags: sponsor.requirements
      };
      
      setSelectedPartnership(partnership);
      setIsMessageModalOpen(true);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (selectedPartnership) {
      setApplyingSponsors(prev => new Set(prev).add(selectedPartnership.id.toString()));
      
      // Simulate sending message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showSuccess('🎉 Message sent successfully! The sponsor will review your profile.');
      
      // Remove from applying state and optionally from list
      setTimeout(() => {
        setApplyingSponsors(prev => {
          const newSet = new Set(prev);
          newSet.delete(selectedPartnership.id.toString());
          return newSet;
        });
        setSponsors(prev => prev.filter(s => s.id !== selectedPartnership.id.toString()));
      }, 1500);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const filteredSponsors = sponsors.filter(sponsor => {
    if (filter === 'all') return true;
    if (filter === 'high-budget') return parseInt(sponsor.budgetRange.split('$')[2].replace(',', '')) >= 10000;
    if (filter === 'tech') return sponsor.industry.toLowerCase().includes('tech');
    return true;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-600" />
              Recommended Sponsors
            </CardTitle>
            <CardDescription>
              AI-curated matches based on your profile and content
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilter('all')}>
                All Sponsors
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('high-budget')}>
                High Budget ($10K+)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('tech')}>
                Technology
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {filteredSponsors.map((sponsor) => (
          <Card key={sponsor.id} data-sponsor-id={sponsor.id} className="relative overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={sponsor.logo} alt={sponsor.name} />
                  <AvatarFallback>{sponsor.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{sponsor.name}</h3>
                      <Badge variant="secondary">{sponsor.industry}</Badge>
                    </div>
                    <Badge variant="outline" className={getScoreColor(sponsor.compatibilityScore)}>
                      {sponsor.compatibilityScore}% match
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">{sponsor.description}</p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Budget: {sponsor.budgetRange}</span>
                    <span>•</span>
                    <span>Type: {sponsor.campaignType}</span>
                    <span>•</span>
                    <span>Deadline: {sponsor.deadline}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {sponsor.requirements.map((req, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDislike(sponsor.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLike(sponsor.id)}
                    className={`transition-colors ${
                      likedSponsors.has(sponsor.id) 
                        ? 'text-green-600 bg-green-50 border-green-200 hover:text-green-700 hover:bg-green-100' 
                        : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${likedSponsors.has(sponsor.id) ? 'fill-current' : ''}`} />
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleViewDetails(sponsor)}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => handleApply(sponsor.id)}
                    disabled={applyingSponsors.has(sponsor.id)}
                    className={applyingSponsors.has(sponsor.id) ? 'bg-green-600 hover:bg-green-600' : ''}
                    data-demo="apply-now"
                  >
                    {applyingSponsors.has(sponsor.id) ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4 animate-spin" />
                        Applying...
                      </>
                    ) : (
                      <>
                        Apply Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredSponsors.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Heart className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>No sponsors match your current filters.</p>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => setFilter('all')}
            >
              Clear Filters
            </Button>
          </div>
        )}

        <div className="text-center pt-4 border-t">
          <Button variant="outline" className="w-full">
            Load More Recommendations
          </Button>
        </div>
      </CardContent>

      {/* Sponsor Details Modal */}
      <SponsorDetailsModal
        sponsor={selectedSponsor}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSponsor(null);
        }}
        onLike={handleLike}
        onDislike={(sponsorId) => {
          handleDislike(sponsorId);
          setIsModalOpen(false);
          setSelectedSponsor(null);
        }}
        onApply={(sponsorId) => {
          handleApply(sponsorId);
          setIsModalOpen(false);
          setSelectedSponsor(null);
        }}
      />

      {/* Send Message Modal */}
      <SendMessageModal
        partnership={selectedPartnership}
        isOpen={isMessageModalOpen}
        onClose={() => {
          setIsMessageModalOpen(false);
          setSelectedPartnership(null);
        }}
        onSend={handleSendMessage}
      />

      {/* Notifications */}
      <NotificationToast 
        notifications={notifications}
        onRemove={removeNotification}
      />
    </Card>
  );
}