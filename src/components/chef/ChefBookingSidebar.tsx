
import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CalendarIcon, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChefBookingSidebarProps {
  date?: Date;
  setDate: (date: Date | undefined) => void;
  time: string;
  setTime: (time: string) => void;
}

const ChefBookingSidebar: React.FC<ChefBookingSidebarProps> = ({
  date,
  setDate,
  time,
  setTime
}) => {
  const isMobile = useIsMobile();

  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", "17:00", 
    "18:00", "19:00", "20:00", "21:00"
  ];

  return (
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
  );
};

export default ChefBookingSidebar;
