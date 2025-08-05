import { Profile } from '@/hooks/useAuth';

// Demo Creator Profile
export const demoCreatorProfile: Profile = {
  id: 'demo-creator-1',
  user_id: 'demo-creator-user',
  user_type: 'creator',
  email: 'sophia.martinez@example.com',
  full_name: 'Sophia Martinez',
  display_name: 'SophiaCreates',
  avatar_url: '/avatars/avatar1.svg',
  bio: 'Content creator passionate about technology, lifestyle, and sustainability. I love creating engaging content that makes a difference.',
  tagline: 'Creating content that inspires change',
  location: { country: 'United States', city: 'Los Angeles' },
  social_handles: {
    instagram: '@sophiacreates',
    tiktok: '@sophiamartinez',
    youtube: 'SophiaCreatesContent'
  },
  social_platforms: ['instagram', 'tiktok', 'youtube'],
  follower_counts: {
    instagram: 125000,
    tiktok: 89000,
    youtube: 45000
  },
  niches: ['Technology', 'Lifestyle', 'Sustainability'],
  professional_level: 8,
  content_styles: ['Educational', 'Entertaining', 'Authentic'],
  collaboration_types: ['Sponsored Posts', 'Product Reviews', 'Brand Partnerships'],
  rate_range: { min: 500, max: 2500 },
  preferred_sectors: ['Technology', 'Eco-friendly', 'Fashion'],
  avoided_sectors: ['Alcohol', 'Gambling'],
  availability_hours: 'Flexible',
  geographic_scope: 'Global',
  content_examples: [
    'https://example.com/content1',
    'https://example.com/content2'
  ],
  onboarding_completed: true,
  content_categories: ['Tech Reviews', 'Lifestyle Tips', 'Sustainability'],
  engagement_rate: 4.2,
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-12-15T10:00:00Z'
};

// Demo Sponsor Profile
export const demoSponsorProfile: Profile = {
  id: 'demo-sponsor-1',
  user_id: 'demo-sponsor-user',
  user_type: 'sponsor',
  email: 'demo.sponsor@techbrand.com',
  full_name: 'Sarah Johnson',
  display_name: 'TechBrand Marketing',
  avatar_url: '/avatars/avatar2.svg',
  bio: 'Marketing director at TechBrand, specializing in influencer partnerships and digital campaigns.',
  company_name: 'TechBrand Inc.',
  industry: 'Technology',
  budget_range: '$10K-50K',
  campaign_objectives: ['Brand Awareness', 'Product Launch', 'Engagement'],
  preferred_sectors: ['Technology', 'Innovation', 'Gaming'],
  avoided_sectors: ['Competitor brands'],
  onboarding_completed: true,
  created_at: '2024-01-10T10:00:00Z',
  updated_at: '2024-12-10T10:00:00Z'
};

// Demo Analytics Data
export const demoAnalytics = {
  creator: {
    totalReach: 259000,
    engagementRate: 4.2,
    avgViewsPerPost: 12500,
    topPerformingPlatform: 'Instagram',
    monthlyGrowth: 8.5,
    recentCampaigns: 12,
    earnings: {
      thisMonth: 4250,
      lastMonth: 3800,
      growth: 11.8
    },
    topNiches: ['Technology', 'Lifestyle', 'Sustainability']
  },
  sponsor: {
    activeCampaigns: 8,
    totalReach: 1250000,
    avgEngagementRate: 3.8,
    campaignROI: 4.2,
    monthlyBudget: 25000,
    topPerformingCreators: ['AlexCreates', 'TechReviewer', 'LifestyleBlogger'],
    campaigns: {
      completed: 15,
      active: 8,
      pending: 3
    }
  }
};

// Demo Messages
export const demoMessages = [
  {
    id: 'msg-1',
    from: 'TechBrand Inc.',
    subject: 'Partnership Opportunity - Smart Watch Campaign',
    preview: 'Hi Alex! We love your tech content and would like to discuss a partnership...',
    timestamp: '2 hours ago',
    unread: true,
    type: 'collaboration'
  },
  {
    id: 'msg-2',
    from: 'EcoLife Brand',
    subject: 'Sustainability Content Collaboration',
    preview: 'Your sustainability content aligns perfectly with our brand values...',
    timestamp: '1 day ago',
    unread: false,
    type: 'collaboration'
  },
  {
    id: 'msg-3',
    from: 'VibeMatch Support',
    subject: 'Profile Optimization Tips',
    preview: 'Here are some tips to improve your profile visibility...',
    timestamp: '3 days ago',
    unread: false,
    type: 'system'
  }
];

// Demo Matches
export const demoMatches = [
  {
    id: 'match-1',
    name: 'TechBrand Inc.',
    logo: '/logos/apple.svg',
    industry: 'Technology',
    matchScore: 92,
    campaignType: 'Product Launch',
    budget: '$2,000 - $5,000',
    description: 'Looking for tech creators to showcase our latest smart watch.',
    tags: ['Technology', 'Wearables', 'Innovation']
  },
  {
    id: 'match-2',
    name: 'EcoLife',
    logo: '/logos/wwf.svg',
    industry: 'Sustainability',
    matchScore: 88,
    campaignType: 'Brand Awareness',
    budget: '$1,500 - $3,000',
    description: 'Seeking creators passionate about environmental sustainability.',
    tags: ['Sustainability', 'Eco-friendly', 'Lifestyle']
  },
  {
    id: 'match-3',
    name: 'StyleCo',
    logo: '/logos/zara.svg',
    industry: 'Fashion',
    matchScore: 76,
    campaignType: 'Seasonal Campaign',
    budget: '$1,000 - $2,500',
    description: 'Spring collection campaign for lifestyle creators.',
    tags: ['Fashion', 'Lifestyle', 'Seasonal']
  }
];

// Demo Creators (for sponsor view)
export const demoCreators = [
  {
    id: 'creator-1',
    name: 'Alex Rivera',
    handle: '@alexcreates',
    avatar: '/avatars/avatar1.svg',
    followers: 125000,
    engagement: 4.2,
    platform: 'Instagram',
    niche: 'Technology',
    matchScore: 94,
    rate: '$500-2500',
    location: 'Los Angeles, CA'
  },
  {
    id: 'creator-2',
    name: 'Maya Chen',
    handle: '@mayastyle',
    avatar: '/avatars/avatar3.svg',
    followers: 89000,
    engagement: 3.8,
    platform: 'TikTok',
    niche: 'Fashion',
    matchScore: 87,
    rate: '$300-1500',
    location: 'New York, NY'
  },
  {
    id: 'creator-3',
    name: 'Jordan Smith',
    handle: '@jordanfitness',
    avatar: '/avatars/avatar4.svg',
    followers: 156000,
    engagement: 5.1,
    platform: 'YouTube',
    niche: 'Fitness',
    matchScore: 82,
    rate: '$800-3000',
    location: 'Miami, FL'
  }
];

// Demo Campaigns
export const demoCampaigns = [
  {
    id: 'campaign-1',
    name: 'Smart Watch Launch 2024',
    status: 'Active',
    budget: '$15,000',
    creators: 5,
    reach: 450000,
    engagement: 3.9,
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    objective: 'Product Launch'
  },
  {
    id: 'campaign-2',
    name: 'Holiday Tech Gift Guide',
    status: 'Completed',
    budget: '$12,000',
    creators: 8,
    reach: 680000,
    engagement: 4.2,
    startDate: '2024-11-15',
    endDate: '2024-11-30',
    objective: 'Brand Awareness'
  },
  {
    id: 'campaign-3',
    name: 'New Year Wellness Campaign',
    status: 'Planning',
    budget: '$20,000',
    creators: 0,
    reach: 0,
    engagement: 0,
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    objective: 'Engagement'
  }
];

export const isDemoMode = () => {
  return localStorage.getItem('demo-mode') === 'true';
};

export const setDemoMode = (active: boolean) => {
  if (active) {
    localStorage.setItem('demo-mode', 'true');
  } else {
    localStorage.removeItem('demo-mode');
  }
};

export const getDemoProfile = (userType: 'creator' | 'sponsor'): Profile => {
  return userType === 'creator' ? demoCreatorProfile : demoSponsorProfile;
};