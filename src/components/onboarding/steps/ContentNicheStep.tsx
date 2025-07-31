import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelect } from '../MultiSelect';
import { ImageUpload } from '../ImageUpload';
import { useAuth } from '@/hooks/useAuth';

interface ContentNicheData {
  niches: string[];
  professional_level: number;
  content_styles: string[];
  content_examples: string[];
  primary_language: string;
}

interface ContentNicheStepProps {
  data: ContentNicheData;
  onChange: (data: Partial<ContentNicheData>) => void;
}

const nicheOptions = [
  { value: 'gaming', label: 'Gaming' },
  { value: 'tech', label: 'Tech' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'beauty', label: 'Beauty' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'food', label: 'Food & Cooking' },
  { value: 'travel', label: 'Travel' },
  { value: 'education', label: 'Education' },
  { value: 'comedy', label: 'Comedy' },
  { value: 'music', label: 'Music' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'business', label: 'Business' },
  { value: 'sports', label: 'Sports' },
  { value: 'art', label: 'Art' },
  { value: 'parenting', label: 'Parenting' }
];

const contentStyleOptions = [
  { value: 'educational', label: 'Educational' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'reviews', label: 'Reviews' },
  { value: 'tutorials', label: 'Tutorials' },
  { value: 'vlogs', label: 'Vlogs' },
  { value: 'livestreams', label: 'Live Streams' },
  { value: 'unboxing', label: 'Unboxing' },
  { value: 'challenges', label: 'Challenges' },
  { value: 'storytelling', label: 'Storytelling' }
];

const languageOptions = [
  { value: 'english', label: 'English' },
  { value: 'french', label: 'French' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'german', label: 'German' },
  { value: 'italian', label: 'Italian' },
  { value: 'other', label: 'Other' }
];

const professionalLevels = [
  { value: 1, label: 'Hobby' },
  { value: 3, label: 'Enthusiast' },
  { value: 5, label: 'Semi-Pro' },
  { value: 7, label: 'Professional' },
  { value: 10, label: 'Expert' }
];

export function ContentNicheStep({ data, onChange }: ContentNicheStepProps) {
  const { user } = useAuth();
  const [contentExamples, setContentExamples] = useState<string[]>(data.content_examples || []);

  const handleContentExampleUpload = (url: string) => {
    if (contentExamples.length < 3) {
      const newExamples = [...contentExamples, url];
      setContentExamples(newExamples);
      onChange({ content_examples: newExamples });
    }
  };

  const handleContentExampleRemove = (index: number) => {
    const newExamples = contentExamples.filter((_, i) => i !== index);
    setContentExamples(newExamples);
    onChange({ content_examples: newExamples });
  };

  const getProfessionalLevelLabel = (value: number) => {
    const level = professionalLevels.find(l => l.value === value);
    return level ? level.label : `Level ${value}`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Your Creative Universe
        </h2>
        <p className="text-muted-foreground mt-2">
          Help us understand your style and specialties
        </p>
      </div>

      {/* Content Niches */}
      <div className="space-y-2">
        <Label>Content Areas *</Label>
        <MultiSelect
          options={nicheOptions}
          value={data.niches || []}
          onChange={(value) => onChange({ niches: value })}
          placeholder="Select your areas of expertise"
        />
        <p className="text-xs text-muted-foreground">
          Choose up to 5 areas that best match your content
        </p>
      </div>

      {/* Professional Level */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Professional Level *</Label>
          <p className="text-sm text-muted-foreground">
            Where are you in your creator journey?
          </p>
        </div>
        
        <div className="space-y-4">
          <Slider
            value={[data.professional_level || 5]}
            onValueChange={(value) => onChange({ professional_level: value[0] })}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Hobby</span>
            <span className="font-medium text-foreground">
              {getProfessionalLevelLabel(data.professional_level || 5)}
            </span>
            <span>Expert</span>
          </div>
        </div>
      </div>

      {/* Content Styles */}
      <div className="space-y-2">
        <Label>Content Types *</Label>
        <MultiSelect
          options={contentStyleOptions}
          value={data.content_styles || []}
          onChange={(value) => onChange({ content_styles: value })}
          placeholder="Select your content styles"
        />
        <p className="text-xs text-muted-foreground">
          Which formats do you use most often?
        </p>
      </div>

      {/* Primary Language */}
      <div className="space-y-2">
        <Label htmlFor="language">Primary Content Language *</Label>
        <Select 
          value={data.primary_language || ''} 
          onValueChange={(value) => onChange({ primary_language: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your primary language" />
          </SelectTrigger>
          <SelectContent>
            {languageOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Content Examples */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Content Examples ({contentExamples.length}/3)</Label>
          <p className="text-sm text-muted-foreground">
            Upload up to 3 representative examples of your work
          </p>
        </div>

        <div className="grid gap-4">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="space-y-2">
              <Label>Example {index + 1} {index === 0 ? '*' : '(optional)'}</Label>
              {contentExamples[index] ? (
                <div className="relative">
                  <img
                    src={contentExamples[index]}
                    alt={`Example ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <button
                    onClick={() => handleContentExampleRemove(index)}
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-destructive/90"
                  >
                    ×
                  </button>
                </div>
              ) : (
                contentExamples.length === index && (
                  <ImageUpload
                    onUpload={handleContentExampleUpload}
                    bucket="creator-content"
                    folder={`${user?.id}/examples`}
                    placeholder={`Upload example ${index + 1}`}
                    className="h-32"
                  />
                )
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
        <p className="text-sm text-purple-800 dark:text-purple-200">
          🎨 <strong>Creative tip:</strong> Choose examples that showcase the diversity of your content 
          and highlight your unique style. These examples will help brands understand your creative universe.
        </p>
      </div>
    </div>
  );
}