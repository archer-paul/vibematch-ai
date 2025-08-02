import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useGamification } from '@/hooks/useGamification';
import { useAdvancedGamification } from '@/hooks/useAdvancedGamification';
import { ChallengeCard } from '@/components/gamification/ChallengeCard';
import { LeaderboardCard } from '@/components/gamification/LeaderboardCard';
import { AchievementCard } from '@/components/gamification/AchievementCard';
import { useAuth } from '@/hooks/useAuth';
import { Trophy, Target, Star, Flame, Users, Sparkles, RotateCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Leaderboard() {
  const { user } = useAuth();
  const { achievements, quotas } = useGamification();
  const { 
    challenges, 
    leaderboard, 
    userRank, 
    loading, 
    completeChallenge,
    refetch 
  } = useAdvancedGamification();
  
  const [activeTab, setActiveTab] = useState('leaderboard');

  const handleClaimReward = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;

    completeChallenge(challengeId);
    
    toast({
      title: "🎉 Reward claimed!",
      description: `You received ${challenge.reward_value} ${
        challenge.reward_type === 'super_likes' ? 'Super Likes' : 
        challenge.reward_type === 'streak_bonus' ? 'bonus days' : 'badge'
      }`,
    });
  };

  const currentUser = leaderboard.find(entry => entry.user_id === user?.id);
  const topCreators = leaderboard.filter(entry => entry.user_type === 'creator').slice(0, 5);
  const topSponsors = leaderboard.filter(entry => entry.user_type === 'sponsor').slice(0, 5);

  // Filter challenges by type
  const dailyChallenges = challenges.filter(c => c.type === 'daily');
  const weeklyChallenges = challenges.filter(c => c.type === 'weekly');
  const monthlyChallenges = challenges.filter(c => c.type === 'monthly');

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto p-6">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p>Loading gamification data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          🏆 Gamification Center
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Take on challenges, unlock achievements and climb the VibeMatch leaderboard!
        </p>
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-500" />
          <span className="text-sm text-muted-foreground">
            Powered by Cerebras AI pour une expérience de matching optimisée
          </span>
        </div>
      </div>

      {/* User Stats Header */}
      {currentUser && (
        <Card className="bg-gradient-to-r from-primary/10 via-purple-50 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {currentUser.full_name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{currentUser.full_name}</h2>
                  <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/10 border-primary/30">
                  Rank #{userRank}
                </Badge>
                    <span className="text-sm text-muted-foreground">
                      {currentUser.total_score.toLocaleString()} points
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{currentUser.total_matches}</div>
                  <div className="text-xs text-muted-foreground">Matches</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-500">{currentUser.streak_days}</div>
                  <div className="text-xs text-muted-foreground">Streak Days</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-500">{currentUser.achievements_count}</div>
                  <div className="text-xs text-muted-foreground">Achievements</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="challenges" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Challenges
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Statistics
          </TabsTrigger>
        </TabsList>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Rankings</h2>
            <Button variant="outline" onClick={refetch} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Top Creators */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Flame className="w-5 h-5 text-purple-500" />
                Top Creators
              </h3>
              <div className="space-y-3">
                {topCreators.map((creator) => (
                  <LeaderboardCard
                    key={creator.user_id}
                    entry={creator}
                    isCurrentUser={creator.user_id === user?.id}
                  />
                ))}
              </div>
            </div>

            {/* Top Sponsors */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Top Sponsors
              </h3>
              <div className="space-y-3">
                {topSponsors.map((sponsor) => (
                  <LeaderboardCard
                    key={sponsor.user_id}
                    entry={sponsor}
                    isCurrentUser={sponsor.user_id === user?.id}
                  />
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Challenges Tab */}
        <TabsContent value="challenges" className="space-y-6">
          <h2 className="text-2xl font-bold">Active Challenges</h2>
          
          <div className="space-y-8">
            {/* Daily Challenges */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-600">Daily Challenges</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {dailyChallenges.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onClaim={handleClaimReward}
                  />
                ))}
              </div>
            </div>

            {/* Weekly Challenges */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-purple-600">Weekly Challenges</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {weeklyChallenges.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onClaim={handleClaimReward}
                  />
                ))}
              </div>
            </div>

            {/* Monthly Challenges */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-orange-600">Monthly Challenges</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {monthlyChallenges.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onClaim={handleClaimReward}
                  />
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <h2 className="text-2xl font-bold">Your Achievements</h2>
          
          {achievements.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {achievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center p-8">
              <CardContent>
                <Trophy className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No achievements unlocked</h3>
                <p className="text-muted-foreground">
                  Start making matches to unlock your first achievements!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats" className="space-y-6">
          <h2 className="text-2xl font-bold">Global Statistics</h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold">1,247</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold">8,932</div>
                <div className="text-sm text-muted-foreground">Total Matches</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Sparkles className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <div className="text-2xl font-bold">94.3%</div>
                <div className="text-sm text-muted-foreground">AI Accuracy</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                <div className="text-2xl font-bold">2,456</div>
                <div className="text-sm text-muted-foreground">Achievements Unlocked</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}