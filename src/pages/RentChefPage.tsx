
import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { ChefCard } from "@/components/chef/ChefCard";
import { ChefFilter } from "@/components/chef/ChefFilter";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarIcon, Clock, DollarSign } from 'lucide-react';
import { ChefGallery } from '@/components/chef/ChefGallery';
import { useToast } from '@/hooks/use-toast';
import { ChefBookingForm } from '@/components/chef/ChefBookingForm';

export type ChefCategory = 'breakfast' | 'lunch' | 'dinner' | 'dessert' | 'event' | 'all';
export type ChefStyle = 'Mexican' | 'Italian' | 'Healthy' | 'Mediterranean' | 'Asian' | 'Meal Prep' | 'Brunch' | 'all';

const RentChefPage = () => {
  const [selectedChef, setSelectedChef] = useState<Chef | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ChefCategory>('all');
  const [selectedStyle, setSelectedStyle] = useState<ChefStyle>('all');
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>("12:00");
  const [showGallery, setShowGallery] = useState(false);
  const { toast } = useToast();

  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", "17:00", 
    "18:00", "19:00", "20:00", "21:00"
  ];

  const handleBooking = (chef: Chef) => {
    if (!date || !time) {
      toast({
        title: "Booking Failed",
        description: "Please select a date and time",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedChef(chef);
  };

  const handleBookingConfirm = (groceries: boolean) => {
    const total = selectedChef ? (groceries ? 
      selectedChef.hourlyRate + 50 : selectedChef.hourlyRate) : 0;
      
    toast({
      title: "Booking Confirmed!",
      description: `${selectedChef?.name} has been booked for ${format(date!, 'PPP')} at ${time}. Total: $${total}`,
    });
    
    setSelectedChef(null);
  };

  const filteredChefs = CHEFS.filter(chef => 
    (selectedCategory === 'all' || chef.specialties.includes(selectedCategory)) &&
    (selectedStyle === 'all' || chef.styles.includes(selectedStyle))
  );

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Rent a Chef</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <h2 className="text-2xl font-bold">Available Chefs</h2>
            </CardHeader>
            <CardContent>
              <ChefFilter 
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedStyle={selectedStyle}
                onStyleChange={setSelectedStyle}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {filteredChefs.map((chef) => (
                  <ChefCard
                    key={chef.id}
                    chef={chef}
                    onBookNow={() => handleBooking(chef)}
                    onViewGallery={() => {
                      setSelectedChef(chef);
                      setShowGallery(true);
                    }}
                  />
                ))}
                {filteredChefs.length === 0 && (
                  <p className="text-center col-span-2 py-10 text-gray-500">
                    No chefs available with the selected filters.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="sticky top-24">
            <CardHeader className="pb-2">
              <h2 className="text-xl font-semibold">Book a Chef</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Select Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        className="pointer-events-auto"
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Select Time
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot}
                        variant={time === slot ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTime(slot)}
                        className={time === slot ? "bg-kitchen-green hover:bg-kitchen-green/90" : ""}
                      >
                        <Clock className="mr-1 h-4 w-4" />
                        {slot}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4">
                  <h3 className="font-medium mb-2">Quick Booking Tips:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Book at least 48 hours in advance</li>
                    <li>• Chefs bring their own tools</li>
                    <li>• You can add groceries to the booking</li>
                    <li>• Prices are per hour</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {selectedChef && showGallery && (
        <ChefGallery 
          chef={selectedChef} 
          onClose={() => setShowGallery(false)} 
        />
      )}
      
      {selectedChef && !showGallery && (
        <ChefBookingForm
          chef={selectedChef}
          bookingDate={date}
          bookingTime={time}
          onConfirm={handleBookingConfirm}
          onCancel={() => setSelectedChef(null)}
        />
      )}
    </div>
  );
};

// Mock data for chefs
export interface Chef {
  id: string;
  name: string;
  image: string;
  rating: number;
  specialties: ChefCategory[];
  styles: ChefStyle[];
  hourlyRate: number;
  location: string;
  description: string;
  gallery: string[];
}

const CHEFS: Chef[] = [
  {
    id: '1',
    name: 'Carla Rodriguez',
    image: 'https://source.unsplash.com/random/300x300/?chef,woman',
    rating: 4.8,
    specialties: ['breakfast', 'lunch', 'dinner'],
    styles: ['Mexican', 'Mediterranean'],
    hourlyRate: 75,
    location: 'New York, NY',
    description: 'Experienced chef specializing in Mexican cuisine with a modern twist. I love creating authentic dishes that tell a story.',
    gallery: [
      'https://source.unsplash.com/random/600x400/?mexican,food,1',
      'https://source.unsplash.com/random/600x400/?mexican,food,2',
      'https://source.unsplash.com/random/600x400/?mexican,food,3',
      'https://source.unsplash.com/random/600x400/?mexican,food,4'
    ]
  },
  {
    id: '2',
    name: 'Jenny Chang',
    image: 'https://source.unsplash.com/random/300x300/?chef,asian,woman',
    rating: 4.9,
    specialties: ['dinner', 'dessert'],
    styles: ['Asian', 'Healthy'],
    hourlyRate: 85,
    location: 'Los Angeles, CA',
    description: 'Specialized in fusion Asian cuisine with a healthy focus. My desserts combine Eastern and Western techniques for unique flavors.',
    gallery: [
      'https://source.unsplash.com/random/600x400/?asian,food,1',
      'https://source.unsplash.com/random/600x400/?asian,food,2',
      'https://source.unsplash.com/random/600x400/?dessert,1',
      'https://source.unsplash.com/random/600x400/?dessert,2'
    ]
  },
  {
    id: '3',
    name: 'Marco Rossi',
    image: 'https://source.unsplash.com/random/300x300/?chef,man',
    rating: 4.7,
    specialties: ['lunch', 'dinner'],
    styles: ['Italian', 'Mediterranean'],
    hourlyRate: 80,
    location: 'Chicago, IL',
    description: 'Italian cuisine expert with 15+ years of experience. I bring authentic Italian flavors directly to your home.',
    gallery: [
      'https://source.unsplash.com/random/600x400/?italian,food,1',
      'https://source.unsplash.com/random/600x400/?italian,food,2',
      'https://source.unsplash.com/random/600x400/?italian,food,3',
      'https://source.unsplash.com/random/600x400/?italian,food,4'
    ]
  },
  {
    id: '4',
    name: 'Sofia Patel',
    image: 'https://source.unsplash.com/random/300x300/?chef,indian,woman',
    rating: 4.9,
    specialties: ['breakfast', 'lunch', 'event'],
    styles: ['Brunch', 'Meal Prep'],
    hourlyRate: 70,
    location: 'Boston, MA',
    description: 'I specialize in brunch and meal preparation services. Perfect for busy families who want healthy, pre-planned meals.',
    gallery: [
      'https://source.unsplash.com/random/600x400/?brunch,1',
      'https://source.unsplash.com/random/600x400/?brunch,2',
      'https://source.unsplash.com/random/600x400/?meal,prep,1',
      'https://source.unsplash.com/random/600x400/?meal,prep,2'
    ]
  },
  {
    id: '5',
    name: 'David Kim',
    image: 'https://source.unsplash.com/random/300x300/?chef,korean,man',
    rating: 4.6,
    specialties: ['dinner', 'event'],
    styles: ['Asian', 'Healthy'],
    hourlyRate: 90,
    location: 'Seattle, WA',
    description: 'Experienced in catering events and private dinners. I create memorable dining experiences with a focus on healthy ingredients.',
    gallery: [
      'https://source.unsplash.com/random/600x400/?korean,food,1',
      'https://source.unsplash.com/random/600x400/?korean,food,2',
      'https://source.unsplash.com/random/600x400/?event,catering,1',
      'https://source.unsplash.com/random/600x400/?event,catering,2'
    ]
  },
  {
    id: '6',
    name: 'Emma Wilson',
    image: 'https://source.unsplash.com/random/300x300/?pastry,chef,woman',
    rating: 5.0,
    specialties: ['dessert', 'breakfast'],
    styles: ['Brunch', 'Italian'],
    hourlyRate: 65,
    location: 'Denver, CO',
    description: 'Pastry chef specialized in Italian desserts and breakfast pastries. I bring the taste of European bakeries to your home.',
    gallery: [
      'https://source.unsplash.com/random/600x400/?pastry,1',
      'https://source.unsplash.com/random/600x400/?pastry,2',
      'https://source.unsplash.com/random/600x400/?italian,dessert,1',
      'https://source.unsplash.com/random/600x400/?italian,dessert,2'
    ]
  }
];

export default RentChefPage;
