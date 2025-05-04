
import React from 'react';
import { ChefHat, RefrigeratorIcon, Plus, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ActionTile from '@/components/home/ActionTile';
import ExpiringSoonSection from '@/components/home/ExpiringSoonSection';
import FloatingGrabAndGoButton from '@/components/home/FloatingGrabAndGoButton';
import SpaceQuickAccess from '@/components/spaces/SpaceQuickAccess';

import { getExpiringSoonItems } from '@/lib/data';
import { useSpaces } from '@/hooks/use-spaces';

const Index = () => {
  const navigate = useNavigate();
  const { spaces } = useSpaces();
  const expiringSoonItems = getExpiringSoonItems(7);
  
  return (
    <div className="min-h-screen bg-kitchen-cream kitchen-texture flex flex-col">
      <Header title="PantryChef AI" />
      
      <main className="flex-1 px-4 py-6 mb-16">
        <div className="mb-4">
          <h2 className="text-2xl font-bold font-heading text-kitchen-dark">Hello, Chef!</h2>
          <p className="text-gray-600">What would you like to do today?</p>
        </div>
        
        {spaces.length > 0 && <SpaceQuickAccess spaces={spaces} />}
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <ActionTile
            title="What Can I Make?"
            icon={ChefHat}
            to="/recipes"
            variant="primary"
            className="col-span-2 h-40"
          />
          
          <ActionTile
            title="My Pantry"
            icon={RefrigeratorIcon}
            to="/pantry"
            variant="secondary"
            className="h-32"
          />
          
          <ActionTile
            title="Add Item"
            icon={Plus}
            to="/pantry?action=add"
            variant="accent"
            className="h-32"
          />
          
          <ActionTile
            title="Shopping List"
            icon={ShoppingCart}
            to="/shopping-list"
            variant="secondary"
            className="col-span-2 h-32"
          />
        </div>
        
        <ExpiringSoonSection items={expiringSoonItems} />
      </main>
      
      <FloatingGrabAndGoButton />
      <Footer />
    </div>
  );
};

export default Index;
