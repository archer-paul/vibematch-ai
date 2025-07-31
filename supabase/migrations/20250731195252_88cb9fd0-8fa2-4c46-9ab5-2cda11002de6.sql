-- Fix the unique constraint and add demo data
ALTER TABLE public.profiles ADD CONSTRAINT profiles_email_unique UNIQUE (email);

-- Insert demo admin user
INSERT INTO public.profiles (
    user_id, email, full_name, display_name, user_type, is_admin, onboarding_completed
) VALUES (
    gen_random_uuid(), 'admin@vibematch.com', 'Admin User', 'VibeBatchAdmin', 'sponsor', true, true
) ON CONFLICT (email) DO UPDATE SET is_admin = true;

-- Insert demo sponsors for matching
INSERT INTO public.profiles (
    user_id, email, full_name, display_name, bio, tagline, user_type,
    company_name, industry, budget_range, campaign_objectives,
    preferred_sectors, onboarding_completed
) VALUES 
(
    gen_random_uuid(),
    'sponsor1@beautybrand.com',
    'Sophie Martin',
    'BeautyBrand Marketing',
    'Marketing Director at leading beauty brand. Looking for authentic creators for our skincare campaigns.',
    'Authentic beauty, real results 💄',
    'sponsor',
    'BeautyGlow Co.',
    'Beauty & Cosmetics',
    '5000-15000',
    '{"brand_awareness", "product_launch", "user_generated_content"}',
    '{"beauty", "fashion", "lifestyle"}',
    true
),
(
    gen_random_uuid(),
    'sponsor2@techstartup.com', 
    'Marcus Johnson',
    'TechFlow Partnerships',
    'Partnership manager at innovative tech startup. Seeking gaming and tech creators for product collaborations.',
    'Innovation through collaboration 🚀',
    'sponsor',
    'TechFlow Solutions',
    'Technology',
    '10000-30000',
    '{"product_demo", "long_term_partnership", "event_coverage"}',
    '{"gaming", "tech", "entertainment"}',
    true
),
(
    gen_random_uuid(),
    'sponsor3@healthcompany.com',
    'Lisa Rodriguez',
    'WellnessPro Campaigns',
    'Health and wellness company looking for fitness influencers to promote our supplement line.',
    'Wellness for everyone 🌱',
    'sponsor',
    'WellnessPro Inc.',
    'Health & Wellness',
    '3000-12000',
    '{"brand_ambassador", "product_review", "educational_content"}',
    '{"fitness", "health", "nutrition"}',
    true
) ON CONFLICT (email) DO NOTHING;

-- Insert demo ghost profiles
INSERT INTO public.ghost_profiles (
    discovered_data, compatibility_scores, status
) VALUES 
(
    '{"name": "Jake Fitness Pro", "platform": "instagram", "followers": 150000, "engagement_rate": 4.2, "niche": ["fitness", "nutrition"], "bio": "Personal trainer helping people achieve their fitness goals"}',
    '{"overall": 89, "niche_match": 95, "audience_alignment": 87, "content_quality": 85}',
    'discovered'
),
(
    '{"name": "Maya Beauty Secrets", "platform": "tiktok", "followers": 320000, "engagement_rate": 6.8, "niche": ["beauty", "skincare"], "bio": "Skincare enthusiast sharing daily routines and product reviews"}',
    '{"overall": 92, "niche_match": 90, "audience_alignment": 94, "content_quality": 90}',
    'discovered'
),
(
    '{"name": "Tech Reviewer Tom", "platform": "youtube", "followers": 580000, "engagement_rate": 3.9, "niche": ["tech", "gaming"], "bio": "In-depth tech reviews and gaming content for enthusiasts"}',
    '{"overall": 88, "niche_match": 93, "audience_alignment": 85, "content_quality": 88}',
    'discovered'
);

-- Add some sample achievements and AI analysis for existing demo users
DO $$
DECLARE
    creator1_id UUID;
    creator2_id UUID;
    sponsor1_id UUID;
BEGIN
    -- Get existing creator IDs
    SELECT user_id INTO creator1_id FROM public.profiles WHERE email = 'emma.creator@demo.com';
    SELECT user_id INTO creator2_id FROM public.profiles WHERE email = 'alex.gamer@demo.com';
    SELECT user_id INTO sponsor1_id FROM public.profiles WHERE email = 'sponsor1@beautybrand.com';

    -- Insert achievements for creators if they exist
    IF creator1_id IS NOT NULL THEN
        INSERT INTO public.achievements (user_id, achievement_type, achievement_data) VALUES
        (creator1_id, 'first_match', '{"earned_at": "2024-01-15", "description": "Completed your first successful match!"}'),
        (creator1_id, 'profile_optimizer', '{"earned_at": "2024-01-20", "description": "Optimized profile with AI recommendations"}')
        ON CONFLICT (user_id, achievement_type) DO NOTHING;

        -- Add AI analysis
        INSERT INTO public.ai_analysis (profile_id, analysis_data, cerebras_score, analysis_type) VALUES
        (creator1_id, '{"strengths": ["High engagement rate", "Niche expertise", "Professional content"], "weaknesses": ["Limited collaboration history"], "recommendations": ["Add more case studies", "Expand content variety"]}', 87.5, 'compatibility'),
        (creator1_id, '{"optimization_score": 92, "missing_fields": [], "suggestions": ["Add more recent work examples"]}', 92.0, 'optimization');
    END IF;

    IF creator2_id IS NOT NULL THEN
        INSERT INTO public.achievements (user_id, achievement_type, achievement_data) VALUES
        (creator2_id, 'first_match', '{"earned_at": "2024-01-18", "description": "Completed your first successful match!"}'),
        (creator2_id, 'streak_master', '{"earned_at": "2024-01-25", "description": "Maintained a 7-day login streak!"}'
        (creator2_id, 'ai_power_user', '{"earned_at": "2024-01-28", "description": "Used AI analysis 10+ times"}')
        ON CONFLICT (user_id, achievement_type) DO NOTHING;

        -- Add AI analysis
        INSERT INTO public.ai_analysis (profile_id, analysis_data, cerebras_score, analysis_type) VALUES
        (creator2_id, '{"strengths": ["Gaming expertise", "Strong community", "Consistent content"], "weaknesses": ["Narrow niche focus"], "recommendations": ["Consider tech reviews", "Expand to streaming"]}', 84.2, 'compatibility');
    END IF;

    -- Insert some swipe actions if users exist
    IF creator1_id IS NOT NULL AND sponsor1_id IS NOT NULL THEN
        INSERT INTO public.swipe_actions (user_id, target_id, action) VALUES
        (creator1_id, sponsor1_id, 'like')
        ON CONFLICT (user_id, target_id) DO NOTHING;
    END IF;

END $$;