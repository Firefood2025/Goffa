
import React from 'react';
import { Chef, ChefCategory, ChefStyle } from "@/types/chef";
import { ChefCard } from "@/components/chef/ChefCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChefFilter } from "@/components/chef/ChefFilter";
import { motion } from 'framer-motion';

interface ChefListProps {
  chefs: Chef[];
  selectedCategory: ChefCategory;
  setSelectedCategory: (category: ChefCategory) => void;
  selectedStyle: ChefStyle;
  setSelectedStyle: (style: ChefStyle) => void;
  onBookNow: (chef: Chef) => void;
  onViewGallery: (chef: Chef) => void;
}

const ChefList: React.FC<ChefListProps> = ({
  chefs,
  selectedCategory,
  setSelectedCategory,
  selectedStyle,
  setSelectedStyle,
  onBookNow,
  onViewGallery
}) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const filteredChefs = chefs.filter(chef => 
    (selectedCategory === 'all' || chef.specialties.includes(selectedCategory)) &&
    (selectedStyle === 'all' || chef.styles.includes(selectedStyle))
  );

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="lg:col-span-2"
    >
      <Card className="mb-6 shadow-md">
        <CardHeader className="pb-2">
          <h2 className="text-xl sm:text-2xl font-bold">Available Chefs</h2>
        </CardHeader>
        <CardContent>
          <ChefFilter 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedStyle={selectedStyle}
            onStyleChange={setSelectedStyle}
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {filteredChefs.length === 0 ? (
              <motion.p 
                variants={itemVariants}
                className="text-center col-span-1 sm:col-span-2 py-10 text-gray-500"
              >
                No chefs available with the selected filters.
              </motion.p>
            ) : (
              filteredChefs.map((chef) => (
                <motion.div
                  key={chef.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ChefCard
                    chef={chef}
                    onBookNow={() => onBookNow(chef)}
                    onViewGallery={() => onViewGallery(chef)}
                  />
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ChefList;
