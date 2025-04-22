
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Camera, Barcode, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

type LoyaltyCard = {
  id: string;
  name: string;
  cardNumber: string;
  imageUrl?: string;
};

const LoyaltyCardsPage = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<LoyaltyCard[]>([
    {
      id: '1',
      name: 'Urban Point',
      cardNumber: '1234 5678 9012 3456',
      imageUrl: '/placeholder.svg'
    }
  ]);

  const [isAddingCard, setIsAddingCard] = useState(false);

  const handleScanBarcode = () => {
    // In a real app, this would activate the device camera with barcode scanning
    console.log('Scanning barcode...');
    setIsAddingCard(false);
    
    // Simulate adding a new card after scanning
    setTimeout(() => {
      const newCard = {
        id: Date.now().toString(),
        name: 'New Loyalty Card',
        cardNumber: Math.floor(Math.random() * 10000000000000000).toString()
      };
      
      setCards(prev => [...prev, newCard]);
    }, 1000);
  };

  const handleTakePhoto = () => {
    // In a real app, this would activate the device camera
    console.log('Taking photo...');
    setIsAddingCard(false);
    
    // Simulate adding a new card after taking photos
    setTimeout(() => {
      const newCard = {
        id: Date.now().toString(),
        name: 'Photo Card',
        cardNumber: Math.floor(Math.random() * 10000000000000000).toString(),
        imageUrl: '/placeholder.svg'
      };
      
      setCards(prev => [...prev, newCard]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-kitchen-cream kitchen-texture flex flex-col">
      <Header title="Loyalty Cards" showBack={true} onBack={() => navigate(-1)} showSettings={false} />
      
      <main className="flex-1 px-4 py-6 mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-heading text-kitchen-dark">My Cards</h2>
          
          <Dialog open={isAddingCard} onOpenChange={setIsAddingCard}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Plus />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Loyalty Card</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Button 
                  onClick={handleScanBarcode}
                  className="flex items-center gap-2"
                >
                  <Barcode className="w-5 h-5" />
                  Scan Barcode
                </Button>
                <Button 
                  onClick={handleTakePhoto}
                  className="flex items-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  Take Photo of Card
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="space-y-4">
          {cards.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">No loyalty cards yet</p>
              <Button 
                onClick={() => setIsAddingCard(true)}
                className="mt-4"
              >
                Add Your First Card
              </Button>
            </div>
          ) : (
            cards.map(card => (
              <div 
                key={card.id}
                className="rounded-lg border border-muted bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded overflow-hidden bg-muted flex items-center justify-center">
                    {card.imageUrl ? (
                      <img src={card.imageUrl} alt={card.name} className="h-full w-full object-cover" />
                    ) : (
                      <CreditCard className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{card.name}</h3>
                    <p className="text-sm text-muted-foreground">{card.cardNumber}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LoyaltyCardsPage;
