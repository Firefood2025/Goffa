
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FloatingGrabAndGoButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate('/grab-and-go')}
      className="fixed bottom-20 right-4 rounded-full w-14 h-14 bg-kitchen-green shadow-lg hover:bg-kitchen-green/90 hover:scale-105 hover:shadow-xl transition-all duration-300 z-50"
      size="icon"
      aria-label="Enter Grab & Go mode"
    >
      <ShoppingBag className="w-6 h-6 text-white" />
    </Button>
  );
};

export default FloatingGrabAndGoButton;
