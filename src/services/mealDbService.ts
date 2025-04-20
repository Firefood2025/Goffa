
interface MealDBResponse {
  meals: Array<{
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
    strCategory?: string;
    strArea?: string;
    strInstructions?: string;
    strTags?: string;
    [key: string]: string | undefined;
  }> | null;
}

interface DetailedMeal {
  id: string;
  title: string;
  image: string;
  cookTime: number;
  ingredients: string[];
  measurements: string[];
  steps: string[];
  cuisine?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  matchingIngredients: number;
  category?: string;
  tags?: string[];
}

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

// Function to get a random cooking time appropriate for the meal
const getRandomCookTime = (mealTitle: string): number => {
  if (mealTitle.toLowerCase().includes('soup') || mealTitle.toLowerCase().includes('stew')) {
    return Math.floor(Math.random() * 30) + 45; // 45-75 minutes for soups/stews
  } else if (mealTitle.toLowerCase().includes('bake') || mealTitle.toLowerCase().includes('roast')) {
    return Math.floor(Math.random() * 35) + 40; // 40-75 minutes for baked items
  } else if (mealTitle.toLowerCase().includes('salad') || mealTitle.toLowerCase().includes('sandwich')) {
    return Math.floor(Math.random() * 10) + 10; // 10-20 minutes for salads/sandwiches
  } else {
    return Math.floor(Math.random() * 20) + 25; // 25-45 minutes for most dishes
  }
};

// Function to determine difficulty based on ingredients count and cooking time
const getDifficulty = (ingredientsCount: number, cookTime: number): 'Easy' | 'Medium' | 'Hard' => {
  if (ingredientsCount > 10 && cookTime > 50) {
    return 'Hard';
  } else if (ingredientsCount > 7 || cookTime > 30) {
    return 'Medium';
  } else {
    return 'Easy';
  }
};

export const searchRecipesByIngredients = async (ingredients: string[]): Promise<DetailedMeal[]> => {
  try {
    if (!ingredients || ingredients.length === 0) {
      return [];
    }
    
    // MealDB API can only filter by one ingredient at a time
    // We'll use the first ingredient to get initial recipes, then filter for matching others
    const mainIngredient = ingredients[0];
    const response = await fetch(`${BASE_URL}/filter.php?i=${mainIngredient}`);
    const data: MealDBResponse = await response.json();

    if (!data.meals) return [];

    // Get full details for each meal
    const detailedMealsPromises = data.meals.slice(0, 20).map(async (meal) => {
      try {
        const details = await getRecipeDetails(meal.idMeal);
        if (!details) return null;
        
        // Calculate how many of the user's ingredients match this recipe's ingredients
        const matchingIngredientsCount = details.ingredients.filter(ingredient => 
          ingredients.some(userIngredient => 
            ingredient.toLowerCase().includes(userIngredient.toLowerCase()) ||
            userIngredient.toLowerCase().includes(ingredient.toLowerCase())
          )
        ).length;
        
        // Only include recipes with at least 2 matching ingredients
        if (matchingIngredientsCount >= 1) {
          return {
            ...details,
            matchingIngredients: matchingIngredientsCount
          };
        }
        return null;
      } catch (error) {
        console.error(`Error fetching details for meal ${meal.idMeal}:`, error);
        return null;
      }
    });

    const detailedMeals = await Promise.all(detailedMealsPromises);
    const filteredMeals = detailedMeals
      .filter((meal): meal is DetailedMeal => meal !== null)
      .sort((a, b) => b.matchingIngredients - a.matchingIngredients)
      .slice(0, 10); // Return top 10 matches
      
    return filteredMeals;
  } catch (error) {
    console.error('Error fetching recipes by ingredients:', error);
    return [];
  }
};

export const getRecipeDetails = async (id: string): Promise<DetailedMeal | null> => {
  try {
    const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
    const data: MealDBResponse = await response.json();

    if (!data.meals?.[0]) return null;

    const meal = data.meals[0];
    const ingredients: string[] = [];
    const measurements: string[] = [];

    // Extract ingredients and measurements from the API response
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}` as keyof typeof meal];
      const measure = meal[`strMeasure${i}` as keyof typeof meal];
      
      if (ingredient && typeof ingredient === 'string' && ingredient.trim()) {
        ingredients.push(ingredient.trim());
        measurements.push(measure?.trim() || '');
      }
    }

    // Convert instructions into steps array
    const instructionsText = meal.strInstructions || '';
    // Split by periods, newlines, or numbered prefixes
    const rawSteps = instructionsText
      .split(/\r\n|\r|\n|(?<=\.)\s+(?=[A-Z])|\d+\.\s+/)
      .filter(step => step && step.trim().length > 5); // Filter out empty or very short steps
    
    // Clean up steps and ensure they end with a period
    const steps = rawSteps.map(step => {
      const trimmed = step.trim();
      return trimmed.endsWith('.') ? trimmed : `${trimmed}.`;
    });

    // Extract tags if available
    const tags = meal.strTags?.split(',').map(tag => tag.trim()) || [];
    
    // Generate a more accurate cooking time based on recipe type
    const cookTime = getRandomCookTime(meal.strMeal);
    
    // Determine difficulty based on ingredients and cooking time
    const difficulty = getDifficulty(ingredients.length, cookTime);

    return {
      id: meal.idMeal,
      title: meal.strMeal,
      image: meal.strMealThumb,
      cookTime,
      ingredients,
      measurements,
      steps,
      cuisine: meal.strArea,
      category: meal.strCategory,
      tags,
      difficulty,
      matchingIngredients: 1 // Default value, will be updated when filtering
    };
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    return null;
  }
};

export const searchRecipesByCuisine = async (cuisine: string): Promise<DetailedMeal[]> => {
  try {
    const response = await fetch(`${BASE_URL}/filter.php?a=${cuisine}`);
    const data: MealDBResponse = await response.json();

    if (!data.meals) return [];

    const detailedMealsPromises = data.meals.slice(0, 15).map(async (meal) => {
      try {
        return await getRecipeDetails(meal.idMeal);
      } catch (error) {
        console.error(`Error fetching details for meal ${meal.idMeal}:`, error);
        return null;
      }
    });

    const detailedMeals = await Promise.all(detailedMealsPromises);
    return detailedMeals
      .filter((meal): meal is DetailedMeal => meal !== null)
      .map(meal => ({
        ...meal,
        matchingIngredients: Math.floor(Math.random() * 3) + 1 // Just a placeholder value when browsing by cuisine
      }));
  } catch (error) {
    console.error('Error fetching recipes by cuisine:', error);
    return [];
  }
};

// Function to get random recipes
export const getRandomRecipes = async (count: number = 5): Promise<DetailedMeal[]> => {
  try {
    const meals: DetailedMeal[] = [];
    
    // MealDB only gives one random meal at a time, so we need to call it multiple times
    for (let i = 0; i < count; i++) {
      const response = await fetch(`${BASE_URL}/random.php`);
      const data: MealDBResponse = await response.json();
      
      if (data.meals?.[0]) {
        const recipeDetails = await getRecipeDetails(data.meals[0].idMeal);
        if (recipeDetails) {
          meals.push({
            ...recipeDetails,
            matchingIngredients: Math.floor(Math.random() * 3) + 1 // Random match count for display
          });
        }
      }
    }
    
    return meals;
  } catch (error) {
    console.error('Error fetching random recipes:', error);
    return [];
  }
};
