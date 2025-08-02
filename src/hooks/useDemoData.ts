import { useState } from 'react';

export interface DemoSponsor {
  id: string;
  user_id: string;
  full_name: string;
  display_name: string;
  company_name: string;
  bio: string;
  budget_range: string;
  campaign_objectives: string[];
  preferred_sectors: string[];
  avatar_url?: string;
}

export function useDemoData() {
  const [demoSponsors] = useState<DemoSponsor[]>([
    {
      id: 'demo-1',
      user_id: 'demo-user-1',
      full_name: 'Marie Dubois',
      display_name: 'Marie D.',
      company_name: 'Coca-Cola',
      bio: 'Global Marketing Director at Coca-Cola. Leading innovative campaigns that connect with diverse audiences worldwide through authentic storytelling.',
      budget_range: '50000-500000',
      campaign_objectives: ['Brand Awareness', 'Global Reach', 'Cultural Connection', 'Share a Coke'],
      preferred_sectors: ['Lifestyle', 'Entertainment', 'Music', 'Sports', 'Food & Beverage'],
      avatar_url: '/logos/Coca-Cola_logo.svg'
    },
    {
      id: 'demo-2',
      user_id: 'demo-user-2',
      full_name: 'Thomas Martin',
      display_name: 'Thomas M.',
      company_name: 'Adidas',
      bio: 'Head of Influencer Marketing at Adidas. Passionate about partnering with creators who embody our "Impossible is Nothing" spirit.',
      budget_range: '30000-300000',
      campaign_objectives: ['Athletic Performance', 'Street Style', 'Sustainability', 'Innovation'],
      preferred_sectors: ['Sports', 'Fashion', 'Fitness', 'Streetwear', 'Lifestyle'],
      avatar_url: '/logos/Adidas_Logo.svg'
    },
    {
      id: 'demo-3',
      user_id: 'demo-user-3',
      full_name: 'Sophie Laurent',
      display_name: 'Sophie L.',
      company_name: 'Apple',
      bio: 'Senior Brand Partnerships Manager at Apple. Focused on showcasing how Apple products enhance creativity and productivity in daily life.',
      budget_range: '75000-1000000',
      campaign_objectives: ['Product Innovation', 'Creative Workflow', 'Productivity', 'Photography'],
      preferred_sectors: ['Technology', 'Photography', 'Creative', 'Productivity', 'Music'],
      avatar_url: '/logos/Apple_logo_black.svg'
    },
    {
      id: 'demo-4',
      user_id: 'demo-user-4',
      full_name: 'Alexandre Chen',
      display_name: 'Alex C.',
      company_name: 'Nike',
      bio: 'Global Creator Partnerships Lead at Nike. Building relationships with athletes and creators who inspire others to move and achieve greatness.',
      budget_range: '40000-400000',
      campaign_objectives: ['Athletic Excellence', 'Just Do It', 'Inspiration', 'Performance'],
      preferred_sectors: ['Sports', 'Fitness', 'Athletics', 'Motivation', 'Lifestyle'],
      avatar_url: '/logos/Logo_NIKE.svg'
    },
    {
      id: 'demo-5',
      user_id: 'demo-user-5',
      full_name: 'Camille Rousseau',
      display_name: 'Camille R.',
      company_name: 'Sephora',
      bio: 'Beauty Partnerships Director at Sephora. Collaborating with beauty creators to showcase inclusive beauty and the latest trends.',
      budget_range: '25000-200000',
      campaign_objectives: ['Beauty Education', 'Product Discovery', 'Inclusivity', 'Trends'],
      preferred_sectors: ['Beauty', 'Makeup', 'Skincare', 'Lifestyle', 'Fashion'],
      avatar_url: '/logos/Sephora_logo.svg'
    },
    {
      id: 'demo-6',
      user_id: 'demo-user-6',
      full_name: 'David Kim',
      display_name: 'David K.',
      company_name: 'Netflix',
      bio: 'Content Partnerships Manager at Netflix. Collaborating with creators to promote our original series and movies to engaged audiences.',
      budget_range: '60000-600000',
      campaign_objectives: ['Content Promotion', 'Streaming Growth', 'Audience Engagement', 'Brand Entertainment'],
      preferred_sectors: ['Entertainment', 'TV Shows', 'Movies', 'Gaming', 'Pop Culture'],
      avatar_url: '/logos/Netflix_2015_logo.svg'
    },
    {
      id: 'demo-7',
      user_id: 'demo-user-7',
      full_name: 'Laura Santos',
      display_name: 'Laura S.',
      company_name: 'L\'Oréal',
      bio: 'Global Beauty Innovation Director at L\'Oréal. Leading partnerships with diverse creators to showcase our commitment to beauty for everyone.',
      budget_range: '45000-450000',
      campaign_objectives: ['Beauty Innovation', 'Inclusivity', 'Product Education', 'Trend Setting'],
      preferred_sectors: ['Beauty', 'Skincare', 'Hair Care', 'Fashion', 'Lifestyle'],
      avatar_url: '/logos/L\'Oréal_logo.svg'
    },
    {
      id: 'demo-8',
      user_id: 'demo-user-8',
      full_name: 'Julien Moreau',
      display_name: 'Julien M.',
      company_name: 'McDonald\'s',
      bio: 'Digital Marketing Director at McDonald\'s. Creating engaging campaigns that connect with younger audiences through authentic creator partnerships.',
      budget_range: '35000-350000',
      campaign_objectives: ['Brand Engagement', 'Menu Promotion', 'Local Marketing', 'Cultural Relevance'],
      preferred_sectors: ['Food & Beverage', 'Lifestyle', 'Entertainment', 'Local Culture', 'Gaming'],
      avatar_url: '/logos/McDonald\'s_SVG_logo.svg'
    }
  ]);

  const getRandomSponsors = (count: number = 5): DemoSponsor[] => {
    const shuffled = [...demoSponsors].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const getAllSponsors = (): DemoSponsor[] => {
    return demoSponsors;
  };

  return {
    demoSponsors,
    getRandomSponsors,
    getAllSponsors
  };
}