import { Router } from 'express';
import { supabaseAdmin } from './supabase.js';
import { calculateMatchScore } from './scoring.js';
import { analyzeCompatibility } from './openai-analyzer.js';

const router = Router();

/**
 * POST /score
 * Body: { creatorProfileId: string, sponsorProfileId: string }
 *
 * Calculates compatibility score between a creator and sponsor.
 * Uses deterministic scoring first, then optionally enriches with OpenAI.
 */
router.post('/score', async (req, res) => {
  try {
    const { creatorProfileId, sponsorProfileId } = req.body;

    if (!creatorProfileId || !sponsorProfileId) {
      return res.status(400).json({
        error: 'Missing creatorProfileId or sponsorProfileId',
      });
    }

    // 1. Fetch both profiles
    const [creatorResult, sponsorResult] = await Promise.all([
      supabaseAdmin.from('profiles').select('*').eq('id', creatorProfileId).single(),
      supabaseAdmin.from('profiles').select('*').eq('id', sponsorProfileId).single(),
    ]);

    if (creatorResult.error || !creatorResult.data) {
      return res.status(404).json({ error: 'Creator profile not found' });
    }
    if (sponsorResult.error || !sponsorResult.data) {
      return res.status(404).json({ error: 'Sponsor profile not found' });
    }

    const creatorProfile = creatorResult.data;
    const sponsorProfile = sponsorResult.data;

    // 2. Fetch existing AI analysis for creator
    const { data: analysisData } = await supabaseAdmin
      .from('ai_analysis')
      .select('*')
      .eq('profile_id', creatorProfileId)
      .eq('analysis_type', 'creator_profile')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // 3. Build creator data for scoring
    const creatorData = {
      detectedNiches: creatorProfile.niches || [],
      subscriberCount: creatorProfile.follower_counts?.youtube || 0,
      engagementRate: creatorProfile.engagement_rate || 0,
      contentStyles: creatorProfile.content_styles || [],
      publishFrequencyDays: analysisData?.analysis_data?.youtubeData?.publishFrequencyDays || 0,
      lastPublishDate: null,
    };

    // 4. Deterministic scoring (fast, no API calls)
    const deterministicScore = calculateMatchScore(creatorData, sponsorProfile);

    // 5. If we have existing AI analysis, also compute OpenAI compatibility
    let aiCompatibility = null;
    if (analysisData?.analysis_data?.creatorAnalysis) {
      try {
        aiCompatibility = await analyzeCompatibility(
          analysisData.analysis_data.creatorAnalysis,
          sponsorProfile
        );
      } catch (e) {
        console.error('OpenAI compatibility analysis failed (non-blocking):', e.message);
      }
    }

    // 6. Combine scores
    const finalScore = aiCompatibility
      ? Math.round(deterministicScore.overallScore * 0.4 + aiCompatibility.compatibilityScore * 0.6)
      : deterministicScore.overallScore;

    // 7. Store match result
    try {
      await supabaseAdmin.from('matchings').upsert({
        creator_id: creatorProfile.user_id,
        sponsor_id: sponsorProfile.user_id,
        compatibility_score: finalScore,
        match_factors: {
          deterministic: deterministicScore,
          ai: aiCompatibility,
        },
      }, {
        onConflict: 'creator_id,sponsor_id',
      });
    } catch (dbError) {
      console.error('Match storage error (non-blocking):', dbError.message);
    }

    res.json({
      score: finalScore,
      factors: aiCompatibility
        ? [
            `Niche Alignment: ${deterministicScore.breakdown.nicheAlignment}%`,
            `Engagement Quality: ${deterministicScore.breakdown.engagementQuality}%`,
            `Audience Fit: ${deterministicScore.breakdown.audienceSize}%`,
            `Brand Safety: ${deterministicScore.breakdown.brandSafety}%`,
            `Content Compatibility: ${deterministicScore.breakdown.contentCompatibility}%`,
          ]
        : [
            `Niche Alignment: ${deterministicScore.breakdown.nicheAlignment}%`,
            `Engagement Quality: ${deterministicScore.breakdown.engagementQuality}%`,
            `Activity Score: ${deterministicScore.breakdown.activity}%`,
          ],
      recommendations: aiCompatibility?.recommendations || [
        'Complete YouTube analysis for better matching',
      ],
      breakdown: deterministicScore.breakdown,
      aiAnalysis: aiCompatibility,
      processingTime: 0,
    });
  } catch (error) {
    console.error('Match scoring error:', error);
    res.status(500).json({
      error: 'Match scoring failed',
      message: error.message,
    });
  }
});

export default router;
