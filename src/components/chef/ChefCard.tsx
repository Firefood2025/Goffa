
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, MapPin, Star, Utensils } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Chef } from "@/pages/RentChefPage";

interface ChefCardProps {
  chef: Chef;
  onBookNow: () => void;
  onViewGallery: () => void;
}

export const ChefCard: React.FC<ChefCardProps> = ({ chef, onBookNow, onViewGallery }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={chef.image} 
          alt={chef.name} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-white text-kitchen-dark font-medium flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {chef.rating.toFixed(1)}
          </Badge>
        </div>
      </div>
      
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold">{chef.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {chef.location}
            </div>
          </div>
          <div className="flex items-center font-bold text-kitchen-green">
            <DollarSign className="h-4 w-4" />
            {chef.hourlyRate}/hr
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm mb-4 line-clamp-2">{chef.description}</p>
        <div className="space-y-3">
          <div>
            <span className="text-xs text-muted-foreground block mb-1">Specialties</span>
            <div className="flex flex-wrap gap-1">
              {chef.specialties.map((specialty) => (
                <Badge key={specialty} variant="outline" className="capitalize text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <span className="text-xs text-muted-foreground block mb-1">Styles</span>
            <div className="flex flex-wrap gap-1">
              {chef.styles.map((style) => (
                <Badge key={style} variant="secondary" className="capitalize text-xs">
                  {style}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4 flex justify-between gap-2">
        <Button variant="outline" className="flex-1" onClick={onViewGallery}>
          <Utensils className="h-4 w-4 mr-2" />
          View Gallery
        </Button>
        <Button className="flex-1 bg-kitchen-green hover:bg-kitchen-green/90" onClick={onBookNow}>
          <Calendar className="h-4 w-4 mr-2" />
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
};
