import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RotateCcw, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useGamification } from '@/hooks/useGamification';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { cerebrasService } from '@/services/cerebrasService';
import { SwipeCard } from '@/components/matching/SwipeCard';
import { SwipeActions } from '@/components/matching/SwipeActions';
import { MatchingStats } from '@/components/matching/MatchingStats';
import { useEnhancedDemoData } from '@/hooks/useEnhancedDemoData';
import { useDemoInteractions } from '@/hooks/useDemoInteractions';

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

export default function Matches() {
  const { profile } = useAuth();
  const { useSuperLike, canUseSuperLike, getSuperLikesRemaining, quotas } = useGamification();
  const { getAllSponsors } = useEnhancedDemoData();
  useDemoInteractions(); // Handle demo interactions
  const [sponsors, setSponsors] = useState<SponsorProfile[]>([]);
  const [currentSponsorIndex, setCurrentSponsorIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'super' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (profile?.user_type === 'creator') {
      fetchSponsors();
    }
  }, [profile]);

  const fetchSponsors = async () => {
    setLoading(true);
    setAnalyzing(true);
    
    try {
      // Simulate Cerebras analysis with realistic timing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'sponsor')
        .eq('onboarding_completed', true)
        .limit(15);

      if (error) throw error;

      // Filter out already swiped sponsors
      const { data: swipedData } = await supabase
        .from('swipe_actions')
        .select('target_id')
        .eq('user_id', profile?.user_id);

      const swipedIds = swipedData?.map(s => s.target_id) || [];
      const unswipedSponsors = data?.filter(sponsor => !swipedIds.includes(sponsor.user_id)) || [];

      // Use demo data for better experience  
      const demoSponsors = getAllSponsors().map(sponsor => ({
        ...sponsor,
        display_name: sponsor.company_name
      }));
      const allSponsors = unswipedSponsors.length > 0 ? unswipedSponsors : demoSponsors;
      setSponsors(allSponsors);
      setCurrentSponsorIndex(0);
    } catch (error) {
      console.error('Error fetching sponsors:', error);
      toast({
        title: "Error",
        description: "Unable to load sponsors",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setAnalyzing(false);
    }
  };

  const handleSwipe = async (action: 'like' | 'dislike' | 'super_like') => {
    if (!profile || currentSponsorIndex >= sponsors.length || isAnimating) return;

    const currentSponsor = sponsors[currentSponsorIndex];
    
    if (action === 'super_like') {
      const canUse = await useSuperLike();
      if (!canUse) return;
    }

    setIsAnimating(true);
    setSwipeDirection(action === 'dislike' ? 'left' : action === 'like' ? 'right' : 'super');

    try {
      // Store swipe action (only for real sponsors, not fake ones)
      if (!currentSponsor.id.startsWith('fake-')) {
        await supabase
          .from('swipe_actions')
          .insert({
            user_id: profile.user_id,
            target_id: currentSponsor.user_id,
            action
          });
      }

      // Analyze compatibility with Cerebras for likes
      if (action !== 'dislike') {
        // Show immediate feedback
        if (action === 'super_like') {
          toast({
            title: "⭐ Super Like sent!",
            description: "Your profile will be prioritized for this sponsor",
          });
        } else {
          toast({
            title: "💖 Like sent!",
            description: "Cerebras AI is analyzing compatibility in real-time...",
          });
        }

        // Background Cerebras analysis
        cerebrasService.analyzeProfileCompatibility(
          {
            id: profile.user_id!,
            niches: profile.niches || [],
            content_styles: profile.content_styles || [],
            collaboration_types: profile.collaboration_types || [],
            bio: profile.bio || '',
            professional_level: profile.professional_level || 1,
            user_type: 'creator'
          },
          {
            id: currentSponsor.user_id,
            niches: currentSponsor.preferred_sectors || [],
            content_styles: [],
            collaboration_types: [],
            bio: currentSponsor.bio || '',
            professional_level: 1,
            user_type: 'sponsor',
            campaign_objectives: currentSponsor.campaign_objectives,
            budget_range: currentSponsor.budget_range
          }
        ).then((result) => {
          // Show compatibility score after analysis
          if (result.score > 80) {
            toast({
              title: "🎯 Excellent compatibility!",
              description: `AI Score: ${result.score}% - Very high match probability`,
            });
          }
        }).catch(console.error);
      }

      // Move to next sponsor after animation
      setTimeout(() => {
        setSwipeDirection(null);
        setCurrentSponsorIndex(prev => prev + 1);
        setIsAnimating(false);
      }, 600);

    } catch (error) {
      console.error('Error processing swipe:', error);
      setIsAnimating(false);
      toast({
        title: "Error",
        description: "Unable to process action",
        variant: "destructive"
      });
    }
  };

  const handleDirectSwipe = (direction: 'left' | 'right' | 'super') => {
    const actionMap = {
      'left': 'dislike' as const,
      'right': 'like' as const,
      'super': 'super_like' as const
    };
    
    handleSwipe(actionMap[direction]);
  };

  if (profile?.user_type !== 'creator') {
    return (
      <div className="container max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Creator Access Required</h2>
            <p className="text-muted-foreground">
              This feature is reserved for content creators.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto p-6 space-y-6">
      {/* Stats Header */}
      <MatchingStats
        superLikesRemaining={getSuperLikesRemaining()}
        streakDays={quotas?.streak_days || 1}
        analyzing={analyzing}
        profilesAnalyzed={127 + currentSponsorIndex}
      />

      {/* Loading State */}
      {loading && (
        <Card className="h-[600px] flex items-center justify-center bg-gradient-to-br from-background to-muted/30">
          <div className="text-center space-y-6">
            <div className="relative">
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
              <Sparkles className="w-6 h-6 absolute -top-2 -right-2 text-yellow-500 animate-pulse" />
            </div>
            <div className="space-y-3">
              <p className="font-semibold text-lg">Cerebras AI at work...</p>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Intelligent analysis of 100+ sponsor profiles to find you the best matches
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Ultra-fast processing in progress</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Card Stack */}
      {!loading && currentSponsorIndex < sponsors.length && (
        <div className="relative h-[600px] perspective-1000">
          {/* Render up to 3 cards in stack */}
          {sponsors.slice(currentSponsorIndex, currentSponsorIndex + 3).map((sponsor, index) => (
            <SwipeCard
              key={`${sponsor.id}-${currentSponsorIndex + index}`}
              sponsor={sponsor}
              index={index}
              isTop={index === 0}
              swipeDirection={index === 0 ? swipeDirection : null}
              onSwipe={handleDirectSwipe}
              analyzing={analyzing && index === 0}
            />
          ))}

          {/* Action Buttons */}
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-full">
            <SwipeActions
              onAction={(action) => handleSwipe(action)}
              canUseSuperLike={canUseSuperLike()}
              superLikesRemaining={getSuperLikesRemaining()}
              disabled={isAnimating}
            />
          </div>
        </div>
      )}

      {/* No More Sponsors */}
      {!loading && currentSponsorIndex >= sponsors.length && (
        <Card className="text-center p-8 bg-gradient-to-br from-background to-muted/30">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Excellent work!</h2>
            <p className="text-muted-foreground max-w-sm mx-auto">
              You've discovered all available sponsors. Cerebras AI analyzes new ones daily.
            </p>
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">
                Next update in 2h15min
              </p>
              <Button 
                onClick={fetchSponsors} 
                variant="outline" 
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Restart analysis
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}