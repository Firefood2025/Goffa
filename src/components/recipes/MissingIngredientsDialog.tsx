
import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface MissingIngredientsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  missingIngredients: string[];
  selectedIngredients: string[];
  setSelectedIngredients: (ingredients: string[]) => void;
  onAddToList: () => void;
}

const MissingIngredientsDialog: React.FC<MissingIngredientsDialogProps> = ({
  open,
  onOpenChange,
  missingIngredients,
  selectedIngredients,
  setSelectedIngredients,
  onAddToList,
}) => {

  const handleToggle = (ingredient: string) => {
    setSelectedIngredients(
      selectedIngredients.includes(ingredient)
        ? selectedIngredients.filter(i => i !== ingredient)
        : [...selectedIngredients, ingredient]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Missing Ingredients</DialogTitle>
          <DialogDescription>
            Would you like to add these items to your shopping list?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {missingIngredients.map((ingredient, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <Checkbox
                id={`ing-${index}`}
                checked={selectedIngredients.includes(ingredient)}
                onCheckedChange={() => handleToggle(ingredient)}
              />
              <label htmlFor={`ing-${index}`}>{ingredient}</label>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onAddToList}>Add to Shopping List</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MissingIngredientsDialog;
