
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ShoppingCart, FolderPlus, ListFilter } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PantryActionsProps {
  onAddNew: () => void;
  onSendToShopping: () => void;
  selectedItems: string[];
}

const PantryActions: React.FC<PantryActionsProps> = ({
  onAddNew,
  onSendToShopping,
  selectedItems = [],
}) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
      <Button 
        onClick={onAddNew} 
        className="bg-kitchen-green hover:bg-kitchen-green/90"
      >
        <Plus size={18} className="mr-1" /> Add Item
      </Button>
      <Button 
        variant="outline" 
        className="border-kitchen-green text-kitchen-green hover:bg-kitchen-green/10"
        onClick={onSendToShopping}
        disabled={selectedItems.length === 0}
      >
        <ShoppingCart size={18} className="mr-1" /> Send to Shopping List
      </Button>
      <Button
        variant="outline"
        className="ml-auto sm:ml-0"
        onClick={() => setShowFilters(true)}
      >
        <ListFilter size={18} className="mr-1" /> Advanced Filters
      </Button>
    </div>
  );
};

export default PantryActions;
