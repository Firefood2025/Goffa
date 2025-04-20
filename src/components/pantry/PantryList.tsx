
import React, { useState } from 'react';
import PantryItem, { PantryItemData } from './PantryItem';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Utensils, Snowflake, Archive, Clock, Plus, MoreHorizontal } from 'lucide-react';
import { CustomListType } from '@/pages/PantryPage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';

interface PantryListProps {
  items: PantryItemData[];
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
  customLists?: CustomListType[];
  onAddToList?: (itemId: string, listId: string) => void;
  selectedItems?: string[];
  onToggleSelectItem?: (itemId: string, isSelected: boolean) => void;
}

const PantryList: React.FC<PantryListProps> = ({ 
  items, 
  onIncrement, 
  onDecrement, 
  onDelete,
  onAddNew,
  customLists = [],
  onAddToList,
  selectedItems = [],
  onToggleSelectItem,
}) => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Count items in each category
  const countByCategory = {
    all: items.length,
    fridge: items.filter(item => item.category === "fridge").length,
    freezer: items.filter(item => item.category === "freezer").length,
    pantry: items.filter(item => item.category === "pantry").length,
    expiring: items.filter(item => {
      if (!item.expiryDate) return false;
      const today = new Date();
      const expiry = new Date(item.expiryDate);
      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }).length,
  };
  
  // Filter items based on active tab
  const getFilteredItems = () => {
    switch (activeTab) {
      case "fridge":
        return items.filter(item => item.category === "fridge");
      case "freezer":
        return items.filter(item => item.category === "freezer");
      case "pantry":
        return items.filter(item => item.category === "pantry");
      case "expiring":
        return items.filter(item => {
          if (!item.expiryDate) return false;
          const today = new Date();
          const expiry = new Date(item.expiryDate);
          const diffTime = expiry.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 7;
        }).sort((a, b) => {
          const dateA = a.expiryDate ? new Date(a.expiryDate).getTime() : Infinity;
          const dateB = b.expiryDate ? new Date(b.expiryDate).getTime() : Infinity;
          return dateA - dateB;
        });
      default:
        return items;
    }
  };
  
  const filteredItems = getFilteredItems();
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "all":
        return <Utensils className="h-4 w-4" />;
      case "fridge":
        return <Snowflake className="h-4 w-4" />;
      case "freezer":
        return <Snowflake className="h-4 w-4" />;
      case "pantry":
        return <Archive className="h-4 w-4" />;
      case "expiring":
        return <Clock className="h-4 w-4" />;
      default:
        return <Utensils className="h-4 w-4" />;
    }
  };

  return (
    <div className="pb-20">
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 pb-2 rounded-lg shadow-sm mb-4">
        <div className="flex justify-between items-center mb-4 px-4 pt-4">
          <h2 className="text-xl font-bold">My Pantry</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="text-kitchen-dark"
            >
              {viewMode === 'grid' ? 'List View' : 'Grid View'}
            </Button>
            <Button 
              onClick={onAddNew} 
              className="bg-kitchen-green hover:bg-kitchen-green/90"
              size="sm"
            >
              <Plus size={16} className="mr-1" /> Add Item
            </Button>
          </div>
        </div>
      
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="px-4">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="all" className="flex items-center justify-center gap-1">
              {getCategoryIcon("all")}
              All
              <Badge variant="outline" className="ml-1 bg-kitchen-cream">
                {countByCategory.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="fridge" className="flex items-center justify-center gap-1">
              {getCategoryIcon("fridge")}
              Fridge
              <Badge variant="outline" className="ml-1 bg-kitchen-cream">
                {countByCategory.fridge}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="freezer" className="flex items-center justify-center gap-1">
              {getCategoryIcon("freezer")}
              Freezer
              <Badge variant="outline" className="ml-1 bg-kitchen-cream">
                {countByCategory.freezer}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="pantry" className="flex items-center justify-center gap-1">
              {getCategoryIcon("pantry")}
              Pantry
              <Badge variant="outline" className="ml-1 bg-kitchen-cream">
                {countByCategory.pantry}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="expiring" className="flex items-center justify-center gap-1 text-kitchen-berry">
              {getCategoryIcon("expiring")}
              Use Soon
              <Badge variant="outline" className="ml-1 bg-kitchen-berry/10 text-kitchen-berry">
                {countByCategory.expiring}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-2'}`}>
        {filteredItems.length === 0 ? (
          <div className="col-span-full p-8 text-center text-gray-500 bg-white rounded-lg border border-muted">
            <p className="mb-4">No items found in this category.</p>
            <Button 
              onClick={onAddNew} 
              variant="outline"
              className="border-kitchen-green text-kitchen-green hover:bg-kitchen-green hover:text-white"
            >
              <Plus size={18} className="mr-1" /> Add Your First Item
            </Button>
          </div>
        ) : (
          filteredItems.map(item => (
            <div key={item.id} className={viewMode === 'grid' ? '' : 'w-full'}>
              <PantryItem
                item={item}
                onIncrement={onIncrement}
                onDecrement={onDecrement}
                onDelete={onDelete}
                viewMode={viewMode}
                customLists={customLists}
                onAddToList={onAddToList}
                isSelected={selectedItems.includes(item.id)}
                onToggleSelect={onToggleSelectItem}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PantryList;
