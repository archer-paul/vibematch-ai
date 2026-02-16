/**
 * YouTube transcript extraction via InnerTube API (ANDROID client).
 *
 * YouTube blocks caption baseUrl fetches from server IPs (ip=0.0.0.0).
 * Solution: use the InnerTube get_transcript endpoint with ANDROID client
 * context, which bypasses this restriction.
 */

const ANDROID_API_KEY = 'AIzaSyA8eiZmM1FaDVjRy-df2KTyQ_vz_yYM39w';
const ANDROID_USER_AGENT = 'com.google.android.youtube/19.02.39 (Linux; U; Android 11) gzip';

/**
 * Fetch transcript for a single YouTube video using InnerTube ANDROID client.
 * Returns the full transcript text or null if unavailable.
 */
export async function fetchVideoTranscript(videoId) {
  try {
    // Step 1: Fetch the video page to get transcript params + cookies
    const pageRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9,fr;q=0.8',
        'Cookie': 'CONSENT=PENDING+987',
      },
    });

    if (!pageRes.ok) {
      console.warn(`[transcript] Page fetch HTTP ${pageRes.status} for ${videoId}`);
      return null;
    }

    const html = await pageRes.text();
    const rawCookies = pageRes.headers.getSetCookie?.() || [];
    const cookieStr = rawCookies.map((c) => c.split(';')[0]).join('; ');
    const visitorData = html.match(/"VISITOR_DATA"\s*:\s*"([^"]+)"/)?.[1];

    // Step 2: Extract transcript params from ytInitialData engagement panels
    const params = extractTranscriptParams(html);
    if (!params) {
      console.warn(`[transcript] No transcript panel found for ${videoId}`);
      return null;
    }

    // Step 3: Call InnerTube get_transcript with ANDROID client
    const resp = await fetch(
      `https://www.youtube.com/youtubei/v1/get_transcript?key=${ANDROID_API_KEY}&prettyPrint=false`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': ANDROID_USER_AGENT,
          'Cookie': cookieStr,
          ...(visitorData ? { 'X-Goog-Visitor-Id': visitorData } : {}),
        },
        body: JSON.stringify({
          context: {
            client: {
              clientName: 'ANDROID',
              clientVersion: '19.02.39',
              hl: 'en',
              ...(visitorData ? { visitorData } : {}),
            },
          },
          params,
        }),
      }
    );

    if (!resp.ok) {
      console.warn(`[transcript] InnerTube API HTTP ${resp.status} for ${videoId}`);
      return null;
    }

    const data = await resp.json();

    // Step 4: Extract text from response segments
    const segments =
      data?.actions?.[0]?.elementsCommand?.transformEntityCommand?.arguments
        ?.transformTranscriptSegmentListArguments?.overwrite?.initialSegments;

    if (!segments || segments.length === 0) {
      console.warn(`[transcript] No segments in InnerTube response for ${videoId}`);
      return null;
    }

    // Extract text from transcriptSegmentRenderer (skip section headers)
    const textParts = [];
    for (const seg of segments) {
      const renderer = seg.transcriptSegmentRenderer;
      if (!renderer) continue;
      const snippet = renderer.snippet;
      const text =
        snippet?.elementsAttributedString?.content ||
        snippet?.simpleText ||
        snippet?.runs?.map((r) => r.text).join('') ||
        '';
      if (text) textParts.push(text);
    }

    const fullText = textParts.join(' ').replace(/\s+/g, ' ').trim();

    if (!fullText || fullText.length < 20) {
      console.warn(`[transcript] Transcript too short for ${videoId} (${fullText.length} chars)`);
      return null;
    }

    console.log(`[transcript] Success for ${videoId}: ${textParts.length} segments, ${fullText.length} chars`);
    return truncateWords(fullText, 500);
  } catch (err) {
    console.error(`[transcript] Error for ${videoId}:`, err.message);
    return null;
  }
}

/**
 * Extract transcript params from ytInitialData engagement panels.
 * Uses brace-counting for safe JSON extraction.
 */
function extractTranscriptParams(html) {
  const marker = 'var ytInitialData = ';
  const startIdx = html.indexOf(marker);
  if (startIdx === -1) return null;

  const braceStart = html.indexOf('{', startIdx);
  if (braceStart === -1) return null;

  const jsonStr = extractJsonByBraceCounting(html, braceStart);
  if (!jsonStr) return null;

  let initData;
  try {
    initData = JSON.parse(jsonStr);
  } catch {
    return null;
  }

  const panels = initData?.engagementPanels || [];
  const transcriptPanel = panels.find(
    (p) =>
      p?.engagementPanelSectionListRenderer?.panelIdentifier ===
      'engagement-panel-searchable-transcript'
  );

  return (
    transcriptPanel?.engagementPanelSectionListRenderer?.content
      ?.continuationItemRenderer?.continuationEndpoint?.getTranscriptEndpoint
      ?.params || null
  );
}

/**
 * Extract a complete JSON object from a string starting at position `start`
 * by counting braces to find the matching closing brace.
 */
function extractJsonByBraceCounting(str, start) {
  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = start; i < str.length; i++) {
    const ch = str[i];

    if (escape) {
      escape = false;
      continue;
    }

    if (ch === '\\' && inString) {
      escape = true;
      continue;
    }

    if (ch === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) {
        return str.substring(start, i + 1);
      }
    }
  }

  return null;
}

/**
 * Fetch transcripts for multiple videos in batches of 3 with delays.
 * Returns array of { videoId, transcript } objects.
 */
export async function fetchChannelTranscripts(videoIds, max = 10) {
  const ids = videoIds.slice(0, max);
  const results = [];
  const batchSize = 5;
  const delayMs = 200;

  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);

    const batchResults = await Promise.allSettled(
      batch.map(async (videoId) => {
        const transcript = await fetchVideoTranscript(videoId);
        return { videoId, transcript };
      })
    );

    for (const r of batchResults) {
      if (r.status === 'fulfilled') {
        results.push(r.value);
      } else {
        console.error(`[transcript] Batch item rejected:`, r.reason);
      }
    }

    if (i + batchSize < ids.length) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  const successCount = results.filter((r) => r.transcript).length;
  console.log(`[transcript] === RESULT: ${successCount}/${ids.length} transcripts fetched ===`);

  return results;
}

/**
 * Truncate text to approximately N words.
 */
function truncateWords(text, maxWords) {
  if (!text) return text;
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ') + '...';
}
