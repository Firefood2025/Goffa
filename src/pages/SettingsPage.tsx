
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  CreditCard, 
  Users, 
  Share, 
  Mail
} from 'lucide-react';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleContactSupport = () => {
    toast({
      title: "Support request sent",
      description: "Our team will contact you shortly.",
    });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-kitchen-cream kitchen-texture flex flex-col">
      <Header title="Settings" showBack={true} onBack={() => navigate(-1)} showSettings={false} />
      
      <main className="flex-1 px-4 py-6 mb-16">
        <motion.div 
          className="space-y-6"
          initial="hidden"
          animate="show"
          variants={container}
        >
          <motion.h2 
            className="text-2xl font-bold font-heading text-kitchen-dark"
            variants={item}
          >
            Account Settings
          </motion.h2>
          
          <motion.div 
            className="space-y-4"
            variants={container}
          >
            <motion.div variants={item}>
              <Button 
                onClick={() => navigate('/profile')}
                variant="outline" 
                className="w-full flex justify-between items-center py-6 text-left hover:bg-kitchen-cream/50 hover:border-kitchen-wood/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-kitchen-wood/10 rounded-full">
                    <User className="text-kitchen-dark" />
                  </div>
                  <div>
                    <p className="font-medium text-kitchen-dark">Profile</p>
                    <p className="text-sm text-muted-foreground">Manage your personal information</p>
                  </div>
                </div>
                <span className="text-kitchen-wood">→</span>
              </Button>
            </motion.div>
            
            <motion.div variants={item}>
              <Button 
                onClick={() => navigate('/loyalty-cards')}
                variant="outline" 
                className="w-full flex justify-between items-center py-6 text-left hover:bg-kitchen-cream/50 hover:border-kitchen-wood/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-kitchen-wood/10 rounded-full">
                    <CreditCard className="text-kitchen-dark" />
                  </div>
                  <div>
                    <p className="font-medium text-kitchen-dark">Loyalty Cards</p>
                    <p className="text-sm text-muted-foreground">Manage your loyalty cards and vouchers</p>
                  </div>
                </div>
                <span className="text-kitchen-wood">→</span>
              </Button>
            </motion.div>
            
            <motion.div variants={item}>
              <Button 
                onClick={() => navigate('/family')}
                variant="outline" 
                className="w-full flex justify-between items-center py-6 text-left hover:bg-kitchen-cream/50 hover:border-kitchen-wood/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-kitchen-wood/10 rounded-full">
                    <Users className="text-kitchen-dark" />
                  </div>
                  <div>
                    <p className="font-medium text-kitchen-dark">Family Members</p>
                    <p className="text-sm text-muted-foreground">Manage your family circle and permissions</p>
                  </div>
                </div>
                <span className="text-kitchen-wood">→</span>
              </Button>
            </motion.div>
            
            <motion.div variants={item}>
              <Button 
                onClick={() => navigate('/refer')}
                variant="outline" 
                className="w-full flex justify-between items-center py-6 text-left hover:bg-kitchen-cream/50 hover:border-kitchen-wood/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-kitchen-wood/10 rounded-full">
                    <Share className="text-kitchen-dark" />
                  </div>
                  <div>
                    <p className="font-medium text-kitchen-dark">Recommend to Friends</p>
                    <p className="text-sm text-muted-foreground">Share and earn rewards</p>
                  </div>
                </div>
                <span className="text-kitchen-wood">→</span>
              </Button>
            </motion.div>
            
            <motion.div variants={item}>
              <Button 
                onClick={handleContactSupport}
                variant="outline" 
                className="w-full flex justify-between items-center py-6 text-left hover:bg-kitchen-cream/50 hover:border-kitchen-wood/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-kitchen-wood/10 rounded-full">
                    <Mail className="text-kitchen-dark" />
                  </div>
                  <div>
                    <p className="font-medium text-kitchen-dark">Contact Support</p>
                    <p className="text-sm text-muted-foreground">Get help with your account</p>
                  </div>
                </div>
                <span className="text-kitchen-wood">→</span>
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="pt-4"
            variants={item}
          >
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={() => {
                toast({
                  title: "Signed out successfully",
                  description: "You have been signed out of your account.",
                });
                setTimeout(() => navigate('/'), 1500);
              }}
            >
              Sign Out
            </Button>
          </motion.div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SettingsPage;
