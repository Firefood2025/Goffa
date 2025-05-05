
import React from 'react';
import { ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { CHEFS } from '@/pages/RentChefPage';

export const ChefTile = () => {
  const { toast } = useToast();
  
  const handleChefHighlight = () => {
    toast({
      title: "Chef of the Day",
      description: "Book our 5-star chef Marco for your next dinner party!",
    });
  };
  
  // Select a featured chef from our database
  const featuredChef = CHEFS.find(chef => chef.id === '3'); // Marco Rossi
  
  return (
    <motion.div 
      className="bg-gradient-to-br from-kitchen-wood to-kitchen-stone rounded-lg shadow-lg overflow-hidden mb-6"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Link to="/rent-chef" className="block">
        <div className="relative">
          <img 
            src="https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
            alt="Personal Chef Service" 
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-4 text-white">
              <h3 className="text-xl font-bold flex items-center">
                <ChefHat className="mr-2" /> Rent a Chef
              </h3>
              <p className="text-sm opacity-90">Professional chefs, your kitchen</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center">
            {featuredChef && (
              <img 
                src={featuredChef.image} 
                alt={featuredChef.name} 
                className="w-10 h-10 rounded-full object-cover border-2 border-white"
                onClick={(e) => {
                  e.preventDefault();
                  handleChefHighlight();
                }}
              />
            )}
            <div className="ml-2">
              <p className="text-white text-sm font-medium">Featured Chef</p>
              <p className="text-white/70 text-xs">{featuredChef?.specialties.join(', ')}</p>
            </div>
          </div>
          
          <motion.button 
            className="bg-kitchen-green hover:bg-kitchen-green/90 text-white text-sm py-1 px-3 rounded"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.preventDefault();
              handleChefHighlight();
            }}
          >
            View
          </motion.button>
        </div>
      </Link>
    </motion.div>
  );
};

export default ChefTile;
