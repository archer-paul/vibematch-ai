import { useState } from 'react';

export interface DemoCreator {
  id: string;
  user_id: string;
  full_name: string;
  bio: string;
  followers_count: number;
  engagement_rate: number;
  content_categories: string[];
  platforms: string[];
  avatar_url?: string;
}

export interface DemoSponsor {
  id: string;
  user_id: string;
  full_name: string;
  company_name: string;
  bio: string;
  budget_range: string;
  campaign_objectives: string[];
  preferred_sectors: string[];
  avatar_url?: string;
}

export function useEnhancedDemoData() {
  const [demoCreators] = useState<DemoCreator[]>([
    {
      id: '1',
      user_id: 'creator_1',
      full_name: 'MrBeast',
      bio: 'Philanthropist, entrepreneur, and content creator known for extreme challenges and charity work. Over 100M subscribers across platforms.',
      followers_count: 120000000,
      engagement_rate: 8.5,
      content_categories: ['Entertainment', 'Philanthropy', 'Gaming', 'Challenges'],
      platforms: ['YouTube', 'Instagram', 'TikTok', 'Twitter'],
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '2',
      user_id: 'creator_2',
      full_name: 'Selena Gomez',
      bio: 'Singer, actress, and mental health advocate. Building a global community around beauty, wellness, and self-acceptance.',
      followers_count: 350000000,
      engagement_rate: 6.2,
      content_categories: ['Beauty', 'Music', 'Mental Health', 'Lifestyle'],
      platforms: ['Instagram', 'TikTok', 'YouTube', 'Twitter'],
      avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b787?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '3',
      user_id: 'creator_3',
      full_name: 'Kim Kardashian',
      bio: 'Entrepreneur, reality TV star, and business mogul. Founder of KKW Beauty and SKIMS. Fashion and lifestyle influencer.',
      followers_count: 280000000,
      engagement_rate: 4.8,
      content_categories: ['Fashion', 'Beauty', 'Business', 'Lifestyle'],
      platforms: ['Instagram', 'TikTok', 'Twitter', 'Snapchat'],
      avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '4',
      user_id: 'creator_4',
      full_name: 'Pewdiepie',
      bio: 'Gaming content creator and commentator. One of the most subscribed individual creators on YouTube with a dedicated global fanbase.',
      followers_count: 111000000,
      engagement_rate: 7.1,
      content_categories: ['Gaming', 'Entertainment', 'Commentary', 'Reviews'],
      platforms: ['YouTube', 'Instagram', 'Twitter'],
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '5',
      user_id: 'creator_5',
      full_name: 'Emma Chamberlain',
      bio: 'Lifestyle content creator and coffee entrepreneur. Known for authentic, relatable content and innovative editing style.',
      followers_count: 12000000,
      engagement_rate: 9.3,
      content_categories: ['Lifestyle', 'Fashion', 'Coffee', 'Vlog'],
      platforms: ['YouTube', 'Instagram', 'TikTok', 'Podcast'],
      avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
    }
  ]);

  const [demoSponsors] = useState<DemoSponsor[]>([
    {
      id: 'sponsor_1',
      user_id: 'sponsor_user_1',
      full_name: 'Sarah Johnson',
      company_name: 'Coca-Cola',
      bio: 'Global Marketing Director at Coca-Cola. Leading innovative campaigns that connect with diverse audiences worldwide through authentic storytelling.',
      budget_range: '$50,000-$500,000',
      campaign_objectives: ['Brand Awareness', 'Global Reach', 'Cultural Connection', 'Share a Coke'],
      preferred_sectors: ['Lifestyle', 'Entertainment', 'Music', 'Sports', 'Food & Beverage'],
      avatar_url: '/logos/Coca-Cola_logo.svg'
    },
    {
      id: 'sponsor_2',
      user_id: 'sponsor_user_2',
      full_name: 'Marcus Thompson',
      company_name: 'Adidas',
      bio: 'Head of Influencer Marketing at Adidas. Passionate about partnering with creators who embody our "Impossible is Nothing" spirit.',
      budget_range: '$30,000-$300,000',
      campaign_objectives: ['Athletic Performance', 'Street Style', 'Sustainability', 'Innovation'],
      preferred_sectors: ['Sports', 'Fashion', 'Fitness', 'Streetwear', 'Lifestyle'],
      avatar_url: '/logos/Adidas_Logo.svg'
    },
    {
      id: 'sponsor_3',
      user_id: 'sponsor_user_3',
      full_name: 'Priya Patel',
      company_name: 'Apple',
      bio: 'Senior Brand Partnerships Manager at Apple. Focused on showcasing how Apple products enhance creativity and productivity in daily life.',
      budget_range: '$75,000-$1,000,000',
      campaign_objectives: ['Product Innovation', 'Creative Workflow', 'Productivity', 'Photography'],
      preferred_sectors: ['Technology', 'Photography', 'Creative', 'Productivity', 'Music'],
      avatar_url: '/logos/Apple_logo_black.svg'
    },
    {
      id: 'sponsor_4',
      user_id: 'sponsor_user_4',
      full_name: 'James Rodriguez',
      company_name: 'Nike',
      bio: 'Global Creator Partnerships Lead at Nike. Building relationships with athletes and creators who inspire others to move and achieve greatness.',
      budget_range: '$40,000-$400,000',
      campaign_objectives: ['Athletic Excellence', 'Just Do It', 'Inspiration', 'Performance'],
      preferred_sectors: ['Sports', 'Fitness', 'Athletics', 'Motivation', 'Lifestyle'],
      avatar_url: '/logos/Logo_NIKE.svg'
    },
    {
      id: 'sponsor_5',
      user_id: 'sponsor_user_5',
      full_name: 'Elena Rossi',
      company_name: 'Sephora',
      bio: 'Beauty Partnerships Director at Sephora. Collaborating with beauty creators to showcase inclusive beauty and the latest trends.',
      budget_range: '$25,000-$200,000',
      campaign_objectives: ['Beauty Education', 'Product Discovery', 'Inclusivity', 'Trends'],
      preferred_sectors: ['Beauty', 'Makeup', 'Skincare', 'Lifestyle', 'Fashion'],
      avatar_url: '/logos/Sephora_logo.svg'
    },
    {
      id: 'sponsor_6',
      user_id: 'sponsor_user_6',
      full_name: 'Alex Chen',
      company_name: 'Tesla',
      bio: 'Digital Marketing Manager at Tesla. Partnering with tech and automotive creators to showcase sustainable transportation innovation.',
      budget_range: '$60,000-$600,000',
      campaign_objectives: ['Sustainability', 'Innovation', 'Technology', 'Future Mobility'],
      preferred_sectors: ['Technology', 'Automotive', 'Sustainability', 'Innovation', 'Travel'],
      avatar_url: '/logos/Netflix_2015_logo.svg'
    }
  ]);

  const getRandomCreators = (count: number = 5): DemoCreator[] => {
    const shuffled = [...demoCreators].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const getRandomSponsors = (count: number = 5): DemoSponsor[] => {
    const shuffled = [...demoSponsors].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const getAllCreators = (): DemoCreator[] => {
    return demoCreators;
  };

  const getAllSponsors = (): DemoSponsor[] => {
    return demoSponsors;
  };

  return {
    demoCreators,
    demoSponsors,
    getRandomCreators,
    getRandomSponsors,
    getAllCreators,
    getAllSponsors
  };
}