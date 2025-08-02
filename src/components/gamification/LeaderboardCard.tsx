import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Star, Zap, Crown, Medal, Target } from 'lucide-react';
import { LeaderboardEntry } from '@/hooks/useAdvancedGamification';

interface LeaderboardCardProps {
  entry: LeaderboardEntry;
  isCurrentUser?: boolean;
  showRank?: boolean;
}

export function LeaderboardCard({ entry, isCurrentUser = false, showRank = true }: LeaderboardCardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <Trophy className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getRankGradient = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getUserTypeColor = (userType: 'creator' | 'sponsor') => {
    return userType === 'creator' 
      ? 'bg-purple-100 text-purple-800 border-purple-200'
      : 'bg-blue-100 text-blue-800 border-blue-200';
  };

  return (
    <Card className={`relative transition-all duration-300 hover:shadow-lg ${
      isCurrentUser ? 'ring-2 ring-primary ring-opacity-50 bg-primary/5' : ''
    } ${
      entry.rank <= 3 ? 'border-2 ' + (entry.rank === 1 ? 'border-yellow-300' : entry.rank === 2 ? 'border-gray-300' : 'border-amber-300') : ''
    }`}>
      {/* Rank Badge */}
      {showRank && (
        <div className="absolute -top-3 -left-3 z-10">
          <div className={`w-12 h-12 rounded-full ${getRankGradient(entry.rank)} flex items-center justify-center font-bold text-lg shadow-lg`}>
            {entry.rank <= 3 ? getRankIcon(entry.rank) : `#${entry.rank}`}
          </div>
        </div>
      )}

      {/* Current User Badge */}
      {isCurrentUser && (
        <div className="absolute top-4 right-4">
          <Badge className="bg-primary text-primary-foreground animate-pulse-glow">
            <Star className="w-3 h-3 mr-1" />
            You
          </Badge>
        </div>
      )}

      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 border-2 border-muted">
            <AvatarImage src={entry.avatar_url} alt={entry.full_name} />
            <AvatarFallback className="text-lg font-bold">
              {entry.full_name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {entry.full_name}
              {entry.rank <= 3 && (
                <div className="text-lg">
                  {entry.rank === 1 ? '👑' : entry.rank === 2 ? '🥈' : '🥉'}
                </div>
              )}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className={getUserTypeColor(entry.user_type)}>
                {entry.user_type === 'creator' ? 'Creator' : 'Sponsor'}
              </Badge>
              {isCurrentUser && (
                <Badge variant="secondary" className="text-xs">
                  Your Profile
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Score Principal */}
        <div className="text-center">
          <div className="text-3xl font-bold text-primary mb-1">
            {entry.total_score.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">Total Points</div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <Target className="w-4 h-4 text-green-500" />
            </div>
            <div className="font-semibold text-lg">{entry.total_matches}</div>
            <div className="text-xs text-muted-foreground">Matches</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <Zap className="w-4 h-4 text-orange-500" />
            </div>
            <div className="font-semibold text-lg">{entry.streak_days}</div>
            <div className="text-xs text-muted-foreground">Streak Days</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <Trophy className="w-4 h-4 text-yellow-500" />
            </div>
            <div className="font-semibold text-lg">{entry.achievements_count}</div>
            <div className="text-xs text-muted-foreground">Achievements</div>
          </div>
        </div>

        {/* Performance Indicator */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Performance:</span>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${
                entry.total_score > 800 ? 'bg-green-500' :
                entry.total_score > 500 ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className="font-medium">
                {entry.total_score > 800 ? 'Excellent' :
                 entry.total_score > 500 ? 'Good' : 'Progressing'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}