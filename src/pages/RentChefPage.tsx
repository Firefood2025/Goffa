
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ChefGallery } from '@/components/chef/ChefGallery';
import { ChefBookingForm } from '@/components/chef/ChefBookingForm';
import ChefPageHero from '@/components/chef/ChefPageHero';
import ChefBookingSidebar from '@/components/chef/ChefBookingSidebar';
import ChefList from '@/components/chef/ChefList';
import { Chef, ChefCategory, ChefStyle } from '@/types/chef';
import { CHEFS } from '@/data/chefData';

const RentChefPage = () => {
  const [selectedChef, setSelectedChef] = useState<Chef | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ChefCategory>('all');
  const [selectedStyle, setSelectedStyle] = useState<ChefStyle>('all');
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>("12:00");
  const [showGallery, setShowGallery] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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
      description: `${selectedChef?.name} has been booked for ${date!.toLocaleDateString()} at ${time}. Total: $${total}`,
    });
    
    setSelectedChef(null);
  };

  const handleBack = () => {
    navigate('/');
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
        <ChefPageHero 
          title="Rent a Chef"
          subtitle="Bring restaurant-quality dining to your home with our professional chefs"
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          <ChefList
            chefs={CHEFS}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedStyle={selectedStyle}
            setSelectedStyle={setSelectedStyle}
            onBookNow={handleBooking}
            onViewGallery={(chef) => {
              setSelectedChef(chef);
              setShowGallery(true);
            }}
          />
          
          <ChefBookingSidebar
            date={date}
            setDate={setDate}
            time={time}
            setTime={setTime}
          />
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

export default RentChefPage;
