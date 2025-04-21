import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

export type KitchenStyle = 'Italian' | 'Asian' | 'Mediterranean' | 'Vegan' | 'Indian' | 'Mexican' | 'French' | 'Middle Eastern' | 'American' | 'Thai' | 'Japanese' | 'Korean' | 'All' | string;

interface KitchenStyleSelectorProps {
  selectedStyle: KitchenStyle;
  onSelect: (style: KitchenStyle) => void;
}

// For Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
let supabase = null;
try {
  if (supabaseUrl && supabaseAnonKey) {
    // Dynamically require to avoid SSR issues
    // @ts-ignore
    const { createClient } = require('@supabase/supabase-js');
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (err) {
  console.error("Error setting up Supabase in KitchenStyleSelector", err);
}

const predefinedStyles: KitchenStyle[] = [
  'All',
  'Italian',
  'Asian',
  'Mediterranean',
  'Vegan',
  'Indian',
  'Mexican',
  'French',
  'Middle Eastern',
  'American',
  'Thai',
  'Japanese',
  'Korean'
];

const KitchenStyleSelector: React.FC<KitchenStyleSelectorProps> = ({ 
  selectedStyle, 
  onSelect 
}) => {
  const [customStyle, setCustomStyle] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [dbKitchenStyles, setDbKitchenStyles] = useState<KitchenStyle[]>([]);
  const [loadingStyles, setLoadingStyles] = useState(false);

  useEffect(() => {
    const fetchKitchenStyles = async () => {
      if (!supabase) return;
      setLoadingStyles(true);
      try {
        const { data, error } = await supabase.from('kitchen_styles').select('name');
        if (data && Array.isArray(data)) {
          const dbStyles = data.map((row: any) => row.name).filter(Boolean);
          setDbKitchenStyles(dbStyles);
        }
        if (error) {
          console.error("Error fetching kitchen styles from DB:", error);
        }
      } catch (err) {
        console.error("KitchenStyleSelector - fetching DB styles:", err);
      }
      setLoadingStyles(false);
    };
    fetchKitchenStyles();
  }, []);

  // Merge without duplicates and keep "All" at start
  const uniqueStyles = Array.from(new Set(predefinedStyles.concat(dbKitchenStyles))).sort((a, b) => {
    if (a === "All") return -1;
    if (b === "All") return 1;
    return a.localeCompare(b);
  });

  const handleAddCustomStyle = () => {
    if (customStyle.trim()) {
      onSelect(customStyle.trim());
      setCustomStyle('');
      setShowCustomInput(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCustomStyle();
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-base font-medium mb-2 text-kitchen-dark">Kitchen Style</h3>
      <div className="flex flex-wrap gap-2 mb-3">
        {loadingStyles && (
          <Button variant="outline" disabled className="border-kitchen-green text-kitchen-green opacity-50">
            Loading...
          </Button>
        )}
        {uniqueStyles.map((style) => (
          <Button
            key={style}
            variant={selectedStyle === style ? "default" : "outline"}
            onClick={() => onSelect(style)}
            className={selectedStyle === style ? 
              "bg-kitchen-green hover:bg-kitchen-green/90" : 
              "border-kitchen-green text-kitchen-green hover:bg-kitchen-green hover:text-white"
            }
          >
            {style}
          </Button>
        ))}
        <Button
          variant="outline"
          onClick={() => setShowCustomInput(!showCustomInput)}
          className="border-kitchen-green text-kitchen-green hover:bg-kitchen-green hover:text-white"
        >
          <Plus className="h-4 w-4 mr-1" />
          Custom Style
        </Button>
      </div>
      
      {showCustomInput && (
        <div className="flex gap-2">
          <Input
            placeholder="Enter custom kitchen style"
            value={customStyle}
            onChange={(e) => setCustomStyle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button
            onClick={handleAddCustomStyle}
            disabled={!customStyle.trim()}
            className="bg-kitchen-green hover:bg-kitchen-green/90"
          >
            Add
          </Button>
        </div>
      )}
    </div>
  );
};

export default KitchenStyleSelector;
