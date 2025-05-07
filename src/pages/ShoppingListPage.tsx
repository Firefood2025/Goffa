
import React from 'react';
import { useNavigate } from 'react-router-dom';

import ShoppingList from '@/components/shopping/ShoppingList';
import ShoppingListLayout from '@/components/shopping/ShoppingListLayout';
import { useShoppingList } from '@/hooks/use-shopping-list';

const ShoppingListPage = () => {
  const navigate = useNavigate();
  
  const { 
    shoppingItems, 
    isLoading, 
    handleToggle, 
    handleDelete, 
    handleAddNew, 
    handleClearChecked, 
    handleShare 
  } = useShoppingList();
  
  const handleBack = () => {
    navigate('/');
  };
  
  return (
    <ShoppingListLayout title="Shopping List" onBack={handleBack}>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-kitchen-green">Loading shopping list...</div>
        </div>
      ) : (
        <ShoppingList
          items={shoppingItems}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onAddNew={handleAddNew}
          onClearChecked={handleClearChecked}
          onShare={handleShare}
        />
      )}
    </ShoppingListLayout>
  );
};

export default ShoppingListPage;
