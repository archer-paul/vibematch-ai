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
        (creator2_id, 'streak_master', '{"earned_at": "2024-01-25", "description": "Maintained a 7-day login streak!"}'),
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