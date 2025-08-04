import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, X, Star, Sparkles } from 'lucide-react';

interface SponsorProfile {
  id: string;
  user_id: string;
  full_name: string;
  display_name?: string;
  company_name: string;
  bio: string;
  budget_range: string;
  campaign_objectives: string[];
  preferred_sectors: string[];
  avatar_url?: string;
}

interface SwipeCardProps {
  sponsor: SponsorProfile;
  index: number;
  isTop: boolean;
  swipeDirection: 'left' | 'right' | 'super' | null;
  onSwipe: (direction: 'left' | 'right' | 'super') => void;
  analyzing: boolean;
}

export function SwipeCard({ sponsor, index, isTop, swipeDirection, onSwipe, analyzing }: SwipeCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [showOverlay, setShowOverlay] = useState<'like' | 'dislike' | 'super' | null>(null);
  const [imageError, setImageError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef({ x: 0, y: 0 });

  // Reset states when card changes
  useEffect(() => {
    setDragOffset({ x: 0, y: 0 });
    setRotation(0);
    setShowOverlay(null);
    setIsDragging(false);
    setImageError(false);
  }, [sponsor.id]);

  // Function to get the correct logo path
  const getLogoPath = (companyName: string, avatarUrl?: string) => {
    if (avatarUrl && !imageError) {
      return avatarUrl;
    }
    
    // Map company names to their logo files
    const logoMap: { [key: string]: string } = {
      'coca-cola': '/logos/coca-cola.svg',
      'nike': '/logos/nike.svg',
      'adidas': '/logos/adidas.svg',
      'apple': '/logos/apple.svg',
      'samsung': '/logos/samsung.svg',
      'netflix': '/logos/netflix.svg',
      'mcdonalds': '/logos/mcdonalds.svg',
      'starbucks': '/logos/starbucks.svg',
      'l\'oréal': '/logos/loreal.svg',
      'loreal': '/logos/loreal.svg',
      'sephora': '/logos/sephora.svg',
      'zara': '/logos/zara.svg',
      'playstation': '/logos/playstation.svg',
      'revolut': '/logos/revolut.svg',
      'wwf': '/logos/wwf.svg'
    };

    const normalizedName = companyName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const logoPath = logoMap[normalizedName] || logoMap[companyName.toLowerCase()];
    
    return logoPath || null;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isTop) return;
    
    setIsDragging(true);
    startPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isTop) return;
    
    const deltaX = e.clientX - startPosRef.current.x;
    const deltaY = e.clientY - startPosRef.current.y;
    
    setDragOffset({ x: deltaX, y: deltaY });
    setRotation(deltaX * 0.1); // Subtle rotation based on horizontal movement
    
    // Show overlay based on direction
    if (Math.abs(deltaX) > 50) {
      if (deltaY < -100) {
        setShowOverlay('super');
      } else if (deltaX > 0) {
        setShowOverlay('like');
      } else {
        setShowOverlay('dislike');
      }
    } else {
      setShowOverlay(null);
    }
  };

  const handleMouseUp = () => {
    if (!isDragging || !isTop) return;
    
    setIsDragging(false);
    
    // Determine swipe action based on final position
    if (Math.abs(dragOffset.x) > 100 || Math.abs(dragOffset.y) > 100) {
      if (dragOffset.y < -150) {
        onSwipe('super');
      } else if (dragOffset.x > 100) {
        onSwipe('right');
      } else if (dragOffset.x < -100) {
        onSwipe('left');
      }
    }
    
    // Reset position
    setDragOffset({ x: 0, y: 0 });
    setRotation(0);
    setShowOverlay(null);
  };

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isTop) return;
    
    setIsDragging(true);
    const touch = e.touches[0];
    startPosRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !isTop) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startPosRef.current.x;
    const deltaY = touch.clientY - startPosRef.current.y;
    
    setDragOffset({ x: deltaX, y: deltaY });
    setRotation(deltaX * 0.1);
    
    if (Math.abs(deltaX) > 50) {
      if (deltaY < -100) {
        setShowOverlay('super');
      } else if (deltaX > 0) {
        setShowOverlay('like');
      } else {
        setShowOverlay('dislike');
      }
    } else {
      setShowOverlay(null);
    }
  };

  const handleTouchEnd = () => {
    handleMouseUp();
  };

  // Calculate card style based on position in stack
  const getCardStyle = () => {
    const baseStyle = {
      transform: `
        scale(${isTop ? 1 : 0.95 - index * 0.05}) 
        translateY(${isTop ? 0 : index * 8}px)
        translateX(${isTop ? dragOffset.x : 0}px)
        translateY(${isTop ? dragOffset.y : index * 8}px)
        rotate(${isTop ? rotation : 0}deg)
      `,
      zIndex: 10 - index,
      transition: isDragging ? 'none' : 'transform 0.3s spring(1, 80, 10, 0)',
    };

    if (swipeDirection && isTop) {
      switch (swipeDirection) {
        case 'left':
          return { ...baseStyle, animation: 'swipe-left 0.6s forwards' };
        case 'right':
          return { ...baseStyle, animation: 'swipe-right 0.6s forwards' };
        case 'super':
          return { ...baseStyle, animation: 'swipe-up 0.8s forwards' };
      }
    }

    return baseStyle;
  };

  const getOverlayContent = () => {
    switch (showOverlay) {
      case 'like':
        return (
          <div className="absolute inset-0 bg-green-500/20 backdrop-blur-sm flex items-center justify-center rounded-lg border-4 border-green-500">
            <div className="bg-green-500 text-white px-6 py-3 rounded-full font-bold text-xl flex items-center gap-2">
              <Heart className="w-6 h-6" />
              LIKE
            </div>
          </div>
        );
      case 'dislike':
        return (
          <div className="absolute inset-0 bg-red-500/20 backdrop-blur-sm flex items-center justify-center rounded-lg border-4 border-red-500">
            <div className="bg-red-500 text-white px-6 py-3 rounded-full font-bold text-xl flex items-center gap-2">
              <X className="w-6 h-6" />
              PASS
            </div>
          </div>
        );
      case 'super':
        return (
          <div className="absolute inset-0 bg-yellow-500/20 backdrop-blur-sm flex items-center justify-center rounded-lg border-4 border-yellow-500">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 py-3 rounded-full font-bold text-xl flex items-center gap-2">
              <Star className="w-6 h-6" />
              SUPER LIKE
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const logoPath = getLogoPath(sponsor.company_name, sponsor.avatar_url);

  return (
    <div
      ref={cardRef}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={getCardStyle()}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Card className="h-full relative overflow-hidden bg-gradient-to-br from-background to-muted/30 border-2">
        {/* Overlay */}
        {getOverlayContent()}
        
        {/* AI Analysis Indicator */}
        {analyzing && isTop && (
          <div className="absolute top-4 right-4 z-10">
            <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border border-purple-200">
              <Sparkles className="w-3 h-3 mr-1 animate-pulse" />
              AI Analysis
            </Badge>
          </div>
        )}

        <CardHeader className="text-center pb-4">
          <div className="w-24 h-24 mx-auto rounded-full bg-white flex items-center justify-center shadow-lg border-4 border-gray-100 overflow-hidden">
            {logoPath ? (
              <img 
                src={logoPath} 
                alt={`${sponsor.company_name} logo`}
                className="w-full h-full object-contain p-2"
                onError={handleImageError}
              />
            ) : (
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-3xl font-bold w-full h-full flex items-center justify-center">
                {sponsor.company_name.charAt(0)}
              </div>
            )}
          </div>
          <CardTitle className="text-2xl bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text">
            {sponsor.company_name}
          </CardTitle>
          <p className="text-lg text-muted-foreground font-medium">Global Brand Partnership</p>
        </CardHeader>

        <CardContent className="space-y-4 px-6">
          <p className="text-center text-sm leading-relaxed">{sponsor.bio}</p>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
              <span className="font-medium text-sm">Budget:</span>
              <Badge variant="outline" className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700">
                {sponsor.budget_range}€
              </Badge>
            </div>
            
            <div className="space-y-2">
              <span className="font-medium text-sm block">Objectifs de campagne:</span>
              <div className="flex flex-wrap gap-1">
                {sponsor.campaign_objectives?.slice(0, 3).map((obj, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100">
                    {obj}
                  </Badge>
                ))}
                {sponsor.campaign_objectives?.length > 3 && (
                  <Badge variant="secondary" className="text-xs bg-muted">
                    +{sponsor.campaign_objectives.length - 3}
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-medium text-sm block">Secteurs d'intérêt:</span>
              <div className="flex flex-wrap gap-1">
                {sponsor.preferred_sectors?.slice(0, 4).map((sector, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-purple-50 border-purple-200 text-purple-700">
                    {sector}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Swipe hint for top card */}
          {isTop && !isDragging && (
            <div className="text-center text-xs text-muted-foreground mt-4 space-y-1">
              <p>← Glissez pour passer • ↑ Super Like • Glissez pour liker →</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}