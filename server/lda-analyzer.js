import lda from 'lda';

// Predefined niche dictionary for mapping LDA terms to human-readable labels
const NICHE_DICTIONARY = {
  Technology: [
    'tech', 'technology', 'software', 'hardware', 'computer', 'phone', 'laptop',
    'gadget', 'device', 'app', 'code', 'programming', 'developer', 'ai',
    'artificial', 'intelligence', 'robot', 'digital', 'internet', 'cyber',
    'smartphone', 'apple', 'google', 'microsoft', 'samsung', 'android', 'ios',
    'chip', 'processor', 'gpu', 'cpu', 'ram', 'storage', 'cloud', 'data',
    'machine', 'learning', 'neural', 'algorithm', 'api', 'web', 'mobile',
  ],
  Gaming: [
    'game', 'gaming', 'play', 'player', 'gamer', 'console', 'pc', 'xbox',
    'playstation', 'nintendo', 'switch', 'steam', 'esport', 'stream',
    'twitch', 'fps', 'rpg', 'mmo', 'battle', 'royale', 'minecraft',
    'fortnite', 'valorant', 'league', 'legends', 'cod', 'warzone',
    'gameplay', 'walkthrough', 'speedrun', 'mod',
  ],
  Beauty: [
    'beauty', 'makeup', 'skincare', 'cosmetic', 'skin', 'foundation',
    'lipstick', 'mascara', 'eyeshadow', 'concealer', 'blush', 'primer',
    'serum', 'moisturizer', 'cleanser', 'routine', 'tutorial', 'glam',
    'glow', 'acne', 'dermatologist', 'sephora', 'drugstore', 'palette',
  ],
  Fitness: [
    'fitness', 'workout', 'exercise', 'gym', 'muscle', 'weight', 'cardio',
    'strength', 'training', 'bodybuilding', 'crossfit', 'yoga', 'pilates',
    'run', 'running', 'marathon', 'protein', 'supplement', 'nutrition',
    'diet', 'calories', 'bulk', 'cut', 'lean', 'abs', 'squat', 'deadlift',
    'bench', 'press', 'hiit',
  ],
  Fashion: [
    'fashion', 'style', 'outfit', 'clothing', 'clothes', 'wear', 'dress',
    'designer', 'brand', 'luxury', 'streetwear', 'trend', 'collection',
    'runway', 'model', 'vogue', 'haul', 'wardrobe', 'accessory', 'shoe',
    'sneaker', 'bag', 'jewelry', 'watch',
  ],
  Food: [
    'food', 'cook', 'cooking', 'recipe', 'kitchen', 'bake', 'baking',
    'chef', 'meal', 'eat', 'eating', 'restaurant', 'taste', 'flavor',
    'ingredient', 'dish', 'dinner', 'lunch', 'breakfast', 'snack',
    'vegan', 'vegetarian', 'healthy', 'delicious', 'homemade',
  ],
  Travel: [
    'travel', 'trip', 'destination', 'flight', 'hotel', 'vacation',
    'adventure', 'explore', 'tourism', 'tourist', 'backpack', 'country',
    'city', 'beach', 'mountain', 'island', 'passport', 'airport',
    'luggage', 'itinerary', 'nomad', 'road', 'trek', 'hike',
  ],
  Education: [
    'education', 'learn', 'learning', 'teach', 'teaching', 'school',
    'university', 'college', 'student', 'study', 'course', 'class',
    'lecture', 'tutorial', 'explain', 'how', 'guide', 'lesson', 'skill',
    'knowledge', 'science', 'math', 'history', 'language', 'exam', 'tips',
  ],
  Entertainment: [
    'entertainment', 'fun', 'funny', 'comedy', 'laugh', 'prank', 'challenge',
    'reaction', 'react', 'skit', 'sketch', 'parody', 'meme', 'viral',
    'vlog', 'daily', 'storytime', 'drama', 'celebrity', 'gossip', 'news',
    'movie', 'film', 'series', 'show', 'tv', 'netflix', 'review',
  ],
  Music: [
    'music', 'song', 'sing', 'singing', 'singer', 'artist', 'album',
    'track', 'beat', 'melody', 'lyric', 'rap', 'hip', 'hop', 'pop',
    'rock', 'jazz', 'electronic', 'edm', 'guitar', 'piano', 'drum',
    'producer', 'studio', 'concert', 'live', 'cover', 'remix',
  ],
  Finance: [
    'finance', 'money', 'invest', 'investing', 'investment', 'stock',
    'market', 'crypto', 'bitcoin', 'ethereum', 'trading', 'trade',
    'portfolio', 'wealth', 'rich', 'income', 'passive', 'budget',
    'save', 'saving', 'bank', 'credit', 'debt', 'tax', 'retire',
    'financial', 'economy', 'business', 'entrepreneur',
  ],
  Lifestyle: [
    'lifestyle', 'life', 'daily', 'routine', 'morning', 'night', 'home',
    'house', 'apartment', 'decor', 'interior', 'design', 'organize',
    'clean', 'cleaning', 'minimal', 'minimalist', 'self', 'care',
    'wellness', 'mental', 'health', 'meditation', 'mindfulness', 'journal',
    'productive', 'productivity',
  ],
  Science: [
    'science', 'scientific', 'research', 'experiment', 'physics',
    'chemistry', 'biology', 'space', 'nasa', 'planet', 'star', 'universe',
    'quantum', 'atom', 'molecule', 'cell', 'dna', 'gene', 'evolution',
    'theory', 'discovery', 'lab', 'laboratory',
  ],
  Sports: [
    'sport', 'sports', 'football', 'soccer', 'basketball', 'baseball',
    'tennis', 'golf', 'boxing', 'mma', 'ufc', 'athlete', 'team', 'league',
    'championship', 'world', 'cup', 'olympic', 'medal', 'score', 'win',
    'match', 'tournament', 'nba', 'nfl', 'fifa',
  ],
  Sustainability: [
    'sustainability', 'sustainable', 'eco', 'green', 'environment',
    'environmental', 'climate', 'carbon', 'recycle', 'recycling', 'zero',
    'waste', 'organic', 'natural', 'renewable', 'solar', 'energy',
    'pollution', 'plastic', 'conservation', 'earth', 'planet',
  ],
};

/**
 * Simple text preprocessing: lowercase, remove punctuation, split into words,
 * remove common English + French stopwords, and short words.
 */
function preprocessText(text) {
  if (!text) return '';

  const stopwords = new Set([
    // English
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'shall', 'can', 'need', 'dare', 'ought',
    'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from',
    'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
    'between', 'out', 'off', 'over', 'under', 'again', 'further', 'then',
    'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'each',
    'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no',
    'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
    'just', 'because', 'but', 'and', 'or', 'if', 'while', 'that', 'this',
    'these', 'those', 'it', 'its', 'my', 'your', 'his', 'her', 'our',
    'their', 'what', 'which', 'who', 'whom', 'i', 'me', 'we', 'us', 'you',
    'he', 'she', 'they', 'them', 'about', 'up', 'get', 'got', 'like',
    'make', 'made', 'new', 'one', 'two', 'also', 'know', 'take', 'come',
    'really', 'much', 'well', 'back', 'even', 'want', 'give', 'day',
    'good', 'first', 'last', 'long', 'great', 'little', 'right', 'still',
    'find', 'say', 'said', 'thing', 'think', 'tell', 'help', 'put',
    // French
    'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'et', 'en', 'est',
    'que', 'qui', 'dans', 'ce', 'il', 'ne', 'sur', 'se', 'pas', 'plus',
    'par', 'je', 'avec', 'tout', 'faire', 'son', 'mais', 'nous', 'comme',
    'ou', 'si', 'leur', 'mon', 'lui', 'aux', 'ces', 'cette', 'sans',
    'aussi', 'pour', 'au', 'vous', 'elle', 'entre', 'vers', 'chez',
    // Common YouTube filler
    'video', 'videos', 'watch', 'subscribe', 'channel', 'episode', 'part',
    'link', 'follow', 'comment', 'share', 'check', 'description', 'below',
    'click', 'thank', 'thanks',
  ]);

  return text
    .toLowerCase()
    .replace(/[^a-zA-ZÀ-ÿ\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopwords.has(word))
    .join(' ');
}

/**
 * Analyze niches from a list of YouTube video data.
 * Uses LDA topic modeling then maps topics to predefined niche labels.
 *
 * @param {Array} videos - Array of video objects with title, description, tags
 * @param {Array} transcripts - Optional array of { videoId, transcript } objects
 * @returns {Array} Detected niches with confidence scores
 */
export function analyzeNiches(videos, transcripts = []) {
  if (!videos || videos.length === 0) {
    return [{ niche: 'Entertainment', confidence: 0.5 }];
  }

  // Build transcript lookup
  const transcriptMap = {};
  for (const t of transcripts) {
    if (t.transcript) transcriptMap[t.videoId] = t.transcript;
  }

  // 1. Build corpus: one "document" per video (title + description + tags + transcript)
  const documents = videos.map((video) => {
    const parts = [
      video.title || '',
      video.description || '',
      (video.tags || []).join(' '),
      transcriptMap[video.id] || '',
    ];
    return preprocessText(parts.join(' '));
  });

  // Filter out empty documents
  const validDocs = documents.filter((doc) => doc.trim().length > 10);

  if (validDocs.length < 3) {
    // Not enough data for LDA, fall back to keyword matching
    return keywordFallback(documents.join(' '));
  }

  // 2. Run LDA with 8 topics, 10 terms per topic
  let topics;
  try {
    // lda expects an array of sentences (strings)
    // It splits by sentences internally, so we join docs with periods
    const sentences = validDocs.map((doc) => doc + '.');
    topics = lda(sentences, 8, 10);
  } catch (e) {
    console.error('LDA error, falling back to keyword matching:', e.message);
    return keywordFallback(documents.join(' '));
  }

  if (!topics || topics.length === 0) {
    return keywordFallback(documents.join(' '));
  }

  // 3. Map each LDA topic to a niche label
  const nicheScores = {};

  for (const topic of topics) {
    if (!topic || topic.length === 0) continue;

    // Get all terms from this topic
    const topicTerms = topic.map((t) => t.term.toLowerCase());

    // Score each niche based on term overlap
    for (const [niche, keywords] of Object.entries(NICHE_DICTIONARY)) {
      let matchScore = 0;
      for (const term of topicTerms) {
        if (keywords.includes(term)) {
          // Weight by the LDA probability
          const ldaTerm = topic.find((t) => t.term.toLowerCase() === term);
          matchScore += ldaTerm ? ldaTerm.probability : 0.1;
        }
        // Partial match (term is substring of keyword or vice versa)
        for (const kw of keywords) {
          if (kw !== term && (kw.includes(term) || term.includes(kw)) && term.length > 3) {
            const ldaTerm = topic.find((t) => t.term.toLowerCase() === term);
            matchScore += (ldaTerm ? ldaTerm.probability : 0.05) * 0.5;
          }
        }
      }

      if (matchScore > 0) {
        nicheScores[niche] = (nicheScores[niche] || 0) + matchScore;
      }
    }
  }

  // 4. Normalize and sort
  const maxScore = Math.max(...Object.values(nicheScores), 0.01);
  const results = Object.entries(nicheScores)
    .map(([niche, score]) => ({
      niche,
      confidence: Math.round((score / maxScore) * 100) / 100,
    }))
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5);

  // If no niches were detected, fall back
  if (results.length === 0) {
    return keywordFallback(documents.join(' '));
  }

  return results;
}

/**
 * Simple keyword-based fallback when LDA fails or has insufficient data.
 */
function keywordFallback(text) {
  const lower = text.toLowerCase();
  const nicheScores = {};

  for (const [niche, keywords] of Object.entries(NICHE_DICTIONARY)) {
    let count = 0;
    for (const kw of keywords) {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      const matches = lower.match(regex);
      if (matches) count += matches.length;
    }
    if (count > 0) {
      nicheScores[niche] = count;
    }
  }

  const maxScore = Math.max(...Object.values(nicheScores), 1);
  const results = Object.entries(nicheScores)
    .map(([niche, score]) => ({
      niche,
      confidence: Math.round((score / maxScore) * 100) / 100,
    }))
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5);

  if (results.length === 0) {
    return [{ niche: 'Entertainment', confidence: 0.3 }];
  }

  return results;
}

export default analyzeNiches;
