import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Users, Target, BarChart3, TrendingUp, Eye } from 'lucide-react';
import { AIProfileScore } from '@/components/dashboard/AIProfileScore';
import { RecommendedSponsors } from '@/components/dashboard/RecommendedSponsors';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { CollaborationsManager } from '@/components/dashboard/CollaborationsManager';
import { CampaignOverview } from '@/components/dashboard/CampaignOverview';
import { AdvancedCreatorTable } from '@/components/dashboard/AdvancedCreatorTable';
import { CampaignManager } from '@/components/dashboard/CampaignManager';
import { CreatorAnalytics } from '@/components/dashboard/CreatorAnalytics';
import { NotificationCenter } from '@/components/dashboard/NotificationCenter';
import { MessageCenter } from '@/components/dashboard/MessageCenter';

const creatorStats = [
  { title: 'AI Matches', value: '42', change: '+12%', icon: Sparkles },
  { title: 'Profile Views', value: '1,248', change: '+23%', icon: Eye },
  { title: 'Active Campaigns', value: '3', change: '+1', icon: Target },
  { title: 'Revenue', value: '$8,500', change: '+15%', icon: TrendingUp },
];

const sponsorStats = [
  { title: 'Matched Creators', value: '156', change: '+28%', icon: Users },
  { title: 'Active Campaigns', value: '8', change: '+3', icon: Target },
  { title: 'Total Reach', value: '2.4M', change: '+18%', icon: BarChart3 },
  { title: 'Average ROI', value: '3.2x', change: '+0.3x', icon: TrendingUp },
];

export default function Dashboard() {
  const { profile } = useAuth();

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isCreator = profile.user_type === 'creator';
  const stats = isCreator ? creatorStats : sponsorStats;
  const welcomeTitle = isCreator ? 'Creator Dashboard' : 'Sponsor Dashboard';
  const welcomeDescription = isCreator 
    ? 'Manage your collaborations and track your performance'
    : 'Discover creators and manage your campaigns';

  return (
    <div className={`space-y-8 ${!isCreator ? 'sponsor-theme' : 'creator-theme'}`}>
      <div>
        <h1 className="text-3xl font-bold">{welcomeTitle}</h1>
        <p className="text-muted-foreground mt-2">
          Hello {profile.full_name}! {welcomeDescription}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
               <p className="text-xs text-muted-foreground">
                 {stat.change} from last month
               </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Creator Dashboard */}
      {isCreator ? (
        <div className="space-y-6">
          {/* Top Row - AI Profile and Quick Actions */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <AIProfileScore />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Optimize your profile for better matches
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="w-full" variant="outline" onClick={() => window.location.href = '/profile'}>
                      <Users className="mr-2 h-4 w-4" />
                      Complete Profile
                    </Button>
                    <Button className="w-full" variant="outline" onClick={() => window.location.href = '/matches'}>
                      <Sparkles className="mr-2 h-4 w-4" />
                      AI Matches
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <PerformanceChart />
            </div>
          </div>

          {/* Middle Row - Recommended Sponsors */}
          <RecommendedSponsors />

          {/* Bottom Row - Collaborations */}
          <CollaborationsManager />
        </div>
      ) : (
        /* Professional B2B Sponsor Dashboard */
        <div className="space-y-6">
          <CampaignOverview />
          <div className="grid grid-cols-1 gap-6">
            <AdvancedCreatorTable />
          </div>
          <div className="grid grid-cols-1 gap-6">
            <CampaignManager />
          </div>
          <div className="grid grid-cols-1 gap-6">
            <CreatorAnalytics />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NotificationCenter />
            <div>
              <MessageCenter />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}