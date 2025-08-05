import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Users, 
  Star, 
  MapPin, 
  TrendingUp,
  MessageSquare,
  Plus,
  Filter
} from 'lucide-react';
import { CreatorDetailsModal } from './CreatorDetailsModal';
import { useNotifications } from '@/hooks/useNotifications';

interface ViewCreatorsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockCreators = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: '/avatars/avatar1.svg',
    platform: 'Instagram',
    followers: '2.4M',
    engagement: 8.5,
    niche: 'Lifestyle',
    location: 'Los Angeles, CA',
    rating: 4.8,
    price_range: '$2K-5K',
    verified: true,
    bio: 'Lifestyle content creator focusing on sustainable living and wellness',
    tags: ['Sustainability', 'Wellness', 'Fashion']
  },
  {
    id: '2',
    name: 'Mike Chen',
    avatar: '/avatars/avatar2.svg',
    platform: 'YouTube',
    followers: '1.8M',
    engagement: 7.2,
    niche: 'Tech',
    location: 'San Francisco, CA',
    rating: 4.6,
    price_range: '$3K-7K',
    verified: true,
    bio: 'Tech reviewer and gadget enthusiast sharing the latest innovations',
    tags: ['Technology', 'Reviews', 'Innovation']
  },
  {
    id: '3',
    name: 'Emma Wilson',
    avatar: '/avatars/avatar3.svg',
    platform: 'TikTok',
    followers: '3.2M',
    engagement: 9.1,
    niche: 'Beauty',
    location: 'New York, NY',
    rating: 4.9,
    price_range: '$1.5K-4K',
    verified: false,
    bio: 'Beauty expert and makeup artist creating viral tutorials',
    tags: ['Beauty', 'Makeup', 'Tutorials']
  },
  {
    id: '4',
    name: 'Alex Rodriguez',
    avatar: '/avatars/avatar4.svg',
    platform: 'Instagram',
    followers: '890K',
    engagement: 6.8,
    niche: 'Fitness',
    location: 'Miami, FL',
    rating: 4.5,
    price_range: '$1K-3K',
    verified: true,
    bio: 'Fitness trainer and nutrition coach inspiring healthy lifestyles',
    tags: ['Fitness', 'Nutrition', 'Health']
  },
  {
    id: '5',
    name: 'Jessica Park',
    avatar: '/avatars/avatar5.svg',
    platform: 'YouTube',
    followers: '1.2M',
    engagement: 8.0,
    niche: 'Travel',
    location: 'Seattle, WA',
    rating: 4.7,
    price_range: '$2.5K-6K',
    verified: true,
    bio: 'Travel enthusiast sharing adventures from around the world',
    tags: ['Travel', 'Adventure', 'Culture']
  }
];

export function ViewCreatorsModal({ isOpen, onClose }: ViewCreatorsModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [nicheFilter, setNicheFilter] = useState('all');
  const [selectedCreator, setSelectedCreator] = useState<any>(null);
  const [showCreatorDetails, setShowCreatorDetails] = useState(false);
  const { showSuccess } = useNotifications();

  const filteredCreators = mockCreators.filter(creator => {
    const matchesSearch = creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         creator.niche.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = platformFilter === 'all' || creator.platform.toLowerCase() === platformFilter;
    const matchesNiche = nicheFilter === 'all' || creator.niche.toLowerCase() === nicheFilter;
    
    return matchesSearch && matchesPlatform && matchesNiche;
  });

  const handleViewCreator = (creator: any) => {
    setSelectedCreator(creator);
    setShowCreatorDetails(true);
  };

  const handleInviteCreator = (creator: any) => {
    showSuccess(`Invitation sent to ${creator.name}!`);
  };

  const handleAddToCampaign = (creator: any) => {
    showSuccess(`${creator.name} added to your campaign shortlist!`);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Browse Creators
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search creators by name or niche..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                </SelectContent>
              </Select>
              <Select value={nicheFilter} onValueChange={setNicheFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Niche" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Niches</SelectItem>
                  <SelectItem value="lifestyle">Lifestyle</SelectItem>
                  <SelectItem value="tech">Tech</SelectItem>
                  <SelectItem value="beauty">Beauty</SelectItem>
                  <SelectItem value="fitness">Fitness</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredCreators.length} creators
              </p>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="text-sm">Sort by: Relevance</span>
              </div>
            </div>

            {/* Creators Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCreators.map((creator) => (
                <Card key={creator.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {/* Creator Header */}
                      <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={creator.avatar} />
                          <AvatarFallback>{creator.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium truncate">{creator.name}</h3>
                            {creator.verified && <Badge variant="default" className="text-xs">Verified</Badge>}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <span>{creator.platform}</span>
                            <span>•</span>
                            <span>{creator.niche}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{creator.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span className="text-muted-foreground">Followers</span>
                          </div>
                          <div className="font-medium">{creator.followers}</div>
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            <span className="text-muted-foreground">Engagement</span>
                          </div>
                          <div className="font-medium">{creator.engagement}%</div>
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            <span className="text-muted-foreground">Rating</span>
                          </div>
                          <div className="font-medium">{creator.rating}/5</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Price Range</div>
                          <div className="font-medium">{creator.price_range}</div>
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {creator.bio}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleViewCreator(creator)}
                        >
                          View Profile
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleInviteCreator(creator)}
                        >
                          <MessageSquare className="mr-1 h-3 w-3" />
                          Invite
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {filteredCreators.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No creators found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or filters
                </p>
              </div>
            )}

            {/* Load More */}
            {filteredCreators.length > 0 && (
              <div className="text-center">
                <Button variant="outline">
                  Load More Creators
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <CreatorDetailsModal
        creator={selectedCreator}
        isOpen={showCreatorDetails}
        onClose={() => setShowCreatorDetails(false)}
      />
    </>
  );
}