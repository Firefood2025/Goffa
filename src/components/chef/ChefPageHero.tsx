
import React from 'react';
import { motion } from 'framer-motion';

interface ChefPageHeroProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
}

const ChefPageHero: React.FC<ChefPageHeroProps> = ({ 
  title, 
  subtitle,
  backgroundImage = "https://images.unsplash.com/photo-1556911073-38141963c9e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.7 }}
      className="relative py-8 sm:py-12 mb-6 sm:mb-8 bg-kitchen-green/90 rounded-lg shadow-lg overflow-hidden"
    >
      <div className="absolute inset-0 opacity-20">
        <img 
          src={backgroundImage}
          alt="Chef background"
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = "https://images.unsplash.com/photo-1556911073-38141963c9e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80";
          }}
        />
      </div>
      <div className="relative text-center text-white px-4">
        <h1 className="text-3xl md:text-5xl font-bold mb-2 sm:mb-4">{title}</h1>
        <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>
    </motion.div>
  );
};

export default ChefPageHero;
