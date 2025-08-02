import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Plus, X, Save } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface AddCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const availableCategories = [
  'Lifestyle', 'Mode', 'Beauté', 'Fitness', 'Tech', 'Gaming', 'Food', 'Travel',
  'Business', 'DIY', 'Education', 'Music', 'Art', 'Photography', 'Sports',
  'Health', 'Parenting', 'Finance', 'Real Estate', 'Automotive', 'Home',
  'Comedy', 'Entertainment', 'News', 'Politics', 'Science', 'Nature',
  'Animals', 'Books', 'Movies', 'Reviews', 'Unboxing', 'Tutorials'
];

export function AddCategoriesModal({ isOpen, onClose, onSave }: AddCategoriesModalProps) {
  const { profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    profile?.content_categories || []
  );

  const handleSave = async () => {
    if (!profile) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          content_categories: selectedCategories
        })
        .eq('user_id', profile.user_id);

      if (error) throw error;
      
      onSave();
      onClose();
    } catch (error) {
      console.error('Error updating categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const removeCategory = (category: string) => {
    setSelectedCategories(prev => prev.filter(c => c !== category));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Gérer vos catégories de contenu</DialogTitle>
          <DialogDescription>
            Sélectionnez les catégories qui correspondent à votre contenu pour améliorer vos matchings.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selected Categories */}
          {selectedCategories.length > 0 && (
            <div className="space-y-3">
              <Label>Catégories sélectionnées ({selectedCategories.length})</Label>
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map((category) => (
                  <Badge 
                    key={category} 
                    variant="default" 
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => removeCategory(category)}
                  >
                    {category}
                    <X className="w-3 h-3" />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Available Categories */}
          <div className="space-y-3">
            <Label>Catégories disponibles</Label>
            <div className="flex flex-wrap gap-2">
              {availableCategories
                .filter(cat => !selectedCategories.includes(cat))
                .map((category) => (
                  <Badge 
                    key={category} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => toggleCategory(category)}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    {category}
                  </Badge>
                ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">💡 Conseils</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Sélectionnez 3-7 catégories pour optimiser vos matchings</li>
              <li>• Choisissez les catégories où vous êtes le plus actif</li>
              <li>• Plus vos catégories sont précises, meilleurs seront vos matchings</li>
            </ul>
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