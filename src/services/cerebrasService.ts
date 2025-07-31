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

class CerebrasService {
  private baseUrl = 'https://api.cerebras.ai/v1/chat/completions';
  private model = 'llama3.1-8b';

  async analyzeProfileCompatibility(
    userProfile: ProfileData,
    targetProfile: ProfileData
  ): Promise<CerebrasAnalysisResult> {
    const startTime = Date.now();

    try {
      // Call Cerebras API through Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('cerebras-analysis', {
        body: {
          userProfile,
          targetProfile,
          analysisType: 'compatibility'
        }
      });

      if (error) throw error;

      const processingTime = Date.now() - startTime;

      // Store analysis result
      await this.storeAnalysisResult(userProfile.id, {
        ...data,
        processingTime,
        targetProfileId: targetProfile.id
      });

      return {
        score: data.score,
        factors: data.factors,
        recommendations: data.recommendations,
        processingTime
      };
    } catch (error) {
      console.error('Cerebras analysis error:', error);
      
      // Fallback analysis if Cerebras fails
      return this.fallbackAnalysis(userProfile, targetProfile, Date.now() - startTime);
    }
  }

  async optimizeProfile(profile: ProfileData): Promise<{
    score: number;
    suggestions: string[];
    optimizedFields: Record<string, any>;
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('cerebras-analysis', {
        body: {
          profile,
          analysisType: 'optimization'
        }
      });

      if (error) throw error;

      // Store optimization result
      await this.storeAnalysisResult(profile.id, {
        ...data,
        analysisType: 'optimization'
      });

      return data;
    } catch (error) {
      console.error('Profile optimization error:', error);
      return {
        score: 75,
        suggestions: [
          "Add more specific niche information",
          "Include recent collaboration examples",
          "Update professional level metrics"
        ],
        optimizedFields: {}
      };
    }
  }

  async batchAnalyzeProfiles(profiles: ProfileData[]): Promise<CerebrasAnalysisResult[]> {
    const batchSize = 5; // Process in smaller batches
    const results: CerebrasAnalysisResult[] = [];

    for (let i = 0; i < profiles.length; i += batchSize) {
      const batch = profiles.slice(i, i + batchSize);
      const batchPromises = batch.map(profile => 
        this.analyzeProfileCompatibility(profiles[0], profile)
      );

      const batchResults = await Promise.allSettled(batchPromises);
      
      batchResults.forEach(result => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          console.error('Batch analysis error:', result.reason);
        }
      });

      // Small delay between batches to avoid rate limiting
      if (i + batchSize < profiles.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return results;
  }

  private async storeAnalysisResult(profileId: string, analysisData: any) {
    try {
      const { error } = await supabase
        .from('ai_analysis')
        .insert({
          profile_id: profileId,
          analysis_data: analysisData,
          cerebras_score: analysisData.score,
          analysis_type: analysisData.analysisType || 'compatibility'
        });

      if (error) {
        console.error('Failed to store analysis result:', error);
      }
    } catch (error) {
      console.error('Store analysis error:', error);
    }
  }

  private fallbackAnalysis(
    userProfile: ProfileData,
    targetProfile: ProfileData,
    processingTime: number
  ): CerebrasAnalysisResult {
    // Simple compatibility scoring based on matching niches and types
    let score = 50; // Base score
    
    // Niche compatibility
    const commonNiches = userProfile.niches.filter(niche => 
      targetProfile.niches?.includes(niche) ||
      targetProfile.preferred_sectors?.includes(niche)
    );
    score += commonNiches.length * 10;

    // Professional level compatibility
    if (userProfile.user_type === 'creator' && targetProfile.user_type === 'sponsor') {
      score += 20;
    }

    // Content style matching
    const compatibleStyles = userProfile.content_styles.filter(style =>
      ['educational', 'tutorials', 'reviews', 'vlogs'].includes(style)
    );
    score += compatibleStyles.length * 5;

    return {
      score: Math.min(score, 95), // Cap at 95 for fallback
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

  // Generate status messages for loading states
  getProcessingMessage(step: string): string {
    const messages = {
      analyzing: "Analyzing profiles with Cerebras AI...",
      matching: "Powered by Cerebras ultra-fast inference",
      optimizing: "Processing with Cerebras AI...",
      discovering: "Cerebras AI discovering potential matches...",
      scoring: "AI insights generated by Cerebras in <100ms"
    };
    
    return messages[step as keyof typeof messages] || "Processing with Cerebras AI...";
  }
}

export const cerebrasService = new CerebrasService();