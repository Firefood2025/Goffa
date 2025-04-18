
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import RecipeList from '@/components/recipes/RecipeList';
import CuisineSelector, { Cuisine } from '@/components/recipes/CuisineSelector';
import { RecipeData } from '@/components/recipes/RecipeCard';

import { mockRecipes } from '@/lib/data';

const RecipesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedCuisine, setSelectedCuisine] = useState<Cuisine>('All');
  const [recipes, setRecipes] = useState<RecipeData[]>(mockRecipes);
  
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
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default RecipesPage;
