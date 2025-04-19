import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@supabase/supabase-js';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import RecipeList from '@/components/recipes/RecipeList';
import CuisineSelector, { Cuisine } from '@/components/recipes/CuisineSelector';
import { RecipeData } from '@/components/recipes/RecipeCard';
import { mockRecipes } from '@/lib/data';
import KitchenStyleSelector, { KitchenStyle } from '@/components/recipes/KitchenStyleSelector';
import RecipeGenerator from '@/components/recipes/RecipeGenerator';
import RecipeDetail, { GeneratedRecipe } from '@/components/recipes/RecipeDetail';
import { Button } from '@/components/ui/button';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const RecipesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedCuisine, setSelectedCuisine] = useState<Cuisine>('All');
  const [recipes, setRecipes] = useState<RecipeData[]>(mockRecipes);
  const [isLoading, setIsLoading] = useState(false);
  
  const [showGenerator, setShowGenerator] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<KitchenStyle>('All');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<GeneratedRecipe | null>(null);
  
  const handleCuisineSelect = (cuisine: Cuisine) => {
    setSelectedCuisine(cuisine);
    if (cuisine === 'All') {
      setRecipes(mockRecipes);
    } else {
      const filteredRecipes = mockRecipes.filter(recipe => 
        recipe.cuisine?.toLowerCase() === cuisine.toLowerCase()
      );
      setRecipes(filteredRecipes);
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
      
      if (supabaseUrl) {
        const response = await fetch(
          `${supabaseUrl}/functions/v1/getRecipeSuggestions`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${supabaseAnonKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ingredients }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to get recipe suggestions');
        }

        const data = await response.json();
        const aiRecipes = data.recipes.map((recipe: any, index: number) => ({
          ...recipe,
          id: `ai-${index}`,
          image: `https://source.unsplash.com/random/800x600/?${recipe.title.toLowerCase().replace(/\s+/g, ',')}`,
          matchingIngredients: ingredients.length
        }));

        setRecipes(aiRecipes);
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
        description: "Please try again later",
        variant: "destructive",
        duration: 3000,
      });
      setRecipes(mockRecipes);
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
  
  const handleRecipeClick = (id: string) => {
    const recipe = recipes.find(r => r.id === id);
    
    if (recipe) {
      toast({
        title: recipe.title,
        description: "This would show the full recipe details",
        duration: 3000,
      });
    }
  };
  
  const handleFilterClick = () => {
    toast({
      title: "Recipe filters",
      description: "This would open recipe filtering options",
      duration: 3000,
    });
  };
  
  const handleBack = () => {
    navigate('/');
  };
  
  const handleToggleGenerator = () => {
    setShowGenerator(!showGenerator);
    if (!showGenerator) {
      setGeneratedRecipe(null);
    }
  };
  
  const handleTryAnother = () => {
    setGeneratedRecipe(null);
  };
  
  useEffect(() => {
    if (supabase) {
      getAiSuggestions();
    } else {
      console.warn('Supabase client not initialized. Using mock recipes instead.');
      setRecipes(mockRecipes);
      toast({
        title: "Using sample recipes",
        description: "Supabase connection not available",
        duration: 3000,
      });
    }
  }, []);
  
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
        </div>
        
        {showGenerator ? (
          <div>
            {generatedRecipe ? (
              <RecipeDetail 
                recipe={generatedRecipe} 
                onTryAnother={handleTryAnother}
                kitchenStyle={selectedStyle}
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
            <CuisineSelector 
              selectedCuisine={selectedCuisine}
              onSelect={handleCuisineSelect}
            />
            <RecipeList
              recipes={recipes}
              onRecipeClick={handleRecipeClick}
              onFilterClick={handleFilterClick}
              isLoading={isLoading}
            />
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default RecipesPage;
