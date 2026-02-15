# VibeMatch

> AI-Powered Creator-Sponsor Matching Platform

[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![OpenAI](https://img.shields.io/badge/Powered%20by-OpenAI-412991?style=flat&logo=openai&logoColor=white)](https://openai.com/)
[![YouTube API](https://img.shields.io/badge/YouTube-Data%20API%20v3-FF0000?style=flat&logo=youtube&logoColor=white)](https://developers.google.com/youtube/v3)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)

## Hackathon Project

Built during the **Cerebras x Cline Hackathon** by **[Paul Archer](https://github.com/archer-paul)** and **[Tom Effernelli](https://github.com/tom-effernelli)**.

Demo video:

https://github.com/user-attachments/assets/8d731038-a078-4628-867a-c1bdb1700f8e

---

Live app: [vibematch.tech](https://vibematch.tech)

---

## About

VibeMatch connects content creators with sponsors through AI-driven compatibility analysis. The platform pulls real YouTube data, runs NLP-based niche detection, scores creators across 30 criteria, and surfaces the best matches — all within a polished, swipe-based UI.

### The Problem

**Creators** waste time pitching sponsors who don't align with their content or audience. **Sponsors** struggle to vet influencers beyond surface-level follower counts. Both sides need better signal, not more noise.

VibeMatch solves this by analyzing actual content (video transcripts, metadata, engagement patterns) to produce data-backed compatibility scores.

---

## Architecture

```
                    +-------------------+
                    |   Frontend React  |
                    |   (Vite + ShadCN) |
                    +--------+----------+
                             |
                     /api proxy (dev)
                             |
                    +--------v----------+
                    |   Express Server  |
                    |   (server.js)     |
                    +--------+----------+
                             |
              +--------------+--------------+
              |              |              |
     +--------v---+  +------v------+  +----v-------+
     | YouTube API |  | OpenAI API  |  |  Supabase  |
     | Data v3     |  | gpt-4o-mini |  | PostgreSQL |
     +--------+---+  +------+------+  +----+-------+
              |              |              |
              +--------------+--------------+
                             |
                    +--------v----------+
                    |   LDA Analyzer    |
                    | (Topic Modeling)  |
                    +-------------------+
```

### How it works

1. **Onboarding** — Creator enters their YouTube handle
2. **YouTube API** — Fetches channel info, last 50 videos (titles, descriptions, tags, stats), filters out Shorts (<60s)
3. **Transcript extraction** — Pulls full video transcripts via YouTube's InnerTube API (ANDROID client context)
4. **LDA niche detection** — Runs topic modeling on video corpus to identify content niches
5. **OpenAI scoring** — Evaluates 30 criteria across 6 categories using gpt-4o-mini in JSON mode
6. **Deterministic matching** — LLM-free algorithm computes creator-sponsor compatibility from weighted factors
7. **Storage** — Results stored in Supabase, profile updated with niches and scores

---

## Features

### Creators
- **YouTube-linked onboarding** with live subscriber/video count validation
- **AI profile analysis** — 30 criteria across 6 categories (vocabulary, SEO, engagement, audience, topical authority, brand voice)
- **Automatic niche detection** via LDA topic modeling on video transcripts and metadata
- **Sponsor matching** with weighted compatibility scores
- **Dashboard** with real AI scores pulled from Supabase

### Sponsors
- **Creator Research tool** — enter any YouTube handle to get a full AI analysis with pipeline visualization
- **Discovery page** — featured influencers (US/UK/FR) with real profile pictures, one-click analysis
- **Video browser** — clickable YouTube links, duration, stats, and full scrollable transcripts
- **Deterministic scoring** on 6 weighted criteria (niche 30%, engagement 20%, audience 15%, content 15%, brand safety 10%, activity 10%)

### General
- **Tinder-style matching** — swipe interface for creators to discover sponsors
- **Gamification** — super likes, streaks, achievements, leaderboard
- **Demo mode** — full app walkthrough with mock data, no API keys needed
- **Fallback system** — every external API call has a local fallback

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, ShadCN/Radix UI |
| **Animations** | Framer Motion |
| **State** | React hooks, React Context, TanStack React Query |
| **Backend** | Express.js (Node.js, ESM) |
| **Database** | Supabase (PostgreSQL + Auth + Realtime + RLS) |
| **AI — Analysis** | OpenAI gpt-4o-mini (JSON mode, ~$0.001/analysis) |
| **AI — Niche Detection** | LDA via `lda` + `natural` for preprocessing |
| **Transcripts** | YouTube InnerTube API (ANDROID client) with brace-counting JSON extraction |
| **External API** | YouTube Data API v3 (via `googleapis`) |
| **Security** | express-rate-limit (50 req/15min), Supabase RLS |
| **Deployment** | Google Cloud Run (Docker) |

---

## Quick Start

### Prerequisites

- Node.js >= 18
- npm >= 9
- YouTube Data API key ([Google Cloud Console](https://console.cloud.google.com/))
- OpenAI API key ([platform.openai.com](https://platform.openai.com/api-keys))
- Supabase project ([supabase.com](https://supabase.com/dashboard))

### Installation

```bash
git clone https://github.com/archer-paul/vibematch-ai
cd vibematch-ai
npm install
```

### Environment Variables

Create `.env` at the project root:

```env
# Frontend (exposed to client)
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<supabase anon key>

# Backend
OPENAI_API_KEY=<sk-proj-...>
OPENAI_MODEL=gpt-4o-mini
YOUTUBE_API_KEY=<AIzaSy...>
SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<supabase service role key>
```

> **Never commit `.env` — it's already in `.gitignore`.**

### Running

**Development (2 terminals):**

```bash
# Terminal 1 — API server
PORT=3001 node server.js

# Terminal 2 — Vite dev server
npm run dev
# Vite proxies /api/* to localhost:3001
```

**Production:**

```bash
npm run build        # Builds frontend into dist/
node server.js       # Serves dist/ + API on port 8080
```

---

## Project Structure

```
vibematch-ai/
├── server.js                    # Express entry point (API + static serving)
├── server/
│   ├── youtube.js               # YouTube Data API v3 integration
│   ├── transcript.js            # Transcript extraction (InnerTube ANDROID client)
│   ├── lda-analyzer.js          # Niche detection via LDA topic modeling
│   ├── openai-analyzer.js       # Creator analysis via OpenAI gpt-4o-mini
│   ├── scoring.js               # Deterministic matching engine (no LLM)
│   ├── analyze.js               # POST /api/analyze/profile orchestrator
│   ├── admin.js                 # POST /api/admin/research (full pipeline)
│   ├── match.js                 # POST /api/match/score
│   └── supabase.js              # Supabase server-side client (service role)
│
├── src/
│   ├── pages/
│   │   ├── Index.tsx            # Landing page
│   │   ├── Auth.tsx             # Authentication
│   │   ├── CreatorOnboarding.tsx # Creator onboarding (4 steps)
│   │   ├── Dashboard.tsx        # Creator dashboard
│   │   ├── Matches.tsx          # Tinder-style swipe matching
│   │   ├── Discovery.tsx        # Sponsor: creator research + featured influencers
│   │   ├── Admin.tsx            # Admin: overview stats + creator research
│   │   ├── Profile.tsx          # User profile
│   │   ├── Pricing.tsx          # Pricing plans
│   │   ├── Leaderboard.tsx      # Gamified leaderboard
│   │   └── ...                  # Messages, Analytics, Campaigns, Settings, Market
│   │
│   ├── services/
│   │   └── analysisService.ts   # Client-side analysis service (calls /api endpoints)
│   │
│   ├── components/
│   │   ├── dashboard/           # AIProfileScore, widgets
│   │   ├── matching/            # SwipeCard, SwipeActions, MatchingStats
│   │   ├── onboarding/          # PersonalInfo, SocialMedia, ContentNiche, Goals
│   │   ├── discovery/           # GhostProfileCard
│   │   ├── gamification/        # AchievementCard, StreakCounter
│   │   ├── landing/             # AnimatedTitle, ParticleBackground
│   │   ├── demo/                # DemoOverlay (guided walkthrough)
│   │   ├── layout/              # AppHeader, AppLayout, AppSidebar
│   │   ├── modals/              # Various modals
│   │   └── ui/                  # ShadCN/Radix base components
│   │
│   ├── hooks/                   # useAuth, useGamification, useDemoData, etc.
│   ├── contexts/                # DemoContext
│   └── integrations/supabase/   # Frontend Supabase client + generated types
│
├── supabase/migrations/         # SQL migrations
├── Dockerfile                   # Production container
├── cloudbuild.yaml              # Google Cloud Build config
└── vite.config.ts               # Vite config (dev proxy)
```

---

## API Endpoints

### `POST /api/admin/research`

Full analysis pipeline for any YouTube creator. Returns channel data, video list with transcripts, niche detection, AI scoring, and timing breakdown.

```json
// Request
{ "handle": "@mkbhd" }

// Response (abbreviated)
{
  "channel": { "title": "MKBHD", "subscriberCount": 20700000, "thumbnailUrl": "..." },
  "videos": [{ "id": "...", "title": "...", "duration": 512, "transcript": "..." }],
  "transcriptCount": 10,
  "transcriptTotal": 10,
  "niches": [{ "niche": "Technology", "confidence": 0.95 }],
  "analysis": { "overallScore": 87, "categories": { ... }, "summary": "..." },
  "timings": { "youtube": "0.5", "transcripts": "5.6", "lda": "7.9", "openai": "4.5", "total": "18.5" }
}
```

### `POST /api/analyze/profile`

Orchestrates the full pipeline and stores results in Supabase. Used during creator onboarding.

```json
// Request
{ "youtubeHandle": "@mkbhd", "profileId": "uuid" }
```

### `POST /api/match/score`

Calculates creator-sponsor compatibility using the deterministic scoring engine.

### `GET /health`

Server health check — returns API configuration status for YouTube, OpenAI, and Supabase.

---

## Analysis Pipeline

### 1. YouTube Data (API v3)

Resolves handle to channel ID, fetches channel metadata + last 50 videos with stats. Filters out Shorts (duration <= 60s). Computes derived metrics: avg views, engagement rate, publishing frequency, top tags.

**Cost**: ~100 API units per analysis (daily quota: 10,000 = ~100 analyses/day)

### 2. Transcript Extraction (InnerTube)

YouTube blocks standard caption URL fetches from server IPs (`ip=0.0.0.0` in baseUrl). We work around this by calling the `get_transcript` InnerTube endpoint with an ANDROID client context, which returns transcript segments directly. Transcripts are fetched in batches of 3 with 500ms delays.

Typical result: **10/10 transcripts** for English channels, good coverage for French.

### 3. LDA Niche Detection

Builds a text corpus (1 doc per video: title + description + tags), removes EN/FR stopwords, runs Latent Dirichlet Allocation with 5 topics. Each topic maps to one of 15 predefined niches (Technology, Gaming, Beauty, Fitness, Fashion, Food, Travel, Education, Entertainment, Music, Finance, Lifestyle, Science, Sports, Sustainability). Falls back to keyword matching when data is sparse.

### 4. OpenAI Scoring (gpt-4o-mini)

Scores 30 criteria grouped into 6 categories (each 0–100):

| Category | What it measures |
|----------|-----------------|
| **Vocabulary & Language** | Title quality, description depth, sentiment, language level, storytelling |
| **SEO & Metadata** | Tags, thumbnails, CTAs, hashtag usage, search optimization |
| **Engagement** | Like/view ratio, comment rate, publishing frequency, consistency |
| **Audience & Reach** | Channel size, growth signals, loyalty (views/subscribers ratio) |
| **Topical Authority** | Topic clarity, expertise depth, thematic consistency |
| **Tone & Brand Voice** | Transparency, authenticity, monetization approach |

**Cost**: ~$0.001 per analysis

### 5. Deterministic Matching

No LLM involved — pure algorithmic scoring:

| Factor | Weight |
|--------|--------|
| Niche alignment | 30% |
| Engagement quality | 20% |
| Audience size fit | 15% |
| Content compatibility | 15% |
| Brand safety | 10% |
| Activity & recency | 10% |

---

## Database (Supabase)

| Table | Purpose |
|-------|---------|
| `profiles` | Creator and sponsor profiles (niches, content styles, follower counts) |
| `ai_analysis` | AI analysis results (scores, categories, full JSON) |
| `swipe_actions` | Like/dislike/super_like actions |
| `matchings` | Compatibility scores between users |
| `conversations` / `messages` | Messaging system |
| `campaigns` / `campaign_creators` | Sponsor campaigns |
| `achievements` / `user_quotas` | Gamification (badges, streaks, daily limits) |
| `creator_analytics` | Per-platform analytics |

---

## Deployment

### Google Cloud Run

The app runs as a Docker container on Cloud Run (europe-west9).

```bash
npm run build

# Build and push
docker build -t gcr.io/<project-id>/vibematch-app .
docker push gcr.io/<project-id>/vibematch-app

# Deploy
gcloud run deploy vibematch-ai \
  --image gcr.io/<project-id>/vibematch-app \
  --platform managed --region europe-west9 \
  --allow-unauthenticated --port 8080 \
  --set-env-vars VITE_SUPABASE_URL=...,OPENAI_MODEL=gpt-4o-mini \
  --set-secrets OPENAI_API_KEY=openai-key:latest,YOUTUBE_API_KEY=youtube-key:latest
```

Or trigger via Cloud Build:

```bash
gcloud builds submit --config cloudbuild.yaml
```

---

## Demo Mode

Test the full app without any API keys:

- Activate: `localStorage.setItem('demo-mode', 'true')`
- Mock data is returned instead of live API calls
- DemoOverlay provides an interactive guided tour of the interface

---

## Roadmap

### Done
- Creator/sponsor matching with swipe interface
- YouTube Data API v3 integration (real channel data, Shorts filtering)
- Transcript extraction via InnerTube ANDROID client
- LDA niche detection from video content + transcripts
- OpenAI gpt-4o-mini analysis (30 criteria, 6 categories)
- Deterministic scoring engine
- Creator Research tool for sponsors (full pipeline with transcript viewer)
- Discovery page with real featured influencers (US/UK/FR)
- Gamification (super likes, streaks, achievements, leaderboard)
- Demo mode with guided walkthrough

### Next
- Instagram Graph API, TikTok Business API, Twitter/X API integration
- Cross-platform unified scoring
- ROI predictor, fake followers detection
- Outreach automation, contract management
- CRM integrations, public API

---

## Team

**Paul Archer** — Full-stack Development & AI Integration
**Tom Effernelli** — Frontend Development & UX Design

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

## Acknowledgments

Thanks to Cerebras for the hackathon, OpenAI for gpt-4o-mini, Google for YouTube Data API v3, and Supabase for the backend infrastructure.
