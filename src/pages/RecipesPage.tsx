import React, { useState, useEffect } from 'react';
import { ListLayout, ViewMode } from '@/components/ui/list-layout';
import RecipeCard, { RecipeData } from '@/components/recipes/RecipeCard';
import CuisineSelector, { Cuisine } from '@/components/recipes/CuisineSelector';
import { Button } from "@/components/ui/button";
import { ChefHat } from "lucide-react";
import { Link } from "react-router-dom";

// Mock recipe data
const mockRecipes: RecipeData[] = [
  {
    id: '1',
    title: 'Spaghetti Carbonara',
    image: 'https://source.unsplash.com/random/800x600/?pasta,carbonara',
    cookTime: 25,
    ingredients: ['pasta', 'eggs', 'bacon', 'parmesan', 'black pepper'],
    matchingIngredients: 3,
    difficulty: 'Easy',
    cuisine: 'Italian'
  },
  {
    id: '2',
    title: 'Chicken Tikka Masala',
    image: 'https://source.unsplash.com/random/800x600/?chicken,tikka',
    cookTime: 45,
    ingredients: ['chicken', 'yogurt', 'tomatoes', 'onion', 'garlic', 'ginger', 'spices'],
    matchingIngredients: 4,
    difficulty: 'Medium',
    cuisine: 'Oriental'
  },
  {
    id: '3',
    title: 'Ratatouille',
    image: 'https://source.unsplash.com/random/800x600/?ratatouille',
    cookTime: 60,
    ingredients: ['eggplant', 'zucchini', 'bell peppers', 'tomatoes', 'onion', 'garlic', 'herbs'],
    matchingIngredients: 5,
    difficulty: 'Medium',
    cuisine: 'French'
  },
  {
    id: '4',
    title: 'Couscous',
    image: 'https://source.unsplash.com/random/800x600/?couscous',
    cookTime: 40,
    ingredients: ['couscous', 'vegetables', 'chickpeas', 'lamb', 'spices'],
    matchingIngredients: 2,
    difficulty: 'Medium',
    cuisine: 'Tunisian'
  },
  {
    id: '5',
    title: 'Margherita Pizza',
    image: 'https://source.unsplash.com/random/800x600/?pizza',
    cookTime: 30,
    ingredients: ['flour', 'tomatoes', 'mozzarella', 'basil', 'olive oil'],
    matchingIngredients: 3,
    difficulty: 'Easy',
    cuisine: 'Italian'
  },
  {
    id: '6',
    title: 'Beef Bourguignon',
    image: 'https://source.unsplash.com/random/800x600/?beef,stew',
    cookTime: 180,
    ingredients: ['beef', 'red wine', 'carrots', 'onions', 'mushrooms', 'bacon', 'herbs'],
    matchingIngredients: 4,
    difficulty: 'Hard',
    cuisine: 'French'
  }
];

// Component for recipe generation
const RecipeGeneratorContainer = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Generate Recipe from Ingredients</h2>
      <p className="text-gray-600 mb-4">
        Let us suggest recipes based on what you have in your pantry.
      </p>
      <Button className="bg-kitchen-green hover:bg-kitchen-green/90">
        Generate Recipes
      </Button>
    </div>
  );
};

// Component for favorite recipes
const FavoriteRecipesManager = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Favorite Recipes</h2>
      <p className="text-gray-600">
        You haven't saved any favorite recipes yet. Click the heart icon on recipes to save them here.
      </p>
    </div>
  );
};

// Component for recipe list
const RecipeList = ({ 
  recipes, 
  viewMode,
  loading = false,
  error = null
}: { 
  recipes: RecipeData[], 
  viewMode: ViewMode,
  loading?: boolean,
  error?: string | null
}) => {
  if (loading) {
    return <div className="text-center py-10">Loading recipes...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (recipes.length === 0) {
    return <div className="text-center py-10">No recipes found. Try changing your filters.</div>;
  }

  return (
    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
      {recipes.map(recipe => (
        <RecipeCard 
          key={recipe.id} 
          recipe={recipe} 
          onClick={(id) => console.log(`Recipe clicked: ${id}`)}
          onToggleFavorite={(id) => console.log(`Toggle favorite: ${id}`)}
        />
      ))}
    </div>
  );
};

const RecipesPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedCuisine, setSelectedCuisine] = useState<Cuisine>('All');
  const [recipes, setRecipes] = useState<RecipeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setRecipes(mockRecipes);
      setLoading(false);
    }, 500);
  }, []);

  // Filter recipes by cuisine
  const filteredRecipes = selectedCuisine === 'All' 
    ? recipes 
    : recipes.filter(recipe => recipe.cuisine === selectedCuisine);

  return (
    <main className="flex-1 px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Recipes</h1>
        <Button asChild className="bg-kitchen-green hover:bg-kitchen-green/90">
          <Link to="/rent-chef" className="flex items-center gap-2">
            <ChefHat size={18} />
            Rent a Chef
          </Link>
        </Button>
      </div>

      <RecipeGeneratorContainer />
      <FavoriteRecipesManager />
      <CuisineSelector selectedCuisine={selectedCuisine} onSelect={setSelectedCuisine} />
      <RecipeList recipes={filteredRecipes} viewMode={viewMode} loading={loading} error={error} />
    </main>
  );
};

export default RecipesPage;
