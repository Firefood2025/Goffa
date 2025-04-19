
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

// Fix the Supabase client initialization by ensuring URL and key are provided
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are defined before creating the client
const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const RecipesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedCuisine, setSelectedCuisine] = useState<Cuisine>('All');
  const [recipes, setRecipes] = useState<RecipeData[]>(mockRecipes);
  const [isLoading, setIsLoading] = useState(false);
  
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

  const getAiSuggestions = async () => {
    setIsLoading(true);
    try {
      // Check if Supabase client is available
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
      // Fall back to mock recipes on error
      setRecipes(mockRecipes);
    } finally {
      setIsLoading(false);
    }
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
  
  useEffect(() => {
    // Only try to get AI suggestions if Supabase client is initialized
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
      </main>
      
      <Footer />
    </div>
  );
};

export default RecipesPage;
