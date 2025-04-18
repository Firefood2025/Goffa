
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

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

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
      const { data: pantryItems } = await supabase
        .from('pantry_items')
        .select('name')
        .limit(10);

      const ingredients = pantryItems?.map(item => item.name) || [];
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/getRecipeSuggestions`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
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
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      toast({
        title: "Couldn't get suggestions",
        description: "Please try again later",
        variant: "destructive",
        duration: 3000,
      });
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
    // Get AI suggestions when the page loads
    getAiSuggestions();
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
