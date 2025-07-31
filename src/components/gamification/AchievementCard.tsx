import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Achievement } from '@/hooks/useGamification';
import { Trophy, Star, Zap, Target, Heart, Crown, Flame } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AchievementCardProps {
  achievement: Achievement;
  isNewlyUnlocked?: boolean;
}

export function AchievementCard({ achievement, isNewlyUnlocked = false }: AchievementCardProps) {
  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'first_match':
        return <Heart className="w-6 h-6 text-pink-500" />;
      case 'super_matcher':
        return <Target className="w-6 h-6 text-purple-500" />;
      case 'streak_master':
        return <Flame className="w-6 h-6 text-orange-500" />;
      case 'ai_power_user':
        return <Zap className="w-6 h-6 text-blue-500" />;
      case 'top_performer':
        return <Crown className="w-6 h-6 text-yellow-500" />;
      default:
        return <Trophy className="w-6 h-6 text-gray-500" />;
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
        return 'Achievement Débloqué';
    }
  };

  const getAchievementDescription = (type: string, data: any) => {
    switch (type) {
      case 'first_match':
        return 'Votre tout premier match réussi !';
      case 'super_matcher':
        return `${data?.matches || 10} matches obtenus ce mois-ci`;
      case 'streak_master':
        return `Streak de ${data?.streak_days || 7} jours maintenu`;
      case 'ai_power_user':
        return 'Utilisation avancée de l\'IA Cerebras';
      case 'top_performer':
        return 'Performance exceptionnelle ce mois-ci';
      default:
        return data?.description || 'Achievement débloqué avec succès !';
    }
  };

  const getRarityColor = (type: string) => {
    switch (type) {
      case 'first_match':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'super_matcher':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'streak_master':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'ai_power_user':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'top_performer':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRarity = (type: string) => {
    switch (type) {
      case 'first_match':
        return 'Commun';
      case 'super_matcher':
        return 'Rare';
      case 'streak_master':
        return 'Épique';
      case 'ai_power_user':
        return 'Légendaire';
      case 'top_performer':
        return 'Mythique';
      default:
        return 'Commun';
    }
  };

  return (
    <Card className={`relative overflow-hidden transition-all duration-500 hover:shadow-lg ${
      isNewlyUnlocked ? 'animate-bounce-in ring-2 ring-yellow-400 ring-opacity-50' : ''
    }`}>
      {isNewlyUnlocked && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-transparent to-yellow-400/20 animate-pulse"></div>
      )}
      
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full bg-background shadow-md ${
            isNewlyUnlocked ? 'animate-pulse-glow' : ''
          }`}>
            {getAchievementIcon(achievement.achievement_type)}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg">
                {getAchievementTitle(achievement.achievement_type)}
              </CardTitle>
              {isNewlyUnlocked && (
                <Badge className="bg-yellow-500 text-white animate-pulse">
                  NOUVEAU !
                </Badge>
              )}
            </div>
            
            <Badge variant="outline" className={getRarityColor(achievement.achievement_type)}>
              {getRarity(achievement.achievement_type)}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          {getAchievementDescription(achievement.achievement_type, achievement.achievement_data)}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Débloqué</span>
          <span>
            {formatDistanceToNow(new Date(achievement.unlocked_at), {
              addSuffix: true,
              locale: fr
            })}
          </span>
        </div>

        {/* Achievement Score */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Points obtenus:</span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500" />
              <span className="font-medium text-sm">
                {achievement.achievement_type === 'first_match' ? '50' :
                 achievement.achievement_type === 'super_matcher' ? '200' :
                 achievement.achievement_type === 'streak_master' ? '300' :
                 achievement.achievement_type === 'ai_power_user' ? '500' :
                 achievement.achievement_type === 'top_performer' ? '1000' : '100'} pts
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}