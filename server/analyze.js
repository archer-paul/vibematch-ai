import { Router } from 'express';
import { google } from 'googleapis';
import { analyzeNiches } from './lda-analyzer.js';
import { analyzeCreatorProfile, classifyNichesWithLLM } from './openai-analyzer.js';
import { fetchChannelTranscripts } from './transcript.js';
import { supabaseAdmin } from './supabase.js';

const router = Router();

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

/**
 * Parse ISO 8601 duration (e.g. PT1H2M30S) to seconds.
 */
function parseDuration(iso) {
  if (!iso) return 0;
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * POST /profile
 * Body: { youtubeHandle: string, profileId: string }
 *
 * Orchestrates: YouTube fetch -> LDA niche detection -> OpenAI analysis -> Supabase storage
 */
router.post('/profile', async (req, res) => {
  try {
    const { youtubeHandle, profileId } = req.body;

    if (!youtubeHandle || !profileId) {
      return res.status(400).json({
        error: 'Missing youtubeHandle or profileId',
      });
    }

    // 1. Fetch YouTube data via the youtube analyze endpoint (internal call)
    const youtubeResponse = await fetchYouTubeData(youtubeHandle);
    if (!youtubeResponse) {
      return res.status(404).json({ error: 'YouTube channel not found' });
    }

    // 2. Fetch transcripts for top 10 videos
    const videoIds = youtubeResponse.videos.slice(0, 10).map((v) => v.id);
    const transcripts = await fetchChannelTranscripts(videoIds, 10);

    // Attach transcript snippets to videos
    const transcriptMap = {};
    for (const t of transcripts) {
      transcriptMap[t.videoId] = t.transcript;
    }
    for (const video of youtubeResponse.videos) {
      if (transcriptMap[video.id]) {
        video.transcriptSnippet = transcriptMap[video.id].split(/[.!?]\s+/).slice(0, 3).join('. ');
      }
    }

    // 3. Run niche detection (LDA + LLM hybrid)
    const ldaNiches = analyzeNiches(youtubeResponse.videos, transcripts);
    const videoTitles = youtubeResponse.videos.map((v) => v.title);
    const nicheAnalysis = await classifyNichesWithLLM(youtubeResponse.channel, videoTitles, ldaNiches);

    // 4. Run OpenAI analysis (with transcripts)
    const creatorAnalysis = await analyzeCreatorProfile(youtubeResponse, nicheAnalysis, transcripts);

    // 4. Store in Supabase
    const analysisRecord = {
      profileId,
      youtubeData: {
        channelId: youtubeResponse.channel.id,
        channelTitle: youtubeResponse.channel.title,
        subscriberCount: youtubeResponse.channel.subscriberCount,
        viewCount: youtubeResponse.channel.viewCount,
        videoCount: youtubeResponse.channel.videoCount,
      },
      nicheAnalysis,
      creatorAnalysis,
      analyzedAt: new Date().toISOString(),
    };

    // Store analysis result
    try {
      const { error: insertError } = await supabaseAdmin
        .from('ai_analysis')
        .upsert({
          profile_id: profileId,
          analysis_type: 'creator_profile',
          analysis_data: analysisRecord,
          cerebras_score: creatorAnalysis.overallScore,
        }, {
          onConflict: 'profile_id,analysis_type',
        });

      if (insertError) {
        // If upsert fails (no unique constraint), try insert
        await supabaseAdmin.from('ai_analysis').insert({
          profile_id: profileId,
          analysis_type: 'creator_profile',
          analysis_data: analysisRecord,
          cerebras_score: creatorAnalysis.overallScore,
        });
      }
    } catch (dbError) {
      console.error('Supabase storage error (non-blocking):', dbError.message);
    }

    // Update profile with YouTube data
    try {
      await supabaseAdmin
        .from('profiles')
        .update({
          follower_counts: {
            youtube: youtubeResponse.channel.subscriberCount,
          },
          engagement_rate: youtubeResponse.metrics.engagementRate,
          niches: nicheAnalysis.slice(0, 3).map((n) => n.niche),
        })
        .eq('id', profileId);
    } catch (updateError) {
      console.error('Profile update error (non-blocking):', updateError.message);
    }

    // 5. Return full analysis
    res.json({
      success: true,
      analysis: {
        overallScore: creatorAnalysis.overallScore,
        categories: creatorAnalysis.categories,
        summary: creatorAnalysis.summary,
        strengths: creatorAnalysis.strengths,
        weaknesses: creatorAnalysis.weaknesses,
        recommendations: creatorAnalysis.recommendations,
        detectedNiches: creatorAnalysis.detectedNiches,
        contentStyle: creatorAnalysis.contentStyle,
      },
      youtube: {
        channelTitle: youtubeResponse.channel.title,
        subscriberCount: youtubeResponse.channel.subscriberCount,
        videoCount: youtubeResponse.channel.videoCount,
        engagementRate: youtubeResponse.metrics.engagementRate,
      },
      niches: nicheAnalysis,
    });
  } catch (error) {
    console.error('Profile analysis error:', error);
    res.status(500).json({
      error: 'Analysis failed',
      message: error.message,
    });
  }
});

/**
 * Internal function to fetch YouTube data (reuses youtube.js logic).
 */
async function fetchYouTubeData(handle) {
  const cleanHandle = handle.replace(/^@/, '').trim();

  // Resolve handle to channel
  let channel = null;
  try {
    const res = await youtube.channels.list({
      part: ['snippet', 'statistics', 'brandingSettings', 'contentDetails'],
      forHandle: cleanHandle,
    });
    if (res.data.items?.length > 0) {
      channel = res.data.items[0];
    }
  } catch (e) {
    // fallback to search
  }

  if (!channel) {
    const searchRes = await youtube.search.list({
      part: ['snippet'],
      q: cleanHandle,
      type: ['channel'],
      maxResults: 1,
    });

    if (!searchRes.data.items?.length) return null;

    const channelId = searchRes.data.items[0].snippet.channelId;
    const channelRes = await youtube.channels.list({
      part: ['snippet', 'statistics', 'brandingSettings', 'contentDetails'],
      id: [channelId],
    });

    channel = channelRes.data.items?.[0];
    if (!channel) return null;
  }

  const stats = channel.statistics || {};
  const snippet = channel.snippet || {};
  const branding = channel.brandingSettings?.channel || {};
  const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;

  // Fetch videos
  let videos = [];
  if (uploadsPlaylistId) {
    const playlistRes = await youtube.playlistItems.list({
      part: ['snippet', 'contentDetails'],
      playlistId: uploadsPlaylistId,
      maxResults: 50,
    });

    const videoIds = playlistRes.data.items?.map(
      (item) => item.contentDetails.videoId
    ) || [];

    if (videoIds.length > 0) {
      const videosRes = await youtube.videos.list({
        part: ['snippet', 'statistics', 'contentDetails'],
        id: videoIds,
      });
      videos = videosRes.data.items || [];
    }
  }

  // Parse videos
  const parsedVideos = videos.map((v) => ({
    id: v.id,
    title: v.snippet?.title,
    description: v.snippet?.description?.substring(0, 500),
    tags: v.snippet?.tags || [],
    publishedAt: v.snippet?.publishedAt,
    duration: parseDuration(v.contentDetails?.duration),
    viewCount: parseInt(v.statistics?.viewCount || '0', 10),
    likeCount: parseInt(v.statistics?.likeCount || '0', 10),
    commentCount: parseInt(v.statistics?.commentCount || '0', 10),
  }));

  // Debug: log duration values for first few videos
  if (parsedVideos.length > 0) {
    console.log(`[analyze] Duration debug — first 3 videos:`, parsedVideos.slice(0, 3).map(v => ({
      title: v.title?.substring(0, 40),
      rawDuration: videos[videos.findIndex(raw => raw.id === v.id)]?.contentDetails?.duration,
      parsedDuration: v.duration,
    })));
  }

  // Filter out YouTube Shorts (<=60s)
  const longVideos = parsedVideos.filter((v) => v.duration > 60);
  console.log(`[analyze] Shorts filter: ${parsedVideos.length} total → ${longVideos.length} long-form (>60s)`);
  const useVideos = longVideos.length > 0 ? longVideos : parsedVideos;

  // Calculate metrics
  let totalViews = 0, totalLikes = 0, totalComments = 0, totalDuration = 0;
  for (const v of useVideos) {
    totalViews += v.viewCount;
    totalLikes += v.likeCount;
    totalComments += v.commentCount;
    totalDuration += v.duration;
  }
  const count = useVideos.length || 1;
  const avgViews = Math.round(totalViews / count);
  const engagementRate = totalViews > 0
    ? Math.round(((totalLikes + totalComments) / totalViews) * 10000) / 100
    : 0;

  // Publishing frequency
  let publishFrequencyDays = 0;
  if (useVideos.length >= 2) {
    const dates = useVideos
      .map((v) => new Date(v.publishedAt))
      .sort((a, b) => b - a);
    const span = (dates[0] - dates[dates.length - 1]) / (1000 * 60 * 60 * 24);
    publishFrequencyDays = span > 0 ? Math.round(span / (count - 1)) : 0;
  }

  // Top tags
  const tagCounts = {};
  for (const v of useVideos) {
    for (const tag of v.tags) {
      const lower = tag.toLowerCase();
      tagCounts[lower] = (tagCounts[lower] || 0) + 1;
    }
  }
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([tag]) => tag);

  const subscriberCount = parseInt(stats.subscriberCount || '0', 10);

  return {
    channel: {
      id: channel.id,
      title: snippet.title,
      description: snippet.description,
      customUrl: snippet.customUrl,
      country: snippet.country || branding.country || null,
      subscriberCount,
      viewCount: parseInt(stats.viewCount || '0', 10),
      videoCount: parseInt(stats.videoCount || '0', 10),
      keywords: branding.keywords ? branding.keywords.split(/\s+/).filter(Boolean) : [],
      publishedAt: snippet.publishedAt,
    },
    videos: useVideos,
    metrics: {
      avgViews,
      avgLikes: Math.round(totalLikes / count),
      avgComments: Math.round(totalComments / count),
      engagementRate,
      publishFrequencyDays,
      avgDurationSeconds: Math.round(totalDuration / count),
      topTags,
      viewsToSubsRatio: subscriberCount > 0 ? Math.round((avgViews / subscriberCount) * 100) / 100 : 0,
    },
  };
}

export default router;
