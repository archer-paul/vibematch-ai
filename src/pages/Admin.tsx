import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Users, BarChart3, Handshake, Bot, Search, Loader2,
  CheckCircle2, ChevronDown, ChevronUp, Globe, Calendar,
  Eye, ThumbsUp, MessageSquare, Clock,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { isDemoMode } from '@/data/demoData';

interface StatsData {
  creators: number;
  sponsors: number;
  analyses: number;
  matches: number;
  recentSignups: Array<{
    id: string;
    full_name: string;
    user_type: string;
    avatar_url: string | null;
    created_at: string;
  }>;
  recentAnalyses: Array<{
    id: string;
    channelTitle: string;
    score: number;
    createdAt: string;
  }>;
}

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

const CATEGORY_LABELS: Record<string, string> = {
  vocabularyLanguage: 'Vocabulary & Language',
  seoMetadata: 'SEO & Metadata Quality',
  engagement: 'Engagement & Interaction',
  audienceReach: 'Audience & Reach',
  topicalAuthority: 'Topical Authority',
  toneBrandVoice: 'Tone & Brand Voice',
  // Legacy fallback
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

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export default function Admin() {
  const { profile } = useAuth();
  const demoMode = isDemoMode();

  const [stats, setStats] = useState<StatsData | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Research state
  const [searchHandle, setSearchHandle] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>([]);
  const [expandedVideos, setExpandedVideos] = useState<Set<string>>(new Set());
  const [researchError, setResearchError] = useState<string | null>(null);

  // Fetch stats on mount
  useEffect(() => {
    if (!demoMode && !profile?.is_admin) return;
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setStatsLoading(false);
      })
      .catch(() => setStatsLoading(false));
  }, [demoMode, profile?.is_admin]);

  if (!demoMode && !profile?.is_admin) {
    return (
      <div className="container max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-muted-foreground">
              You do not have admin privileges to access this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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

      // Animate pipeline steps based on real timing data
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

      // Reveal steps one by one with delays
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

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="research">Creator Research</TabsTrigger>
        </TabsList>

        {/* ===== OVERVIEW TAB ===== */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Creators', value: stats?.creators, icon: Users, color: 'text-blue-600' },
              { label: 'Sponsors', value: stats?.sponsors, icon: Handshake, color: 'text-green-600' },
              { label: 'AI Analyses', value: stats?.analyses, icon: Bot, color: 'text-purple-600' },
              { label: 'Matches', value: stats?.matches, icon: BarChart3, color: 'text-orange-600' },
            ].map((s) => (
              <Card key={s.label}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{s.label}</p>
                      <p className="text-2xl font-bold">
                        {statsLoading ? '...' : (s.value ?? 0).toLocaleString()}
                      </p>
                    </div>
                    <s.icon className={`w-8 h-8 ${s.color} opacity-80`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Signups */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Signups</CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : !stats?.recentSignups?.length ? (
                <p className="text-muted-foreground">No signups yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 pr-4">Name</th>
                        <th className="text-left py-2 pr-4">Type</th>
                        <th className="text-left py-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentSignups.map((s) => (
                        <tr key={s.id} className="border-b last:border-0">
                          <td className="py-2 pr-4 font-medium">{s.full_name || 'Anonymous'}</td>
                          <td className="py-2 pr-4">
                            <Badge variant={s.user_type === 'creator' ? 'default' : 'secondary'}>
                              {s.user_type}
                            </Badge>
                          </td>
                          <td className="py-2 text-muted-foreground">{formatDate(s.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Analyses */}
          <Card>
            <CardHeader>
              <CardTitle>Recent AI Analyses</CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : !stats?.recentAnalyses?.length ? (
                <p className="text-muted-foreground">No analyses yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 pr-4">Channel</th>
                        <th className="text-left py-2 pr-4">Score</th>
                        <th className="text-left py-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentAnalyses.map((a) => (
                        <tr key={a.id} className="border-b last:border-0">
                          <td className="py-2 pr-4 font-medium">{a.channelTitle}</td>
                          <td className="py-2 pr-4">
                            <Badge variant={a.score >= 80 ? 'default' : 'secondary'}>
                              {a.score}/100
                            </Badge>
                          </td>
                          <td className="py-2 text-muted-foreground">{formatDate(a.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== CREATOR RESEARCH TAB ===== */}
        <TabsContent value="research" className="space-y-6">
          {/* Search Bar */}
          <Card>
            <CardContent className="p-6">
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
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 min-w-[120px]"
                >
                  {isResearching ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Bot className="w-4 h-4 mr-2" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Error */}
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

          {/* Results */}
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

              {/* Niche Chart + Score Breakdown side by side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Niche Chart */}
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

                {/* Score Breakdown */}
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
                  <CardTitle className="text-lg">Latest Videos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {result.videos.map((v) => (
                    <div key={v.id} className="border rounded-lg p-3">
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => v.transcriptSnippet && toggleVideo(v.id)}
                      >
                        <div className="flex-1 min-w-0">
                          <a
                            href={`https://www.youtube.com/watch?v=${v.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-sm truncate block hover:underline text-primary"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {v.title}
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
                          </div>
                        </div>
                        {v.transcriptSnippet && (
                          <div className="ml-2">
                            {expandedVideos.has(v.id) ? (
                              <ChevronUp className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                        )}
                      </div>
                      {expandedVideos.has(v.id) && v.transcriptSnippet && (
                        <div className="mt-2 p-2 bg-muted rounded text-xs text-muted-foreground italic">
                          "{v.transcriptSnippet}"
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
