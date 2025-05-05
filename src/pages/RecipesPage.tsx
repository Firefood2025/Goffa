
import React, { useState, useEffect } from 'react';
import { ListLayout, ViewMode } from '@/components/ui/list-layout';
import RecipeCard, { RecipeData } from '@/components/recipes/RecipeCard';
import CuisineSelector, { Cuisine } from '@/components/recipes/CuisineSelector';
import { Button } from "@/components/ui/button";
import { ChefHat } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Badge } from '@/components/ui/badge';
import { getRandomRecipes, searchRecipesByCuisine } from '@/services/mealDbService';

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

// Navigation bar for recipes
const RecipeNavigation = () => {
  return (
    <NavigationMenu className="max-w-full w-full justify-center my-4">
      <NavigationMenuList className="space-x-2">
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-kitchen-green text-white hover:bg-kitchen-green/90">Categories</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {["Breakfast", "Lunch", "Dinner", "Dessert", "Appetizer", "Salad", "Soup", "Seafood"].map((category) => (
                <li key={category}>
                  <NavigationMenuLink asChild>
                    <a
                      href={`#${category.toLowerCase()}`}
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">{category}</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Discover delicious {category.toLowerCase()} recipes
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-kitchen-green text-white hover:bg-kitchen-green/90">Cuisine</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {["Italian", "Mexican", "Chinese", "Indian", "French", "Thai", "Japanese", "Mediterranean"].map((cuisine) => (
                <li key={cuisine}>
                  <NavigationMenuLink asChild>
                    <a
                      href={`#${cuisine.toLowerCase()}`}
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">{cuisine}</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Explore {cuisine} culinary traditions
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Button asChild variant="outline" className="border-kitchen-green text-kitchen-green hover:bg-kitchen-green/10">
            <Link to="/recipes?filter=popular">Popular</Link>
          </Button>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Button asChild variant="outline" className="border-kitchen-green text-kitchen-green hover:bg-kitchen-green/10">
            <Link to="/recipes?filter=quick">Quick & Easy</Link>
          </Button>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Button asChild variant="outline" className="border-kitchen-green text-kitchen-green hover:bg-kitchen-green/10">
            <Link to="/recipes?filter=healthy">Healthy</Link>
          </Button>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const RecipesPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedCuisine, setSelectedCuisine] = useState<Cuisine>('All');
  const [recipes, setRecipes] = useState<RecipeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch real recipes using mealDbService
    setLoading(true);
    
    const fetchRecipes = async () => {
      try {
        let fetchedRecipes;
        
        if (selectedCuisine === 'All') {
          fetchedRecipes = await getRandomRecipes(9);
        } else {
          fetchedRecipes = await searchRecipesByCuisine(selectedCuisine);
        }
        
        // Convert to RecipeData format
        const formattedRecipes = fetchedRecipes.map(recipe => ({
          id: recipe.id,
          title: recipe.title,
          image: recipe.image,
          cookTime: recipe.cookTime,
          ingredients: recipe.ingredients,
          matchingIngredients: recipe.matchingIngredients,
          difficulty: recipe.difficulty,
          cuisine: recipe.cuisine || selectedCuisine
        }));
        
        setRecipes(formattedRecipes);
        setError(null);
      } catch (err) {
        console.error('Error fetching recipes:', err);
        setError('Failed to load recipes. Please try again.');
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecipes();
  }, [selectedCuisine]);

  return (
    <div className="min-h-screen bg-kitchen-cream flex flex-col">
      <Header title="Recipes" />
      
      <main className="flex-1 px-4 py-6 mb-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Recipes</h1>
          <Button asChild className="bg-kitchen-green hover:bg-kitchen-green/90">
            <Link to="/rent-chef" className="flex items-center gap-2">
              <ChefHat size={18} />
              Rent a Chef
            </Link>
          </Button>
        </div>
        
        <RecipeNavigation />
        
        <RecipeGeneratorContainer />
        <FavoriteRecipesManager />
        <CuisineSelector selectedCuisine={selectedCuisine} onSelect={setSelectedCuisine} />
        
        <RecipeList 
          recipes={recipes} 
          viewMode={viewMode} 
          loading={loading} 
          error={error} 
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default RecipesPage;
