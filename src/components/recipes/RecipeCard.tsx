
import React from 'react';
import { Clock, Utensils, ChefHat } from 'lucide-react';

export interface RecipeData {
  id: string;
  title: string;
  image: string;
  cookTime: number; // minutes
  ingredients: string[];
  matchingIngredients: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisine?: string;
}

interface RecipeCardProps {
  recipe: RecipeData;
  onClick: (id: string) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  // Calculate match percentage
  const matchPercentage = Math.round((recipe.matchingIngredients / recipe.ingredients.length) * 100);
  
  // Determine match styling
  const getMatchStyling = () => {
    if (matchPercentage >= 90) {
      return { bg: 'bg-green-500', text: 'text-white' };
    } else if (matchPercentage >= 70) {
      return { bg: 'bg-green-400', text: 'text-white' };
    } else if (matchPercentage >= 50) {
      return { bg: 'bg-yellow-400', text: 'text-kitchen-dark' };
    } else {
      return { bg: 'bg-kitchen-stone', text: 'text-white' };
    }
  };
  
  const matchStyle = getMatchStyling();
  
  return (
    <div 
      onClick={() => onClick(recipe.id)}
      className="bg-white rounded-xl shadow-md overflow-hidden mb-4 cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="relative">
        <img 
          src={recipe.image} 
          alt={recipe.title}
          className="w-full h-48 object-cover"
        />
        <div className={`absolute top-3 right-3 ${matchStyle.bg} ${matchStyle.text} text-xs font-bold px-2 py-1 rounded-full`}>
          {matchPercentage}% Match
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2 text-kitchen-dark">{recipe.title}</h3>
        
        <div className="flex flex-wrap items-center text-sm text-gray-600 mt-2">
          <div className="flex items-center mr-4 mb-1">
            <Clock size={16} className="mr-1 text-kitchen-green" />
            <span>{recipe.cookTime} min</span>
          </div>
          
          <div className="flex items-center mr-4 mb-1">
            <Utensils size={16} className="mr-1 text-kitchen-green" />
            <span>
              {recipe.matchingIngredients}/{recipe.ingredients.length} ingredients
            </span>
          </div>
          
          <div className="flex items-center mr-4 mb-1">
            <ChefHat size={16} className="mr-1 text-kitchen-green" />
            <span>{recipe.difficulty}</span>
          </div>
          
          {recipe.cuisine && (
            <div className="px-2 py-0.5 bg-muted rounded-full text-xs mb-1">
              {recipe.cuisine}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
