import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function useDataPersistence() {
  const { profile } = useAuth();

  // Demo creators data
  const demoCreators = [
    {
      full_name: 'Emma Creative',
      email: 'emma.creative@example.com',
      user_type: 'creator' as const,
      bio: 'Créatrice de contenu lifestyle et mode basée à Paris. Passionnée par la beauté naturelle et les tendances émergentes.',
      content_categories: ['Lifestyle', 'Mode', 'Beauté'],
      follower_counts: { instagram: 45000, tiktok: 32000 },
      engagement_rate: 8.5,
      social_platforms: { instagram: 'emma_creative_paris', tiktok: 'emmacreative' }
    },
    {
      full_name: 'TechReview FR',
      email: 'contact@techreviewfr.com',
      user_type: 'creator' as const,
      bio: 'Reviews tech, tests de gadgets et analyses gaming. Chaîne YouTube francophone spécialisée dans les nouvelles technologies.',
      content_categories: ['Tech', 'Gaming', 'Reviews'],
      follower_counts: { youtube: 125000, twitter: 58000 },
      engagement_rate: 12.3,
      social_platforms: { youtube: 'TechReviewFR', twitter: 'techreviewfr' }
    },
    {
      full_name: 'Fitness Maxime',
      email: 'maxime.fitness@example.com',
      user_type: 'creator' as const,
      bio: 'Coach sportif et nutritionniste. Contenus fitness, recettes healthy et motivation quotidienne.',
      content_categories: ['Fitness', 'Nutrition', 'Motivation'],
      follower_counts: { tiktok: 85000, instagram: 67000 },
      engagement_rate: 15.2,
      social_platforms: { tiktok: 'fitnessmaximefr', instagram: 'maxime_fitness' }
    }
  ];

  // Demo sponsors data
  const demoSponsors = [
    {
      full_name: 'Marie Dubois',
      email: 'marie@techcorp.com',
      user_type: 'sponsor' as const,
      company_name: 'TechCorp Solutions',
      industry: 'Technology',
      bio: 'Marketing Director chez TechCorp, spécialisée dans les collaborations avec les créateurs tech.',
      budget_range: '$5,000 - $15,000',
      campaign_objectives: ['Brand Awareness', 'Product Launch', 'Lead Generation'],
      preferred_sectors: ['Tech', 'Gaming', 'Innovation']
    },
    {
      full_name: 'Pierre Martin',
      email: 'pierre@ecobrands.com',
      user_type: 'sponsor' as const,
      company_name: 'EcoLife Brands',
      industry: 'Sustainability',
      bio: 'Brand Manager passionné par l\'écologie et les partenariats authentiques.',
      budget_range: '$3,000 - $8,000',
      campaign_objectives: ['Sustainability Messaging', 'Community Building'],
      preferred_sectors: ['Lifestyle', 'Eco-Friendly', 'Health']
    },
    {
      full_name: 'Sophie Laurent',
      email: 'sophie@fitnessproducts.com',
      user_type: 'sponsor' as const,
      company_name: 'FitnessPro',
      industry: 'Health & Fitness',
      bio: 'Responsable partenariats chez FitnessPro, à la recherche d\'ambassadeurs fitness authentiques.',
      budget_range: '$2,000 - $6,000',
      campaign_objectives: ['Product Integration', 'Community Engagement'],
      preferred_sectors: ['Fitness', 'Health', 'Lifestyle']
    }
  ];

  const seedDatabase = async () => {
    try {
      // Insert demo creators
      for (const creator of demoCreators) {
        // Check if creator already exists
        const { data: existingCreator } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', creator.email)
          .single();

        if (!existingCreator) {
          // Create a user first (mock user creation for demo purposes)
          const mockUserId = `demo-creator-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          
          const { error } = await supabase
            .from('profiles')
            .insert({
              user_id: mockUserId,
              full_name: creator.full_name,
              email: creator.email,
              user_type: creator.user_type,
              bio: creator.bio,
              content_categories: creator.content_categories,
              follower_counts: creator.follower_counts,
              engagement_rate: creator.engagement_rate,
              social_platforms: creator.social_platforms
            });

          if (error) {
            console.error('Error inserting creator:', error);
          }
        }
      }

      // Insert demo sponsors
      for (const sponsor of demoSponsors) {
        // Check if sponsor already exists
        const { data: existingSponsor } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', sponsor.email)
          .single();

        if (!existingSponsor) {
          // Create a user first (mock user creation for demo purposes)
          const mockUserId = `demo-sponsor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          
          const { error } = await supabase
            .from('profiles')
            .insert({
              user_id: mockUserId,
              full_name: sponsor.full_name,
              email: sponsor.email,
              user_type: sponsor.user_type,
              company_name: sponsor.company_name,
              industry: sponsor.industry,
              bio: sponsor.bio,
              budget_range: sponsor.budget_range,
              campaign_objectives: sponsor.campaign_objectives,
              preferred_sectors: sponsor.preferred_sectors
            });

          if (error) {
            console.error('Error inserting sponsor:', error);
          }
        }
      }

      console.log('Demo data seeding completed');
    } catch (error) {
      console.error('Error seeding database:', error);
    }
  };

  const seedGhostProfiles = async () => {
    try {
      const ghostProfiles = [
        {
          discovered_data: {
            name: 'Emma Creative',
            platform: 'Instagram',
            followers: 45000,
            engagement_rate: 8.5,
            niche: ['Lifestyle', 'Mode', 'Beauté'],
            bio: 'Créatrice de contenu lifestyle et mode basée à Paris. Passionnée par la beauté naturelle et les tendances émergentes.'
          },
          compatibility_scores: {
            overall: 92,
            niche_match: 89,
            audience_alignment: 94,
            content_quality: 93
          },
          status: 'discovered'
        },
        {
          discovered_data: {
            name: 'TechReviewFR',
            platform: 'YouTube',
            followers: 125000,
            engagement_rate: 12.3,
            niche: ['Tech', 'Reviews', 'Gaming'],
            bio: 'Reviews tech, tests de gadgets et analyses gaming. Chaîne YouTube francophone spécialisée dans les nouvelles technologies.'
          },
          compatibility_scores: {
            overall: 89,
            niche_match: 95,
            audience_alignment: 87,
            content_quality: 85
          },
          status: 'discovered'
        }
      ];

      for (const ghostProfile of ghostProfiles) {
        // Check if ghost profile already exists by checking discovered_data
        const { data: existingGhost } = await supabase
          .from('ghost_profiles')
          .select('id')
          .filter('discovered_data', 'cs', `{"name": "${ghostProfile.discovered_data.name}"}`)
          .single();

        if (!existingGhost) {
          const { error } = await supabase
            .from('ghost_profiles')
            .insert(ghostProfile);

          if (error) {
            console.error('Error inserting ghost profile:', error);
          }
        }
      }

      console.log('Ghost profiles seeding completed');
    } catch (error) {
      console.error('Error seeding ghost profiles:', error);
    }
  };

  // Seed database when hook is first used (only once)
  useEffect(() => {
    // Skip seeding in demo mode to avoid UUID errors
    const isDemoMode = localStorage.getItem('demo-mode') === 'true';
    if (profile && !isDemoMode) {
      // Seed demo data for all users (for demo purposes)
      seedDatabase();
      seedGhostProfiles();
    }
  }, [profile]);

  return {
    seedDatabase,
    seedGhostProfiles
  };
}