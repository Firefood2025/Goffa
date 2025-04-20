
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@supabase/supabase-js';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import RecipeList from '@/components/recipes/RecipeList';
import CuisineSelector, { Cuisine } from '@/components/recipes/CuisineSelector';
import { RecipeData } from '@/components/recipes/RecipeCard';
import KitchenStyleSelector, { KitchenStyle } from '@/components/recipes/KitchenStyleSelector';
import RecipeGenerator from '@/components/recipes/RecipeGenerator';
import RecipeDetail, { GeneratedRecipe } from '@/components/recipes/RecipeDetail';
import { Button } from '@/components/ui/button';
import { searchRecipesByIngredients, searchRecipesByCuisine, getRecipeDetails } from '@/services/mealDbService';
import OnboardingSteps from '@/components/recipes/OnboardingSteps';
import LoadingAnimation from '@/components/recipes/LoadingAnimation';
import FavoriteRecipesManager from '@/components/recipes/FavoriteRecipesManager';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const RecipesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedCuisine, setSelectedCuisine] = useState<Cuisine>('All');
  const [recipes, setRecipes] = useState<RecipeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favoriteRecipes, setFavoriteRecipes] = useState<string[]>([]);
  
  const [showGenerator, setShowGenerator] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<KitchenStyle>('All');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<GeneratedRecipe | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<GeneratedRecipe | null>(null);
  
  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [firstTimeVisit, setFirstTimeVisit] = useState(true);

  useEffect(() => {
    // Check if this is the first visit
    const hasVisitedBefore = localStorage.getItem('hasVisitedRecipesPage');
    if (!hasVisitedBefore) {
      setShowOnboarding(true);
      localStorage.setItem('hasVisitedRecipesPage', 'true');
    } else {
      setFirstTimeVisit(false);
    }
    
    // Load favorite recipes from localStorage
    const storedFavorites = localStorage.getItem('favoriteRecipes');
    if (storedFavorites) {
      setFavoriteRecipes(JSON.parse(storedFavorites));
    }
  }, []);
  
  const handleFilterClick = () => {
    toast({
      title: "Filter Options",
      description: "Recipe filtering options would appear here",
      duration: 3000,
    });
  };
  
  const handleCuisineSelect = async (cuisine: Cuisine) => {
    setSelectedCuisine(cuisine);
    setIsLoading(true);
    try {
      if (cuisine === 'All') {
        const pantryItems = await supabase?.from('pantry_items').select('name').limit(10);
        const ingredients = pantryItems?.data?.map(item => item.name) || [];
        const apiRecipes = await searchRecipesByIngredients(ingredients);
        setRecipes(apiRecipes);
      } else {
        const apiRecipes = await searchRecipesByCuisine(cuisine);
        setRecipes(apiRecipes);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      toast({
        title: "Couldn't fetch recipes",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleStyleSelect = (style: KitchenStyle) => {
    setSelectedStyle(style);
    setGeneratedRecipe(null);
  };

  const getAiSuggestions = async () => {
    setIsLoading(true);
    try {
      if (!supabase) {
        throw new Error('Supabase client is not initialized. Check your environment variables.');
      }

      const { data: pantryItems } = await supabase
        .from('pantry_items')
        .select('name')
        .limit(10);

      const ingredients = pantryItems?.map(item => item.name) || [];
      
      if (ingredients.length === 0) {
        throw new Error('No pantry items found. Please add some ingredients to your pantry first.');
      }
      
      const apiRecipes = await searchRecipesByIngredients(ingredients);
      
      if (apiRecipes.length === 0) {
        toast({
          title: "No recipes found",
          description: "Try adding more ingredients to your pantry",
          variant: "destructive",
          duration: 3000,
        });
      } else {
        setRecipes(apiRecipes);
        toast({
          title: "AI Suggestions Ready",
          description: "Based on your pantry items",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      toast({
        title: "Couldn't get suggestions",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateRecipe = async (ingredients: string[]) => {
    setIsGenerating(true);
    try {
      if (!supabase) {
        throw new Error('Supabase client is not initialized');
      }
      
      // First try to find a recipe by ingredients from the API
      const apiRecipes = await searchRecipesByIngredients(ingredients);
      
      if (apiRecipes.length > 0) {
        // Randomly select one of the recipes
        const randomIndex = Math.floor(Math.random() * apiRecipes.length);
        const selectedApiRecipe = apiRecipes[randomIndex];
        
        // Get full recipe details
        const recipeDetails = await getRecipeDetails(selectedApiRecipe.id);
        
        if (recipeDetails) {
          setGeneratedRecipe({
            id: recipeDetails.id,
            title: recipeDetails.title,
            cookTime: recipeDetails.cookTime,
            ingredients: recipeDetails.ingredients,
            measurements: recipeDetails.measurements,
            steps: recipeDetails.steps,
            image: recipeDetails.image,
            cuisine: recipeDetails.cuisine,
            category: recipeDetails.category,
            tags: recipeDetails.tags,
            nutrition: {
              calories: Math.floor(Math.random() * 400) + 200,
              protein: Math.floor(Math.random() * 20) + 10,
              carbs: Math.floor(Math.random() * 30) + 20,
              fat: Math.floor(Math.random() * 15) + 5
            },
            tagline: `A delicious ${recipeDetails.cuisine || selectedStyle} recipe with your selected ingredients!`
          });
          
          toast({
            title: "Recipe Created!",
            description: "Your custom recipe is ready",
            duration: 3000,
          });
          return;
        }
      }
      
      // If API recipes aren't found or details couldn't be fetched, fall back to AI generation
      if (supabaseUrl) {
        const response = await fetch(
          `${supabaseUrl}/functions/v1/getRecipeSuggestions`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${supabaseAnonKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              ingredients, 
              cuisine: selectedStyle === 'All' ? undefined : selectedStyle,
              detailed: true 
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to generate recipe');
        }

        const data = await response.json();
        if (data.recipes && data.recipes.length > 0) {
          const recipe = data.recipes[0];
          setGeneratedRecipe({
            title: recipe.title,
            cookTime: recipe.cookTime || Math.floor(Math.random() * 30) + 20,
            ingredients: recipe.ingredients || ingredients,
            steps: recipe.steps || ['Mix all ingredients together', 'Cook until done'],
            nutrition: recipe.nutrition || {
              calories: Math.floor(Math.random() * 400) + 200,
              protein: Math.floor(Math.random() * 20) + 10,
              carbs: Math.floor(Math.random() * 30) + 20,
              fat: Math.floor(Math.random() * 15) + 5
            },
            tagline: recipe.tagline || `Inspired by your pantry and ${selectedStyle} vibe!`
          });
          
          toast({
            title: "Recipe Created!",
            description: "Your custom recipe is ready",
            duration: 3000,
          });
        } else {
          throw new Error('No recipe generated');
        }
      } else {
        simulateRecipeGeneration(ingredients);
      }
    } catch (error) {
      console.error('Error generating recipe:', error);
      simulateRecipeGeneration(ingredients);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const simulateRecipeGeneration = (ingredients: string[]) => {
    setTimeout(() => {
      const styleName = selectedStyle === 'All' ? 'Fusion' : selectedStyle;
      
      setGeneratedRecipe({
        title: `${styleName} ${ingredients[0]} Delight`,
        cookTime: Math.floor(Math.random() * 30) + 20,
        ingredients: [
          ...ingredients, 
          'Salt and pepper to taste',
          'Olive oil',
          'Fresh herbs'
        ],
        steps: [
          `Prepare all ${ingredients.join(', ')} ingredients.`,
          'Heat olive oil in a pan over medium heat.',
          `Add ${ingredients[0]} and cook for 5 minutes.`,
          `Combine with ${ingredients.slice(1).join(', ')}.`,
          'Season with salt and pepper to taste.',
          'Cook until done and serve hot.'
        ],
        nutrition: {
          calories: Math.floor(Math.random() * 400) + 200,
          protein: Math.floor(Math.random() * 20) + 10,
          carbs: Math.floor(Math.random() * 30) + 20,
          fat: Math.floor(Math.random() * 15) + 5
        },
        tagline: `Inspired by your pantry and ${styleName} vibe!`
      });
      
      toast({
        title: "Recipe Created!",
        description: "Your custom recipe is ready",
        duration: 3000,
      });
      
      setIsGenerating(false);
    }, 2000);
  };
  
  const handleRecipeClick = async (id: string) => {
    setIsLoading(true);
    try {
      const recipeDetails = await getRecipeDetails(id);
      
      if (recipeDetails) {
        setSelectedRecipe({
          id: recipeDetails.id,
          title: recipeDetails.title,
          cookTime: recipeDetails.cookTime,
          ingredients: recipeDetails.ingredients,
          measurements: recipeDetails.measurements,
          steps: recipeDetails.steps,
          tagline: recipeDetails.cuisine 
            ? `Authentic ${recipeDetails.cuisine} cuisine` 
            : 'Delicious recipe to try today!',
          image: recipeDetails.image,
          cuisine: recipeDetails.cuisine,
          category: recipeDetails.category,
          tags: recipeDetails.tags
        });
        
        setShowGenerator(true);
      } else {
        toast({
          title: "Recipe not found",
          description: "Could not load recipe details",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching recipe details:', error);
      toast({
        title: "Error fetching recipe",
        description: "Could not load recipe details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBack = () => {
    navigate('/');
  };
  
  const handleToggleGenerator = () => {
    setShowGenerator(!showGenerator);
    if (!showGenerator) {
      setGeneratedRecipe(null);
      setSelectedRecipe(null);
    }
  };
  
  const handleTryAnother = () => {
    setGeneratedRecipe(null);
    setSelectedRecipe(null);
  };
  
  const toggleFavorite = (recipeId: string) => {
    let updatedFavorites;
    if (favoriteRecipes.includes(recipeId)) {
      updatedFavorites = favoriteRecipes.filter(id => id !== recipeId);
    } else {
      updatedFavorites = [...favoriteRecipes, recipeId];
    }
    setFavoriteRecipes(updatedFavorites);
    localStorage.setItem('favoriteRecipes', JSON.stringify(updatedFavorites));
    
    toast({
      title: favoriteRecipes.includes(recipeId) ? "Removed from favorites" : "Added to favorites",
      description: favoriteRecipes.includes(recipeId) 
        ? "Recipe removed from your favorites" 
        : "Recipe added to your favorites",
      duration: 2000,
    });
  };
  
  const deleteRecipe = (recipeId: string) => {
    setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
    
    // If it was a favorite, remove from favorites too
    if (favoriteRecipes.includes(recipeId)) {
      toggleFavorite(recipeId);
    }
    
    toast({
      title: "Recipe deleted",
      description: "Recipe has been removed from your list",
      duration: 2000,
    });
  };
  
  const completeOnboarding = () => {
    setShowOnboarding(false);
    setFirstTimeVisit(false);
  };
  
  useEffect(() => {
    const fetchInitialRecipes = async () => {
      setIsLoading(true);
      try {
        if (supabase) {
          const { data: pantryItems } = await supabase
            .from('pantry_items')
            .select('name')
            .limit(10);

          const ingredients = pantryItems?.map(item => item.name) || [];
          const apiRecipes = await searchRecipesByIngredients(ingredients);
          setRecipes(apiRecipes);
        } else {
          // Fetch some default recipes if no pantry items are available
          const defaultRecipes = await searchRecipesByCuisine('Italian');
          setRecipes(defaultRecipes);
        }
      } catch (error) {
        console.error('Error fetching initial recipes:', error);
        // Fetch some default recipes as fallback
        try {
          const defaultRecipes = await searchRecipesByCuisine('Italian');
          setRecipes(defaultRecipes);
        } catch (fallbackError) {
          console.error('Error fetching fallback recipes:', fallbackError);
          toast({
            title: "Couldn't load recipes",
            description: "Please check your internet connection and try again",
            variant: "destructive",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialRecipes();
  }, []);
  
  // Show onboarding if it's the first visit
  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-kitchen-cream flex flex-col">
        <Header 
          title="Welcome to Recipe Ideas" 
          showSettings={false} 
          showBack={true} 
          onBack={handleBack} 
        />
        
        <OnboardingSteps 
          currentStep={onboardingStep} 
          setCurrentStep={setOnboardingStep}
          completeOnboarding={completeOnboarding}
        />
        
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-kitchen-cream flex flex-col">
      <Header 
        title="Recipe Ideas" 
        showSettings={false} 
        showBack={true} 
        onBack={handleBack} 
      />
      
      <main className="flex-1 px-4 py-6">
        <div className="mb-6">
          <Button
            onClick={handleToggleGenerator}
            className="w-full bg-kitchen-green hover:bg-kitchen-green/90 mb-4"
          >
            {showGenerator ? "Browse Recipe Ideas" : "Create Custom Recipe"}
          </Button>
          
          {!showGenerator && (
            <Button
              onClick={getAiSuggestions}
              className="w-full bg-kitchen-green/90 hover:bg-kitchen-green mb-2"
              disabled={isLoading}
            >
              {isLoading ? "Loading suggestions..." : "Get AI Suggestions"}
            </Button>
          )}
        </div>
        
        {showGenerator ? (
          <div>
            {selectedRecipe ? (
              <RecipeDetail 
                recipe={selectedRecipe} 
                onTryAnother={handleTryAnother}
                kitchenStyle={selectedStyle}
                isFavorite={selectedRecipe.id ? favoriteRecipes.includes(selectedRecipe.id) : false}
                onToggleFavorite={() => selectedRecipe.id && toggleFavorite(selectedRecipe.id)}
              />
            ) : generatedRecipe ? (
              <RecipeDetail 
                recipe={generatedRecipe} 
                onTryAnother={handleTryAnother}
                kitchenStyle={selectedStyle}
                isFavorite={generatedRecipe.id ? favoriteRecipes.includes(generatedRecipe.id) : false}
                onToggleFavorite={() => generatedRecipe.id && toggleFavorite(generatedRecipe.id)}
              />
            ) : (
              <>
                <KitchenStyleSelector 
                  selectedStyle={selectedStyle}
                  onSelect={handleStyleSelect}
                />
                <RecipeGenerator 
                  onGenerate={generateRecipe}
                  isGenerating={isGenerating}
                  kitchenStyle={selectedStyle}
                />
              </>
            )}
          </div>
        ) : (
          <>
            {!isLoading && recipes.length > 0 && (
              <FavoriteRecipesManager 
                favoriteRecipes={favoriteRecipes}
                recipes={recipes}
                onViewRecipe={handleRecipeClick}
                onRemoveFavorite={toggleFavorite}
              />
            )}
            
            <CuisineSelector 
              selectedCuisine={selectedCuisine}
              onSelect={handleCuisineSelect}
            />
            
            {isLoading ? (
              <LoadingAnimation />
            ) : (
              <RecipeList
                recipes={recipes}
                onRecipeClick={handleRecipeClick}
                onFilterClick={handleFilterClick}
                favoriteRecipes={favoriteRecipes}
                onToggleFavorite={toggleFavorite}
                onDeleteRecipe={deleteRecipe}
                isLoading={false}
              />
            )}
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default RecipesPage;
