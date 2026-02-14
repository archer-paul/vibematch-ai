import { Router } from 'express';
import { google } from 'googleapis';

const router = Router();
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

/**
 * Resolve a YouTube handle (e.g. "@mkbhd") to a channel ID.
 * Tries forHandle first, then falls back to search.
 */
async function resolveHandle(handle) {
  // Clean handle
  const cleanHandle = handle.replace(/^@/, '').trim();

  // Try forHandle parameter
  try {
    const res = await youtube.channels.list({
      part: ['snippet', 'statistics', 'brandingSettings', 'contentDetails'],
      forHandle: cleanHandle,
    });
    if (res.data.items && res.data.items.length > 0) {
      return res.data.items[0];
    }
  } catch (e) {
    // forHandle might not work for all handles, fall through
  }

  // Fallback: search for the channel
  const searchRes = await youtube.search.list({
    part: ['snippet'],
    q: cleanHandle,
    type: ['channel'],
    maxResults: 1,
  });

  if (!searchRes.data.items || searchRes.data.items.length === 0) {
    return null;
  }

  const channelId = searchRes.data.items[0].snippet.channelId;

  const channelRes = await youtube.channels.list({
    part: ['snippet', 'statistics', 'brandingSettings', 'contentDetails'],
    id: [channelId],
  });

  return channelRes.data.items?.[0] || null;
}

/**
 * Fetch the latest videos from a channel's uploads playlist.
 */
async function fetchLatestVideos(uploadsPlaylistId, maxResults = 50) {
  // Get video IDs from the uploads playlist
  const playlistRes = await youtube.playlistItems.list({
    part: ['snippet', 'contentDetails'],
    playlistId: uploadsPlaylistId,
    maxResults,
  });

  const videoIds = playlistRes.data.items?.map(
    (item) => item.contentDetails.videoId
  ) || [];

  if (videoIds.length === 0) return [];

  // Fetch full video details in batches of 50
  const videosRes = await youtube.videos.list({
    part: ['snippet', 'statistics', 'contentDetails'],
    id: videoIds,
  });

  return videosRes.data.items || [];
}

/**
 * Parse ISO 8601 duration (PT1H2M30S) to seconds.
 */
function parseDuration(iso) {
  if (!iso) return 0;
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const h = parseInt(match[1] || '0', 10);
  const m = parseInt(match[2] || '0', 10);
  const s = parseInt(match[3] || '0', 10);
  return h * 3600 + m * 60 + s;
}

/**
 * Calculate derived metrics from videos.
 */
function calculateMetrics(videos, subscriberCount) {
  if (videos.length === 0) {
    return {
      avgViews: 0,
      avgLikes: 0,
      avgComments: 0,
      engagementRate: 0,
      publishFrequencyDays: 0,
      avgDurationSeconds: 0,
      topTags: [],
      viewsToSubsRatio: 0,
    };
  }

  let totalViews = 0;
  let totalLikes = 0;
  let totalComments = 0;
  let totalDuration = 0;
  const tagCounts = {};
  const publishDates = [];

  for (const video of videos) {
    const stats = video.statistics || {};
    const views = parseInt(stats.viewCount || '0', 10);
    const likes = parseInt(stats.likeCount || '0', 10);
    const comments = parseInt(stats.commentCount || '0', 10);

    totalViews += views;
    totalLikes += likes;
    totalComments += comments;
    totalDuration += parseDuration(video.contentDetails?.duration);

    // Count tags
    const tags = video.snippet?.tags || [];
    for (const tag of tags) {
      const lower = tag.toLowerCase();
      tagCounts[lower] = (tagCounts[lower] || 0) + 1;
    }

    // Collect publish dates
    if (video.snippet?.publishedAt) {
      publishDates.push(new Date(video.snippet.publishedAt));
    }
  }

  const count = videos.length;
  const avgViews = Math.round(totalViews / count);
  const avgLikes = Math.round(totalLikes / count);
  const avgComments = Math.round(totalComments / count);

  // Engagement rate = (likes + comments) / views * 100
  const engagementRate = totalViews > 0
    ? ((totalLikes + totalComments) / totalViews) * 100
    : 0;

  // Publishing frequency
  let publishFrequencyDays = 0;
  if (publishDates.length >= 2) {
    publishDates.sort((a, b) => b - a);
    const newest = publishDates[0];
    const oldest = publishDates[publishDates.length - 1];
    const spanDays = (newest - oldest) / (1000 * 60 * 60 * 24);
    publishFrequencyDays = spanDays > 0 ? Math.round(spanDays / (count - 1)) : 0;
  }

  // Top tags (sorted by frequency)
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([tag]) => tag);

  // Views-to-subscribers ratio
  const subs = parseInt(subscriberCount || '0', 10);
  const viewsToSubsRatio = subs > 0 ? avgViews / subs : 0;

  return {
    avgViews,
    avgLikes,
    avgComments,
    engagementRate: Math.round(engagementRate * 100) / 100,
    publishFrequencyDays,
    avgDurationSeconds: Math.round(totalDuration / count),
    topTags,
    viewsToSubsRatio: Math.round(viewsToSubsRatio * 100) / 100,
  };
}

/**
 * POST /analyze
 * Body: { handle: string }
 * Returns full channel data + video data + derived metrics.
 */
router.post('/analyze', async (req, res) => {
  try {
    const { handle } = req.body;

    if (!handle || typeof handle !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid handle' });
    }

    if (!process.env.YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY === 'YOUR_YOUTUBE_API_KEY_HERE') {
      return res.status(503).json({ error: 'YouTube API key not configured' });
    }

    // 1. Resolve handle to channel
    const channel = await resolveHandle(handle);
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    const stats = channel.statistics || {};
    const snippet = channel.snippet || {};
    const branding = channel.brandingSettings?.channel || {};
    const uploadsPlaylistId =
      channel.contentDetails?.relatedPlaylists?.uploads;

    // 2. Fetch latest videos
    let videos = [];
    if (uploadsPlaylistId) {
      videos = await fetchLatestVideos(uploadsPlaylistId, 50);
    }

    // 3. Calculate metrics
    const metrics = calculateMetrics(videos, stats.subscriberCount);

    // 4. Build response
    const result = {
      channel: {
        id: channel.id,
        title: snippet.title,
        description: snippet.description,
        customUrl: snippet.customUrl,
        country: snippet.country || branding.country || null,
        thumbnailUrl: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url,
        subscriberCount: parseInt(stats.subscriberCount || '0', 10),
        viewCount: parseInt(stats.viewCount || '0', 10),
        videoCount: parseInt(stats.videoCount || '0', 10),
        keywords: branding.keywords ? branding.keywords.split(/\s+/).filter(Boolean) : [],
        publishedAt: snippet.publishedAt,
      },
      videos: videos.map((v) => ({
        id: v.id,
        title: v.snippet?.title,
        description: v.snippet?.description?.substring(0, 500),
        tags: v.snippet?.tags || [],
        publishedAt: v.snippet?.publishedAt,
        duration: parseDuration(v.contentDetails?.duration),
        viewCount: parseInt(v.statistics?.viewCount || '0', 10),
        likeCount: parseInt(v.statistics?.likeCount || '0', 10),
        commentCount: parseInt(v.statistics?.commentCount || '0', 10),
      })),
      metrics,
    };

    res.json(result);
  } catch (error) {
    console.error('YouTube analysis error:', error);
    const status = error.code === 403 ? 403 : 500;
    res.status(status).json({
      error: 'YouTube analysis failed',
      message: error.message,
    });
  }
});

export default router;
