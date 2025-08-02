import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Instagram, Youtube, Twitter, Linkedin, Plus, X, Save } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface AddNetworksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const platforms = [
  { name: 'Instagram', icon: Instagram, placeholder: '@username' },
  { name: 'YouTube', icon: Youtube, placeholder: 'Channel URL' },
  { name: 'TikTok', icon: Twitter, placeholder: '@username' },
  { name: 'LinkedIn', icon: Linkedin, placeholder: 'Profile URL' },
  { name: 'Twitter', icon: Twitter, placeholder: '@username' }
];

export function AddNetworksModal({ isOpen, onClose, onSave }: AddNetworksModalProps) {
  const { profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [networks, setNetworks] = useState<Record<string, string>>(
    profile?.social_handles || {}
  );
  const [followerCounts, setFollowerCounts] = useState<Record<string, number>>(
    profile?.follower_counts || {}
  );

  const handleSave = async () => {
    if (!profile) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          social_handles: networks,
          follower_counts: followerCounts
        })
        .eq('user_id', profile.user_id);

      if (error) throw error;
      
      // Update the profile in the context/hook if available
      if (profile) {
        profile.social_handles = networks;
        profile.follower_counts = followerCounts;
      }
      
      onSave();
      onClose();
    } catch (error) {
      console.error('Error updating networks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateNetwork = (platform: string, handle: string) => {
    setNetworks(prev => ({ ...prev, [platform]: handle }));
  };

  const updateFollowers = (platform: string, count: string) => {
    const numCount = parseInt(count) || 0;
    setFollowerCounts(prev => ({ ...prev, [platform]: numCount }));
  };

  const removeNetwork = (platform: string) => {
    setNetworks(prev => {
      const newNetworks = { ...prev };
      delete newNetworks[platform];
      return newNetworks;
    });
    setFollowerCounts(prev => {
      const newCounts = { ...prev };
      delete newCounts[platform];
      return newCounts;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter vos réseaux sociaux</DialogTitle>
          <DialogDescription>
            Connectez vos comptes pour améliorer vos statistiques et votre visibilité.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Connected Networks */}
          {Object.keys(networks).length > 0 && (
            <div className="space-y-3">
              <Label>Réseaux connectés</Label>
              <div className="space-y-2">
                {Object.entries(networks).map(([platform, handle]) => {
                  const platformConfig = platforms.find(p => p.name.toLowerCase() === platform.toLowerCase());
                  const Icon = platformConfig?.icon || Instagram;
                  
                  return (
                    <div key={platform} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Icon className="w-5 h-5" />
                      <div className="flex-1">
                        <div className="font-medium">{platform}</div>
                        <div className="text-sm text-muted-foreground">{handle}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {followerCounts[platform]?.toLocaleString() || 0} followers
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeNetwork(platform)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add New Networks */}
          <div className="space-y-4">
            <Label>Ajouter un réseau</Label>
            {platforms.map((platform) => {
              const isConnected = networks[platform.name.toLowerCase()];
              const Icon = platform.icon;
              
              if (isConnected) return null;
              
              return (
                <div key={platform.name} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{platform.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Input
                        placeholder={platform.placeholder}
                        onChange={(e) => updateNetwork(platform.name.toLowerCase(), e.target.value)}
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        placeholder="Nombre de followers"
                        onChange={(e) => updateFollowers(platform.name.toLowerCase(), e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}