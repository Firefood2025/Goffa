
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
    const requestData = await req.json();
    const { ingredients, cuisine, detailed = false } = requestData;
    
    // Initialize Google AI
    const genAI = new GoogleGenerativeAI(Deno.env.get('GOOGLE_API_KEY') || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    let prompt;
    
    if (detailed) {
      // Detailed prompt for single recipe generation with steps
      prompt = `Given these ingredients: ${ingredients.join(', ')}${cuisine ? ` and a ${cuisine} cuisine style` : ''}, 
      generate a detailed recipe. Format the response as JSON with this structure:
      {
        "recipes": [{
          "title": "Creative Recipe Name",
          "ingredients": ["Complete", "list", "of", "ingredients", "with", "quantities"],
          "steps": ["Step 1: Do this", "Step 2: Do that", "..."],
          "cookTime": estimated_minutes,
          "difficulty": "Easy/Medium/Hard",
          "nutrition": {
            "calories": estimated_calories,
            "protein": estimated_protein_grams,
            "carbs": estimated_carbs_grams,
            "fat": estimated_fat_grams
          },
          "tagline": "A catchy tagline for this recipe"
        }]
      }
      
      Be creative with the recipe name and make sure it reflects the ${cuisine || 'selected'} cuisine style.
      The steps should be detailed enough for someone to follow along.
      Include a fun tagline that captures the essence of the dish.`;
    } else {
      // Original prompt for multiple recipe suggestions
      prompt = `Given these ingredients: ${ingredients.join(', ')}${cuisine ? ` and a ${cuisine} cuisine style` : ''}, 
      suggest 3 possible recipes. Format the response as JSON with this structure:
      {
        "recipes": [{
          "title": "Recipe Name",
          "cuisine": "Cuisine Type",
          "ingredients": ["list", "of", "ingredients"],
          "cookTime": estimated_minutes,
          "difficulty": "Easy/Medium/Hard"
        }]
      }`;
    }

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Parse the JSON response
    const recipes = JSON.parse(text);

    return new Response(JSON.stringify(recipes), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message,
      recipes: [] 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
