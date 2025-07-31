import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Briefcase, 
  MoreHorizontal, 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  MessageSquare,
  Star
} from 'lucide-react';

interface Collaboration {
  id: string;
  sponsor: {
    name: string;
    logo: string;
  };
  title: string;
  status: 'pending' | 'active' | 'completed' | 'declined';
  value: number;
  deadline: string;
  progress: number;
  description: string;
  type: string;
}

const mockCollaborations: Collaboration[] = [
  {
    id: '1',
    sponsor: { name: 'TechFlow', logo: '/placeholder.svg' },
    title: 'Q2 Product Launch Campaign',
    status: 'active',
    value: 12000,
    deadline: '2024-02-15',
    progress: 65,
    description: 'Create 4 videos showcasing new productivity features',
    type: 'Video Series'
  },
  {
    id: '2',
    sponsor: { name: 'EcoLife Brands', logo: '/placeholder.svg' },
    title: 'Sustainable Living Partnership',
    status: 'pending',
    value: 8000,
    deadline: '2024-02-20',
    progress: 0,
    description: 'Monthly content featuring eco-friendly products',
    type: 'Long-term Partnership'
  },
  {
    id: '3',
    sponsor: { name: 'FitnessPro', logo: '/placeholder.svg' },
    title: 'Summer Fitness Challenge',
    status: 'completed',
    value: 6000,
    deadline: '2024-01-30',
    progress: 100,
    description: 'Workout videos using FitnessPro equipment',
    type: 'Product Integration'
  },
  {
    id: '4',
    sponsor: { name: 'GameZone', logo: '/placeholder.svg' },
    title: 'New RPG Game Review',
    status: 'declined',
    value: 4000,
    deadline: '2024-02-10',
    progress: 0,
    description: 'Gameplay review and first impressions',
    type: 'Game Review'
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active': return <Clock className="h-4 w-4" />;
    case 'completed': return <CheckCircle className="h-4 w-4" />;
    case 'pending': return <AlertCircle className="h-4 w-4" />;
    case 'declined': return <XCircle className="h-4 w-4" />;
    default: return <Clock className="h-4 w-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-blue-100 text-blue-800';
    case 'completed': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'declined': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export function CollaborationsManager() {
  const [collaborations] = useState(mockCollaborations);

  const activeCollaborations = collaborations.filter(c => c.status === 'active');
  const pendingCollaborations = collaborations.filter(c => c.status === 'pending');
  const completedCollaborations = collaborations.filter(c => c.status === 'completed');

  const totalValue = collaborations
    .filter(c => c.status === 'completed' || c.status === 'active')
    .reduce((sum, c) => sum + c.value, 0);

  const CollaborationRow = ({ collaboration }: { collaboration: Collaboration }) => (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={collaboration.sponsor.logo} alt={collaboration.sponsor.name} />
            <AvatarFallback>{collaboration.sponsor.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{collaboration.title}</div>
            <div className="text-sm text-muted-foreground">{collaboration.sponsor.name}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={getStatusColor(collaboration.status)}>
          <div className="flex items-center gap-1">
            {getStatusIcon(collaboration.status)}
            <span className="capitalize">{collaboration.status}</span>
          </div>
        </Badge>
      </TableCell>
      <TableCell>
        <div className="font-medium">${collaboration.value.toLocaleString()}</div>
        <div className="text-sm text-muted-foreground">{collaboration.type}</div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4" />
          {collaboration.deadline}
        </div>
      </TableCell>
      <TableCell>
        {collaboration.status === 'active' && (
          <div className="space-y-1">
            <div className="text-sm">{collaboration.progress}%</div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${collaboration.progress}%` }}
              />
            </div>
          </div>
        )}
        {collaboration.status === 'completed' && (
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Done</span>
          </div>
        )}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MessageSquare className="mr-2 h-4 w-4" />
              Message Sponsor
            </DropdownMenuItem>
            {collaboration.status === 'completed' && (
              <DropdownMenuItem>
                <Star className="mr-2 h-4 w-4" />
                Rate Collaboration
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-orange-600" />
              Collaborations
            </CardTitle>
            <CardDescription>
              Manage your brand partnerships and campaigns
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span>Total Value: ${totalValue.toLocaleString()}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Active ({activeCollaborations.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Pending ({pendingCollaborations.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Completed ({completedCollaborations.length})
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              All ({collaborations.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeCollaborations.length > 0 ? (
                  activeCollaborations.map(collaboration => (
                    <CollaborationRow key={collaboration.id} collaboration={collaboration} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No active collaborations
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="pending">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingCollaborations.length > 0 ? (
                  pendingCollaborations.map(collaboration => (
                    <CollaborationRow key={collaboration.id} collaboration={collaboration} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No pending collaborations
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="completed">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedCollaborations.length > 0 ? (
                  completedCollaborations.map(collaboration => (
                    <CollaborationRow key={collaboration.id} collaboration={collaboration} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No completed collaborations
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="all">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collaborations.map(collaboration => (
                  <CollaborationRow key={collaboration.id} collaboration={collaboration} />
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}