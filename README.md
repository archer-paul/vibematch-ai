# VibeMatch

> AI-Powered Creator-Sponsor Matching Platform

[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![OpenAI](https://img.shields.io/badge/Powered%20by-OpenAI-412991?style=flat&logo=openai&logoColor=white)](https://openai.com/)
[![YouTube API](https://img.shields.io/badge/YouTube-Data%20API%20v3-FF0000?style=flat&logo=youtube&logoColor=white)](https://developers.google.com/youtube/v3)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)

## Hackathon Project

Developed during the **Cerebras x Cline Hackathon** by **[Paul Archer](https://github.com/archer-paul)** and **[Tom Effernelli](https://github.com/tom-effernelli)**.

Check out the demo video:

https://github.com/user-attachments/assets/8d731038-a078-4628-867a-c1bdb1700f8e

---

Check out our app [here](https://vibematch.tech)

---

## About

VibeMatch is a SaaS platform that leverages artificial intelligence to create authentic and high-performing partnerships between content creators and sponsors. The platform automates the entire matching, analysis, and connection process while ensuring optimal compatibility based on deep behavioral data.

### Problem We Solve

**For Creators:**
- Difficulty finding sponsors aligned with their audience and values
- Time-consuming and often unsuccessful negotiation processes
- Lack of visibility into their own marketing profile

**For Sponsors:**
- Complexity in identifying the right influencers in their niche
- Risk of inauthentic partnerships damaging brand image
- Absence of predictive tools to evaluate collaboration ROI

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

### Data Flow

1. **Onboarding** : Creator enters their YouTube handle
2. **YouTube API** : Fetches channel info + last 50 videos (titles, descriptions, tags, stats)
3. **LDA** : Analyzes text corpus from videos to detect niches (5 topics, 15 possible niches)
4. **OpenAI** : Evaluates 30 criteria across 6 categories via gpt-4o-mini in JSON mode
5. **Scoring** : Deterministic algorithm (no LLM) for fast creator-sponsor matching
6. **Supabase** : Stores analysis in `ai_analysis`, updates profile

---

## Key Features

### For Creators
- **Smart Onboarding**: Real YouTube profile validation with live subscriber/video count display
- **AI Profile Analysis**: 30-criteria analysis across 6 categories (Content, Engagement, Audience, Themes, Text, Brand)
- **Niche Detection**: Automatic niche detection via LDA topic modeling on video content
- **Intelligent Matching**: Algorithm-based sponsor recommendations with weighted compatibility scores
- **Performance Tracking**: Dashboard with real AI scores fetched from Supabase

### For Sponsors
- **Professional B2B Interface**: Campaign briefing with automatic KPI generation
- **Advanced Recommendations**: Deterministic scoring on 6 weighted criteria (niche alignment 30%, engagement 20%, audience 15%, content 15%, brand safety 10%, activity 10%)
- **Ghost Matching**: Analysis of non-registered creator profiles via public data
- **Real-time Analytics**: Multi-touch attribution and performance tracking

### Unique Features
- **Tinder-like Matching**: Swipe interface for creators to discover sponsors
- **Gamification**: Super likes, streaks, achievements, leaderboard
- **Demo Mode**: Full app walkthrough without API keys (mock data)
- **Fallback System**: Every API call has a local fallback if external services fail

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, ShadCN/Radix UI |
| **Animations** | Framer Motion |
| **State** | React hooks, React Context, TanStack React Query |
| **Backend** | Express.js (Node.js, ESM) |
| **Database** | Supabase (PostgreSQL + Auth + Realtime + RLS) |
| **AI - Analysis** | OpenAI gpt-4o-mini (JSON mode, ~$0.001/analysis) |
| **AI - Niche Detection** | LDA via `lda` library + preprocessing with `natural` |
| **External API** | YouTube Data API v3 (via `googleapis`) |
| **Security** | express-rate-limit (50 req/15min), Supabase RLS, service role key server-side |
| **Deployment** | Google Cloud Run (Docker) |

---

## Quick Start

### Prerequisites

- Node.js >= 18
- npm >= 9
- A Google Cloud account (for YouTube API)
- An OpenAI account (for gpt-4o-mini)
- A Supabase project (already configured)

### Installation

```bash
git clone <repo-url>
cd vibematch-ai
npm install
```

### Environment Variables

Create/edit `.env` at the project root:

```env
# Frontend (exposed to client via VITE_ prefix)
VITE_SUPABASE_URL=https://tuqarhetglkawdnniyuz.supabase.co
VITE_SUPABASE_ANON_KEY=<your supabase anon key>

# Backend - OpenAI
OPENAI_API_KEY=<your openai key, starts with sk-proj-...>
OPENAI_MODEL=gpt-4o-mini

# Backend - YouTube
YOUTUBE_API_KEY=<your youtube api key, starts with AIzaSy...>

# Backend - Supabase (server-side, service role for bypassing RLS)
SUPABASE_URL=https://tuqarhetglkawdnniyuz.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your supabase service role key>
```

#### How to get each key:

| Key | Where to get it |
|-----|----------------|
| `YOUTUBE_API_KEY` | [Google Cloud Console](https://console.cloud.google.com/) > APIs & Services > Credentials > Create API Key > Restrict to "YouTube Data API v3" |
| `OPENAI_API_KEY` | [OpenAI Platform](https://platform.openai.com/api-keys) > Create new secret key |
| `SUPABASE_SERVICE_ROLE_KEY` | [Supabase Dashboard](https://supabase.com/dashboard) > Project Settings > API > service_role key |
| `VITE_SUPABASE_ANON_KEY` | Same Supabase page > anon key |

> **Important**: Never commit `.env` to Git. It is already in `.gitignore`.

### Running the Project

#### Development (2 terminals)

**Terminal 1 - Express API server:**
```bash
PORT=3001 node server.js
# Starts on http://localhost:3001
```

**Terminal 2 - Vite dev server (frontend):**
```bash
npm run dev
# Starts on http://localhost:8080
# Vite proxy redirects /api/* calls to http://localhost:3001
```

#### Production

```bash
npm run build          # Build frontend into dist/
node server.js         # Serves dist/ + API on same port (8080)
```

---

## Project Structure

```
vibematch-ai/
|
|-- server.js                          # Express entry point (API + static files)
|-- server/
|   |-- youtube.js                     # YouTube Data API v3 integration
|   |-- lda-analyzer.js                # Niche detection via LDA topic modeling
|   |-- openai-analyzer.js             # Profile analysis + compatibility via OpenAI
|   |-- scoring.js                     # Deterministic scoring engine (30 criteria, no LLM)
|   |-- analyze.js                     # POST /api/analyze/profile (orchestrator)
|   |-- match.js                       # POST /api/match/score
|   |-- supabase.js                    # Supabase server-side client (service role)
|
|-- src/
|   |-- pages/
|   |   |-- Index.tsx                  # Landing page
|   |   |-- Auth.tsx                   # Authentication
|   |   |-- CreatorOnboarding.tsx      # Creator onboarding (4 steps)
|   |   |-- Dashboard.tsx              # Creator dashboard
|   |   |-- Matches.tsx                # Tinder-like swipe matching
|   |   |-- Discovery.tsx              # Creator discovery (sponsors)
|   |   |-- Messages.tsx               # Messaging
|   |   |-- Analytics.tsx              # Creator analytics
|   |   |-- Campaigns.tsx              # Campaign management
|   |   |-- Profile.tsx                # User profile
|   |   |-- Pricing.tsx                # Pricing plans
|   |   |-- Leaderboard.tsx            # Gamified leaderboard
|   |   |-- Market.tsx                 # Marketplace
|   |   |-- Settings.tsx               # Settings
|   |   |-- Admin.tsx                  # Admin panel
|   |
|   |-- services/
|   |   |-- analysisService.ts         # Main analysis service (calls /api endpoints)
|   |   |-- cerebrasService.ts         # [DEPRECATED] Old Cerebras service
|   |
|   |-- components/
|   |   |-- dashboard/                 # AIProfileScore, widgets
|   |   |-- matching/                  # SwipeCard, SwipeActions, MatchingStats
|   |   |-- onboarding/               # Steps: PersonalInfo, SocialMedia, ContentNiche, Goals
|   |   |-- discovery/                 # GhostProfileCard
|   |   |-- gamification/              # AchievementCard, StreakCounter
|   |   |-- landing/                   # AnimatedTitle, ParticleBackground
|   |   |-- demo/                      # DemoOverlay
|   |   |-- layout/                    # AppHeader, AppLayout, AppSidebar
|   |   |-- modals/                    # Various modals
|   |   |-- ui/                        # ShadCN/Radix base components
|   |
|   |-- hooks/                         # useAuth, useGamification, useDemoData, etc.
|   |-- contexts/                      # DemoContext
|   |-- integrations/supabase/         # Frontend Supabase client + generated types
|   |-- data/                          # demoData.ts
|
|-- supabase/
|   |-- functions/cerebras-analysis/   # [DEPRECATED] Old Cerebras Edge Function
|   |-- migrations/                    # SQL migrations
|
|-- public/                            # Static assets (avatars, logos)
|-- vite.config.ts                     # Vite config (proxy /api in dev)
|-- tailwind.config.ts                 # Tailwind config
|-- .env                               # Environment variables (not committed)
```

---

## API Endpoints

### `POST /api/youtube/analyze`

Analyze a YouTube channel from its handle.

**Request:**
```json
{ "handle": "@mkbhd" }
```

**Response:**
```json
{
  "channel": {
    "id": "UCBJycsmduvYEL83R_U4JriQ",
    "title": "MKBHD",
    "subscriberCount": 19400000,
    "viewCount": 4200000000,
    "videoCount": 1780,
    "country": "US",
    "keywords": ["tech", "reviews", "gadgets"]
  },
  "videos": [
    {
      "id": "abc123",
      "title": "iPhone 16 Pro Review",
      "tags": ["iphone", "apple", "review"],
      "viewCount": 5200000,
      "likeCount": 180000,
      "commentCount": 12000
    }
  ],
  "metrics": {
    "avgViews": 3200000,
    "engagementRate": 4.2,
    "publishFrequencyDays": 4,
    "topTags": ["tech", "review", "apple", "samsung"],
    "viewsToSubsRatio": 0.16
  }
}
```

### `POST /api/analyze/profile`

Full orchestration: YouTube fetch + LDA niche detection + OpenAI analysis + Supabase storage.

**Request:**
```json
{
  "youtubeHandle": "@mkbhd",
  "profileId": "uuid-of-the-profile"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "overallScore": 87,
    "categories": {
      "contentProduction": 92,
      "textAnalysis": 80,
      "engagement": 88,
      "audience": 95,
      "themes": 85,
      "brandPersonality": 82
    },
    "summary": "MKBHD is a top-tier tech reviewer...",
    "strengths": ["Exceptional production quality", "Massive loyal audience"],
    "weaknesses": ["Limited content diversity"],
    "detectedNiches": ["Technology", "Entertainment"],
    "contentStyle": "High-end tech reviews and commentary"
  },
  "youtube": {
    "channelTitle": "MKBHD",
    "subscriberCount": 19400000,
    "videoCount": 1780,
    "engagementRate": 4.2
  },
  "niches": [
    { "niche": "Technology", "confidence": 0.95 },
    { "niche": "Entertainment", "confidence": 0.42 }
  ]
}
```

### `POST /api/match/score`

Calculate creator-sponsor compatibility.

**Request:**
```json
{
  "creatorProfileId": "uuid-creator",
  "sponsorProfileId": "uuid-sponsor"
}
```

**Response:**
```json
{
  "score": 82,
  "factors": [
    "Niche Alignment: 90%",
    "Engagement Quality: 80%",
    "Audience Fit: 75%",
    "Brand Safety: 95%",
    "Content Compatibility: 70%"
  ],
  "recommendations": ["Strong tech alignment", "Budget matches audience tier"],
  "breakdown": {
    "nicheAlignment": 90,
    "audienceSize": 75,
    "engagementQuality": 80,
    "contentCompatibility": 70,
    "brandSafety": 95,
    "activity": 85
  }
}
```

### `GET /health`

Server health check with API configuration status.

---

## Analysis Pipeline (Detail)

### Step 1: YouTube Data API v3

- Resolves handle (e.g. `@mkbhd`) to channel ID via `forHandle` or `search.list`
- Fetches: title, description, subscribers, total views, country, keywords
- Fetches last 50 videos: titles, descriptions, tags, stats (views, likes, comments), duration
- Calculates derived metrics: average views, engagement rate, publishing frequency, top tags, views-to-subscribers ratio

**API Cost**: ~100 units per analysis (quota = 10,000/day = ~100 analyses/day)

### Step 2: LDA (Latent Dirichlet Allocation)

- Builds corpus: 1 document per video (title + description + tags concatenated)
- Preprocessing: lowercase, punctuation removal, EN/FR stopwords, short words
- Runs LDA with 5 topics, 10 terms per topic
- Maps each topic to one of 15 predefined niches:
  Technology, Gaming, Beauty, Fitness, Fashion, Food, Travel, Education, Entertainment, Music, Finance, Lifestyle, Science, Sports, Sustainability
- Returns niches with confidence score (0-1)
- Fallback: keyword matching if insufficient data for LDA

### Step 3: OpenAI (gpt-4o-mini)

Analyzes 30 criteria grouped in 6 categories (each scored 0-100):

| Category | Criteria |
|----------|----------|
| **Content & Production** | Production quality, editing style, thumbnails, variety, visual consistency, platform optimization |
| **Text Analysis** | Title/description length, sentiment, language level, CTAs, storytelling, hashtags, SEO |
| **Engagement** | Engagement rate, like/view ratio, comments/views, publishing frequency, consistency, timing |
| **Audience** | Size, estimated growth, reach, loyalty (views/subscribers ratio) |
| **Themes & Expertise** | Topic clarity, expertise depth, diversity, thematic consistency, organic brand mentions |
| **Brand Personality** | Tone, transparency, monetization approach, perceived authenticity |

**Cost**: ~$0.001 per analysis with gpt-4o-mini

### Step 4: Deterministic Scoring (Matching)

LLM-free algorithm for fast creator-sponsor matching:

| Criterion | Weight | Logic |
|-----------|--------|-------|
| Niche alignment | 30% | Overlap between creator niches and sponsor sectors |
| Engagement quality | 20% | Engagement rate vs benchmarks for audience tier |
| Audience size fit | 15% | Subscriber count vs sponsor budget range |
| Content compatibility | 15% | Content styles vs campaign objectives |
| Brand safety | 10% | No overlap with sponsor's avoided sectors |
| Activity | 10% | Publishing frequency + recency |

---

## Database Schema (Supabase)

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles (creators and sponsors) with niches, content_styles, follower_counts, etc. |
| `ai_analysis` | AI analysis results (scores, categories, niches, full analysis JSON) |
| `swipe_actions` | Like/dislike/super_like actions |
| `matchings` | Compatibility scores between creators and sponsors |
| `conversations` | Messaging threads |
| `messages` | Individual messages |
| `campaigns` | Sponsor campaigns |
| `campaign_creators` | Campaign-creator associations |
| `achievements` | Gamification badges |
| `user_quotas` | Daily quotas and streaks |
| `creator_analytics` | Analytics data per platform |
| `ghost_profiles` | Discovered non-registered profiles |

---

## Demo Mode

Demo mode allows testing the full app without API keys:

- Activated via `localStorage.setItem('demo-mode', 'true')`
- `analysisService` returns mock data instead of calling APIs
- Sponsor profiles come from `useEnhancedDemoData`
- DemoOverlay guides users through the interface with interactive steps

---

## Rate Limiting

API routes (`/api/*`) are protected by `express-rate-limit`:
- **50 requests per 15 minutes** per IP address
- Standard `RateLimit-*` headers included in responses
- 429 response with JSON message on limit exceeded

---

## Deployment

### Google Cloud Run

```bash
npm run build

docker build -t vibematch-ai .
docker push gcr.io/<project-id>/vibematch-ai

gcloud run deploy vibematch-ai \
  --image gcr.io/<project-id>/vibematch-ai \
  --set-env-vars VITE_SUPABASE_URL=...,VITE_SUPABASE_ANON_KEY=...,OPENAI_MODEL=gpt-4o-mini \
  --set-secrets OPENAI_API_KEY=openai-key:latest,YOUTUBE_API_KEY=youtube-key:latest,SUPABASE_SERVICE_ROLE_KEY=supabase-srk:latest
```

---

## Roadmap

### Phase 1 - Hackathon MVP (Done)
- [x] Creator/sponsor matching with swipe interface
- [x] Registration, onboarding, dashboard
- [x] AI analysis integration
- [x] Demo mode with guided walkthrough
- [x] Gamification (super likes, streaks, achievements)

### Phase 2 - Real Data (Done)
- [x] YouTube Data API v3 integration (real channel data)
- [x] LDA niche detection from video content
- [x] OpenAI gpt-4o-mini analysis (30 criteria, 6 categories)
- [x] Deterministic scoring engine for matching
- [x] Real YouTube validation in onboarding
- [x] Real AI scores on dashboard

### Phase 3 - Multi-Platform (Next)
- [ ] Instagram Graph API integration
- [ ] TikTok Business API integration
- [ ] Twitter/X API v2 integration
- [ ] Cross-platform unified scoring
- [ ] Multi-platform niche detection

### Phase 4 - Production
- [ ] Premium features (ROI predictor, fake followers detection)
- [ ] Complete ghost matching
- [ ] Automation suite (outreach, contracts)
- [ ] CRM integrations
- [ ] Public API for partners

---

## Team

**Paul Archer** - Full-stack Developer & AI Integration
**Tom Effernelli** - Frontend Developer & UX Design

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **Cerebras** for the hackathon opportunity and initial AI infrastructure
- **OpenAI** for gpt-4o-mini powering creator analysis
- **Google** for the YouTube Data API v3
- **Supabase** for the backend infrastructure
- **Open source community** for the fantastic tools and libraries

---

<div align="center">

**Revolutionizing influencer marketing with AI-powered authentic partnerships**

Made with love during Cerebras x Cline Hackathon

</div>
