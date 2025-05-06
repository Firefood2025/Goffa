
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Check, Plus, ShoppingBag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { ShoppingItemData } from '@/components/shopping/ShoppingItem';
import { ListLayout, ViewMode } from '@/components/ui/list-layout';

import { mockShoppingItems, mockShoppingLists } from '@/lib/data';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

const GrabAndGoPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // State for items in Grab & Go mode
  const [shoppingItems, setShoppingItems] = useState<ShoppingItemData[]>(
    mockShoppingItems.filter(item => !item.isChecked)
  );

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  
  // Dialog state for import
  const [showImportDialog, setShowImportDialog] = useState(false);
  
  // Check for location state (items passed from Pantry)
  useEffect(() => {
    if (location.state && location.state.selectedItems) {
      const newItems = location.state.selectedItems as ShoppingItemData[];
      const existingIds = new Set(shoppingItems.map(i => i.id));
      const itemsToAdd = newItems.filter(item => !existingIds.has(item.id));
      
      if (itemsToAdd.length > 0) {
        setShoppingItems(prev => [...prev, ...itemsToAdd]);
        toast({
          title: "Items Added",
          description: `Added ${itemsToAdd.length} item${itemsToAdd.length > 1 ? 's' : ''} to Grab & Go`,
          duration: 2000,
        });
      }
    }
  }, [location.state]);

  // Handler functions
  const handleToggle = (id: string) => {
    setShoppingItems(items =>
      items.map(item =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )
    );
  };

  const handleQuickAdd = () => {
    setShowImportDialog(true);
  };

  const handleExitGrabAndGo = () => {
    navigate('/shopping-list');
  };

  // Group items by category
  const groupedItems = shoppingItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ShoppingItemData[]>);

  // Sort categories for display
  const sortedCategories = Object.keys(groupedItems).sort();

  // --- Import logic ---
  // Map itemIds to ShoppingItemData from mockShoppingItems
  const shoppingLists = mockShoppingLists.map(list => ({
    id: list.id,
    name: list.name,
    items: list.items
      .map(itemId => mockShoppingItems.find(i => i.id === itemId))
      .filter(Boolean) as ShoppingItemData[]
  }));

  // Create a list with selected items
  const handleCreateList = () => {
    const checkedItems = shoppingItems.filter(item => item.isChecked);
    if (checkedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please check some items to create a list",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }
    
    const newListName = `Shopping List - ${new Date().toLocaleDateString()}`;
    const listData = {
      items: checkedItems,
      name: newListName,
      creator: "You",
      date: new Date().toISOString(),
    };
    
    // Here you could save to database/localStorage
    
    toast({
      title: "List Created",
      description: `Created "${newListName}" with ${checkedItems.length} items`,
      duration: 2000,
    });
    
    // Navigate to shopping list with the new list data
    navigate('/shopping-list', { 
      state: { 
        newList: listData 
      }
    });
  };

  // Merge imported items, avoiding duplicates by id
  const handleImportListItems = (listId: string) => {
    const importList = shoppingLists.find(l => l.id === listId);
    if (!importList) return;
    // Only add items that aren't already present in shoppingItems (by id)
    const existingIds = new Set(shoppingItems.map(i => i.id));
    const newItems = importList.items.filter(i => !existingIds.has(i.id));
    
    if (newItems.length === 0) {
      toast({
        title: "No new items imported",
        description: "All items from the selected list are already in Grab & Go.",
        variant: "default",
        duration: 2000,
      });
    } else {
      setShoppingItems(prev => [...prev, ...newItems]);
      toast({
        title: "Items imported",
        description: `Imported ${newItems.length} item${newItems.length > 1 ? 's' : ''} from "${importList.name}".`,
        duration: 2000,
      });
    }
    setShowImportDialog(false);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
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

  return (
    <div className="min-h-screen bg-kitchen-cream flex flex-col">
      {/* Grab & Go mode header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-kitchen-green text-white px-4 py-3 shadow-md sticky top-0 z-10"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ShoppingBag size={24} className="mr-2" />
            <h1 className="text-xl font-bold">Grab &amp; Go Mode</h1>
          </div>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExitGrabAndGo}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Exit Grab &amp; Go mode"
          >
            <X size={24} />
          </motion.button>
        </div>
      </motion.header>

      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex-1 px-4 py-6 mb-20 max-w-4xl mx-auto w-full overflow-hidden"
      >
        {shoppingItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center py-10 bg-white/80 rounded-xl shadow-sm mt-4 backdrop-blur-sm"
          >
            <p className="text-xl mb-4">Your shopping list is empty</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={handleQuickAdd}
                className="bg-kitchen-green hover:bg-kitchen-green/90 text-lg py-6 px-8 transition-transform duration-200"
              >
                <Plus size={24} className="mr-2" />
                Import Items
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <ListLayout
            title="Shopping Items"
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            className="mt-4"
          >
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6 pb-16"
            >
              {sortedCategories.map(category => (
                <motion.div key={category} className="mb-6" variants={itemVariants}>
                  <h2 className="text-xl font-bold mb-3 px-2 text-kitchen-dark">{category}</h2>
                  <div className={`${viewMode === 'list' ? 'space-y-2' : 'grid grid-cols-2 gap-3'}`}>
                    <AnimatePresence>
                      {groupedItems[category].map(item => (
                        <motion.div 
                          key={item.id}
                          className={`
                            bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden
                            ${viewMode === 'list' ? 'flex items-center p-4' : 'p-4 flex flex-col items-center text-center'}
                          `}
                          variants={itemVariants}
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        >
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleToggle(item.id)}
                            className={`
                              flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center
                              transition-colors duration-300
                              ${viewMode === 'list' ? 'mr-4' : 'mb-3'}
                              ${item.isChecked 
                                ? 'bg-kitchen-green border-kitchen-green text-white' 
                                : 'border-gray-300 hover:border-gray-400 transition-colors'}
                            `}
                            aria-label={item.isChecked ? "Uncheck item" : "Check item"}
                          >
                            {item.isChecked && <Check size={18} />}
                          </motion.button>
                          
                          <div className={viewMode === 'list' ? 'flex-1' : 'w-full'}>
                            <h3 className={`text-lg font-medium ${item.isChecked ? 'text-gray-400 line-through' : 'text-kitchen-dark'}`}>
                              {item.name}
                            </h3>
                            
                            {item.note && (
                              <p className="text-sm text-gray-500 mt-1">{item.note}</p>
                            )}
                          </div>
                          
                          <span className={`text-base ${item.isChecked ? 'text-gray-400' : 'text-kitchen-dark'} ${viewMode === 'grid' ? 'mt-2' : ''}`}>
                            {item.quantity} {item.unit}
                          </span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
              
              {shoppingItems.some(item => item.isChecked) && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-8 flex justify-center"
                >
                  <Button 
                    onClick={handleCreateList}
                    className="bg-kitchen-green hover:bg-kitchen-green/90 text-white py-2 px-6"
                  >
                    Create List with Selected Items
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </ListLayout>
        )}
      </motion.main>
      
      {/* Grab & Go quick add/import button */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        className="fixed bottom-8 right-6 drop-shadow-lg transition-all z-50"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            onClick={handleQuickAdd}
            className="bg-kitchen-green text-white w-16 h-16 rounded-full flex items-center justify-center hover:bg-kitchen-green/90 transition-transform duration-300 shadow-2xl"
            size="icon"
            aria-label="Import items to Grab & Go"
            style={{ boxShadow: '0 8px 20px rgba(68, 130, 74, 0.15)' }}
          >
            <Plus size={32} />
          </Button>
        </motion.div>
      </motion.div>
      
      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Import Items to Grab &amp; Go</DialogTitle>
            <DialogDescription>
              Choose from your existing lists to quickly import items.
            </DialogDescription>
          </DialogHeader>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-3 py-2"
          >
            {shoppingLists.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No lists available to import from.
              </div>
            ) : (
              shoppingLists.map(list => (
                <motion.button
                  key={list.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex justify-between items-center w-full p-3 rounded-lg bg-gray-100 hover:bg-kitchen-green/10 border border-gray-200 transition-colors mb-1 active:bg-kitchen-green/20"
                  onClick={() => handleImportListItems(list.id)}
                  type="button"
                >
                  <span className="font-semibold text-kitchen-dark">{list.name}</span>
                  <span className="text-gray-500 text-xs">{list.items.length} item{list.items.length !== 1 ? 's' : ''}</span>
                </motion.button>
              ))
            )}
          </motion.div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GrabAndGoPage;
