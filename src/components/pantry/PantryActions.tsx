
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ShoppingCart, FolderPlus, ListFilter } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
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
import { Badge } from '@/components/ui/badge';

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
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center sm:justify-start">
      <Button 
        onClick={onAddNew} 
        className="bg-kitchen-green hover:bg-kitchen-green/90"
        size={isMobile ? "sm" : "default"}
      >
        <Plus size={isMobile ? 16 : 18} className="mr-1" /> Add Item
      </Button>
      
      <Button 
        variant="outline" 
        className="border-kitchen-green text-kitchen-green hover:bg-kitchen-green/10"
        onClick={onSendToShopping}
        disabled={selectedItems.length === 0}
        size={isMobile ? "sm" : "default"}
      >
        <ShoppingCart size={isMobile ? 16 : 18} className="mr-1" /> 
        <span className="hidden xs:inline">Send to Shopping List</span>
        <span className="xs:hidden">To Shopping</span>
        {selectedItems.length > 0 && (
          <Badge variant="outline" className="ml-1 bg-kitchen-green/20 border-kitchen-green">
            {selectedItems.length}
          </Badge>
        )}
      </Button>
      
      <Button
        variant="outline"
        className="ml-auto sm:ml-0"
        onClick={() => setShowFilters(true)}
        size={isMobile ? "sm" : "default"}
      >
        <ListFilter size={isMobile ? 16 : 18} className="mr-1" /> 
        <span className="hidden xs:inline">Advanced Filters</span>
        <span className="xs:hidden">Filters</span>
      </Button>
    </div>
  );
};

export default PantryActions;
