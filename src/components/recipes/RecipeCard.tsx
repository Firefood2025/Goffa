
import React from 'react';
import { Clock, Utensils, ChefHat, Heart, Trash2 } from 'lucide-react';

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
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe, 
  onClick, 
  isFavorite = false,
  onToggleFavorite,
  onDelete
}) => {
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
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(recipe.id);
    }
  };
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(recipe.id);
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4 hover:shadow-lg transition-shadow">
      <div 
        className="relative cursor-pointer" 
        onClick={() => onClick(recipe.id)}
      >
        <img 
          src={recipe.image || `https://source.unsplash.com/random/800x600/?food,${recipe.title.toLowerCase().replace(/\s+/g, ',')}`} 
          alt={recipe.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            // Fallback image if the main one fails to load
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = `https://source.unsplash.com/random/800x600/?food,${recipe.title.toLowerCase().replace(/\s+/g, ',')}`;
          }}
        />
        <div className={`absolute top-3 right-3 ${matchStyle.bg} ${matchStyle.text} text-xs font-bold px-2 py-1 rounded-full`}>
          {matchPercentage}% Match
        </div>
        
        {onToggleFavorite && (
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-3 left-3 p-2 rounded-full ${
              isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-500'
            } hover:scale-110 transition-transform`}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              size={16} 
              className={isFavorite ? 'fill-current' : ''} 
            />
          </button>
        )}
        
        {onDelete && (
          <button
            onClick={handleDeleteClick}
            className="absolute bottom-3 right-3 p-2 rounded-full bg-white text-gray-500 hover:bg-red-100 hover:text-red-500 transition-colors"
            aria-label="Delete recipe"
          >
            <Trash2 size={16} />
          </button>
        )}
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
