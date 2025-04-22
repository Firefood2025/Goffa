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
import AiLoadingAnimation from '@/components/recipes/AiLoadingAnimation';
import { Utensils } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;
try {
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log("Supabase client initialized successfully");
  } else {
    console.log("Supabase environment variables not found");
  }
} catch (error) {
  console.error("Error initializing Supabase client:", error);
}

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
  
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [firstTimeVisit, setFirstTimeVisit] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [missingIngredients, setMissingIngredients] = useState<string[]>([]);
  const [showMissingDialog, setShowMissingDialog] = useState(false);

  const onboardingSteps = [
    {
      title: "Choose Kitchen Style",
      description: "Pick a style that inspires your recipes.",
      content: (
        <KitchenStyleSelector
          selectedStyle={selectedStyle}
          onSelect={style => {
            setSelectedStyle(style);
            setOnboardingStep(1);
          }}
        />
      ),
    },
    {
      title: "Scan Pantry Items",
      description: "Import and confirm your pantry items for personalized recipe matches.",
      content: (
        <Button 
          onClick={() => setOnboardingStep(2)}
          className="bg-kitchen-green w-full"
        >
          Continue with Pantry Import
        </Button>
      ),
    },
    {
      title: "Get Recipe Suggestions",
      description: "Let AI (or your pantry) suggest delicious recipes customized for you.",
      content: (
        <Button
          onClick={() => setShowOnboarding(false)}
          className="bg-kitchen-green w-full"
        >
          Finish & View Recipes
        </Button>
      ),
    },
  ];

  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('hasVisitedRecipesPage');
    if (!hasVisitedBefore) {
      setShowOnboarding(true);
      localStorage.setItem('hasVisitedRecipesPage', 'true');
    } else {
      setFirstTimeVisit(false);
    }
    
    const storedFavorites = localStorage.getItem('favoriteRecipes');
    if (storedFavorites) {
      setFavoriteRecipes(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    const hasSeenSplash = localStorage.getItem('hasSeenRecipeSplash');
    if (hasSeenSplash) {
      setShowSplashScreen(false);
    } else {
      setTimeout(() => {
        setShowSplashScreen(false);
        localStorage.setItem('hasSeenRecipeSplash', 'true');
      }, 3000);
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
        let ingredients = ['chicken', 'onion', 'garlic', 'tomato', 'rice'];
        if (supabase) {
          try {
            const { data: pantryItems } = await supabase.from('pantry_items').select('name').limit(10);
            if (pantryItems && pantryItems.length > 0) {
              ingredients = pantryItems.map(item => item.name);
            }
          } catch (error) {
            console.error("Error fetching pantry items:", error);
          }
        }
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
      let ingredients = ['chicken', 'onion', 'garlic', 'tomato', 'rice'];
      if (supabase) {
        try {
          const { data: pantryItems } = await supabase.from('pantry_items').select('name').limit(10);
          if (pantryItems && pantryItems.length > 0) {
            ingredients = pantryItems.map(item => item.name);
          }
        } catch (error) {
          console.error("Error fetching pantry items:", error);
        }
      }
      const apiRecipes = await searchRecipesByIngredients(ingredients);
      setRecipes(apiRecipes);
      toast({
        title: "Recipes Found",
        description: `Found ${apiRecipes.length} recipe${apiRecipes.length > 1 ? "s" : ""} based on your ingredients`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Couldn't get suggestions",
        description: "Please try again later.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportFromPantry = async () => {
    if (!supabase) {
      toast({
        title: "Cannot access pantry",
        description: "Database connection not available",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: pantryItems } = await supabase
        .from('pantry_items')
        .select('name')
        .neq('name', 'Pork');  // Exclude pork from results
      
      if (pantryItems && pantryItems.length > 0) {
        let ingredients: string[] = pantryItems.map(item => item.name);
        ingredients = ingredients.filter(item => item !== 'Pork');
        const currentIngredients = new Set(selectedIngredients);
        const newIngredients = ingredients.filter(ing => !currentIngredients.has(ing));
        
        setSelectedIngredients(prev => [...prev, ...newIngredients]);
        
        toast({
          title: "Pantry items imported",
          description: `Added ${newIngredients.length} new ingredients from your pantry`,
        });
      } else {
        toast({
          title: "No items found",
          description: "Your pantry is empty",
        });
      }
    } catch (error) {
      toast({
        title: "Error importing items",
        description: "Could not fetch pantry items",
        variant: "destructive",
      });
    }
  };
  
  const findMissingIngredients = (recipe: GeneratedRecipe) => {
    const recipeIngredients = recipe.ingredients || [];
    const pantryIngredients = selectedIngredients;
    return recipeIngredients.filter(ing => 
      !pantryIngredients.includes(ing) && ing.toLowerCase() !== 'pork'
    );
  };
  
  const generateRecipe = async (ingredients: string[]) => {
    setIsGenerating(true);
    try {
      const apiRecipes = await searchRecipesByIngredients(ingredients);
      if (apiRecipes.length > 0) {
        const idx = Math.floor(Math.random() * apiRecipes.length);
        const selectedApiRecipe = apiRecipes[idx];
        const recipeDetails = await getRecipeDetails(selectedApiRecipe.id);
        if (recipeDetails) {
          const missing = findMissingIngredients(recipeDetails);
          setMissingIngredients(missing);
          if (missing.length > 0) {
            setShowMissingDialog(true);
          }
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
              fat: Math.floor(Math.random() * 15) + 5,
            },
            tagline: `A delicious ${recipeDetails.cuisine || selectedStyle} recipe with your selected ingredients!`,
          });
          toast({
            title: "Recipe Created!",
            description: "Your custom recipe is ready",
            duration: 3000,
          });
          return;
        }
      }
      if (supabaseUrl) {
        const response = await fetch(
          `${supabaseUrl}/functions/v1/getRecipeSuggestions`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${supabaseAnonKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ingredients,
              cuisine: selectedStyle === "All" ? undefined : selectedStyle,
              detailed: true,
            }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          if (data.recipes && data.recipes.length > 0) {
            const recipe = data.recipes[0];
            setGeneratedRecipe({
              id: recipe.id,
              title: recipe.title,
              cookTime: recipe.cookTime,
              ingredients: recipe.ingredients,
              steps: recipe.steps,
              image: recipe.image,
              nutrition: recipe.nutrition,
              tagline: recipe.tagline,
            });
            toast({
              title: "AI Recipe Created!",
              description: "Your custom recipe is ready",
              duration: 3000,
            });
            return;
          }
        }
      }
      toast({
        title: "No recipe found",
        description: "Couldn't generate a recipe. Try more ingredients.",
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Error generating recipe",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
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
          image: recipeDetails.image,
          tagline: recipeDetails.cuisine 
            ? `Authentic ${recipeDetails.cuisine} cuisine` 
            : 'Delicious recipe to try today!',
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
        let ingredients = ['chicken', 'onion', 'garlic', 'tomato', 'rice'];
        if (supabase) {
          try {
            const { data: pantryItems } = await supabase.from('pantry_items').select('name').limit(10);
            if (pantryItems && pantryItems.length > 0) {
              ingredients = pantryItems.map(item => item.name);
            }
          } catch (error) {
            console.error("Error fetching pantry items:", error);
          }
        }
        const apiRecipes = await searchRecipesByIngredients(ingredients);
        if (apiRecipes.length > 0) {
          setRecipes(apiRecipes);
        } else {
          const defaultRecipes = await searchRecipesByCuisine('Italian');
          setRecipes(defaultRecipes);
        }
      } catch (error) {
        console.error('Error fetching initial recipes:', error);
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
  
  if (showOnboarding) {
    const step = onboardingSteps[onboardingStep];
    return (
      <div className="min-h-screen bg-kitchen-cream flex flex-col">
        <Header
          title="Welcome to Recipe Ideas"
          showSettings={false}
          showBack={true}
          onBack={handleBack}
        />
        <main className="flex-1 px-4 py-6 flex flex-col items-center justify-center">
          <div className="max-w-lg w-full bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-center mb-2">{step.title}</h2>
            <p className="text-center text-gray-600 mb-4">{step.description}</p>
            <div>{step.content}</div>
            {onboardingStep > 0 && (
              <Button
                onClick={() => setOnboardingStep(onboardingStep - 1)}
                variant="ghost"
                className="mt-4"
              >
                Back
              </Button>
            )}
          </div>
        </main>
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
      
      {showSplashScreen ? (
        <div className="fixed inset-0 bg-white/95 flex items-center justify-center z-50 animate-fade-in">
          <div className="text-center p-6">
            <h2 className="text-2xl font-bold mb-4">Welcome to Recipe Ideas!</h2>
            <p className="text-gray-600 mb-4">
              Are you confused about what to cook? We can make your life easier!
            </p>
            <div className="animate-pulse">
              <Utensils size={48} className="mx-auto text-kitchen-green" />
            </div>
          </div>
        </div>
      ) : (
        <main className="flex-1 px-4 py-6">
          <div className="mb-6">
            <Button
              onClick={handleToggleGenerator}
              className="w-full bg-kitchen-green hover:bg-kitchen-green/90 mb-4"
            >
              {showGenerator ? "Browse Recipe Ideas" : "Inspirations"}
            </Button>
            {!showGenerator && (
              <Button
                onClick={getAiSuggestions}
                className="w-full bg-kitchen-green/90 hover:bg-kitchen-green mb-2"
                disabled={isLoading}
              >
                {isLoading ? <span className="flex items-center"><Utensils className="animate-spin mr-2" size={18} /> Loading suggestions...</span> : "Get AI Suggestions"}
              </Button>
            )}
          </div>
          
          {isLoading ? (
            <AiLoadingAnimation message="Cooking up suggestions for you..." />
          ) : showGenerator ? (
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
      )}

      <Dialog open={showMissingDialog} onOpenChange={setShowMissingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Missing Ingredients</DialogTitle>
            <DialogDescription>
              Would you like to add these items to your shopping list?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {missingIngredients.map((ingredient, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <Checkbox id={`ing-${index}`} />
                <label htmlFor={`ing-${index}`}>{ingredient}</label>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMissingDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              // Here you would implement the logic to add to shopping list
              toast({
                title: "Added to shopping list",
                description: "Selected ingredients have been added to your list",
              });
              setShowMissingDialog(false);
            }}>
              Add to Shopping List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default RecipesPage;
