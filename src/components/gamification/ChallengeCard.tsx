import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Clock, Star, Trophy, Zap, Gift } from 'lucide-react';
import { Challenge } from '@/hooks/useAdvancedGamification';

interface ChallengeCardProps {
  challenge: Challenge;
  onClaim?: (challengeId: string) => void;
}

export function ChallengeCard({ challenge, onClaim }: ChallengeCardProps) {
  const progressPercentage = (challenge.current_progress / challenge.target_value) * 100;
  
  const getTypeColor = (type: Challenge['type']) => {
    switch (type) {
      case 'daily':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'weekly':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'monthly':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRewardIcon = (rewardType: Challenge['reward_type']) => {
    switch (rewardType) {
      case 'super_likes':
        return <Star className="w-4 h-4" />;
      case 'streak_bonus':
        return <Zap className="w-4 h-4" />;
      case 'badge':
        return <Trophy className="w-4 h-4" />;
      default:
        return <Gift className="w-4 h-4" />;
    }
  };

  const getTimeRemaining = () => {
    const now = new Date();
    const expires = new Date(challenge.expires_at);
    const diff = expires.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expiré';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}j ${hours % 24}h`;
    }
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
      challenge.completed ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' : ''
    }`}>
      {challenge.completed && (
        <div className="absolute top-4 right-4">
          <Badge className="bg-green-500 text-white animate-pulse-glow">
            <Trophy className="w-3 h-3 mr-1" />
            Terminé
          </Badge>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{challenge.icon}</div>
            <div>
              <CardTitle className="text-lg">{challenge.title}</CardTitle>
              <Badge variant="outline" className={getTypeColor(challenge.type)}>
                {challenge.type.charAt(0).toUpperCase() + challenge.type.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mt-2">
          {challenge.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progression</span>
            <span className="font-medium">
              {challenge.current_progress} / {challenge.target_value}
            </span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-2"
          />
        </div>

        {/* Reward */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Récompense:</span>
            <div className="flex items-center gap-1 text-primary font-medium">
              {getRewardIcon(challenge.reward_type)}
              <span>
                {challenge.reward_value} {challenge.reward_type === 'super_likes' ? 'Super Likes' : 
                 challenge.reward_type === 'streak_bonus' ? 'Jours de bonus' : 'Badge'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{getTimeRemaining()}</span>
          </div>
        </div>

        {/* Claim Button */}
        {challenge.completed && onClaim && (
          <Button 
            onClick={() => onClaim(challenge.id)}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            <Gift className="w-4 h-4 mr-2" />
            Récupérer la récompense
          </Button>
        )}
      </CardContent>
    </Card>
  );
}