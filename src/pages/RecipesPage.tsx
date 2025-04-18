
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import RecipeList from '@/components/recipes/RecipeList';
import { RecipeData } from '@/components/recipes/RecipeCard';

import { mockRecipes } from '@/lib/data';

const RecipesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [recipes, setRecipes] = useState<RecipeData[]>(mockRecipes);
  
  // Handler functions
  const handleRecipeClick = (id: string) => {
    // In a real app, this would navigate to recipe details
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
