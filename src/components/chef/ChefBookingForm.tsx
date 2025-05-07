
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Chef } from '@/types/chef';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { Calendar, Clock, DollarSign } from 'lucide-react';

interface ChefBookingFormProps {
  chef: Chef;
  bookingDate?: Date;
  bookingTime?: string;
  onConfirm: (includeGroceries: boolean) => void;
  onCancel: () => void;
}

export const ChefBookingForm: React.FC<ChefBookingFormProps> = ({ 
  chef, 
  bookingDate, 
  bookingTime, 
  onConfirm, 
  onCancel 
}) => {
  const [includeGroceries, setIncludeGroceries] = useState(false);
  const groceriesFee = 50;
  const total = chef.hourlyRate + (includeGroceries ? groceriesFee : 0);
  
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book {chef.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="flex items-center gap-4">
            <img 
              src={chef.image} 
              alt={chef.name} 
              className="w-16 h-16 rounded-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "https://images.unsplash.com/photo-1556911073-38141963c9e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
              }}
            />
            <div>
              <h3 className="font-semibold">{chef.name}</h3>
              <p className="text-sm text-muted-foreground">{chef.location}</p>
            </div>
          </div>
          
          <Card className="p-4 bg-muted/50">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-kitchen-green" />
                <span>
                  {bookingDate ? format(bookingDate, 'PPP') : 'Date not selected'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-kitchen-green" />
                <span>{bookingTime || 'Time not selected'}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-kitchen-green" />
                <span>${chef.hourlyRate}/hour</span>
              </div>
            </div>
          </Card>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="add-groceries"
              checked={includeGroceries}
              onCheckedChange={setIncludeGroceries}
            />
            <Label htmlFor="add-groceries">Include groceries (+${groceriesFee})</Label>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>${total}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              This is an estimated cost for one hour. Final price may vary based on duration.
            </p>
          </div>
          
          <div className="flex justify-between gap-2 pt-2">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={() => onConfirm(includeGroceries)} 
              className="flex-1 bg-kitchen-green hover:bg-kitchen-green/90"
            >
              Confirm Booking
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
