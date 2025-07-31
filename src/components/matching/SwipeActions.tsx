import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, X, Star, Zap } from 'lucide-react';

interface SwipeActionsProps {
  onAction: (action: 'dislike' | 'super_like' | 'like') => void;
  canUseSuperLike: boolean;
  superLikesRemaining: number;
  disabled?: boolean;
}

export function SwipeActions({ onAction, canUseSuperLike, superLikesRemaining, disabled }: SwipeActionsProps) {
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const handleAction = (action: 'dislike' | 'super_like' | 'like') => {
    if (disabled) return;
    
    setActiveAction(action);
    onAction(action);
    
    // Reset active state after animation
    setTimeout(() => setActiveAction(null), 300);
  };

  return (
    <div className="flex justify-center items-center gap-6 mt-8">
      {/* Dislike Button */}
      <Button
        size="lg"
        variant="outline"
        disabled={disabled}
        className={`
          relative rounded-full w-16 h-16 p-0 border-2 transition-all duration-300
          hover:scale-110 hover:border-red-300 hover:shadow-lg hover:shadow-red-100
          ${activeAction === 'dislike' ? 'animate-dislike-shake bg-red-50' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-50'}
        `}
        onClick={() => handleAction('dislike')}
      >
        <X className="w-7 h-7 text-red-500" />
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <span className="text-xs text-muted-foreground font-medium">Passer</span>
        </div>
      </Button>

      {/* Super Like Button */}
      <Button
        size="lg"
        variant="outline"
        disabled={disabled || !canUseSuperLike}
        className={`
          relative rounded-full w-20 h-20 p-0 border-2 transition-all duration-300
          hover:scale-110 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-100
          ${activeAction === 'super_like' ? 'animate-super-glow bg-gradient-to-r from-yellow-50 to-orange-50' : ''}
          ${!canUseSuperLike ? 'opacity-50 cursor-not-allowed' : disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50'}
        `}
        onClick={() => handleAction('super_like')}
      >
        <div className="relative">
          <Star className="w-8 h-8 text-yellow-500" />
          {canUseSuperLike && (
            <div className="absolute -top-1 -right-1">
              <Zap className="w-3 h-3 text-yellow-600 animate-pulse" />
            </div>
          )}
        </div>
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-center">
          <span className="text-xs text-muted-foreground font-medium block">Super Like</span>
          <span className="text-xs text-yellow-600 font-bold">{superLikesRemaining} restants</span>
        </div>
      </Button>

      {/* Like Button */}
      <Button
        size="lg"
        variant="outline"
        disabled={disabled}
        className={`
          relative rounded-full w-16 h-16 p-0 border-2 transition-all duration-300
          hover:scale-110 hover:border-green-300 hover:shadow-lg hover:shadow-green-100
          ${activeAction === 'like' ? 'animate-like-pop bg-green-50' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-50'}
        `}
        onClick={() => handleAction('like')}
      >
        <Heart className="w-7 h-7 text-green-500" />
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <span className="text-xs text-muted-foreground font-medium">Liker</span>
        </div>
      </Button>
    </div>
  );
}