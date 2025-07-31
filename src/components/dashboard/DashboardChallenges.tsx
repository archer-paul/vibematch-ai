import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useAdvancedGamification } from '@/hooks/useAdvancedGamification';
import { Trophy, Target, Clock, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DashboardChallenges() {
  const { challenges, loading } = useAdvancedGamification();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Défis Actifs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-2 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show only active challenges, prioritize daily and weekly
  const activeChallenges = challenges
    .filter(c => !c.completed)
    .sort((a, b) => {
      const order = { daily: 1, weekly: 2, monthly: 3 };
      return order[a.type] - order[b.type];
    })
    .slice(0, 3);

  const completedToday = challenges.filter(c => 
    c.completed && c.type === 'daily'
  ).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            Défis Actifs
          </CardTitle>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            {completedToday} terminés aujourd'hui
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {activeChallenges.length > 0 ? (
          <>
            {activeChallenges.map((challenge) => {
              const progress = (challenge.current_progress / challenge.target_value) * 100;
              
              return (
                <div key={challenge.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{challenge.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{challenge.title}</h4>
                        <Badge 
                          variant="outline" 
                          className={
                            challenge.type === 'daily' ? 'bg-blue-50 text-blue-700' :
                            challenge.type === 'weekly' ? 'bg-purple-50 text-purple-700' :
                            'bg-orange-50 text-orange-700'
                          }
                        >
                          {challenge.type}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{challenge.current_progress}/{challenge.target_value}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span>+{challenge.reward_value}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              );
            })}
            
            <div className="pt-2 border-t">
              <Button asChild variant="outline" className="w-full gap-2" size="sm">
                <Link to="/leaderboard?tab=challenges">
                  <Trophy className="w-4 h-4" />
                  Voir tous les défis
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <Trophy className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Tous les défis sont terminés !
            </p>
            <Button asChild variant="outline" size="sm" className="mt-2">
              <Link to="/leaderboard?tab=challenges">
                Voir le classement
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}