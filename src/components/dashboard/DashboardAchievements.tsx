import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGamification } from '@/hooks/useGamification';
import { useAdvancedGamification } from '@/hooks/useAdvancedGamification';
import { Trophy, Star, Award, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DashboardAchievements() {
  const { achievements, loading: gamificationLoading } = useGamification();
  const { userRank, loading: leaderboardLoading } = useAdvancedGamification();

  const loading = gamificationLoading || leaderboardLoading;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Vos Performances
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentAchievements = achievements.slice(0, 3);
  const totalPoints = achievements.reduce((sum, achievement) => {
    const points = achievement.achievement_type === 'first_match' ? 50 :
                  achievement.achievement_type === 'super_matcher' ? 200 :
                  achievement.achievement_type === 'streak_master' ? 300 :
                  achievement.achievement_type === 'ai_power_user' ? 500 :
                  achievement.achievement_type === 'top_performer' ? 1000 : 100;
    return sum + points;
  }, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Vos Performances
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-700">{achievements.length}</div>
            <div className="text-xs text-yellow-600">Achievements</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-700">#{userRank || '---'}</div>
            <div className="text-xs text-blue-600">Classement</div>
          </div>
        </div>

        {/* Recent Achievements */}
        {recentAchievements.length > 0 ? (
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              Achievements récents
            </h4>
            {recentAchievements.map((achievement) => {
              const getAchievementIcon = (type: string) => {
                switch (type) {
                  case 'first_match':
                    return '❤️';
                  case 'super_matcher':
                    return '🎯';
                  case 'streak_master':
                    return '🔥';
                  case 'ai_power_user':
                    return '⚡';
                  case 'top_performer':
                    return '👑';
                  default:
                    return '🏆';
                }
              };

              const getAchievementTitle = (type: string) => {
                switch (type) {
                  case 'first_match':
                    return 'Premier Match';
                  case 'super_matcher':
                    return 'Super Matcher';
                  case 'streak_master':
                    return 'Maître du Streak';
                  case 'ai_power_user':
                    return 'Expert IA';
                  case 'top_performer':
                    return 'Top Performer';
                  default:
                    return 'Achievement';
                }
              };

              return (
                <div key={achievement.id} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                  <div className="text-lg">{getAchievementIcon(achievement.achievement_type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{getAchievementTitle(achievement.achievement_type)}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {achievement.achievement_data?.description || 'Achievement débloqué'}
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 text-xs">
                    +{achievement.achievement_type === 'first_match' ? 50 :
                       achievement.achievement_type === 'super_matcher' ? 200 :
                       achievement.achievement_type === 'streak_master' ? 300 :
                       achievement.achievement_type === 'ai_power_user' ? 500 :
                       achievement.achievement_type === 'top_performer' ? 1000 : 100}
                  </Badge>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4">
            <Award className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Aucun achievement débloqué
            </p>
            <p className="text-xs text-muted-foreground">
              Commencez par faire des matches !
            </p>
          </div>
        )}

        {/* Total Points */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Points totaux:</span>
            <div className="flex items-center gap-1 font-medium">
              <Star className="w-4 h-4 text-yellow-500" />
              {totalPoints.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button asChild variant="outline" className="w-full gap-2" size="sm">
          <Link to="/leaderboard?tab=achievements">
            <TrendingUp className="w-4 h-4" />
            Voir le classement complet
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}