
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface ShoppingListLayoutProps {
  children: React.ReactNode;
  title: string;
  onBack: () => void;
}

const ShoppingListLayout: React.FC<ShoppingListLayoutProps> = ({ 
  children, 
  title,
  onBack 
}) => {
  return (
    <div className="min-h-screen bg-kitchen-cream flex flex-col">
      <Header 
        title={title} 
        showSettings={false} 
        showBack={true} 
        onBack={onBack} 
      />
      
      <main className="flex-1 px-4 py-6">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default ShoppingListLayout;
