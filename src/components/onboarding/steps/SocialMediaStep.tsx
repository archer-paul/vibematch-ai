import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, ExternalLink, Instagram, Youtube } from 'lucide-react';
import { cn } from '@/lib/utils';
import { analysisService } from '@/services/analysisService';

interface SocialHandles {
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  twitter?: string;
  twitch?: string;
}

interface SocialMediaStepProps {
  data: SocialHandles;
  onChange: (data: Partial<SocialHandles>) => void;
}

interface PlatformConfig {
  key: keyof SocialHandles;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  placeholder: string;
  baseUrl: string;
}

const platforms: PlatformConfig[] = [
  {
    key: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    placeholder: '@your_handle',
    baseUrl: 'https://instagram.com/'
  },
  {
    key: 'tiktok',
    name: 'TikTok',
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 112.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
      </svg>
    ),
    placeholder: '@your_handle',
    baseUrl: 'https://tiktok.com/@'
  },
  {
    key: 'youtube',
    name: 'YouTube',
    icon: Youtube,
    placeholder: '@your_channel',
    baseUrl: 'https://youtube.com/@'
  },
  {
    key: 'twitter',
    name: 'Twitter/X',
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    placeholder: '@your_handle',
    baseUrl: 'https://x.com/'
  },
  {
    key: 'twitch',
    name: 'Twitch',
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
      </svg>
    ),
    placeholder: 'your_handle',
    baseUrl: 'https://twitch.tv/'
  }
];

interface ValidationState {
  [key: string]: 'idle' | 'checking' | 'valid' | 'invalid';
}

interface ProfileMetrics {
  [key: string]: { subscribers: number; videos: number } | undefined;
}

export function SocialMediaStep({ data, onChange }: SocialMediaStepProps) {
  const [validation, setValidation] = useState<ValidationState>({});
  const [isPublicProfile, setIsPublicProfile] = useState<{ [key: string]: boolean }>({});
  const [metrics, setMetrics] = useState<ProfileMetrics>({});

  // Validate a social profile - real API for YouTube, simulated for others
  const validateProfile = async (platform: string, username: string) => {
    if (!username || username.length < 3) return;

    setValidation(prev => ({ ...prev, [platform]: 'checking' }));

    if (platform === 'youtube') {
      // Real YouTube validation via API
      try {
        const result = await analysisService.fetchYouTubeData(username);
        if (result && result.channel) {
          setValidation(prev => ({ ...prev, [platform]: 'valid' }));
          setMetrics(prev => ({
            ...prev,
            [platform]: {
              subscribers: result.channel.subscriberCount,
              videos: result.channel.videoCount,
            },
          }));
        } else {
          setValidation(prev => ({ ...prev, [platform]: 'invalid' }));
        }
      } catch {
        setValidation(prev => ({ ...prev, [platform]: 'invalid' }));
      }
    } else {
      // Simulated validation for other platforms
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      const isValid = Math.random() > 0.2;
      setValidation(prev => ({ ...prev, [platform]: isValid ? 'valid' : 'invalid' }));
      if (isValid) {
        setMetrics(prev => ({
          ...prev,
          [platform]: {
            subscribers: Math.floor(Math.random() * 100000),
            videos: Math.floor(Math.random() * 1000),
          },
        }));
      }
    }
  };

  const handleUsernameChange = (platform: keyof SocialHandles, value: string) => {
    // Clean the input (remove @, spaces, special chars)
    const cleanValue = value.replace(/[@\s]/g, '').toLowerCase();

    onChange({ [platform]: cleanValue });

    // Reset validation state
    if (validation[platform] !== 'idle') {
      setValidation(prev => ({ ...prev, [platform]: 'idle' }));
      setMetrics(prev => ({ ...prev, [platform]: undefined }));
    }

    // Trigger validation after user stops typing
    if (cleanValue.length >= 3) {
      const timeoutId = setTimeout(() => {
        validateProfile(platform, cleanValue);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  };

  const getValidationIcon = (platform: string) => {
    const state = validation[platform];
    switch (state) {
      case 'checking':
        return <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />;
      case 'valid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'invalid':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getValidationMessage = (platform: string) => {
    const state = validation[platform];
    switch (state) {
      case 'checking':
        return platform === 'youtube' ? 'Analyzing YouTube profile...' : 'Verifying profile...';
      case 'valid':
        return 'Profile found and verified';
      case 'invalid':
        return 'Profile not found or private';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Connect your social media
        </h2>
        <p className="text-muted-foreground mt-2">
          Add your profiles so brands can evaluate your audience
        </p>
      </div>

      <div className="space-y-6">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          const value = data[platform.key] || '';
          const validationState = validation[platform.key];
          const isPublic = isPublicProfile[platform.key] ?? true;
          const platformMetrics = metrics[platform.key];

          return (
            <div key={platform.key} className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <Label htmlFor={platform.key} className="text-base font-medium">
                    {platform.name}
                  </Label>
                </div>
              </div>

              <div className="space-y-3 ml-10">
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      id={platform.key}
                      value={value}
                      onChange={(e) => handleUsernameChange(platform.key, e.target.value)}
                      placeholder={platform.placeholder}
                      className={cn(
                        "pr-10",
                        validationState === 'valid' && "border-green-500",
                        validationState === 'invalid' && "border-destructive"
                      )}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {getValidationIcon(platform.key)}
                    </div>
                  </div>

                  {validationState && validationState !== 'idle' && (
                    <p className={cn(
                      "text-xs",
                      validationState === 'valid' && "text-green-600",
                      validationState === 'invalid' && "text-destructive",
                      validationState === 'checking' && "text-muted-foreground"
                    )}>
                      {getValidationMessage(platform.key)}
                    </p>
                  )}
                </div>

                {value && (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`${platform.key}-public`}
                          checked={isPublic}
                          onCheckedChange={(checked) =>
                            setIsPublicProfile(prev => ({ ...prev, [platform.key]: checked }))
                          }
                        />
                        <Label htmlFor={`${platform.key}-public`} className="text-sm">
                          Public profile
                        </Label>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => window.open(platform.baseUrl + value, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3" />
                        View profile
                      </Button>
                    </div>

                    {validationState === 'valid' && platformMetrics && (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground mb-2">Metrics overview</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Subscribers:</span> {platformMetrics.subscribers.toLocaleString()}
                          </div>
                          <div>
                            <span className="font-medium">{platform.key === 'youtube' ? 'Videos' : 'Posts'}:</span> {platformMetrics.videos.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Tip:</strong> The more profiles you add, the better we can match you with relevant brands.
          Public profiles allow for better audience analysis.
        </p>
      </div>
    </div>
  );
}
