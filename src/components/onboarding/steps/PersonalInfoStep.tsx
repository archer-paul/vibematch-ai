import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '../ImageUpload';
import { useAuth } from '@/hooks/useAuth';

interface PersonalInfoData {
  display_name: string;
  bio: string;
  tagline: string;
  location: {
    country: string;
    city: string;
  };
  avatar_url?: string;
}

interface PersonalInfoStepProps {
  data: PersonalInfoData;
  onChange: (data: Partial<PersonalInfoData>) => void;
}

export function PersonalInfoStep({ data, onChange }: PersonalInfoStepProps) {
  const { user } = useAuth();
  const [bioLength, setBioLength] = useState(data.bio?.length || 0);
  const [taglineLength, setTaglineLength] = useState(data.tagline?.length || 0);

  const handleBioChange = (value: string) => {
    if (value.length <= 150) {
      setBioLength(value.length);
      onChange({ bio: value });
    }
  };

  const handleTaglineChange = (value: string) => {
    if (value.length <= 50) {
      setTaglineLength(value.length);
      onChange({ tagline: value });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Create Your Creator Profile
        </h2>
        <p className="text-muted-foreground mt-2">
          Share some information to personalize your experience
        </p>
      </div>

      {/* Profile Picture */}
      <div className="space-y-2">
        <Label htmlFor="avatar">Profile Picture</Label>
        <ImageUpload
          onUpload={(url) => onChange({ avatar_url: url })}
          onRemove={() => onChange({ avatar_url: undefined })}
          currentImage={data.avatar_url}
          bucket="avatars"
          folder={user?.id || ''}
          placeholder="Upload your profile picture"
          className="max-w-sm mx-auto"
        />
      </div>

      {/* Display Name */}
      <div className="space-y-2">
        <Label htmlFor="display_name">Display Name *</Label>
        <Input
          id="display_name"
          value={data.display_name}
          onChange={(e) => onChange({ display_name: e.target.value })}
          placeholder="Your creator name"
          className="w-full"
        />
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="country">Country *</Label>
          <Input
            id="country"
            value={data.location?.country || ''}
            onChange={(e) => onChange({ 
              location: { ...data.location, country: e.target.value } 
            })}
            placeholder="United States"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={data.location?.city || ''}
            onChange={(e) => onChange({ 
              location: { ...data.location, city: e.target.value } 
            })}
            placeholder="New York"
          />
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="bio">Biography *</Label>
          <span className={`text-xs ${bioLength > 140 ? 'text-destructive' : 'text-muted-foreground'}`}>
            {bioLength}/150
          </span>
        </div>
        <Textarea
          id="bio"
          value={data.bio}
          onChange={(e) => handleBioChange(e.target.value)}
          placeholder="Describe yourself in a few words... What type of content do you create? What are you passionate about?"
          className="min-h-[100px] resize-none"
        />
      </div>

      {/* Tagline */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="tagline">Tagline/Slogan (optional)</Label>
          <span className={`text-xs ${taglineLength > 45 ? 'text-destructive' : 'text-muted-foreground'}`}>
            {taglineLength}/50
          </span>
        </div>
        <Input
          id="tagline"
          value={data.tagline}
          onChange={(e) => handleTaglineChange(e.target.value)}
          placeholder="Your signature phrase..."
        />
      </div>
    </div>
  );
}