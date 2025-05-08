
import React, { useEffect, useState } from 'react';
import { ChefHat, RefrigeratorIcon, Plus, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ActionTile from '@/components/home/ActionTile';
import ExpiringSoonSection from '@/components/home/ExpiringSoonSection';
import FloatingGrabAndGoButton from '@/components/home/FloatingGrabAndGoButton';
import SpaceQuickAccess from '@/components/spaces/SpaceQuickAccess';
import ChefTile from '@/components/home/ChefTile';

import { getExpiringSoonItems } from '@/lib/data';
import { useSpaces } from '@/hooks/use-spaces';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const navigate = useNavigate();
  const { spaces } = useSpaces();
  const [expiringSoonItems, setExpiringSoonItems] = useState(getExpiringSoonItems(7));
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  // Fetch expiring soon items from Supabase
  useEffect(() => {
    const fetchExpiringSoonItems = async () => {
      try {
        const today = new Date();
        const oneWeekLater = new Date();
        oneWeekLater.setDate(today.getDate() + 7);
        
        const { data, error } = await supabase
          .from('pantry_items')
          .select('id, name, expiry_date, image_url')
          .lt('expiry_date', oneWeekLater.toISOString())
          .gt('expiry_date', today.toISOString())
          .order('expiry_date', { ascending: true });
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          const items = data.map(item => {
            const expiryDate = new Date(item.expiry_date);
            const diffTime = expiryDate.getTime() - today.getTime();
            const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            return {
              id: item.id,
              name: item.name,
              daysLeft,
              image: item.image_url
            };
          });
          
          setExpiringSoonItems(items);
        }
      } catch (error) {
        console.error('Error fetching expiring soon items:', error);
      }
    };
    
    fetchExpiringSoonItems();
  }, []);

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-kitchen-cream kitchen-texture flex flex-col"
    >
      <Header />
      
      <motion.main 
        variants={containerVariants}
        className="flex-1 px-4 py-6 mb-16 overflow-x-hidden"
      >
        <motion.div variants={itemVariants} className="mb-4">
          <h2 className="text-2xl font-bold font-heading text-kitchen-dark">Hello, Chef!</h2>
          <p className="text-gray-600">What would you like to do today?</p>
        </motion.div>
        
        {spaces.length > 0 && (
          <motion.div variants={itemVariants}>
            <SpaceQuickAccess spaces={spaces} />
          </motion.div>
        )}
        
        <motion.div variants={itemVariants}>
          <ChefTile />
        </motion.div>
        
        <motion.div variants={containerVariants} className="grid grid-cols-2 gap-4 mb-6">
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="col-span-2"
          >
            <ActionTile
              title="What Can I Make?"
              icon={ChefHat}
              to="/recipes"
              variant="primary"
              className="h-40 bg-gradient-to-tr from-kitchen-green/90 to-kitchen-green"
            />
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <ActionTile
              title="My Pantry"
              icon={RefrigeratorIcon}
              to="/pantry"
              variant="secondary"
              className="h-32 bg-gradient-to-br from-kitchen-wood to-kitchen-stone"
            />
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <ActionTile
              title="Add Item"
              icon={Plus}
              to="/pantry?action=add"
              variant="accent"
              className="h-32 bg-gradient-to-br from-kitchen-berry/90 to-kitchen-berry"
            />
          </motion.div>
          
          <motion.div 
            variants={itemVariants} 
            whileHover={{ scale: 1.02 }}
            className="col-span-2"
          >
            <ActionTile
              title="Shopping List"
              icon={ShoppingCart}
              to="/shopping-list"
              variant="secondary"
              className="h-32 bg-gradient-to-br from-blue-500/80 to-blue-600"
            />
          </motion.div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <ExpiringSoonSection items={expiringSoonItems} />
        </motion.div>
      </motion.main>
      
      <FloatingGrabAndGoButton />
      <Footer />
    </motion.div>
  );
};

export default Index;
