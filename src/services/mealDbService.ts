
interface MealDBResponse {
  meals: Array<{
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
    strCategory?: string;
    strArea?: string;
    strInstructions?: string;
    strTags?: string;
  }> | null;
}

interface DetailedMeal {
  id: string;
  title: string;
  image: string;
  cookTime: number;
  ingredients: string[];
  steps: string[];
  cuisine?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  matchingIngredients: number;
}

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export const searchRecipesByIngredients = async (ingredients: string[]): Promise<DetailedMeal[]> => {
  try {
    const response = await fetch(`${BASE_URL}/filter.php?i=${ingredients.join(',')}`);
    const data: MealDBResponse = await response.json();

    if (!data.meals) return [];

    // Get full details for each meal
    const detailedMeals = await Promise.all(
      data.meals.slice(0, 10).map(async (meal) => {
        const details = await getRecipeDetails(meal.idMeal);
        return details;
      })
    );

    return detailedMeals.filter((meal): meal is DetailedMeal => meal !== null);
  } catch (error) {
    console.error('Error fetching recipes:', error);
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

    // Extract ingredients from the API response
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}` as keyof typeof meal];
      if (ingredient && typeof ingredient === 'string' && ingredient.trim()) {
        ingredients.push(ingredient.trim());
      }
    }

    // Convert instructions into steps array
    const steps = meal.strInstructions?.split('\n').filter(step => step.trim()) || [];

    return {
      id: meal.idMeal,
      title: meal.strMeal,
      image: meal.strMealThumb,
      cookTime: Math.floor(Math.random() * 30) + 20, // Random time since API doesn't provide this
      ingredients,
      steps,
      cuisine: meal.strArea,
      difficulty: 'Medium', // Default since API doesn't provide this
      matchingIngredients: 1 // Will be calculated based on user's pantry
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

    const detailedMeals = await Promise.all(
      data.meals.slice(0, 10).map(async (meal) => {
        const details = await getRecipeDetails(meal.idMeal);
        return details;
      })
    );

    return detailedMeals.filter((meal): meal is DetailedMeal => meal !== null);
  } catch (error) {
    console.error('Error fetching recipes by cuisine:', error);
    return [];
  }
};
