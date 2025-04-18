
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ShoppingList from '@/components/shopping/ShoppingList';
import { ShoppingItemData } from '@/components/shopping/ShoppingItem';

import { mockShoppingItems } from '@/lib/data';

const ShoppingListPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [shoppingItems, setShoppingItems] = useState<ShoppingItemData[]>(mockShoppingItems);
  
  // Handler functions
  const handleToggle = (id: string) => {
    setShoppingItems(items =>
      items.map(item =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )
    );
  };
  
  const handleDelete = (id: string) => {
    setShoppingItems(items => items.filter(item => item.id !== id));
    
    toast({
      title: "Item removed",
      description: "The item has been removed from your shopping list",
      duration: 3000,
    });
  };
  
  const handleAddNew = () => {
    // In a real application, this would open a form or modal
    toast({
      title: "Add item feature",
      description: "This would open a form to add a new shopping list item",
      duration: 3000,
    });
  };
  
  const handleClearChecked = () => {
    setShoppingItems(items => items.filter(item => !item.isChecked));
    
    toast({
      title: "Checked items cleared",
      description: "All checked items have been removed from your list",
      duration: 3000,
    });
  };
  
  const handleShare = () => {
    toast({
      title: "Share list feature",
      description: "This would open options to share your shopping list",
      duration: 3000,
    });
  };
  
  const handleBack = () => {
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-kitchen-cream flex flex-col">
      <Header 
        title="Shopping List" 
        showSettings={false} 
        showBack={true} 
        onBack={handleBack} 
      />
      
      <main className="flex-1 px-4 py-6">
        <ShoppingList
          items={shoppingItems}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onAddNew={handleAddNew}
          onClearChecked={handleClearChecked}
          onShare={handleShare}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default ShoppingListPage;
