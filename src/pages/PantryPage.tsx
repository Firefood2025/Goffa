
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PantryList from '@/components/pantry/PantryList';
import { PantryItemData } from '@/components/pantry/PantryItem';
import { useToast } from '@/hooks/use-toast';

import { mockPantryItems } from '@/lib/data';

const PantryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [pantryItems, setPantryItems] = useState<PantryItemData[]>(mockPantryItems);
  
  // Handler functions
  const handleIncrement = (id: string) => {
    setPantryItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };
  
  const handleDecrement = (id: string) => {
    setPantryItems(items => 
      items.map(item => 
        item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  };
  
  const handleDelete = (id: string) => {
    setPantryItems(items => items.filter(item => item.id !== id));
    
    toast({
      title: "Item removed",
      description: "The item has been removed from your pantry",
      duration: 3000,
    });
  };
  
  const handleAddNew = () => {
    // In a real application, this would open a form or modal
    toast({
      title: "Add item feature",
      description: "This would open a form to add a new pantry item",
      duration: 3000,
    });
  };
  
  const handleBack = () => {
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-kitchen-cream flex flex-col">
      <Header 
        title="My Pantry" 
        showSettings={false} 
        showBack={true} 
        onBack={handleBack} 
      />
      
      <main className="flex-1 px-4 py-6">
        <PantryList
          items={pantryItems}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          onDelete={handleDelete}
          onAddNew={handleAddNew}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default PantryPage;
