-- Create user type enum
CREATE TYPE public.user_type AS ENUM ('creator', 'sponsor');

-- Create profiles table with detailed information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  user_type user_type NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  
  -- Creator specific fields
  social_platforms JSONB DEFAULT '{}',
  follower_counts JSONB DEFAULT '{}',
  content_categories TEXT[],
  engagement_rate DECIMAL(5,2),
  
  -- Sponsor specific fields
  company_name TEXT,
  industry TEXT,
  budget_range TEXT,
  campaign_objectives TEXT[],
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create matchings table for AI scoring system
CREATE TABLE public.matchings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL,
  sponsor_id UUID NOT NULL,
  compatibility_score DECIMAL(5,2) NOT NULL CHECK (compatibility_score >= 0 AND compatibility_score <= 100),
  match_factors JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  CONSTRAINT unique_creator_sponsor_match UNIQUE (creator_id, sponsor_id)
);

-- Enable RLS for matchings
ALTER TABLE public.matchings ENABLE ROW LEVEL SECURITY;

-- RLS policies for matchings - users can only see their own matches
CREATE POLICY "Creators can view their matches" 
ON public.matchings 
FOR SELECT 
USING (
  creator_id IN (
    SELECT user_id FROM public.profiles WHERE user_id = auth.uid() AND user_type = 'creator'
  )
);

CREATE POLICY "Sponsors can view their matches" 
ON public.matchings 
FOR SELECT 
USING (
  sponsor_id IN (
    SELECT user_id FROM public.profiles WHERE user_id = auth.uid() AND user_type = 'sponsor'
  )
);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_matchings_updated_at
  BEFORE UPDATE ON public.matchings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();