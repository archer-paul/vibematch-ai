import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  ArrowUpDown,
  Star,
  TrendingUp,
  Users,
  MessageSquare,
  Plus
} from "lucide-react";

interface Creator {
  id: string;
  name: string;
  avatar: string;
  niche: string[];
  followers: number;
  engagement: number;
  avgViews: number;
  rate: number;
  rating: number;
  platforms: string[];
  compatibility: number;
  recentWork: string[];
  location: string;
  responseTime: string;
}

const mockCreators: Creator[] = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar: "/placeholder.svg",
    niche: ["Fashion", "Lifestyle"],
    followers: 125000,
    engagement: 4.2,
    avgViews: 15000,
    rate: 2500,
    rating: 4.9,
    platforms: ["Instagram", "TikTok"],
    compatibility: 92,
    recentWork: ["Zara Campaign", "Nike Collaboration"],
    location: "Los Angeles, CA",
    responseTime: "< 2 hours"
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    avatar: "/placeholder.svg",
    niche: ["Tech", "Gaming"],
    followers: 89000,
    engagement: 5.1,
    avgViews: 22000,
    rate: 1800,
    rating: 4.7,
    platforms: ["YouTube", "Twitch"],
    compatibility: 88,
    recentWork: ["Samsung Review", "AMD Partnership"],
    location: "Austin, TX",
    responseTime: "< 4 hours"
  },
  {
    id: "3",
    name: "Emma Thompson",
    avatar: "/placeholder.svg",
    niche: ["Beauty", "Wellness"],
    followers: 156000,
    engagement: 3.8,
    avgViews: 18000,
    rate: 3200,
    rating: 4.8,
    platforms: ["Instagram", "YouTube"],
    compatibility: 95,
    recentWork: ["Sephora Campaign", "Glossier Partnership"],
    location: "New York, NY",
    responseTime: "< 1 hour"
  }
];

type SortKey = keyof Creator;
type SortOrder = 'asc' | 'desc';

export function AdvancedCreatorTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>('compatibility');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [nicheFilter, setNicheFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [followersFilter, setFollowersFilter] = useState<string>('all');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const filteredAndSortedCreators = useMemo(() => {
    let filtered = mockCreators.filter(creator => {
      const matchesSearch = creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           creator.niche.some(n => n.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesNiche = nicheFilter === 'all' || creator.niche.includes(nicheFilter);
      const matchesPlatform = platformFilter === 'all' || creator.platforms.includes(platformFilter);
      
      let matchesFollowers = true;
      if (followersFilter !== 'all') {
        const followers = creator.followers;
        switch (followersFilter) {
          case '0-50k': matchesFollowers = followers <= 50000; break;
          case '50k-100k': matchesFollowers = followers > 50000 && followers <= 100000; break;
          case '100k+': matchesFollowers = followers > 100000; break;
        }
      }
      
      return matchesSearch && matchesNiche && matchesPlatform && matchesFollowers;
    });

    return filtered.sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      return sortOrder === 'asc' 
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });
  }, [searchTerm, sortKey, sortOrder, nicheFilter, platformFilter, followersFilter]);

  const handleSelectCreator = (creatorId: string) => {
    setSelectedCreators(prev => 
      prev.includes(creatorId)
        ? prev.filter(id => id !== creatorId)
        : [...prev, creatorId]
    );
  };

  const handleSelectAll = () => {
    setSelectedCreators(
      selectedCreators.length === filteredAndSortedCreators.length
        ? []
        : filteredAndSortedCreators.map(c => c.id)
    );
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 90) return "text-corporate-success";
    if (score >= 80) return "text-corporate-warning";
    return "text-corporate-gray";
  };

  return (
    <Card className="border border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-corporate-gray-dark">Creator Recommendations</CardTitle>
            <CardDescription>Advanced filtering and analytics for creator selection</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add to Campaign
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-corporate-gray" />
            <Input
              placeholder="Search creators by name or niche..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={nicheFilter} onValueChange={setNicheFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Niche" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Niches</SelectItem>
                <SelectItem value="Fashion">Fashion</SelectItem>
                <SelectItem value="Tech">Tech</SelectItem>
                <SelectItem value="Beauty">Beauty</SelectItem>
                <SelectItem value="Gaming">Gaming</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
                <SelectItem value="YouTube">YouTube</SelectItem>
                <SelectItem value="TikTok">TikTok</SelectItem>
                <SelectItem value="Twitch">Twitch</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={followersFilter} onValueChange={setFollowersFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Followers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="0-50k">0-50K</SelectItem>
                <SelectItem value="50k-100k">50K-100K</SelectItem>
                <SelectItem value="100k+">100K+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedCreators.length > 0 && (
          <div className="flex items-center gap-4 p-3 bg-corporate-blue/5 rounded-lg border border-corporate-blue/20">
            <span className="text-sm font-medium text-corporate-blue">
              {selectedCreators.length} creator(s) selected
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Add to Campaign</Button>
              <Button variant="outline" size="sm">Send Message</Button>
              <Button variant="outline" size="sm">Export Selected</Button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedCreators.length === filteredAndSortedCreators.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Creator</TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-corporate-blue"
                  onClick={() => handleSort('followers')}
                >
                  <div className="flex items-center gap-1">
                    Audience
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-corporate-blue"
                  onClick={() => handleSort('engagement')}
                >
                  <div className="flex items-center gap-1">
                    Engagement
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-corporate-blue"
                  onClick={() => handleSort('rate')}
                >
                  <div className="flex items-center gap-1">
                    Rate
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-corporate-blue"
                  onClick={() => handleSort('compatibility')}
                >
                  <div className="flex items-center gap-1">
                    Match Score
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Performance</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedCreators.map((creator) => (
                <TableRow key={creator.id} className="hover:bg-muted/50">
                  <TableCell>
                    <Checkbox
                      checked={selectedCreators.includes(creator.id)}
                      onCheckedChange={() => handleSelectCreator(creator.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={creator.avatar} alt={creator.name} />
                        <AvatarFallback>{creator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-corporate-gray-dark">{creator.name}</div>
                        <div className="flex gap-1 mt-1">
                          {creator.niche.map((n, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {n}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2 mt-1">
                          {creator.platforms.map((platform, i) => (
                            <span key={i} className="text-xs text-corporate-gray">
                              {platform}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium flex items-center gap-1">
                        <Users className="h-4 w-4 text-corporate-gray" />
                        {formatNumber(creator.followers)}
                      </div>
                      <div className="text-corporate-gray text-xs">{creator.location}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium text-corporate-blue">{creator.engagement}%</div>
                      <div className="text-corporate-gray text-xs">
                        {formatNumber(creator.avgViews)} avg views
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">${creator.rate.toLocaleString()}</div>
                      <div className="text-corporate-gray text-xs">per post</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`text-lg font-bold ${getCompatibilityColor(creator.compatibility)}`}>
                        {creator.compatibility}%
                      </div>
                      <div className="flex items-center gap-1 text-corporate-warning">
                        <Star className="h-3 w-3 fill-current" />
                        <span className="text-xs">{creator.rating}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-xs text-corporate-gray">
                      <TrendingUp className="h-3 w-3" />
                      <MessageSquare className="h-3 w-3" />
                      <span>{creator.responseTime}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Send Message</DropdownMenuItem>
                        <DropdownMenuItem>Add to Campaign</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View Analytics</DropdownMenuItem>
                        <DropdownMenuItem>Download Media Kit</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-corporate-gray">
            Showing {filteredAndSortedCreators.length} of {mockCreators.length} creators
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}