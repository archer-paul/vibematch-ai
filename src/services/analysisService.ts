import { supabase } from "@/integrations/supabase/client";

export interface CerebrasAnalysisResult {
  score: number;
  factors: string[];
  recommendations: string[];
  processingTime: number;
}

export interface ProfileData {
  id: string;
  niches: string[];
  content_styles: string[];
  collaboration_types: string[];
  bio: string;
  professional_level: number;
  user_type: 'creator' | 'sponsor';
  preferred_sectors?: string[];
  campaign_objectives?: string[];
  budget_range?: string;
}

export interface YouTubeChannelData {
  channelTitle: string;
  subscriberCount: number;
  videoCount: number;
  engagementRate: number;
}

export interface CreatorAnalysisResult {
  overallScore: number;
  categories: {
    // New text-focused categories
    vocabularyLanguage?: number;
    seoMetadata?: number;
    engagement?: number;
    audienceReach?: number;
    topicalAuthority?: number;
    toneBrandVoice?: number;
    // Legacy categories (backward compat)
    contentProduction?: number;
    textAnalysis?: number;
    audience?: number;
    themes?: number;
    brandPersonality?: number;
  };
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  detectedNiches: string[];
  contentStyle: string;
}

export interface FullAnalysisResult {
  success: boolean;
  analysis: CreatorAnalysisResult;
  youtube: YouTubeChannelData;
  niches: Array<{ niche: string; confidence: number }>;
}

function isDemoMode(): boolean {
  try {
    return localStorage.getItem('demo-mode') === 'true';
  } catch {
    return false;
  }
}

class AnalysisService {
  /**
   * Fetch YouTube channel data for a handle.
   */
  async fetchYouTubeData(handle: string): Promise<{
    channel: YouTubeChannelData;
    metrics: { engagementRate: number; avgViews: number };
  } | null> {
    if (isDemoMode()) {
      return this.mockYouTubeData(handle);
    }

    try {
      const response = await fetch('/api/youtube/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle }),
      });

      if (!response.ok) {
        console.warn('YouTube API failed, using fallback');
        return this.mockYouTubeData(handle);
      }

      const data = await response.json();
      return {
        channel: {
          channelTitle: data.channel.title,
          subscriberCount: data.channel.subscriberCount,
          videoCount: data.channel.videoCount,
          engagementRate: data.metrics.engagementRate,
        },
        metrics: {
          engagementRate: data.metrics.engagementRate,
          avgViews: data.metrics.avgViews,
        },
      };
    } catch (error) {
      console.error('YouTube fetch error:', error);
      return this.mockYouTubeData(handle);
    }
  }

  /**
   * Run full profile analysis (YouTube + LDA + OpenAI).
   */
  async analyzeProfile(youtubeHandle: string, profileId: string): Promise<FullAnalysisResult | null> {
    if (isDemoMode()) {
      return this.mockAnalysis();
    }

    try {
      const response = await fetch('/api/analyze/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtubeHandle, profileId }),
      });

      if (!response.ok) {
        console.warn('Profile analysis API failed, using fallback');
        return this.mockAnalysis();
      }

      return await response.json();
    } catch (error) {
      console.error('Profile analysis error:', error);
      return this.mockAnalysis();
    }
  }

  /**
   * Analyze compatibility between a creator and sponsor.
   * Compatible with old cerebrasService.analyzeProfileCompatibility interface.
   */
  async analyzeProfileCompatibility(
    userProfile: ProfileData,
    targetProfile: ProfileData
  ): Promise<CerebrasAnalysisResult> {
    const startTime = Date.now();

    if (isDemoMode()) {
      return this.fallbackAnalysis(userProfile, targetProfile, Date.now() - startTime);
    }

    try {
      const response = await fetch('/api/match/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorProfileId: userProfile.id,
          sponsorProfileId: targetProfile.id,
        }),
      });

      if (!response.ok) {
        return this.fallbackAnalysis(userProfile, targetProfile, Date.now() - startTime);
      }

      const data = await response.json();
      const processingTime = Date.now() - startTime;

      return {
        score: data.score,
        factors: data.factors || [],
        recommendations: data.recommendations || [],
        processingTime,
      };
    } catch (error) {
      console.error('Compatibility analysis error:', error);
      return this.fallbackAnalysis(userProfile, targetProfile, Date.now() - startTime);
    }
  }

  /**
   * Fetch stored AI analysis from Supabase for a profile.
   */
  async getStoredAnalysis(profileId: string): Promise<CreatorAnalysisResult | null> {
    try {
      const { data, error } = await supabase
        .from('ai_analysis')
        .select('*')
        .eq('profile_id', profileId)
        .eq('analysis_type', 'creator_profile')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) return null;

      const analysisData = data.analysis_data as Record<string, unknown>;
      const creatorAnalysis = analysisData?.creatorAnalysis as CreatorAnalysisResult | undefined;
      if (!creatorAnalysis) return null;

      return {
        overallScore: creatorAnalysis.overallScore || data.cerebras_score || 0,
        categories: creatorAnalysis.categories || {
          vocabularyLanguage: 0,
          seoMetadata: 0,
          engagement: 0,
          audienceReach: 0,
          topicalAuthority: 0,
          toneBrandVoice: 0,
        },
        summary: creatorAnalysis.summary || '',
        strengths: creatorAnalysis.strengths || [],
        weaknesses: creatorAnalysis.weaknesses || [],
        recommendations: creatorAnalysis.recommendations || [],
        detectedNiches: creatorAnalysis.detectedNiches || [],
        contentStyle: creatorAnalysis.contentStyle || '',
      };
    } catch (error) {
      console.error('Error fetching stored analysis:', error);
      return null;
    }
  }

  /**
   * Profile optimization (kept for backward compat).
   */
  async optimizeProfile(profile: ProfileData): Promise<{
    score: number;
    suggestions: string[];
    optimizedFields: Record<string, unknown>;
  }> {
    return {
      score: 75,
      suggestions: [
        "Add more specific niche information",
        "Include recent collaboration examples",
        "Update professional level metrics"
      ],
      optimizedFields: {},
    };
  }

  getProcessingMessage(step: string): string {
    const messages: Record<string, string> = {
      analyzing: "Analyzing profiles with VibeMatch AI...",
      matching: "Powered by VibeMatch AI intelligent matching",
      optimizing: "Processing with VibeMatch AI...",
      discovering: "VibeMatch AI discovering potential matches...",
      scoring: "AI insights generated by VibeMatch"
    };
    return messages[step] || "Processing with VibeMatch AI...";
  }

  // --- Fallback / mock methods ---

  private fallbackAnalysis(
    userProfile: ProfileData,
    targetProfile: ProfileData,
    processingTime: number
  ): CerebrasAnalysisResult {
    let score = 50;

    const commonNiches = userProfile.niches.filter(niche =>
      targetProfile.niches?.includes(niche) ||
      targetProfile.preferred_sectors?.includes(niche)
    );
    score += commonNiches.length * 10;

    if (userProfile.user_type === 'creator' && targetProfile.user_type === 'sponsor') {
      score += 20;
    }

    const compatibleStyles = userProfile.content_styles.filter(style =>
      ['educational', 'tutorials', 'reviews', 'vlogs'].includes(style)
    );
    score += compatibleStyles.length * 5;

    return {
      score: Math.min(score, 95),
      factors: [
        `${commonNiches.length} matching niches`,
        'Profile completeness',
        'Professional level alignment'
      ],
      recommendations: [
        'Complete your profile for better matching',
        'Add more specific niche details',
        'Include recent collaboration examples'
      ],
      processingTime
    };
  }

  private mockYouTubeData(handle: string) {
    const seed = handle.length * 7;
    return {
      channel: {
        channelTitle: handle.replace('@', ''),
        subscriberCount: 10000 + (seed * 1337) % 990000,
        videoCount: 50 + (seed * 13) % 950,
        engagementRate: 1.5 + (seed % 80) / 10,
      },
      metrics: {
        engagementRate: 1.5 + (seed % 80) / 10,
        avgViews: 1000 + (seed * 97) % 99000,
      },
    };
  }

  private mockAnalysis(): FullAnalysisResult {
    return {
      success: true,
      analysis: {
        overallScore: 72,
        categories: {
          vocabularyLanguage: 75,
          seoMetadata: 68,
          engagement: 70,
          audienceReach: 65,
          topicalAuthority: 78,
          toneBrandVoice: 74,
        },
        summary: 'Active content creator with consistent publishing schedule and engaged community.',
        strengths: ['Consistent publishing', 'Good engagement rate', 'Clear niche focus'],
        weaknesses: ['Could improve SEO', 'Limited audience reach'],
        recommendations: [
          'Optimize video titles for discoverability',
          'Increase collaboration with other creators',
          'Diversify content formats',
        ],
        detectedNiches: ['Technology', 'Education'],
        contentStyle: 'Educational tutorials and reviews',
      },
      youtube: {
        channelTitle: 'Demo Channel',
        subscriberCount: 45000,
        videoCount: 230,
        engagementRate: 4.2,
      },
      niches: [
        { niche: 'Technology', confidence: 0.85 },
        { niche: 'Education', confidence: 0.65 },
      ],
    };
  }
}

export const analysisService = new AnalysisService();

// Backward-compatible exports
export const cerebrasService = analysisService;
export default analysisService;
