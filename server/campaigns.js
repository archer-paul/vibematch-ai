import { Router } from 'express';
import { supabaseAdmin } from './supabase.js';
import { recommendCreatorsForCampaign } from './openai-analyzer.js';

const router = Router();

/**
 * POST /
 * Body: { sponsorId, name, budget, niches, objectives, audienceDescription }
 *
 * Creates a campaign in Supabase and returns AI-recommended creators.
 */
router.post('/', async (req, res) => {
  try {
    const { sponsorId, name, budget, niches, objectives, audienceDescription } = req.body;

    if (!sponsorId || !name) {
      return res.status(400).json({ error: 'Missing required fields: sponsorId, name' });
    }

    // Store campaign in Supabase
    const { data: campaign, error: dbError } = await supabaseAdmin
      .from('campaigns')
      .insert({
        sponsor_id: sponsorId,
        name,
        budget: budget || 0,
        niches: niches || [],
        objectives: objectives || [],
        audience_description: audienceDescription || '',
        status: 'draft',
      })
      .select()
      .single();

    if (dbError) {
      console.error('[Campaigns] DB insert error:', dbError);
      // Still proceed with recommendations even if DB fails
    }

    // Get AI recommendations
    const recommendations = await recommendCreatorsForCampaign({
      name,
      budget,
      niches,
      objectives,
      audienceDescription,
    });

    res.json({
      campaign: campaign || { name, budget, niches, objectives, audienceDescription },
      recommendations,
    });
  } catch (error) {
    console.error('[Campaigns] Creation error:', error);
    res.status(500).json({ error: 'Failed to create campaign', message: error.message });
  }
});

/**
 * GET /?sponsorId=uuid
 *
 * Returns all campaigns for a given sponsor.
 */
router.get('/', async (req, res) => {
  try {
    const { sponsorId } = req.query;

    if (!sponsorId) {
      return res.status(400).json({ error: 'Missing sponsorId query parameter' });
    }

    const { data, error } = await supabaseAdmin
      .from('campaigns')
      .select('*')
      .eq('sponsor_id', sponsorId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Campaigns] DB fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch campaigns' });
    }

    res.json({ campaigns: data || [] });
  } catch (error) {
    console.error('[Campaigns] Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch campaigns', message: error.message });
  }
});

export default router;
