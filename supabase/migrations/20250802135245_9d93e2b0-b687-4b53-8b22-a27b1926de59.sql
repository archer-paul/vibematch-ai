-- Fix remaining function search_path issues
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data ->> 'user_type')::user_type, 'creator')
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user_quotas()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_quotas (user_id)
  VALUES (NEW.id);
  
  INSERT INTO public.user_subscriptions (user_id, plan_type)
  VALUES (NEW.id, 'free');
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.reset_daily_quotas()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.user_quotas 
  SET super_likes_used_today = 0
  WHERE last_login < CURRENT_DATE;
  
  UPDATE public.user_quotas 
  SET streak_days = 0
  WHERE last_login < CURRENT_DATE - INTERVAL '1 day';
END;
$$;