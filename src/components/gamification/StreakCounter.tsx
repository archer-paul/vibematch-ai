import { Flame, Star, Trophy, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useGamification } from '@/hooks/useGamification';

export function StreakCounter() {
  const { quotas, subscription, getSuperLikesRemaining, loading } = useGamification();

  if (loading || !quotas) {
    return (
      <div className="flex items-center gap-2 animate-pulse">
        <div className="w-8 h-8 bg-muted rounded-full"></div>
        <div className="w-12 h-4 bg-muted rounded"></div>
      </div>
    );
  }

  const streakDays = quotas.streak_days;
  const superLikesLeft = getSuperLikesRemaining();
  const bonusLikes = Math.floor(streakDays / 3);

  const getStreakColor = () => {
    if (streakDays >= 30) return 'text-purple-500';
    if (streakDays >= 14) return 'text-orange-500';
    if (streakDays >= 7) return 'text-red-500';
    if (streakDays >= 3) return 'text-yellow-500';
    return 'text-gray-500';
  };

  const getStreakIcon = () => {
    if (streakDays >= 30) return <Trophy className="w-5 h-5" />;
    if (streakDays >= 14) return <Star className="w-5 h-5" />;
    if (streakDays >= 7) return <Zap className="w-5 h-5" />;
    return <Flame className="w-5 h-5" />;
  };

  const getStreakTitle = () => {
    if (streakDays >= 30) return 'Legendary Streak';
    if (streakDays >= 14) return 'Epic Streak';
    if (streakDays >= 7) return 'Fire Streak';
    if (streakDays >= 3) return 'Hot Streak';
    return 'Daily Login';
  };

  const getStreakDescription = () => {
    const nextBonus = Math.ceil(streakDays / 3) * 3;
    const daysToBonus = nextBonus - streakDays;
    
    return (
      <div className="space-y-2">
        <div>
          <span className="font-semibold">{getStreakTitle()}</span>
          <p className="text-sm text-muted-foreground">
            {streakDays} {streakDays === 1 ? 'jour' : 'jours'} consécutifs
          </p>
        </div>
        
        {bonusLikes > 0 && (
          <div className="text-sm">
            <span className="text-green-500 font-medium">
              +{bonusLikes} Super Like{bonusLikes > 1 ? 's' : ''} bonus
            </span>
          </div>
        )}
        
        {daysToBonus > 0 && (
          <div className="text-sm text-muted-foreground">
            Plus que {daysToBonus} jour{daysToBonus > 1 ? 's' : ''} pour le prochain bonus !
          </div>
        )}
        
        <div className="border-t pt-2 text-sm">
          <span className="text-muted-foreground">Plan actuel: </span>
          <Badge variant="outline" className="text-xs">
            {subscription?.plan_type?.toUpperCase() || 'FREE'}
          </Badge>
          <div className="mt-1">
            <span className="text-muted-foreground">Super Likes: </span>
            <span className="font-medium">{superLikesLeft}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border hover:bg-accent/50 transition-colors cursor-pointer">
            <div className={`${getStreakColor()} animate-pulse`}>
              {getStreakIcon()}
            </div>
            <div className="flex items-center gap-1">
              <span className={`font-bold ${getStreakColor()}`}>
                {streakDays}
              </span>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                {streakDays === 1 ? 'jour' : 'jours'}
              </span>
            </div>
            
            {bonusLikes > 0 && (
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200">
                +{bonusLikes}
              </Badge>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="w-64">
          {getStreakDescription()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}