
import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { ChefCard } from "@/components/chef/ChefCard";
import { ChefFilter } from "@/components/chef/ChefFilter";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarIcon, Clock, DollarSign, ArrowLeft } from 'lucide-react';
import { ChefGallery } from '@/components/chef/ChefGallery';
import { useToast } from '@/hooks/use-toast';
import { ChefBookingForm } from '@/components/chef/ChefBookingForm';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';

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
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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

  const handleBack = () => {
    navigate('/');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="min-h-screen bg-kitchen-cream flex flex-col">
      <Header showBack onBack={handleBack} />
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-6 mb-16 flex-1"
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="relative py-8 sm:py-12 mb-6 sm:mb-8 bg-kitchen-green/90 rounded-lg shadow-lg overflow-hidden"
        >
          <div className="absolute inset-0 opacity-20">
            <img 
              src="https://images.unsplash.com/photo-1556911073-38141963c9e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
              alt="Chef background"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative text-center text-white px-4">
            <h1 className="text-3xl md:text-5xl font-bold mb-2 sm:mb-4">Rent a Chef</h1>
            <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto">
              Bring restaurant-quality dining to your home with our professional chefs
            </p>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2"
          >
            <Card className="mb-6 shadow-md">
              <CardHeader className="pb-2">
                <h2 className="text-xl sm:text-2xl font-bold">Available Chefs</h2>
              </CardHeader>
              <CardContent>
                <ChefFilter 
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  selectedStyle={selectedStyle}
                  onStyleChange={setSelectedStyle}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  {filteredChefs.length === 0 ? (
                    <motion.p 
                      variants={itemVariants}
                      className="text-center col-span-1 sm:col-span-2 py-10 text-gray-500"
                    >
                      No chefs available with the selected filters.
                    </motion.p>
                  ) : (
                    filteredChefs.map((chef) => (
                      <motion.div
                        key={chef.id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ChefCard
                          chef={chef}
                          onBookNow={() => handleBooking(chef)}
                          onViewGallery={() => {
                            setSelectedChef(chef);
                            setShowGallery(true);
                          }}
                        />
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="order-first lg:order-none mb-6 lg:mb-0"
          >
            <Card className="sticky top-24 shadow-md">
              <CardHeader className="pb-2 bg-muted/30">
                <h2 className="text-lg sm:text-xl font-semibold">Book a Chef</h2>
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
                    <div className={isMobile ? "grid grid-cols-4 gap-2" : "grid grid-cols-3 gap-2"}>
                      {timeSlots.map((slot) => (
                        <Button
                          key={slot}
                          variant={time === slot ? "default" : "outline"}
                          size="sm"
                          onClick={() => setTime(slot)}
                          className={`
                            transition-all duration-200 
                            ${time === slot ? "bg-kitchen-green hover:bg-kitchen-green/90 scale-105" : ""}
                          `}
                        >
                          {isMobile ? slot : (
                            <>
                              <Clock className="mr-1 h-4 w-4" />
                              {slot}
                            </>
                          )}
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
          </motion.div>
        </div>
      </motion.div>

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

      <Footer />
    </div>
  );
};

// Mock data for chefs with better images and fixed URLs
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

// Updated CHEFS array with fixed and more reliable image URLs
export const CHEFS: Chef[] = [
  {
    id: '1',
    name: 'Carla Rodriguez',
    image: 'https://images.unsplash.com/photo-1583394550880-082575469405?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    specialties: ['breakfast', 'lunch', 'dinner'],
    styles: ['Mexican', 'Mediterranean'],
    hourlyRate: 75,
    location: 'New York, NY',
    description: 'Experienced chef specializing in Mexican cuisine with a modern twist. I love creating authentic dishes that tell a story.',
    gallery: [
      'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1551504734-5ee1c4a3479c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    id: '2',
    name: 'Jenny Chang',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    specialties: ['dinner', 'dessert'],
    styles: ['Asian', 'Healthy'],
    hourlyRate: 85,
    location: 'Los Angeles, CA',
    description: 'Specialized in fusion Asian cuisine with a healthy focus. My desserts combine Eastern and Western techniques for unique flavors.',
    gallery: [
      'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1563245738-2e66f2ed75a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1574484184081-afea8a62f9c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    id: '3',
    name: 'Marco Rossi',
    image: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    specialties: ['lunch', 'dinner'],
    styles: ['Italian', 'Mediterranean'],
    hourlyRate: 80,
    location: 'Chicago, IL',
    description: 'Italian cuisine expert with 15+ years of experience. I bring authentic Italian flavors directly to your home.',
    gallery: [
      'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1598866594230-a7c12756260f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    id: '4',
    name: 'Sofia Patel',
    image: 'https://images.unsplash.com/photo-1556911073-38141963c9e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    specialties: ['breakfast', 'lunch', 'event'],
    styles: ['Brunch', 'Meal Prep'],
    hourlyRate: 70,
    location: 'Boston, MA',
    description: 'I specialize in brunch and meal preparation services. Perfect for busy families who want healthy, pre-planned meals.',
    gallery: [
      'https://images.unsplash.com/photo-1590368755807-9b6a24eecc72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    id: '5',
    name: 'David Kim',
    image: 'https://images.unsplash.com/photo-1563991655280-cb95c90ca2fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    specialties: ['dinner', 'event'],
    styles: ['Asian', 'Healthy'],
    hourlyRate: 90,
    location: 'Seattle, WA',
    description: 'Experienced in catering events and private dinners. I create memorable dining experiences with a focus on healthy ingredients.',
    gallery: [
      'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1557872943-16a5ac26437e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1529042410759-befb1204b468?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    id: '6',
    name: 'Emma Wilson',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    specialties: ['dessert', 'breakfast'],
    styles: ['Brunch', 'Italian'],
    hourlyRate: 65,
    location: 'Denver, CO',
    description: 'Pastry chef specialized in Italian desserts and breakfast pastries. I bring the taste of European bakeries to your home.',
    gallery: [
      'https://images.unsplash.com/photo-1587314168485-3236d6710814?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1546554137-f86b9593a222?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1579372786545-666a77c4f321?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1619743358116-050db12c2fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    ]
  }
];

export default RentChefPage;
