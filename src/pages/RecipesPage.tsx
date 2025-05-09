
import React, { useState, useEffect } from 'react';
import { ListLayout, ViewMode } from '@/components/ui/list-layout';
import RecipeCard, { RecipeData } from '@/components/recipes/RecipeCard';
import CuisineSelector, { Cuisine } from '@/components/recipes/CuisineSelector';
import { Button } from "@/components/ui/button";
import { ChefHat, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Badge } from '@/components/ui/badge';
import { getRandomRecipes, searchRecipesByCuisine, searchRecipesByIngredients, getRecipeDetails } from '@/services/mealDbService';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { KitchenStyle } from '@/components/recipes/KitchenStyleSelector';
import RecipeList from '@/components/recipes/RecipeList';
import RecipeGeneratorContainer from '@/components/recipes/RecipeGeneratorContainer';
import { GeneratedRecipe } from '@/components/recipes/RecipeDetail';
import { supabase } from '@/integrations/supabase/client';
import MissingIngredientsDialog from '@/components/recipes/MissingIngredientsDialog';

// Navigation bar for recipes
const RecipeNavigation = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="mb-4">
      {isMobile ? (
        // Mobile navigation with scrollable pills
        <div className="overflow-x-auto -mx-4 px-4">
          <div className="flex space-x-2 w-max pb-2">
            <Button asChild variant="outline" className="border-kitchen-green text-kitchen-green hover:bg-kitchen-green/10 flex-shrink-0">
              <Link to="/recipes?filter=popular">Popular</Link>
            </Button>
            <Button asChild variant="outline" className="border-kitchen-green text-kitchen-green hover:bg-kitchen-green/10 flex-shrink-0">
              <Link to="/recipes?filter=quick">Quick & Easy</Link>
            </Button>
            <Button asChild variant="outline" className="border-kitchen-green text-kitchen-green hover:bg-kitchen-green/10 flex-shrink-0">
              <Link to="/recipes?filter=healthy">Healthy</Link>
            </Button>
            <Button asChild className="bg-kitchen-green text-white hover:bg-kitchen-green/90 flex-shrink-0">
              <Link to="/recipes?filter=categories">Categories</Link>
            </Button>
            <Button asChild className="bg-kitchen-green text-white hover:bg-kitchen-green/90 flex-shrink-0">
              <Link to="/recipes?filter=cuisine">Cuisine</Link>
            </Button>
          </div>
        </div>
      ) : (
        // Desktop navigation with dropdown menus
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
      )}
    </div>
  );
};

// Component for favorite recipes
const FavoriteRecipesSection = ({ favoriteRecipes, recipeCollection, onViewRecipe, onToggleFavorite }) => {
  const favorites = recipeCollection.filter(recipe => favoriteRecipes.includes(recipe.id));
  
  if (favorites.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
        <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 flex items-center">
          <Heart size={20} className="mr-2 text-kitchen-berry" />
          Favorite Recipes
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          You haven't saved any favorite recipes yet. Click the heart icon on recipes to save them here.
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
      <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 flex items-center">
        <Heart size={20} className="mr-2 text-kitchen-berry" />
        Favorite Recipes
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.slice(0, 3).map(recipe => (
          <RecipeCard 
            key={recipe.id} 
            recipe={recipe} 
            onClick={() => onViewRecipe(recipe.id)}
            onToggleFavorite={() => onToggleFavorite(recipe.id)}
            isFavorite={true}
          />
        ))}
      </div>
      {favorites.length > 3 && (
        <div className="mt-4 text-center">
          <Button variant="outline" className="border-kitchen-green text-kitchen-green">
            View all favorites
          </Button>
        </div>
      )}
    </div>
  );
};

const RecipesPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedCuisine, setSelectedCuisine] = useState<Cuisine>('All');
  const [recipes, setRecipes] = useState<RecipeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // Recipe generator state
  const [showGenerator, setShowGenerator] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<KitchenStyle>('Modern');
  const [generatedRecipe, setGeneratedRecipe] = useState<GeneratedRecipe | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<GeneratedRecipe | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [favoriteRecipes, setFavoriteRecipes] = useState<string[]>([]);
  const [recipeCollection, setRecipeCollection] = useState<RecipeData[]>([]);
  
  // Missing ingredients dialog state
  const [missingIngDialogOpen, setMissingIngDialogOpen] = useState(false);
  const [missingIngredients, setMissingIngredients] = useState<string[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  // Load favorite recipes from localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favoriteRecipes');
    if (storedFavorites) {
      try {
        setFavoriteRecipes(JSON.parse(storedFavorites));
      } catch (e) {
        console.error('Error parsing favorite recipes:', e);
      }
    }
  }, []);

  // Save favorite recipes to localStorage
  const handleToggleFavorite = (recipeId: string) => {
    setFavoriteRecipes(prev => {
      const newFavorites = prev.includes(recipeId) 
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId];
        
      localStorage.setItem('favoriteRecipes', JSON.stringify(newFavorites));
      return newFavorites;
    });
    
    toast({
      title: favoriteRecipes.includes(recipeId) ? "Removed from favorites" : "Added to favorites",
      description: favoriteRecipes.includes(recipeId) 
        ? "Recipe has been removed from your favorites" 
        : "Recipe has been added to your favorites",
      duration: 2000,
    });
  };

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
        
        if (fetchedRecipes && fetchedRecipes.length > 0) {
          setRecipes(fetchedRecipes);
          setRecipeCollection(prev => {
            // Merge new recipes with existing collection, avoiding duplicates
            const existingIds = new Set(prev.map(r => r.id));
            const uniqueNewRecipes = fetchedRecipes.filter(r => !existingIds.has(r.id));
            return [...prev, ...uniqueNewRecipes];
          });
          setError(null);
        } else {
          setError('No recipes found. Please try a different cuisine.');
          setRecipes([]);
        }
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

  const handleRecipeClick = async (id: string) => {
    try {
      setLoading(true);
      const recipe = await getRecipeDetails(id);
      
      if (recipe) {
        const recipeWithPantryMatching = await matchWithPantryItems(recipe);
        setSelectedRecipe(recipeWithPantryMatching);
        setShowGenerator(true);
      } else {
        toast({
          title: "Recipe not found",
          description: "The recipe details could not be loaded",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error loading recipe details:', error);
      toast({
        title: "Failed to load recipe",
        description: "An error occurred while loading the recipe details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to match recipe ingredients with pantry items
  const matchWithPantryItems = async (recipe) => {
    try {
      // Fetch pantry items
      const { data: pantryItems, error } = await supabase
        .from('pantry_items')
        .select('name');
        
      if (error) throw error;
      
      // Check which ingredients are in the pantry
      const pantryNames = pantryItems?.map(item => item.name?.toLowerCase()).filter(Boolean) || [];
      const missingIngs = recipe.ingredients.filter(ingredient => 
        !pantryNames.some(pantryItem => 
          ingredient.toLowerCase().includes(pantryItem) || 
          pantryItem.includes(ingredient.toLowerCase())
        )
      );
      
      // Store missing ingredients for potential shopping list addition
      setMissingIngredients(missingIngs);
      
      return {
        ...recipe,
        missingIngredients: missingIngs
      };
    } catch (error) {
      console.error('Error matching with pantry items:', error);
      return recipe;
    }
  };
  
  const handleTryAnother = () => {
    setGeneratedRecipe(null);
    setSelectedRecipe(null);
  };
  
  const generateRecipe = async (ingredients: string[]) => {
    setIsGenerating(true);
    try {
      const matchingRecipes = await searchRecipesByIngredients(ingredients);
      
      if (matchingRecipes && matchingRecipes.length > 0) {
        // Take the first recipe match
        const generatedRecipe = matchingRecipes[0];
        
        // Add to collection for favorites management
        setRecipeCollection(prev => {
          // Avoid duplicates
          const exists = prev.some(r => r.id === generatedRecipe.id);
          return exists ? prev : [...prev, generatedRecipe];
        });
        
        setGeneratedRecipe(generatedRecipe);
        setError(null);
      } else {
        toast({
          title: "No recipes found",
          description: "No recipes match your ingredients. Try different ingredients or cuisine.",
          variant: "destructive",
        });
        setGeneratedRecipe(null);
      }
    } catch (err) {
      console.error('Error generating recipe:', err);
      toast({
        title: "Recipe generation failed",
        description: "An error occurred while finding a recipe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleAddMissingToShoppingList = async () => {
    if (!selectedIngredients.length) {
      toast({
        title: "No ingredients selected",
        description: "Please select ingredients to add to your shopping list",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Get current shopping list to avoid duplicates
      const { data: existingItems, error } = await supabase
        .from('shopping_list')
        .select('name');
        
      if (error) throw error;
      
      const existingNames = existingItems?.map(item => item.name.toLowerCase()) || [];
      
      // Filter out any ingredients already in the shopping list
      const newIngredients = selectedIngredients.filter(
        ingredient => !existingNames.includes(ingredient.toLowerCase())
      );
      
      if (newIngredients.length > 0) {
        // Add new ingredients to shopping list
        const newItems = newIngredients.map(ingredient => ({
          name: ingredient,
          category: 'Recipe Ingredients',
          quantity: 1,
          unit: 'pc',
          ischecked: false
        }));
        
        const { error: insertError } = await supabase
          .from('shopping_list')
          .insert(newItems);
          
        if (insertError) throw insertError;
        
        toast({
          title: "Added to shopping list",
          description: `${newIngredients.length} ingredient${newIngredients.length > 1 ? 's' : ''} added to your shopping list`,
        });
        
        setMissingIngDialogOpen(false);
        setSelectedIngredients([]);
      } else {
        toast({
          title: "Ingredients already in list",
          description: "All selected ingredients are already in your shopping list",
        });
      }
    } catch (error) {
      console.error('Error adding to shopping list:', error);
      toast({
        title: "Couldn't add to shopping list",
        description: "There was an error adding ingredients to your shopping list",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-kitchen-cream flex flex-col">
      <Header title="Recipes" />
      
      <main className="flex-1 px-4 py-6 mb-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
          <h1 className="text-2xl sm:text-3xl font-bold">Recipes</h1>
          <Button asChild className="bg-kitchen-green hover:bg-kitchen-green/90 w-full sm:w-auto">
            <Link to="/rent-chef" className="flex items-center justify-center gap-2">
              <ChefHat size={isMobile ? 16 : 18} />
              Rent a Chef
            </Link>
          </Button>
        </div>
        
        <RecipeNavigation />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <RecipeGeneratorContainer
              showGenerator={showGenerator}
              setShowGenerator={setShowGenerator}
              selectedStyle={selectedStyle}
              setSelectedStyle={setSelectedStyle}
              generatedRecipe={generatedRecipe}
              setGeneratedRecipe={setGeneratedRecipe}
              selectedRecipe={selectedRecipe}
              setSelectedRecipe={setSelectedRecipe}
              isGenerating={isGenerating}
              generateRecipe={generateRecipe}
              handleTryAnother={handleTryAnother}
              favoriteRecipes={favoriteRecipes}
              onToggleFavorite={handleToggleFavorite}
            />
            
            {!showGenerator && (
              <FavoriteRecipesSection 
                favoriteRecipes={favoriteRecipes}
                recipeCollection={recipeCollection}
                onViewRecipe={handleRecipeClick}
                onToggleFavorite={handleToggleFavorite}
              />
            )}
          </div>
          
          <div className="md:col-span-2">
            {!showGenerator && (
              <>
                <CuisineSelector selectedCuisine={selectedCuisine} onSelect={setSelectedCuisine} />
                
                <RecipeList 
                  recipes={recipes} 
                  onRecipeClick={handleRecipeClick}
                  onFilterClick={() => {}} 
                  isLoading={loading}
                  favoriteRecipes={favoriteRecipes}
                  onToggleFavorite={handleToggleFavorite}
                />
              </>
            )}
          </div>
        </div>
        
        <MissingIngredientsDialog 
          open={missingIngDialogOpen}
          onOpenChange={setMissingIngDialogOpen}
          missingIngredients={missingIngredients}
          selectedIngredients={selectedIngredients}
          setSelectedIngredients={setSelectedIngredients}
          onAddToList={handleAddMissingToShoppingList}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default RecipesPage;
