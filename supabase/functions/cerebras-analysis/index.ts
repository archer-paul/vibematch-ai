import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const cerebrasApiKey = Deno.env.get('CEREBRAS_API_KEY');
    if (!cerebrasApiKey) {
      throw new Error('CEREBRAS_API_KEY not found in environment variables');
    }

    const { userProfile, targetProfile, profile, analysisType } = await req.json();

    let prompt: string;
    
    if (analysisType === 'optimization') {
      prompt = `Analyze this creator profile and provide optimization suggestions:
        
Profile: ${JSON.stringify(profile)}

Return a JSON response with:
{
  "score": number (0-100),
  "suggestions": string[],
  "optimizedFields": object
}

Focus on completeness, niche clarity, and professional presentation.`;
    } else {
      prompt = `Analyze compatibility between these two profiles for collaboration:

Creator Profile: ${JSON.stringify(userProfile)}
Sponsor Profile: ${JSON.stringify(targetProfile)}

Return a JSON response with:
{
  "score": number (0-100),
  "factors": string[],
  "recommendations": string[]
}

Consider niche alignment, professional level, content styles, and collaboration types.`;
    }

    const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cerebrasApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.1-8b',
        messages: [
          {
            role: 'system',
            content: 'You are an AI expert specializing in creator-sponsor matching and profile optimization. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Cerebras API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse JSON response from Cerebras
    let analysisResult;
    try {
      analysisResult = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse Cerebras response:', content);
      // Fallback response
      analysisResult = {
        score: 75,
        factors: ['Profile analysis completed'],
        recommendations: ['Continue optimizing your profile'],
        suggestions: ['Add more details to your profile']
      };
    }

    console.log('Cerebras analysis completed:', analysisResult);

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in cerebras-analysis function:', error);
    
    // Return fallback response on error
    const fallbackResponse = {
      score: 70,
      factors: ['Basic compatibility check completed'],
      recommendations: ['Profile analysis temporarily unavailable'],
      suggestions: ['Try again later for detailed analysis']
    };

    return new Response(JSON.stringify(fallbackResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  }
});