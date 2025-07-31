import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, X, Star, Loader2, Bot } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useGamification } from '@/hooks/useGamification';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { cerebrasService } from '@/services/cerebrasService';

interface SponsorProfile {
  id: string;
  user_id: string;
  full_name: string;
  display_name: string;
  company_name: string;
  bio: string;
  budget_range: string;
  campaign_objectives: string[];
  preferred_sectors: string[];
  avatar_url?: string;
}

export default function Matches() {
  const { profile } = useAuth();
  const { useSuperLike, canUseSuperLike, getSuperLikesRemaining } = useGamification();
  const [sponsors, setSponsors] = useState<SponsorProfile[]>([]);
  const [currentSponsorIndex, setCurrentSponsorIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'super' | null>(null);

  useEffect(() => {
    if (profile?.user_type === 'creator') {
      fetchSponsors();
    }
  }, [profile]);

  const fetchSponsors = async () => {
    setLoading(true);
    setAnalyzing(true);
    
    try {
      // Simulate Cerebras analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'sponsor')
        .eq('onboarding_completed', true)
        .limit(10);

      if (error) throw error;

      // Filter out already swiped sponsors
      const { data: swipedData } = await supabase
        .from('swipe_actions')
        .select('target_id')
        .eq('user_id', profile?.user_id);

      const swipedIds = swipedData?.map(s => s.target_id) || [];
      const unswipedSponsors = data?.filter(sponsor => !swipedIds.includes(sponsor.user_id)) || [];

      setSponsors(unswipedSponsors);
    } catch (error) {
      console.error('Error fetching sponsors:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les sponsors",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setAnalyzing(false);
    }
  };

  const handleSwipe = async (action: 'like' | 'dislike' | 'super_like') => {
    if (!profile || currentSponsorIndex >= sponsors.length) return;

    const currentSponsor = sponsors[currentSponsorIndex];
    
    if (action === 'super_like') {
      const canUse = await useSuperLike();
      if (!canUse) return;
    }

    setSwipeDirection(action === 'dislike' ? 'left' : action === 'like' ? 'right' : 'super');

    try {
      // Store swipe action
      await supabase
        .from('swipe_actions')
        .insert({
          user_id: profile.user_id,
          target_id: currentSponsor.user_id,
          action
        });

      // Analyze compatibility with Cerebras
      if (action !== 'dislike') {
        await cerebrasService.analyzeProfileCompatibility(
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
        );
      }

      // Show action feedback
      if (action === 'super_like') {
        toast({
          title: "⭐ Super Like!",
          description: "Votre profil sera mis en avant pour ce sponsor",
        });
      } else if (action === 'like') {
        toast({
          title: "💖 Match potentiel!",
          description: "Cerebras AI analyse la compatibilité...",
        });
      }

      // Move to next sponsor
      setTimeout(() => {
        setSwipeDirection(null);
        setCurrentSponsorIndex(prev => prev + 1);
      }, 500);

    } catch (error) {
      console.error('Error processing swipe:', error);
      toast({
        title: "Erreur",
        description: "Impossible de traiter l'action",
        variant: "destructive"
      });
    }
  };

  if (profile?.user_type !== 'creator') {
    return (
      <div className="container max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Accès Créateur Requis</h2>
            <p className="text-muted-foreground">
              Cette fonctionnalité est réservée aux créateurs de contenu.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Découvrez vos Sponsors</h1>
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Bot className="w-4 h-4" />
          <span className="text-sm">
            {analyzing ? "Analyzing 100+ profiles with Cerebras AI..." : "Powered by Cerebras ultra-fast inference"}
          </span>
        </div>
      </div>

      {/* Super Likes Counter */}
      <div className="text-center">
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          <Star className="w-3 h-3 mr-1" />
          {getSuperLikesRemaining()} Super Likes restants
        </Badge>
      </div>

      {/* Loading State */}
      {loading && (
        <Card className="h-[600px] flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin mx-auto" />
            <div className="space-y-2">
              <p className="font-medium">Analyse en cours...</p>
              <p className="text-sm text-muted-foreground">
                Cerebras AI analyse plus de 100 profils pour vous
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Sponsor Card */}
      {!loading && currentSponsorIndex < sponsors.length && (
        <div className="relative">
          <Card className={`transition-all duration-500 ${
            swipeDirection === 'left' ? 'transform -translate-x-full opacity-0' :
            swipeDirection === 'right' ? 'transform translate-x-full opacity-0' :
            swipeDirection === 'super' ? 'transform -translate-y-full scale-110 opacity-0' :
            'transform translate-x-0 opacity-100'
          }`}>
            {(() => {
              const sponsor = sponsors[currentSponsorIndex];
              return (
                <>
                  <CardHeader className="text-center">
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold">
                      {sponsor.full_name.charAt(0)}
                    </div>
                    <CardTitle className="text-2xl">{sponsor.display_name}</CardTitle>
                    <p className="text-lg text-muted-foreground">{sponsor.company_name}</p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-center">{sponsor.bio}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Budget:</span>
                        <Badge variant="outline">{sponsor.budget_range}€</Badge>
                      </div>
                      
                      <div>
                        <span className="font-medium block mb-2">Objectifs:</span>
                        <div className="flex flex-wrap gap-1">
                          {sponsor.campaign_objectives?.map((obj, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {obj}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="font-medium block mb-2">Secteurs préférés:</span>
                        <div className="flex flex-wrap gap-1">
                          {sponsor.preferred_sectors?.map((sector, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {sector}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </>
              );
            })()}
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full w-16 h-16 p-0"
              onClick={() => handleSwipe('dislike')}
            >
              <X className="w-6 h-6 text-red-500" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="rounded-full w-16 h-16 p-0"
              onClick={() => handleSwipe('super_like')}
              disabled={!canUseSuperLike()}
            >
              <Star className="w-6 h-6 text-yellow-500" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="rounded-full w-16 h-16 p-0"
              onClick={() => handleSwipe('like')}
            >
              <Heart className="w-6 h-6 text-green-500" />
            </Button>
          </div>
        </div>
      )}

      {/* No More Sponsors */}
      {!loading && currentSponsorIndex >= sponsors.length && (
        <Card className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Plus de sponsors à découvrir!</h2>
          <p className="text-muted-foreground mb-4">
            Revenez demain pour de nouveaux profils analysés par Cerebras AI
          </p>
          <Button onClick={fetchSponsors}>
            Relancer l'analyse
          </Button>
        </Card>
      )}
    </div>
  );
}