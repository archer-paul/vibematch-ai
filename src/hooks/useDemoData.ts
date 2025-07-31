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
      company_name: 'TechStart Innovation',
      bio: 'Passionnée par les nouvelles technologies et l\'innovation. Je recherche des créateurs authentiques pour promouvoir nos solutions tech auprès d\'une audience engagée.',
      budget_range: '5000-15000',
      campaign_objectives: ['Brand Awareness', 'Lead Generation', 'Product Demo', 'Community Building'],
      preferred_sectors: ['Tech', 'Innovation', 'Startups', 'SaaS', 'IA']
    },
    {
      id: 'demo-2',
      user_id: 'demo-user-2',
      full_name: 'Thomas Martin',
      display_name: 'Thomas M.',
      company_name: 'EcoLife Solutions',
      bio: 'Entrepreneur engagé dans le développement durable. Nous cherchons des influenceurs qui partagent nos valeurs environnementales pour sensibiliser à l\'écologie.',
      budget_range: '8000-25000',
      campaign_objectives: ['Sustainability Education', 'Brand Values', 'Environmental Awareness', 'CSR Communication'],
      preferred_sectors: ['Écologie', 'Lifestyle', 'Mode Durable', 'Zero Waste', 'Energie Verte']
    },
    {
      id: 'demo-3',
      user_id: 'demo-user-3',
      full_name: 'Sophie Laurent',
      display_name: 'Sophie L.',
      company_name: 'Beauty & Wellness Co',
      bio: 'Spécialiste en cosmétiques naturels et bien-être. Recherche des créatrices authentiques dans l\'univers beauté pour promouvoir nos produits clean beauty.',
      budget_range: '12000-40000',
      campaign_objectives: ['Product Launch', 'Trust Building', 'Sales Conversion', 'Tutorial Content'],
      preferred_sectors: ['Beauté', 'Bien-être', 'Lifestyle', 'Skincare', 'Clean Beauty']
    },
    {
      id: 'demo-4',
      user_id: 'demo-user-4',
      full_name: 'Alexandre Chen',
      display_name: 'Alex C.',
      company_name: 'FitTech Pro',
      bio: 'Co-fondateur d\'une startup fitness tech. Nous développons des applications de coaching personnalisé et cherchons des créateurs fitness pour des partenariats long terme.',
      budget_range: '15000-50000',
      campaign_objectives: ['App Downloads', 'User Acquisition', 'Fitness Education', 'Community Growth'],
      preferred_sectors: ['Fitness', 'Sport', 'Nutrition', 'Wellness', 'Tech']
    },
    {
      id: 'demo-5',
      user_id: 'demo-user-5',
      full_name: 'Camille Rousseau',
      display_name: 'Camille R.',
      company_name: 'Artisan Food Lab',
      bio: 'Passionnée de gastronomie et fondatrice d\'une marque de produits artisanaux. Je cherche des créateurs culinaires pour partager notre savoir-faire authentique.',
      budget_range: '6000-20000',
      campaign_objectives: ['Recipe Creation', 'Brand Storytelling', 'Product Testing', 'Culinary Education'],
      preferred_sectors: ['Cuisine', 'Gastronomie', 'Artisanat', 'Terroir', 'Food']
    },
    {
      id: 'demo-6',
      user_id: 'demo-user-6',
      full_name: 'David Kim',
      display_name: 'David K.',
      company_name: 'GameZone Studios',
      bio: 'Développeur de jeux indépendants. Nous créons des expériences gaming uniques et recherchons des créateurs gaming pour faire découvrir nos titres à leur communauté.',
      budget_range: '10000-30000',
      campaign_objectives: ['Game Reviews', 'Streaming Content', 'Community Engagement', 'Launch Campaign'],
      preferred_sectors: ['Gaming', 'Esports', 'Tech', 'Streaming', 'Entertainment']
    },
    {
      id: 'demo-7',
      user_id: 'demo-user-7',
      full_name: 'Laura Santos',
      display_name: 'Laura S.',
      company_name: 'Travel Memories',
      bio: 'Agence de voyage spécialisée dans les expériences authentiques. Nous collaborons avec des créateurs voyage pour inspirer et documenter des destinations uniques.',
      budget_range: '20000-60000',
      campaign_objectives: ['Destination Marketing', 'Travel Inspiration', 'Experience Documentation', 'Tourism Promotion'],
      preferred_sectors: ['Voyage', 'Tourisme', 'Culture', 'Adventure', 'Photography']
    },
    {
      id: 'demo-8',
      user_id: 'demo-user-8',
      full_name: 'Julien Moreau',
      display_name: 'Julien M.',
      company_name: 'FinTech Solutions',
      bio: 'Expert en technologies financières. Nous démocratisons l\'investissement et cherchons des créateurs pour expliquer la finance de manière accessible et pédagogique.',
      budget_range: '25000-80000',
      campaign_objectives: ['Financial Education', 'App Promotion', 'Trust Building', 'Compliance Communication'],
      preferred_sectors: ['Finance', 'Investissement', 'Crypto', 'Education', 'Tech']
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