
import { serve } from 'https://deno.fresh.dev/std@1.0.0/server.ts';
import { GoogleGenerativeAI } from '@google/generative-ai';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to fetch recipes from TheMealDB
async function fetchRecipesFromMealDB(ingredients) {
  try {
    // We'll try to fetch by main ingredient
    const mainIngredient = ingredients[0] || 'chicken';
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(mainIngredient)}`);
    const data = await response.json();
    
    if (data.meals) {
      // Get full details for each recipe
      const detailedRecipes = await Promise.all(
        data.meals.slice(0, 3).map(async (meal) => {
          const detailResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
          const detailData = await detailResponse.json();
          return detailData.meals[0];
        })
      );
      
      // Transform to our format
      return detailedRecipes.map(meal => {
        // Extract ingredients and measures
        const ingredientsList = [];
        for (let i = 1; i <= 20; i++) {
          const ingredient = meal[`strIngredient${i}`];
          const measure = meal[`strMeasure${i}`];
          if (ingredient && ingredient.trim()) {
            ingredientsList.push(`${measure ? measure.trim() + " " : ""}${ingredient.trim()}`);
          }
        }
        
        // Split instructions into steps
        const steps = meal.strInstructions.split(/\.\s+/).filter(step => step.trim().length > 0);
        
        return {
          title: meal.strMeal,
          cuisine: meal.strArea || "International",
          ingredients: ingredientsList,
          cookTime: Math.floor(Math.random() * 45) + 15,
          difficulty: ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)],
          image: meal.strMealThumb,
          steps: steps.map(step => step.trim() + (step.endsWith('.') ? '' : '.')),
          id: meal.idMeal,
          nutrition: {
            calories: Math.floor(Math.random() * 500) + 200,
            protein: Math.floor(Math.random() * 30) + 10,
            carbs: Math.floor(Math.random() * 50) + 20,
            fat: Math.floor(Math.random() * 25) + 5
          },
          tagline: `Authentic ${meal.strArea || "International"} cuisine`
        };
      });
    }
    return [];
  } catch (error) {
    console.error("Error fetching from MealDB:", error);
    return [];
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    const { ingredients, cuisine, detailed = false } = requestData;
    
    // First try to get recipes from TheMealDB
    let recipes = await fetchRecipesFromMealDB(ingredients);
    
    // If no recipes or we need AI-generated recipes specifically
    if (recipes.length === 0 || detailed) {
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
      const aiRecipes = JSON.parse(text);
      
      // If we're in detailed mode, use AI recipe, otherwise append to MealDB recipes
      if (detailed) {
        recipes = aiRecipes.recipes;
      } else if (recipes.length === 0) {
        recipes = aiRecipes.recipes;
      }
    }

    return new Response(JSON.stringify({ recipes }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in getRecipeSuggestions:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      recipes: [] 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
