-- Create campaigns table for sponsors
CREATE TABLE public.campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sponsor_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
  budget_total NUMERIC(10,2),
  budget_remaining NUMERIC(10,2),
  start_date DATE,
  end_date DATE,
  objectives JSONB DEFAULT '[]'::jsonb,
  target_audience JSONB DEFAULT '{}'::jsonb,
  requirements JSONB DEFAULT '{}'::jsonb,
  kpis JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create campaign_creators junction table
CREATE TABLE public.campaign_creators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'invited' CHECK (status IN ('invited', 'accepted', 'declined', 'active', 'completed')),
  rate_agreed NUMERIC(10,2),
  deliverables JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(campaign_id, creator_id)
);

-- Create campaign_analytics table
CREATE TABLE public.campaign_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC,
  metric_data JSONB DEFAULT '{}'::jsonb,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create creator_analytics table for detailed tracking
CREATE TABLE public.creator_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL,
  platform TEXT NOT NULL,
  metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
  audience_demographics JSONB DEFAULT '{}'::jsonb,
  engagement_data JSONB DEFAULT '{}'::jsonb,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_analytics ENABLE ROW LEVEL SECURITY;

-- RLS policies for campaigns
CREATE POLICY "Sponsors can manage their campaigns" 
ON public.campaigns 
FOR ALL
USING (sponsor_id IN (
  SELECT user_id FROM profiles 
  WHERE user_id = auth.uid() AND user_type = 'sponsor'
));

-- RLS policies for campaign_creators (SELECT)
CREATE POLICY "Campaign creators viewable by sponsors" 
ON public.campaign_creators 
FOR SELECT
USING (campaign_id IN (
  SELECT id FROM campaigns 
  WHERE sponsor_id IN (
    SELECT user_id FROM profiles 
    WHERE user_id = auth.uid() AND user_type = 'sponsor'
  )
));

-- RLS policies for campaign_creators (INSERT)
CREATE POLICY "Sponsors can insert campaign creators" 
ON public.campaign_creators 
FOR INSERT
WITH CHECK (campaign_id IN (
  SELECT id FROM campaigns 
  WHERE sponsor_id IN (
    SELECT user_id FROM profiles 
    WHERE user_id = auth.uid() AND user_type = 'sponsor'
  )
));

-- RLS policies for campaign_creators (UPDATE)
CREATE POLICY "Sponsors can update campaign creators" 
ON public.campaign_creators 
FOR UPDATE
USING (campaign_id IN (
  SELECT id FROM campaigns 
  WHERE sponsor_id IN (
    SELECT user_id FROM profiles 
    WHERE user_id = auth.uid() AND user_type = 'sponsor'
  )
));

-- RLS policies for campaign_creators (DELETE)
CREATE POLICY "Sponsors can delete campaign creators" 
ON public.campaign_creators 
FOR DELETE
USING (campaign_id IN (
  SELECT id FROM campaigns 
  WHERE sponsor_id IN (
    SELECT user_id FROM profiles 
    WHERE user_id = auth.uid() AND user_type = 'sponsor'
  )
));

-- RLS policies for campaign_analytics
CREATE POLICY "Campaign analytics viewable by sponsors" 
ON public.campaign_analytics 
FOR SELECT
USING (campaign_id IN (
  SELECT id FROM campaigns 
  WHERE sponsor_id IN (
    SELECT user_id FROM profiles 
    WHERE user_id = auth.uid() AND user_type = 'sponsor'
  )
));

CREATE POLICY "Sponsors can insert campaign analytics" 
ON public.campaign_analytics 
FOR INSERT
WITH CHECK (campaign_id IN (
  SELECT id FROM campaigns 
  WHERE sponsor_id IN (
    SELECT user_id FROM profiles 
    WHERE user_id = auth.uid() AND user_type = 'sponsor'
  )
));

-- RLS policies for creator_analytics
CREATE POLICY "Creator analytics viewable by all authenticated users" 
ON public.creator_analytics 
FOR SELECT
TO authenticated
USING (true);

-- Add triggers for updated_at
CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campaign_creators_updated_at
  BEFORE UPDATE ON public.campaign_creators
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();