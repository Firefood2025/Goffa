
import React from 'react';
import { Utensils } from 'lucide-react';

const RecipeSplashScreen: React.FC = () => (
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
);

export default RecipeSplashScreen;
