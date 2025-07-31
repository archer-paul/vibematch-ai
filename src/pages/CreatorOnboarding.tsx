import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ProgressIndicator } from '@/components/onboarding/ProgressIndicator';
import { PersonalInfoStep } from '@/components/onboarding/steps/PersonalInfoStep';
import { SocialMediaStep } from '@/components/onboarding/steps/SocialMediaStep';
import { ContentNicheStep } from '@/components/onboarding/steps/ContentNicheStep';
import { GoalsPreferencesStep } from '@/components/onboarding/steps/GoalsPreferencesStep';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';

interface OnboardingData {
  // Personal Info
  display_name: string;
  bio: string;
  tagline: string;
  location: { country: string; city: string };
  avatar_url?: string;
  
  // Social Media
  social_handles: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    twitter?: string;
    twitch?: string;
  };
  
  // Content & Niche
  niches: string[];
  professional_level: number;
  content_styles: string[];
  content_examples: string[];
  primary_language: string;
  
  // Goals & Preferences
  collaboration_types: string[];
  rate_range?: { min: number; max: number };
  preferred_sectors: string[];
  avoided_sectors: string[];
  availability_hours: string;
  geographic_scope: string;
  prefer_to_discuss_rates: boolean;
}

const initialData: OnboardingData = {
  display_name: '',
  bio: '',
  tagline: '',
  location: { country: '', city: '' },
  social_handles: {},
  niches: [],
  professional_level: 5,
  content_styles: [],
  content_examples: [],
  primary_language: 'english',
  collaboration_types: [],
  preferred_sectors: [],
  avoided_sectors: [],
  availability_hours: '',
  geographic_scope: '',
  prefer_to_discuss_rates: false
};

const stepTitles = [
  'Profile',
  'Social Media',
  'Content',
  'Goals'
];

export default function CreatorOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([false, false, false, false]);
  const [saving, setSaving] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load existing data on mount
  useEffect(() => {
    if (profile) {
      setData(prev => ({
        ...prev,
        display_name: profile.display_name || profile.full_name || '',
        bio: profile.bio || '',
        tagline: profile.tagline || '',
        location: profile.location || { country: '', city: '' },
        avatar_url: profile.avatar_url,
        social_handles: profile.social_handles || {},
        niches: profile.niches || [],
        professional_level: profile.professional_level || 5,
        content_styles: profile.content_styles || [],
        content_examples: profile.content_examples || [],
        collaboration_types: profile.collaboration_types || [],
        rate_range: profile.rate_range,
        preferred_sectors: profile.preferred_sectors || [],
        avoided_sectors: profile.avoided_sectors || [],
        availability_hours: profile.availability_hours || '',
        geographic_scope: profile.geographic_scope || ''
      }));
    }
  }, [profile]);

  // Validate current step
  useEffect(() => {
    let valid = false;
    
    switch (currentStep) {
      case 1:
        valid = !!(data.display_name && data.bio && data.location.country && data.location.city);
        break;
      case 2:
        // Social media step is optional but at least one platform is recommended
        valid = true;
        break;
      case 3:
        valid = !!(data.niches.length > 0 && data.content_styles.length > 0 && data.content_examples.length > 0);
        break;
      case 4:
        valid = !!(data.collaboration_types.length > 0 && data.availability_hours && data.geographic_scope);
        break;
    }
    
    setIsFormValid(valid);
  }, [currentStep, data]);

  const updateData = (stepData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...stepData }));
  };

  const saveProgress = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: data.display_name,
          bio: data.bio,
          tagline: data.tagline,
          location: data.location,
          avatar_url: data.avatar_url,
          social_handles: data.social_handles,
          niches: data.niches,
          professional_level: data.professional_level,
          content_styles: data.content_styles,
          content_examples: data.content_examples,
          collaboration_types: data.collaboration_types,
          rate_range: data.prefer_to_discuss_rates ? null : data.rate_range,
          preferred_sectors: data.preferred_sectors,
          avoided_sectors: data.avoided_sectors,
          availability_hours: data.availability_hours,
          geographic_scope: data.geographic_scope,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Progress Saved",
        description: "Your information has been saved successfully."
      });
    } catch (error) {
      console.error('Error saving progress:', error);
      toast({
        variant: "destructive",
        title: "Save Error",
        description: "Unable to save your information."
      });
    } finally {
      setSaving(false);
    }
  };

  const completeOnboarding = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: data.display_name,
          bio: data.bio,
          tagline: data.tagline,
          location: data.location,
          avatar_url: data.avatar_url,
          social_handles: data.social_handles,
          niches: data.niches,
          professional_level: data.professional_level,
          content_styles: data.content_styles,
          content_examples: data.content_examples,
          collaboration_types: data.collaboration_types,
          rate_range: data.prefer_to_discuss_rates ? null : data.rate_range,
          preferred_sectors: data.preferred_sectors,
          avoided_sectors: data.avoided_sectors,
          availability_hours: data.availability_hours,
          geographic_scope: data.geographic_scope,
          onboarding_completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "🎉 Welcome to VibeMatch!",
        description: "Your creator profile is now set up. AI analysis of your profile will begin."
      });

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to complete registration."
      });
    } finally {
      setSaving(false);
    }
  };

  const nextStep = async () => {
    if (currentStep < 4) {
      // Mark current step as completed
      const newCompleted = [...completedSteps];
      newCompleted[currentStep - 1] = true;
      setCompletedSteps(newCompleted);
      
      // Save progress
      await saveProgress();
      
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      await completeOnboarding();
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep 
            data={{
              display_name: data.display_name,
              bio: data.bio,
              tagline: data.tagline,
              location: data.location,
              avatar_url: data.avatar_url
            }}
            onChange={updateData}
          />
        );
      case 2:
        return (
          <SocialMediaStep 
            data={data.social_handles}
            onChange={(social_handles) => updateData({ social_handles })}
          />
        );
      case 3:
        return (
          <ContentNicheStep 
            data={{
              niches: data.niches,
              professional_level: data.professional_level,
              content_styles: data.content_styles,
              content_examples: data.content_examples,
              primary_language: data.primary_language
            }}
            onChange={updateData}
          />
        );
      case 4:
        return (
          <GoalsPreferencesStep 
            data={{
              collaboration_types: data.collaboration_types,
              rate_range: data.rate_range,
              preferred_sectors: data.preferred_sectors,
              avoided_sectors: data.avoided_sectors,
              availability_hours: data.availability_hours,
              geographic_scope: data.geographic_scope,
              prefer_to_discuss_rates: data.prefer_to_discuss_rates
            }}
            onChange={updateData}
          />
        );
      default:
        return null;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-indigo-950/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
              VibeMatch
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Set up your creator profile
            </p>
          </div>

          {/* Progress Indicator */}
          <ProgressIndicator
            currentStep={currentStep}
            totalSteps={4}
            completedSteps={completedSteps}
            stepTitles={stepTitles}
          />

          {/* Step Content */}
          <div className="bg-card rounded-xl shadow-lg border p-8 mb-8">
            {renderCurrentStep()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={previousStep}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={saveProgress}
                disabled={saving}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save'}
              </Button>

              <Button
                onClick={nextStep}
                disabled={!isFormValid || saving}
                className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              >
                {currentStep === 4 ? 'Complete' : 'Next'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}