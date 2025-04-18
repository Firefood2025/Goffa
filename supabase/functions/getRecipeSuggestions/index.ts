
import { serve } from 'https://deno.fresh.dev/std@1.0.0/server.ts';
import { GoogleGenerativeAI } from '@google/generative-ai';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { ingredients } = await req.json();
    
    // Initialize Google AI
    const genAI = new GoogleGenerativeAI(Deno.env.get('GOOGLE_API_KEY') || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Given these ingredients: ${ingredients.join(', ')}, suggest 3 possible recipes. 
    Format the response as JSON with this structure:
    {
      "recipes": [{
        "title": "Recipe Name",
        "cuisine": "Cuisine Type",
        "ingredients": ["list", "of", "ingredients"],
        "cookTime": estimated_minutes,
        "difficulty": "Easy/Medium/Hard"
      }]
    }`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Parse the JSON response
    const recipes = JSON.parse(text);

    return new Response(JSON.stringify(recipes), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
