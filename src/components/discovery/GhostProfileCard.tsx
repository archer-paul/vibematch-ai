import { Bot, Star, Users, TrendingUp, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export interface GhostProfile {
  id: string;
  discovered_data: {
    name: string;
    platform: string;
    followers: number;
    engagement_rate: number;
    niche: string[];
    bio: string;
    avatar_url?: string;
  };
  compatibility_scores: {
    overall: number;
    niche_match: number;
    audience_alignment: number;
    content_quality: number;
  };
  status: 'discovered' | 'invited' | 'joined';
  invited_at?: string;
}

interface GhostProfileCardProps {
  profile: GhostProfile;
  onInvite?: (profileId: string) => void;
  showInviteButton?: boolean;
}

export function GhostProfileCard({ profile, onInvite, showInviteButton = true }: GhostProfileCardProps) {
  const { discovered_data, compatibility_scores, status } = profile;
  
  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'invited':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700">Invité</Badge>;
      case 'joined':
        return <Badge variant="secondary" className="bg-green-100 text-green-700">Rejoint</Badge>;
      default:
        return <Badge variant="secondary" className="bg-purple-100 text-purple-700">
          <Bot className="w-3 h-3 mr-1" />
          AI Discovered
        </Badge>;
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 relative overflow-hidden">
      {/* AI Discovered Badge */}
      <div className="absolute top-4 right-4 z-10">
        {getStatusBadge()}
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="w-12 h-12 border-2 border-background shadow-md">
            <AvatarImage src={discovered_data.avatar_url} alt={discovered_data.name} />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold">
              {discovered_data.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg flex items-center gap-2 pr-20">
              {discovered_data.name}
              <Badge variant="outline" className="text-xs">
                {discovered_data.platform}
              </Badge>
            </CardTitle>
            
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {formatFollowers(discovered_data.followers)}
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {discovered_data.engagement_rate}%
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Bio */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {discovered_data.bio}
        </p>

        {/* Niches */}
        <div className="flex flex-wrap gap-1">
          {discovered_data.niche.map((niche, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {niche}
            </Badge>
          ))}
        </div>

        {/* Compatibility Scores */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Compatibilité AI</span>
            <Badge className={`text-xs ${getScoreColor(compatibility_scores.overall)}`}>
              {compatibility_scores.overall}%
            </Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="font-medium">{compatibility_scores.niche_match}%</div>
              <div className="text-muted-foreground">Niche</div>
            </div>
            <div className="text-center">
              <div className="font-medium">{compatibility_scores.audience_alignment}%</div>
              <div className="text-muted-foreground">Audience</div>
            </div>
            <div className="text-center">
              <div className="font-medium">{compatibility_scores.content_quality}%</div>
              <div className="text-muted-foreground">Qualité</div>
            </div>
          </div>
        </div>

        {/* Cerebras Branding */}
        <div className="text-xs text-muted-foreground text-center py-2 border-t">
          <div className="flex items-center justify-center gap-1">
            <Bot className="w-3 h-3" />
            <span>Powered by Cerebras ultra-fast inference</span>
          </div>
        </div>

        {/* Invite Button */}
        {showInviteButton && status === 'discovered' && (
          <Button 
            onClick={() => onInvite?.(profile.id)}
            className="w-full"
            variant="default"
          >
            <Mail className="w-4 h-4 mr-2" />
            Inviter sur la plateforme
          </Button>
        )}

        {status === 'invited' && (
          <div className="text-center py-2">
            <span className="text-sm text-muted-foreground">
              Invitation envoyée • En attente de réponse
            </span>
          </div>
        )}

        {status === 'joined' && (
          <Button variant="outline" className="w-full" disabled>
            ✓ A rejoint la plateforme
          </Button>
        )}
      </CardContent>
    </Card>
  );
}