import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Trophy, Star, Gift } from 'lucide-react';
import { Achievement } from '@/hooks/useGamification';

interface AchievementNotificationProps {
  achievement: Achievement;
  onDismiss: () => void;
  autoHide?: boolean;
  duration?: number;
}

export function AchievementNotification({ 
  achievement, 
  onDismiss, 
  autoHide = true,
  duration = 5000 
}: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoHide, duration]);

  const handleDismiss = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(false);
      onDismiss();
    }, 300);
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

  const getPoints = (type: string) => {
    switch (type) {
      case 'first_match':
        return 50;
      case 'super_matcher':
        return 200;
      case 'streak_master':
        return 300;
      case 'ai_power_user':
        return 500;
      case 'top_performer':
        return 1000;
      default:
        return 100;
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      isAnimating ? 'transform translate-x-full opacity-0' : 'transform translate-x-0 opacity-100'
    }`}>
      <Card className="w-96 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-lg animate-bounce-in">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse-glow">
                <Trophy className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg text-yellow-800">
                  🏆 Achievement Débloqué !
                </h3>
                <Badge className="bg-yellow-500 text-white animate-pulse">
                  NOUVEAU
                </Badge>
              </div>
              
              <p className="font-semibold text-yellow-700">
                {getAchievementTitle(achievement.achievement_type)}
              </p>
              
              <p className="text-sm text-yellow-600 mt-1">
                {achievement.achievement_data?.description || 'Félicitations pour cet achievement !'}
              </p>

              {/* Points earned */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
                  <Star className="w-3 h-3 text-yellow-600" />
                  <span className="text-xs font-medium text-yellow-700">
                    +{getPoints(achievement.achievement_type)} points
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-orange-100 px-2 py-1 rounded-full">
                  <Gift className="w-3 h-3 text-orange-600" />
                  <span className="text-xs font-medium text-orange-700">
                    Récompense débloquée
                  </span>
                </div>
              </div>
            </div>

            {/* Close button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="flex-shrink-0 h-8 w-8 p-0 hover:bg-yellow-100"
            >
              <X className="w-4 h-4 text-yellow-600" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}