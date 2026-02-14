import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Bot, Search, Loader2,
  CheckCircle2, ChevronDown, ChevronUp, Globe, Calendar,
  Eye, ThumbsUp, MessageSquare, Users, Clock,
  Youtube, ExternalLink, FileText,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface PipelineStep {
  label: string;
  status: 'pending' | 'running' | 'done';
  time?: string;
  detail?: string;
}

interface ResearchResult {
  channel: {
    id: string;
    title: string;
    description: string;
    customUrl: string;
    thumbnailUrl?: string;
    country: string | null;
    subscriberCount: number;
    viewCount: number;
    videoCount: number;
    publishedAt: string;
  };
  videos: Array<{
    id: string;
    title: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    publishedAt: string;
    duration?: number;
    transcript?: string;
    transcriptSnippet?: string;
  }>;
  metrics: {
    avgViews: number;
    engagementRate: number;
    publishFrequencyDays: number;
  };
  transcriptCount: number;
  transcriptTotal: number;
  niches: Array<{ niche: string; confidence: number }>;
  analysis: {
    overallScore: number;
    categories: Record<string, number>;
    summary: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    detectedNiches: string[];
    contentStyle: string;
  };
  timings: {
    youtube: string;
    transcripts: string;
    lda: string;
    openai: string;
    total: string;
  };
}

interface FeaturedCreator {
  name: string;
  handle: string;
  platform: 'YouTube' | 'TikTok' | 'Instagram';
  subscribers: string;
  niches: string[];
  country: string;
  countryFlag: string;
  avatarUrl?: string;
}

const FEATURED_CREATORS: FeaturedCreator[] = [
  // US
  {
    name: 'MrBeast',
    handle: '@MrBeast',
    platform: 'YouTube',
    subscribers: '467M',
    niches: ['Entertainment', 'Philanthropy'],
    country: 'US',
    countryFlag: '\u{1F1FA}\u{1F1F8}',
    avatarUrl: 'https://yt3.ggpht.com/nxYrc_1_2f77DoBadyxMTmv7ZpRZapHR5jbuYe7PlPd5cIRJxtNNEYyOC0ZsxaDyJJzXrnJiuDE=s176-c-k-c0x00ffffff-no-rj',
  },
  {
    name: 'MKBHD',
    handle: '@mkbhd',
    platform: 'YouTube',
    subscribers: '20.7M',
    niches: ['Technology', 'Reviews'],
    country: 'US',
    countryFlag: '\u{1F1FA}\u{1F1F8}',
    avatarUrl: 'https://yt3.ggpht.com/qu4TmIaYUlS41-dJ9gZ7DUR3nilvmB5_11i6OKSdvNnBNiyOusZP1bMN6ICnuxtjFBb6ioKgRQ=s176-c-k-c0x00ffffff-no-rj',
  },
  {
    name: 'Charli D\'Amelio',
    handle: '@charlidamelio',
    platform: 'TikTok',
    subscribers: '155.9M',
    niches: ['Dance', 'Lifestyle'],
    country: 'US',
    countryFlag: '\u{1F1FA}\u{1F1F8}',
  },
  {
    name: 'Emma Chamberlain',
    handle: '@emmachamberlain',
    platform: 'YouTube',
    subscribers: '12M',
    niches: ['Lifestyle', 'Fashion'],
    country: 'US',
    countryFlag: '\u{1F1FA}\u{1F1F8}',
    avatarUrl: 'https://yt3.ggpht.com/zDSI5VOhKgSHZMOihPFJGh4NmgHu1fI7bVYp8lhTuhnwhDBECt-Hgs1nm69dCn23aXZZAtCQ7g=s176-c-k-c0x00ffffff-no-rj',
  },
  // UK
  {
    name: 'KSI',
    handle: '@KSI',
    platform: 'YouTube',
    subscribers: '17.3M',
    niches: ['Entertainment', 'Music'],
    country: 'UK',
    countryFlag: '\u{1F1EC}\u{1F1E7}',
    avatarUrl: 'https://yt3.ggpht.com/2f8wOz76TImPcmiuUYSgJQbQnjEKXlD01_kw284BOI_DrQS4tYS6Q97DMW-yffRT-pVYIs6a=s176-c-k-c0x00ffffff-no-rj',
  },
  {
    name: 'Zoella',
    handle: '@zoella280390',
    platform: 'YouTube',
    subscribers: '5M',
    niches: ['Beauty', 'Lifestyle'],
    country: 'UK',
    countryFlag: '\u{1F1EC}\u{1F1E7}',
    avatarUrl: 'https://yt3.ggpht.com/ytc/AIdro_nuwq0o1XZJm0q21D8IiCnTDxiQNyN6nLzXtozVtxhOrsA=s176-c-k-c0x00ffffff-no-rj',
  },
  // France
  {
    name: 'Squeezie',
    handle: '@Squeezie',
    platform: 'YouTube',
    subscribers: '20M',
    niches: ['Gaming', 'Entertainment'],
    country: 'FR',
    countryFlag: '\u{1F1EB}\u{1F1F7}',
    avatarUrl: 'https://yt3.ggpht.com/ytc/AIdro_mPZvx-xk6pbAYdC7G8jUZzgCNDDTg1ZfF0_Lwd8UpJT4M=s176-c-k-c0x00ffffff-no-rj',
  },
  {
    name: 'Lena Situations',
    handle: '@LenaSituations',
    platform: 'YouTube',
    subscribers: '3.2M',
    niches: ['Fashion', 'Lifestyle'],
    country: 'FR',
    countryFlag: '\u{1F1EB}\u{1F1F7}',
    avatarUrl: 'https://yt3.ggpht.com/d2MpFvheu0xlCTovS837oS2ji_DNdnE-MWf2OsWDqohUV3YP-wv7a7TCxDh1sRP0T9SxP2VudCo=s176-c-k-c0x00ffffff-no-rj',
  },
  {
    name: 'Cyprien',
    handle: '@CyprienGaming',
    platform: 'YouTube',
    subscribers: '14M',
    niches: ['Comedy', 'Entertainment'],
    country: 'FR',
    countryFlag: '\u{1F1EB}\u{1F1F7}',
    avatarUrl: 'https://yt3.ggpht.com/ytc/AIdro_nzmEgJOtSmIdLgQFXPALaELhW4rK-4WMt4kw4SwjrNFQ=s176-c-k-c0x00ffffff-no-rj',
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  vocabularyLanguage: 'Vocabulary & Language',
  seoMetadata: 'SEO & Metadata Quality',
  engagement: 'Engagement & Interaction',
  audienceReach: 'Audience & Reach',
  topicalAuthority: 'Topical Authority',
  toneBrandVoice: 'Tone & Brand Voice',
  contentProduction: 'Content & Production',
  textAnalysis: 'Text Analysis',
  audience: 'Audience & Community',
  themes: 'Themes & Expertise',
  brandPersonality: 'Brand Personality',
};

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toLocaleString();
}

const PLATFORM_COLORS: Record<string, string> = {
  YouTube: 'bg-red-100 text-red-700 border-red-200',
  TikTok: 'bg-gray-100 text-gray-800 border-gray-300',
  Instagram: 'bg-pink-100 text-pink-700 border-pink-200',
};

export default function Discovery() {
  const { profile } = useAuth();
  const [searchParams] = useSearchParams();
  const [selectedCountry, setSelectedCountry] = useState<string>('all');

  // Creator Research state
  const [searchHandle, setSearchHandle] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>([]);
  const [expandedVideos, setExpandedVideos] = useState<Set<string>>(new Set());
  const [researchError, setResearchError] = useState<string | null>(null);

  // Pre-fill search from URL query param (?handle=@xxx)
  useEffect(() => {
    const handle = searchParams.get('handle');
    if (handle) {
      setSearchHandle(handle);
    }
  }, [searchParams]);

  const filteredCreators = FEATURED_CREATORS.filter(
    (c) => selectedCountry === 'all' || c.country === selectedCountry
  );

  const runResearch = async () => {
    if (!searchHandle.trim()) return;
    setIsResearching(true);
    setResult(null);
    setResearchError(null);
    setPipelineSteps([
      { label: 'Fetching YouTube Data', status: 'running' },
      { label: 'Extracting Transcripts', status: 'pending' },
      { label: 'Niche Detection (LDA + LLM)', status: 'pending' },
      { label: 'AI Scoring (gpt-4o-mini)', status: 'pending' },
    ]);

    try {
      const response = await fetch('/api/admin/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle: searchHandle.trim() }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Research failed');
      }

      const data: ResearchResult = await response.json();
      const t = data.timings;

      const steps: PipelineStep[] = [
        {
          label: 'Fetching YouTube Data',
          status: 'done',
          time: `${t.youtube}s`,
          detail: `${data.channel.title} | ${formatNumber(data.channel.subscriberCount)} subs | ${formatNumber(data.channel.videoCount)} videos | ${data.channel.country || 'N/A'}`,
        },
        {
          label: 'Extracting Transcripts',
          status: 'done',
          time: `${t.transcripts}s`,
          detail: `${data.transcriptCount}/${data.transcriptTotal} videos transcribed successfully`,
        },
        {
          label: 'Niche Detection (LDA + LLM)',
          status: 'done',
          time: `${t.lda}s`,
          detail: data.niches
            .slice(0, 3)
            .map((n) => `${n.niche} ${Math.round(n.confidence * 100)}%`)
            .join(' | '),
        },
        {
          label: 'AI Scoring (gpt-4o-mini)',
          status: 'done',
          time: `${t.openai}s`,
          detail: `Overall Score: ${data.analysis.overallScore}/100`,
        },
      ];

      const delays = [0, 300, 600, 900];
      for (let i = 0; i < steps.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, delays[i]));
        setPipelineSteps((prev) => {
          const next = [...prev];
          next[i] = steps[i];
          if (i + 1 < next.length && next[i + 1].status === 'pending') {
            next[i + 1] = { ...next[i + 1], status: 'running' };
          }
          return next;
        });
      }

      setResult(data);
    } catch (err: unknown) {
      setResearchError(err instanceof Error ? err.message : 'Research failed');
      setPipelineSteps([]);
    } finally {
      setIsResearching(false);
    }
  };

  const toggleVideo = (id: string) => {
    setExpandedVideos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (profile?.user_type !== 'sponsor') {
    return (
      <div className="container max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Sponsor Access Required</h2>
            <p className="text-muted-foreground">
              This feature is reserved for sponsors.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AI Discovery
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Research any YouTube creator with our AI pipeline, or explore featured influencers from around the world
        </p>
      </div>

      {/* ===== CREATOR RESEARCH SECTION ===== */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Creator Research
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Enter YouTube handle (e.g. @mkbhd)"
                value={searchHandle}
                onChange={(e) => setSearchHandle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isResearching && runResearch()}
                className="pl-10"
              />
            </div>
            <Button
              onClick={runResearch}
              disabled={isResearching || !searchHandle.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 min-w-[160px]"
            >
              {isResearching ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4 mr-2" />
                  Analyze Creator
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Research Error */}
      {researchError && (
        <Card className="border-destructive">
          <CardContent className="p-4 text-destructive">{researchError}</CardContent>
        </Card>
      )}

      {/* Pipeline Steps */}
      {pipelineSteps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Analysis Pipeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pipelineSteps.map((step, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                  step.status === 'done'
                    ? 'bg-green-50 dark:bg-green-950/20'
                    : step.status === 'running'
                    ? 'bg-blue-50 dark:bg-blue-950/20'
                    : 'bg-muted/50'
                }`}
              >
                <div className="mt-0.5">
                  {step.status === 'done' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : step.status === 'running' ? (
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">[{i + 1}]</span>
                    <span className="font-medium">{step.label}</span>
                    {step.status === 'done' && step.time && (
                      <Badge variant="outline" className="text-xs ml-auto">
                        {step.time}
                      </Badge>
                    )}
                  </div>
                  {step.detail && (
                    <p className="text-sm text-muted-foreground mt-1 truncate">
                      {step.detail}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Research Results */}
      {result && (
        <div className="space-y-6">
          {/* Channel Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <img
                  src={result.channel.thumbnailUrl}
                  alt={result.channel.title}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-full object-cover border-2 border-background shadow-md flex-shrink-0"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{result.channel.title}</h2>
                  <p className="text-sm text-muted-foreground">{result.channel.customUrl}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" /> {formatNumber(result.channel.subscriberCount)} subs
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" /> {formatNumber(result.channel.viewCount)} views
                    </span>
                    {result.channel.country && (
                      <span className="flex items-center gap-1">
                        <Globe className="w-4 h-4" /> {result.channel.country}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> Since {new Date(result.channel.publishedAt).getFullYear()}
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{result.analysis.overallScore}</div>
                  <div className="text-xs text-muted-foreground">/100</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Niche Chart + Score Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detected Niches</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.niches.map((n) => (
                  <div key={n.niche}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{n.niche}</span>
                      <span className="text-muted-foreground">{Math.round(n.confidence * 100)}%</span>
                    </div>
                    <Progress value={n.confidence * 100} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Score Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(result.analysis.categories).map(([key, score]) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{CATEGORY_LABELS[key] || key}</span>
                      <span className="text-muted-foreground">{score}/100</span>
                    </div>
                    <Progress value={score} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* AI Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{result.analysis.summary}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-green-700 dark:text-green-400 mb-2">Strengths</h4>
                  <ul className="text-sm space-y-1">
                    {result.analysis.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-orange-700 dark:text-orange-400 mb-2">Weaknesses</h4>
                  <ul className="text-sm space-y-1">
                    {result.analysis.weaknesses.map((w, i) => (
                      <li key={i} className="text-muted-foreground">- {w}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-blue-700 dark:text-blue-400 mb-2">Recommendations</h4>
                  <ul className="text-sm space-y-1">
                    {result.analysis.recommendations.map((r, i) => (
                      <li key={i} className="text-muted-foreground">- {r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Latest Videos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Latest Videos ({result.videos.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {result.videos.map((v) => (
                <div key={v.id} className="border rounded-lg overflow-hidden">
                  <div
                    className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => (v.transcript || v.transcriptSnippet) && toggleVideo(v.id)}
                  >
                    {/* YouTube link icon */}
                    <a
                      href={`https://www.youtube.com/watch?v=${v.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 w-10 h-10 rounded-lg bg-red-100 dark:bg-red-950/30 flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-950/50 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                      title="Watch on YouTube"
                    >
                      <Youtube className="w-5 h-5 text-red-600" />
                    </a>

                    <div className="flex-1 min-w-0">
                      <a
                        href={`https://www.youtube.com/watch?v=${v.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-sm hover:underline text-primary flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="truncate">{v.title}</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-50" />
                      </a>
                      <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" /> {formatNumber(v.viewCount)}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" /> {formatNumber(v.likeCount)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" /> {formatNumber(v.commentCount)}
                        </span>
                        {v.duration != null && v.duration > 0 && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {Math.floor(v.duration / 60)}:{String(v.duration % 60).padStart(2, '0')}
                          </span>
                        )}
                        {(v.transcript || v.transcriptSnippet) && (
                          <span className="flex items-center gap-1 text-blue-600">
                            <FileText className="w-3 h-3" /> Transcript
                          </span>
                        )}
                      </div>
                    </div>

                    {(v.transcript || v.transcriptSnippet) && (
                      <div className="ml-2 flex-shrink-0">
                        {expandedVideos.has(v.id) ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Expanded transcript */}
                  {expandedVideos.has(v.id) && (v.transcript || v.transcriptSnippet) && (
                    <div className="border-t bg-muted/30 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">Full Transcript</span>
                      </div>
                      <div className="max-h-64 overflow-y-auto rounded bg-background border p-3 text-sm text-muted-foreground leading-relaxed">
                        {v.transcript || v.transcriptSnippet}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ===== FEATURED INFLUENCERS SECTION ===== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Influencers</h2>
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All' },
              { value: 'US', label: '\u{1F1FA}\u{1F1F8} US' },
              { value: 'UK', label: '\u{1F1EC}\u{1F1E7} UK' },
              { value: 'FR', label: '\u{1F1EB}\u{1F1F7} FR' },
            ].map((filter) => (
              <Button
                key={filter.value}
                variant={selectedCountry === filter.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCountry(filter.value)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCreators.map((creator) => (
            <Card
              key={creator.handle}
              className="group hover:shadow-lg transition-all duration-300 hover:border-primary/20 overflow-hidden"
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  {creator.avatarUrl ? (
                    <img
                      src={creator.avatarUrl}
                      alt={creator.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-full object-cover border-2 border-background shadow-md flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg font-bold border-2 border-background shadow-md flex-shrink-0">
                      {creator.name.charAt(0)}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base truncate">{creator.name}</h3>
                      <span className="text-lg flex-shrink-0" title={creator.country}>{creator.countryFlag}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{creator.handle}</p>

                    <div className="flex items-center gap-3 mt-2">
                      <Badge className={`text-xs ${PLATFORM_COLORS[creator.platform] || ''}`}>
                        {creator.platform === 'YouTube' && <Youtube className="w-3 h-3 mr-1" />}
                        {creator.platform}
                      </Badge>
                      <span className="flex items-center gap-1 text-sm font-medium">
                        <Users className="w-3.5 h-3.5 text-muted-foreground" />
                        {creator.subscribers}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-3">
                      {creator.niches.map((niche) => (
                        <Badge key={niche} variant="secondary" className="text-xs">
                          {niche}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setSearchHandle(creator.handle);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <Bot className="w-4 h-4 mr-2" />
                    Analyze with AI
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
