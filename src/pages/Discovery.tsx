import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { GhostProfileCard } from '@/components/discovery/GhostProfileCard';
import { Bot, Search, Filter, Sparkles, RotateCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface GhostProfile {
  id: string;
  full_name: string;
  platform: 'instagram' | 'tiktok' | 'youtube' | 'linkedin';
  followers: number;
  engagement_rate: number;
  content_categories: string[];
  ai_compatibility_score: number;
  bio: string;
  location?: string;
  estimated_rate?: string;
  avatar_url?: string;
  platform_url?: string;
  discovered_date: string;
}

export default function Discovery() {
  const { profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [isScanning, setIsScanning] = useState(false);

  // Fake Ghost Profiles
  const ghostProfiles: GhostProfile[] = [
    {
      id: 'ghost-1',
      full_name: 'Emma Creative',
      platform: 'instagram',
      followers: 45000,
      engagement_rate: 8.5,
      content_categories: ['Lifestyle', 'Mode', 'Beauté'],
      ai_compatibility_score: 92,
      bio: 'Créatrice de contenu lifestyle et mode basée à Paris. Passionnée par la beauté naturelle et les tendances émergentes.',
      location: 'Paris, France',
      estimated_rate: '800-1500€',
      discovered_date: '2024-01-15'
    },
    {
      id: 'ghost-2',
      full_name: 'TechReviewFR',
      platform: 'youtube',
      followers: 125000,
      engagement_rate: 12.3,
      content_categories: ['Tech', 'Reviews', 'Gaming'],
      ai_compatibility_score: 89,
      bio: 'Reviews tech, tests de gadgets et analyses gaming. Chaîne YouTube francophone spécialisée dans les nouvelles technologies.',
      location: 'Lyon, France',
      estimated_rate: '2000-4000€',
      discovered_date: '2024-01-12'
    },
    {
      id: 'ghost-3',
      full_name: 'FitnessMaxime',
      platform: 'tiktok',
      followers: 85000,
      engagement_rate: 15.2,
      content_categories: ['Fitness', 'Nutrition', 'Motivation'],
      ai_compatibility_score: 87,
      bio: 'Coach sportif et nutritionniste. Contenus fitness, recettes healthy et motivation quotidienne.',
      location: 'Marseille, France',
      estimated_rate: '1200-2500€',
      discovered_date: '2024-01-10'
    },
    {
      id: 'ghost-4',
      full_name: 'Sarah Entrepreneur',
      platform: 'linkedin',
      followers: 35000,
      engagement_rate: 6.8,
      content_categories: ['Business', 'Entrepreneuriat', 'Leadership'],
      ai_compatibility_score: 85,
      bio: 'Entrepreneure et consultante en stratégie digitale. Partage son expertise en développement business et leadership.',
      location: 'Bordeaux, France',
      estimated_rate: '1500-3000€',
      discovered_date: '2024-01-08'
    }
  ];

  const handleScanProfiles = async () => {
    setIsScanning(true);
    
    // Simulate AI scanning
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsScanning(false);
    toast({
      title: "🤖 Scan terminé !",
      description: `Cerebras AI a analysé 1,247 profils et trouvé ${ghostProfiles.length} nouvelles correspondances`,
    });
  };

  const handleInviteProfile = (profileId: string) => {
    console.log('Inviting profile:', profileId);
  };

  const filteredProfiles = ghostProfiles.filter(profile => {
    const matchesSearch = profile.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.content_categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPlatform = selectedPlatform === 'all' || profile.platform === selectedPlatform;
    
    return matchesSearch && matchesPlatform;
  });

  if (profile?.user_type !== 'sponsor') {
    return (
      <div className="container max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Accès Sponsor Requis</h2>
            <p className="text-muted-foreground">
              Cette fonctionnalité est réservée aux sponsors.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          🔍 Découverte IA
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Cerebras AI scanne automatiquement les réseaux sociaux pour découvrir de nouveaux créateurs compatibles avec votre marque
        </p>
      </div>

      {/* AI Status & Scan Button */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center ${isScanning ? 'animate-pulse' : ''}`}>
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Intelligence Artificielle Cerebras</h3>
                <p className="text-sm text-muted-foreground">
                  {isScanning ? 'Scan en cours... Analyse de 1,247 profils' : 'Prêt à découvrir de nouveaux talents'}
                </p>
              </div>
            </div>
            
            <Button 
              onClick={handleScanProfiles}
              disabled={isScanning}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              {isScanning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Scan en cours...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Lancer un scan IA
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Profils Découverts ({filteredProfiles.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher par nom ou catégorie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'instagram', 'youtube', 'tiktok', 'linkedin'].map((platform) => (
                <Button
                  key={platform}
                  variant={selectedPlatform === platform ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPlatform(platform)}
                >
                  {platform === 'all' ? 'Tous' : platform.charAt(0).toUpperCase() + platform.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ghost Profiles Grid */}
      {filteredProfiles.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProfiles.map((profile) => (
            <GhostProfileCard
              key={profile.id}
              profile={profile}
              onInvite={handleInviteProfile}
            />
          ))}
        </div>
      ) : (
        <Card className="text-center p-8">
          <CardContent>
            <Bot className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun profil trouvé</h3>
            <p className="text-muted-foreground mb-4">
              Lancez un scan IA pour découvrir de nouveaux créateurs
            </p>
            <Button onClick={handleScanProfiles} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Lancer une recherche
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}