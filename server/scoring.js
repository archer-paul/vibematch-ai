/**
 * Deterministic scoring engine for fast creator-sponsor matching.
 * No LLM calls — purely algorithmic based on ~30 measurable criteria.
 * Used for sorting/recommendations. Full OpenAI analysis is reserved for explicit interactions.
 */

// Audience size tiers and their ideal budget ranges
const AUDIENCE_TIERS = [
  { min: 0, max: 1000, label: 'nano', idealBudgets: ['0-500', '500-2000'] },
  { min: 1000, max: 10000, label: 'micro', idealBudgets: ['500-2000', '2000-5000'] },
  { min: 10000, max: 100000, label: 'mid', idealBudgets: ['2000-5000', '5000-20000'] },
  { min: 100000, max: 1000000, label: 'macro', idealBudgets: ['5000-20000', '20000-100000'] },
  { min: 1000000, max: Infinity, label: 'mega', idealBudgets: ['20000-100000', '100000+'] },
];

// Engagement rate benchmarks by audience tier
const ENGAGEMENT_BENCHMARKS = {
  nano: { excellent: 8, good: 5, average: 3 },
  micro: { excellent: 5, good: 3, average: 1.5 },
  mid: { excellent: 3, good: 1.5, average: 0.8 },
  macro: { excellent: 2, good: 1, average: 0.5 },
  mega: { excellent: 1.5, good: 0.8, average: 0.3 },
};

/**
 * Get audience tier for a subscriber count.
 */
function getAudienceTier(subscriberCount) {
  return AUDIENCE_TIERS.find(
    (t) => subscriberCount >= t.min && subscriberCount < t.max
  ) || AUDIENCE_TIERS[0];
}

/**
 * Calculate niche alignment score (0-100).
 * Weight: 30%
 */
function nicheAlignmentScore(creatorNiches, sponsorSectors) {
  if (!creatorNiches?.length || !sponsorSectors?.length) return 40;

  const creatorSet = new Set(creatorNiches.map((n) => n.toLowerCase()));
  const sponsorSet = new Set(sponsorSectors.map((s) => s.toLowerCase()));

  let matches = 0;
  for (const niche of creatorSet) {
    if (sponsorSet.has(niche)) {
      matches++;
    }
    // Partial matching for related niches
    for (const sector of sponsorSet) {
      if (niche.includes(sector) || sector.includes(niche)) {
        matches += 0.5;
      }
    }
  }

  const maxPossible = Math.min(creatorSet.size, sponsorSet.size);
  if (maxPossible === 0) return 40;

  return Math.min(100, Math.round((matches / maxPossible) * 100));
}

/**
 * Calculate audience size fit score (0-100).
 * Weight: 15%
 */
function audienceSizeScore(subscriberCount, budgetRange) {
  const tier = getAudienceTier(subscriberCount);

  if (!budgetRange) return 50;

  const budgetLower = budgetRange.toLowerCase().replace(/\s/g, '');

  // Check if budget matches audience tier
  if (tier.idealBudgets.some((b) => budgetLower.includes(b) || b.includes(budgetLower))) {
    return 90;
  }

  // Adjacent tier is still OK
  const tierIndex = AUDIENCE_TIERS.indexOf(tier);
  const adjacentTiers = [
    AUDIENCE_TIERS[tierIndex - 1],
    AUDIENCE_TIERS[tierIndex + 1],
  ].filter(Boolean);

  for (const adj of adjacentTiers) {
    if (adj.idealBudgets.some((b) => budgetLower.includes(b))) {
      return 70;
    }
  }

  return 40;
}

/**
 * Calculate engagement quality score (0-100).
 * Weight: 20%
 */
function engagementQualityScore(engagementRate, subscriberCount) {
  const tier = getAudienceTier(subscriberCount);
  const benchmarks = ENGAGEMENT_BENCHMARKS[tier.label];

  if (engagementRate >= benchmarks.excellent) return 95;
  if (engagementRate >= benchmarks.good) return 80;
  if (engagementRate >= benchmarks.average) return 60;
  if (engagementRate >= benchmarks.average * 0.5) return 40;
  return 25;
}

/**
 * Calculate content compatibility score (0-100).
 * Weight: 15%
 */
function contentCompatibilityScore(creatorStyles, sponsorObjectives) {
  if (!creatorStyles?.length || !sponsorObjectives?.length) return 50;

  // Map campaign objectives to compatible content styles
  const objectiveStyleMap = {
    awareness: ['vlogs', 'entertainment', 'lifestyle', 'reviews'],
    engagement: ['tutorials', 'educational', 'challenges', 'interactive'],
    conversion: ['reviews', 'unboxing', 'tutorials', 'how-to'],
    branding: ['lifestyle', 'vlogs', 'storytelling', 'cinematic'],
    'product launch': ['reviews', 'unboxing', 'first-look', 'haul'],
    'brand awareness': ['vlogs', 'entertainment', 'lifestyle', 'travel'],
    leads: ['educational', 'tutorials', 'webinar', 'how-to'],
    sales: ['reviews', 'unboxing', 'comparison', 'deals'],
  };

  let compatibleCount = 0;
  const creatorStylesLower = creatorStyles.map((s) => s.toLowerCase());

  for (const objective of sponsorObjectives) {
    const compatibleStyles = objectiveStyleMap[objective.toLowerCase()] || [];
    for (const style of compatibleStyles) {
      if (creatorStylesLower.some((cs) => cs.includes(style) || style.includes(cs))) {
        compatibleCount++;
      }
    }
  }

  return Math.min(100, 30 + compatibleCount * 15);
}

/**
 * Calculate brand safety score (0-100).
 * Weight: 10%
 */
function brandSafetyScore(creatorNiches, avoidedSectors) {
  if (!avoidedSectors?.length) return 90;
  if (!creatorNiches?.length) return 70;

  const creatorSet = new Set(creatorNiches.map((n) => n.toLowerCase()));
  const avoidedSet = new Set(avoidedSectors.map((s) => s.toLowerCase()));

  let conflicts = 0;
  for (const niche of creatorSet) {
    for (const avoided of avoidedSet) {
      if (niche.includes(avoided) || avoided.includes(niche)) {
        conflicts++;
      }
    }
  }

  if (conflicts > 0) return Math.max(10, 90 - conflicts * 30);
  return 90;
}

/**
 * Calculate activity score (0-100).
 * Weight: 10%
 */
function activityScore(publishFrequencyDays, lastPublishDate) {
  let freqScore = 50;
  if (publishFrequencyDays > 0) {
    if (publishFrequencyDays <= 3) freqScore = 95;
    else if (publishFrequencyDays <= 7) freqScore = 85;
    else if (publishFrequencyDays <= 14) freqScore = 70;
    else if (publishFrequencyDays <= 30) freqScore = 50;
    else freqScore = 30;
  }

  // Recency bonus
  let recencyScore = 50;
  if (lastPublishDate) {
    const daysSince = (Date.now() - new Date(lastPublishDate).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince <= 7) recencyScore = 95;
    else if (daysSince <= 14) recencyScore = 80;
    else if (daysSince <= 30) recencyScore = 60;
    else recencyScore = 30;
  }

  return Math.round(freqScore * 0.6 + recencyScore * 0.4);
}

/**
 * Calculate the overall match score between a creator analysis and a sponsor profile.
 * Returns a score 0-100 with breakdown.
 */
export function calculateMatchScore(creatorData, sponsorProfile) {
  const creatorNiches = creatorData.detectedNiches || creatorData.niches || [];
  const subscriberCount = creatorData.subscriberCount || 0;
  const engagementRate = creatorData.engagementRate || 0;
  const creatorStyles = creatorData.contentStyles || creatorData.content_styles || [];

  const scores = {
    nicheAlignment: nicheAlignmentScore(
      creatorNiches,
      sponsorProfile.preferred_sectors || []
    ),
    audienceSize: audienceSizeScore(
      subscriberCount,
      sponsorProfile.budget_range
    ),
    engagementQuality: engagementQualityScore(engagementRate, subscriberCount),
    contentCompatibility: contentCompatibilityScore(
      creatorStyles,
      sponsorProfile.campaign_objectives || []
    ),
    brandSafety: brandSafetyScore(
      creatorNiches,
      sponsorProfile.avoided_sectors || []
    ),
    activity: activityScore(
      creatorData.publishFrequencyDays || 0,
      creatorData.lastPublishDate
    ),
  };

  // Weighted average
  const weights = {
    nicheAlignment: 0.30,
    audienceSize: 0.15,
    engagementQuality: 0.20,
    contentCompatibility: 0.15,
    brandSafety: 0.10,
    activity: 0.10,
  };

  let overall = 0;
  for (const [key, weight] of Object.entries(weights)) {
    overall += scores[key] * weight;
  }

  return {
    overallScore: Math.round(overall),
    breakdown: scores,
    weights,
  };
}

export default calculateMatchScore;
