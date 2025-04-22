
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  CreditCard, 
  Family, 
  Share, 
  Mail
} from 'lucide-react';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

const SettingsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-kitchen-cream kitchen-texture flex flex-col">
      <Header title="Settings" showBack={true} onBack={() => navigate(-1)} showSettings={false} />
      
      <main className="flex-1 px-4 py-6 mb-16">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold font-heading text-kitchen-dark">Account Settings</h2>
          
          <div className="space-y-4">
            <Button 
              onClick={() => navigate('/profile')}
              variant="outline" 
              className="w-full flex justify-between items-center py-6 text-left"
            >
              <div className="flex items-center gap-3">
                <User className="text-kitchen-dark" />
                <div>
                  <p className="font-medium text-kitchen-dark">Profile</p>
                  <p className="text-sm text-muted-foreground">Manage your personal information</p>
                </div>
              </div>
              <span>→</span>
            </Button>
            
            <Button 
              onClick={() => navigate('/loyalty-cards')}
              variant="outline" 
              className="w-full flex justify-between items-center py-6 text-left"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="text-kitchen-dark" />
                <div>
                  <p className="font-medium text-kitchen-dark">Loyalty Cards</p>
                  <p className="text-sm text-muted-foreground">Manage your loyalty cards and vouchers</p>
                </div>
              </div>
              <span>→</span>
            </Button>
            
            <Button 
              onClick={() => navigate('/family')}
              variant="outline" 
              className="w-full flex justify-between items-center py-6 text-left"
            >
              <div className="flex items-center gap-3">
                <Family className="text-kitchen-dark" />
                <div>
                  <p className="font-medium text-kitchen-dark">Family Members</p>
                  <p className="text-sm text-muted-foreground">Manage your family circle and permissions</p>
                </div>
              </div>
              <span>→</span>
            </Button>
            
            <Button 
              onClick={() => navigate('/refer')}
              variant="outline" 
              className="w-full flex justify-between items-center py-6 text-left"
            >
              <div className="flex items-center gap-3">
                <Share className="text-kitchen-dark" />
                <div>
                  <p className="font-medium text-kitchen-dark">Recommend to Friends</p>
                  <p className="text-sm text-muted-foreground">Share and earn rewards</p>
                </div>
              </div>
              <span>→</span>
            </Button>
            
            <Button 
              onClick={() => {/* Handle support/contact */}}
              variant="outline" 
              className="w-full flex justify-between items-center py-6 text-left"
            >
              <div className="flex items-center gap-3">
                <Mail className="text-kitchen-dark" />
                <div>
                  <p className="font-medium text-kitchen-dark">Contact Support</p>
                  <p className="text-sm text-muted-foreground">Get help with your account</p>
                </div>
              </div>
              <span>→</span>
            </Button>
          </div>
          
          <div className="pt-4">
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={() => {/* Handle logout */}}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SettingsPage;
