import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Bot, Flame, Target, Zap } from 'lucide-react';

interface MatchingStatsProps {
  superLikesRemaining: number;
  streakDays: number;
  analyzing: boolean;
  profilesAnalyzed?: number;
}

export function MatchingStats({ 
  superLikesRemaining, 
  streakDays, 
  analyzing, 
  profilesAnalyzed = 127 
}: MatchingStatsProps) {
  return (
    <div className="space-y-4">
      {/* Header with AI Status */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text">
          Discover Your Sponsors
        </h1>
        
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Bot className={`w-4 h-4 ${analyzing ? 'animate-pulse text-blue-500' : ''}`} />
          <span className="text-sm font-medium">
            {analyzing 
              ? "Cerebras AI analyzing 100+ profiles..." 
              : `Powered by Cerebras ultra-fast inference • ${profilesAnalyzed} profiles analyzed`
            }
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        {/* Super Likes */}
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-lg font-bold text-yellow-700">{superLikesRemaining}</div>
            <div className="text-xs text-yellow-600">Super Likes</div>
          </CardContent>
        </Card>

        {/* Streak */}
        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Flame className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-lg font-bold text-orange-700">{streakDays}</div>
            <div className="text-xs text-orange-600">Day{streakDays > 1 ? 's' : ''} streak</div>
          </CardContent>
        </Card>

        {/* AI Score */}
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-lg font-bold text-blue-700">94%</div>
            <div className="text-xs text-blue-600">AI Match</div>
          </CardContent>
        </Card>
      </div>

      {/* Bonus Indicator */}
      {streakDays >= 3 && (
        <div className="text-center">
          <Badge 
            variant="secondary" 
            className="bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 border border-orange-200 animate-pulse-glow"
          >
            <Flame className="w-3 h-3 mr-1" />
            Bonus Streak: +{Math.floor(streakDays / 3)} Super Like{Math.floor(streakDays / 3) > 1 ? 's' : ''}
          </Badge>
        </div>
      )}
    </div>
  );
}