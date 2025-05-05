
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Camera } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

type ProfileFormValues = {
  name: string;
  email: string;
  phone: string;
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const form = useForm<ProfileFormValues>({
    defaultValues: {
      name: 'Guest User',
      email: 'user@example.com',
      phone: '+971 50 123 4567',
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      console.log(data);
      // Save profile data to database or local storage
      setIsSaving(false);
      setIsEditing(false);
      setSaveSuccess(true);
      
      // Show success message
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved successfully.",
      });
      
      // Reset success animation after 2 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 2000);
    }, 1500);
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
      <Header title="My Profile" showBack={true} onBack={() => navigate(-1)} showSettings={false} />
      
      <main className="flex-1 px-4 py-6 mb-16">
        <motion.div
          initial="hidden"
          animate="show"
          variants={container}
        >
          <motion.div 
            className="flex flex-col items-center mb-6"
            variants={item}
          >
            <div className="relative">
              <Avatar className="w-24 h-24 mb-4 border-2 border-kitchen-wood">
                <AvatarImage src="" />
                <AvatarFallback className="bg-kitchen-wood text-white text-xl">
                  {form.getValues().name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <Button 
                variant="outline" 
                size="icon"
                className="absolute bottom-3 right-0 rounded-full bg-white shadow-md hover:bg-gray-100"
                onClick={() => {
                  toast({
                    title: "Feature coming soon",
                    description: "Photo upload will be available in the next update.",
                  });
                }}
              >
                <Camera size={16} />
              </Button>
            </div>
            
            <motion.p
              className="text-sm text-muted-foreground mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Update your personal information
            </motion.p>
          </motion.div>
          
          <Form {...form}>
            <motion.form 
              onSubmit={form.handleSubmit(onSubmit)} 
              className="space-y-6"
              variants={container}
            >
              <motion.div variants={item}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          readOnly={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </motion.div>
              
              <motion.div variants={item}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          readOnly={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </motion.div>
              
              <motion.div variants={item}>
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          readOnly={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </motion.div>
              
              <motion.div 
                className="pt-4 flex justify-end"
                variants={item}
              >
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : saveSuccess ? (
                        <>
                          <Check size={18} /> Saved
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </div>
                ) : (
                  <Button 
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="bg-kitchen-wood hover:bg-kitchen-wood/90"
                  >
                    Edit Profile
                  </Button>
                )}
              </motion.div>
            </motion.form>
          </Form>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;
