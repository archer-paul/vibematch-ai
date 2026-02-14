import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

/**
 * Analyze a creator profile based on YouTube data, LDA niche analysis, and transcripts.
 * Returns scores across 6 text-measurable categories.
 */
export async function analyzeCreatorProfile(youtubeData, nicheAnalysis, transcripts = []) {
  const { channel, videos, metrics } = youtubeData;

  // Build transcript section for prompt (top 5 videos, ~200 words each)
  const transcriptSection = transcripts
    .filter((t) => t.transcript)
    .slice(0, 5)
    .map((t) => {
      const video = videos.find((v) => v.id === t.videoId);
      const title = video?.title || t.videoId;
      const words = t.transcript.split(/\s+/).slice(0, 200).join(' ');
      return `### ${title}\n${words}`;
    })
    .join('\n\n');

  const hasTranscripts = transcriptSection.length > 0;

  const prompt = `You are an expert creator analyst for a creator-brand matching platform called VibeMatch.

Analyze this YouTube creator profile and provide scores for each category (0-100).

## Channel Info
- Name: ${channel.title}
- Subscribers: ${channel.subscriberCount.toLocaleString()}
- Total Views: ${channel.viewCount.toLocaleString()}
- Videos: ${channel.videoCount}
- Country: ${channel.country || 'Unknown'}
- Channel Age: Created ${channel.publishedAt}
- Keywords: ${(channel.keywords || []).slice(0, 20).join(', ')}
- Description: ${(channel.description || '').substring(0, 500)}

## Video Metrics (last ${videos.length} videos)
- Average Views: ${metrics.avgViews.toLocaleString()}
- Average Likes: ${metrics.avgLikes.toLocaleString()}
- Average Comments: ${metrics.avgComments.toLocaleString()}
- Engagement Rate: ${metrics.engagementRate}%
- Publishing Frequency: every ${metrics.publishFrequencyDays} days
- Average Duration: ${Math.round(metrics.avgDurationSeconds / 60)} minutes
- Views/Subscribers Ratio: ${metrics.viewsToSubsRatio}
- Top Tags: ${metrics.topTags.slice(0, 15).join(', ')}

## Detected Niches (from LDA analysis)
${nicheAnalysis.map((n) => `- ${n.niche}: ${Math.round(n.confidence * 100)}% confidence`).join('\n')}

## Sample Video Titles (last 10)
${videos.slice(0, 10).map((v) => `- ${v.title}`).join('\n')}
${hasTranscripts ? `
## Video Transcripts (auto-generated captions)
${transcriptSection}
` : ''}
## Scoring Categories

Score each category 0-100:

1. **Vocabulary & Language** (vocabularyLanguage): Vocabulary richness, articulation clarity, language sophistication, multilingual ability, filler word frequency, sentence structure${hasTranscripts ? ' (analyze from transcripts)' : ''}
2. **SEO & Metadata Quality** (seoMetadata): Title effectiveness, description quality, tag strategy, keyword optimization, CTAs, hashtag usage, searchability
3. **Engagement & Interaction** (engagement): Engagement rate, like/view ratio, comments/views, publishing frequency, consistency, timing
4. **Audience & Reach** (audienceReach): Audience size, estimated growth, reach, loyalty (views/subscribers ratio), geographic reach
5. **Topical Authority** (topicalAuthority): Topic clarity, expertise depth, thematic consistency, knowledge demonstration${hasTranscripts ? ', depth of explanation in transcripts' : ''}, organic brand mentions
6. **Tone & Brand Voice** (toneBrandVoice): Communication style, authenticity, consistency of voice, emotional range, personality${hasTranscripts ? ' (analyze from transcripts)' : ''}, perceived trustworthiness

Return ONLY valid JSON:
{
  "overallScore": number,
  "categories": {
    "vocabularyLanguage": number,
    "seoMetadata": number,
    "engagement": number,
    "audienceReach": number,
    "topicalAuthority": number,
    "toneBrandVoice": number
  },
  "summary": "2-3 sentence summary of the creator",
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2"],
  "recommendations": ["rec1", "rec2", "rec3"],
  "detectedNiches": ["niche1", "niche2"],
  "contentStyle": "primary content style description"
}`;

  try {
    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content:
            'You are a creator analysis expert. Always respond with valid JSON only. Be precise and data-driven in your scoring.',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('OpenAI creator analysis error:', error);
    return fallbackCreatorAnalysis(youtubeData, nicheAnalysis);
  }
}

/**
 * Analyze compatibility between a creator and a sponsor profile.
 */
export async function analyzeCompatibility(creatorAnalysis, sponsorProfile) {
  const prompt = `You are a compatibility expert for creator-brand matching.

## Creator Profile
- Overall Score: ${creatorAnalysis.overallScore}/100
- Niches: ${(creatorAnalysis.detectedNiches || []).join(', ')}
- Content Style: ${creatorAnalysis.contentStyle || 'N/A'}
- Strengths: ${(creatorAnalysis.strengths || []).join(', ')}
- Summary: ${creatorAnalysis.summary || 'N/A'}
- Category Scores: ${JSON.stringify(creatorAnalysis.categories || {})}

## Sponsor Profile
- Company: ${sponsorProfile.company_name || 'Unknown'}
- Industry: ${sponsorProfile.industry || 'Unknown'}
- Preferred Sectors: ${(sponsorProfile.preferred_sectors || []).join(', ')}
- Campaign Objectives: ${(sponsorProfile.campaign_objectives || []).join(', ')}
- Budget Range: ${sponsorProfile.budget_range || 'Unknown'}
- Avoided Sectors: ${(sponsorProfile.avoided_sectors || []).join(', ')}
- Bio: ${(sponsorProfile.bio || '').substring(0, 300)}

Analyze the compatibility between this creator and sponsor.

Return ONLY valid JSON:
{
  "compatibilityScore": number (0-100),
  "matchFactors": {
    "nicheAlignment": number (0-100),
    "audienceFit": number (0-100),
    "contentQuality": number (0-100),
    "brandSafety": number (0-100),
    "engagementPotential": number (0-100)
  },
  "summary": "1-2 sentence compatibility summary",
  "recommendations": ["rec1", "rec2"],
  "risks": ["risk1"]
}`;

  try {
    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content:
            'You are a brand-creator matching expert. Always respond with valid JSON only.',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 600,
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('OpenAI compatibility analysis error:', error);
    return {
      compatibilityScore: 65,
      matchFactors: {
        nicheAlignment: 60,
        audienceFit: 70,
        contentQuality: 65,
        brandSafety: 80,
        engagementPotential: 60,
      },
      summary: 'Compatibility analysis temporarily unavailable.',
      recommendations: ['Complete profile for better analysis'],
      risks: [],
    };
  }
}

/**
 * Fallback creator analysis when OpenAI fails.
 */
function fallbackCreatorAnalysis(youtubeData, nicheAnalysis) {
  const { channel, metrics } = youtubeData;
  const subs = channel.subscriberCount;

  // Simple heuristic scoring
  const audienceScore = Math.min(
    100,
    subs > 1000000 ? 95 : subs > 100000 ? 80 : subs > 10000 ? 65 : subs > 1000 ? 50 : 30
  );

  const engagementScore = Math.min(
    100,
    metrics.engagementRate > 10 ? 95 : metrics.engagementRate > 5 ? 80 :
    metrics.engagementRate > 2 ? 65 : metrics.engagementRate > 1 ? 50 : 35
  );

  const consistencyScore = metrics.publishFrequencyDays > 0 && metrics.publishFrequencyDays <= 7
    ? 85
    : metrics.publishFrequencyDays <= 14 ? 70 : metrics.publishFrequencyDays <= 30 ? 55 : 40;

  const overallScore = Math.round(
    audienceScore * 0.25 + engagementScore * 0.3 + consistencyScore * 0.2 + 60 * 0.25
  );

  return {
    overallScore,
    categories: {
      vocabularyLanguage: 60,
      seoMetadata: 55,
      engagement: engagementScore,
      audienceReach: audienceScore,
      topicalAuthority: 60,
      toneBrandVoice: 60,
    },
    summary: `${channel.title} is a creator with ${subs.toLocaleString()} subscribers and a ${metrics.engagementRate}% engagement rate.`,
    strengths: ['Active channel', 'Consistent content'],
    weaknesses: ['Analysis limited - OpenAI unavailable'],
    recommendations: ['Try again later for full AI analysis'],
    detectedNiches: nicheAnalysis.map((n) => n.niche).slice(0, 3),
    contentStyle: 'General content creator',
  };
}

/**
 * Classify creator niches using LLM (gpt-4o-mini) with channel context.
 * Falls back to LDA niches on error.
 *
 * @param {Object} channel - Channel data (title, description, keywords)
 * @param {string[]} videoTitles - Top video titles
 * @param {Array} ldaNiches - LDA-detected niches as fallback context
 * @returns {Array<{ niche: string, confidence: number }>}
 */
export async function classifyNichesWithLLM(channel, videoTitles, ldaNiches) {
  const AVAILABLE_NICHES = [
    'Technology', 'Gaming', 'Beauty', 'Fitness', 'Fashion',
    'Food', 'Travel', 'Education', 'Entertainment', 'Music',
    'Finance', 'Lifestyle', 'Science', 'Sports', 'Sustainability',
  ];

  const prompt = `You are a YouTube channel niche classifier. Classify this channel into its top 3-5 niches from the list below.

## Available Niches
${AVAILABLE_NICHES.join(', ')}

## Channel Info
- Name: ${channel.title || 'Unknown'}
- Description: ${(channel.description || '').substring(0, 500)}
- Keywords: ${(channel.keywords || []).slice(0, 20).join(', ')}

## Top Video Titles
${(videoTitles || []).slice(0, 15).map((t) => `- ${t}`).join('\n')}

## LDA Pre-Analysis (statistical text analysis — may be inaccurate)
${(ldaNiches || []).map((n) => `- ${n.niche}: ${Math.round(n.confidence * 100)}%`).join('\n')}

Based on the channel name, description, keywords, and video titles, classify the channel into the most accurate 3-5 niches from the available list.

Return ONLY valid JSON:
{
  "niches": [
    { "niche": "NicheName", "confidence": 0.95 },
    { "niche": "NicheName2", "confidence": 0.7 }
  ]
}

Confidence values should be between 0 and 1, reflecting how strongly the channel fits each niche.`;

  try {
    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are a niche classification expert. Always respond with valid JSON only.',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
      max_tokens: 300,
    });

    const content = response.choices[0].message.content;
    const parsed = JSON.parse(content);

    if (parsed.niches && Array.isArray(parsed.niches) && parsed.niches.length > 0) {
      // Validate that niches are from the allowed list
      const validNiches = parsed.niches
        .filter((n) => AVAILABLE_NICHES.includes(n.niche))
        .map((n) => ({
          niche: n.niche,
          confidence: Math.min(1, Math.max(0, n.confidence)),
        }));

      if (validNiches.length > 0) {
        return validNiches;
      }
    }

    console.warn('[LLM niches] Invalid response format, falling back to LDA');
    return ldaNiches;
  } catch (error) {
    console.error('[LLM niches] Classification error:', error.message);
    return ldaNiches;
  }
}
