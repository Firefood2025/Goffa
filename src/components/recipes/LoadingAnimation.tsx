
import React from 'react';
import { Utensils } from 'lucide-react';

const LoadingAnimation: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 animate-fade-in">
      <div className="relative">
        <div className="animate-spin h-16 w-16 mb-4">
          <Utensils size={64} className="text-kitchen-green" />
        </div>
        <div className="absolute top-0 left-0 h-16 w-16 flex items-center justify-center">
          <div className="h-2 w-2 bg-kitchen-green rounded-full"></div>
        </div>
      </div>
      <p className="text-kitchen-green font-medium mt-4">Finding delicious recipes for you...</p>
      <p className="text-gray-500 text-sm mt-2">Matching your pantry ingredients with the best recipes</p>
    </div>
  );
};

export default LoadingAnimation;
