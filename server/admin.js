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
 * GET /stats
 * Returns real platform statistics from Supabase.
 */
router.get('/stats', async (req, res) => {
  try {
    const [creatorsRes, sponsorsRes, analysesRes, matchesRes, recentSignupsRes, recentAnalysesRes] =
      await Promise.all([
        supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }).eq('user_type', 'creator'),
        supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }).eq('user_type', 'sponsor'),
        supabaseAdmin.from('ai_analysis').select('id', { count: 'exact', head: true }),
        supabaseAdmin.from('matchings').select('id', { count: 'exact', head: true }),
        supabaseAdmin.from('profiles').select('id, full_name, user_type, avatar_url, created_at').order('created_at', { ascending: false }).limit(10),
        supabaseAdmin.from('ai_analysis').select('id, analysis_data, cerebras_score, created_at').order('created_at', { ascending: false }).limit(10),
      ]);

    res.json({
      creators: creatorsRes.count || 0,
      sponsors: sponsorsRes.count || 0,
      analyses: analysesRes.count || 0,
      matches: matchesRes.count || 0,
      recentSignups: recentSignupsRes.data || [],
      recentAnalyses: (recentAnalysesRes.data || []).map((a) => ({
        id: a.id,
        channelTitle: a.analysis_data?.youtubeData?.channelTitle || 'Unknown',
        score: a.cerebras_score || 0,
        createdAt: a.created_at,
      })),
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats', message: error.message });
  }
});

/**
 * POST /research
 * Full analysis pipeline for one YouTuber.
 * Returns all data including per-video transcript snippets and timing.
 */
router.post('/research', async (req, res) => {
  try {
    const { handle } = req.body;
    if (!handle || typeof handle !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid handle' });
    }

    const timings = {};
    const overallStart = Date.now();

    // Step 1: Fetch YouTube data
    const ytStart = Date.now();
    const youtubeData = await fetchYouTubeData(handle);
    timings.youtube = ((Date.now() - ytStart) / 1000).toFixed(1);

    if (!youtubeData) {
      return res.status(404).json({ error: 'YouTube channel not found' });
    }

    // Step 2: Fetch transcripts
    const txStart = Date.now();
    const videoIds = youtubeData.videos.slice(0, 10).map((v) => v.id);
    const transcripts = await fetchChannelTranscripts(videoIds, 10);
    timings.transcripts = ((Date.now() - txStart) / 1000).toFixed(1);

    const transcriptCount = transcripts.filter((t) => t.transcript).length;

    // Attach transcript snippets to videos
    const transcriptMap = {};
    for (const t of transcripts) {
      transcriptMap[t.videoId] = t.transcript;
    }
    for (const video of youtubeData.videos) {
      if (transcriptMap[video.id]) {
        video.transcriptSnippet = transcriptMap[video.id]
          .split(/[.!?]\s+/)
          .slice(0, 3)
          .join('. ');
      }
    }

    // Step 3: Niche detection (LDA + LLM hybrid)
    const ldaStart = Date.now();
    const ldaNiches = analyzeNiches(youtubeData.videos, transcripts);
    const videoTitles = youtubeData.videos.map((v) => v.title);
    const nicheAnalysis = await classifyNichesWithLLM(youtubeData.channel, videoTitles, ldaNiches);
    timings.lda = ((Date.now() - ldaStart) / 1000).toFixed(1);

    // Step 4: OpenAI analysis
    const aiStart = Date.now();
    const creatorAnalysis = await analyzeCreatorProfile(youtubeData, nicheAnalysis, transcripts);
    timings.openai = ((Date.now() - aiStart) / 1000).toFixed(1);

    timings.total = ((Date.now() - overallStart) / 1000).toFixed(1);

    res.json({
      channel: youtubeData.channel,
      videos: youtubeData.videos.slice(0, 10),
      metrics: youtubeData.metrics,
      transcriptCount,
      transcriptTotal: videoIds.length,
      niches: nicheAnalysis,
      analysis: creatorAnalysis,
      timings,
    });
  } catch (error) {
    console.error('Admin research error:', error);
    res.status(500).json({ error: 'Research failed', message: error.message });
  }
});

/**
 * Internal: Fetch YouTube data for a handle (same logic as analyze.js).
 */
async function fetchYouTubeData(handle) {
  const cleanHandle = handle.replace(/^@/, '').trim();

  let channel = null;
  try {
    const res = await youtube.channels.list({
      part: ['snippet', 'statistics', 'brandingSettings', 'contentDetails'],
      forHandle: cleanHandle,
    });
    if (res.data.items?.length > 0) {
      channel = res.data.items[0];
    }
  } catch {
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

  let videos = [];
  if (uploadsPlaylistId) {
    const playlistRes = await youtube.playlistItems.list({
      part: ['snippet', 'contentDetails'],
      playlistId: uploadsPlaylistId,
      maxResults: 50,
    });

    const videoIds =
      playlistRes.data.items?.map((item) => item.contentDetails.videoId) || [];

    if (videoIds.length > 0) {
      const videosRes = await youtube.videos.list({
        part: ['snippet', 'statistics', 'contentDetails'],
        id: videoIds,
      });
      videos = videosRes.data.items || [];
    }
  }

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
    console.log(`[admin] Duration debug — first 3 videos:`, parsedVideos.slice(0, 3).map(v => ({
      title: v.title?.substring(0, 40),
      rawDuration: videos[videos.findIndex(raw => raw.id === v.id)]?.contentDetails?.duration,
      parsedDuration: v.duration,
    })));
  }

  // Filter out YouTube Shorts (<=60s)
  const longVideos = parsedVideos.filter((v) => v.duration > 60);
  console.log(`[admin] Shorts filter: ${parsedVideos.length} total → ${longVideos.length} long-form (>60s)`);
  const useVideos = longVideos.length > 0 ? longVideos : parsedVideos;

  let totalViews = 0,
    totalLikes = 0,
    totalComments = 0,
    totalDuration = 0;
  for (const v of useVideos) {
    totalViews += v.viewCount;
    totalLikes += v.likeCount;
    totalComments += v.commentCount;
    totalDuration += v.duration;
  }
  const count = useVideos.length || 1;
  const avgViews = Math.round(totalViews / count);
  const engagementRate =
    totalViews > 0
      ? Math.round(((totalLikes + totalComments) / totalViews) * 10000) / 100
      : 0;

  let publishFrequencyDays = 0;
  if (useVideos.length >= 2) {
    const dates = useVideos
      .map((v) => new Date(v.publishedAt))
      .sort((a, b) => b - a);
    const span = (dates[0] - dates[dates.length - 1]) / (1000 * 60 * 60 * 24);
    publishFrequencyDays = span > 0 ? Math.round(span / (count - 1)) : 0;
  }

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
      thumbnailUrl:
        snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url,
      country: snippet.country || branding.country || null,
      subscriberCount,
      viewCount: parseInt(stats.viewCount || '0', 10),
      videoCount: parseInt(stats.videoCount || '0', 10),
      keywords: branding.keywords
        ? branding.keywords.split(/\s+/).filter(Boolean)
        : [],
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
      viewsToSubsRatio:
        subscriberCount > 0
          ? Math.round((avgViews / subscriberCount) * 100) / 100
          : 0,
    },
  };
}

export default router;
