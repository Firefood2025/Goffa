
import React from 'react';
import { 
  Home, 
  ChevronRight,
  Tablet,
  Utensils,
  Shirt,
  Ship,
  PalmtreeIcon,
  Building,
  LucideIcon,
  LucideProps 
} from 'lucide-react';

const icons: Record<string, LucideIcon> = {
  'home': Home,
  'office-chair': ChevronRight,
  'dining-table': Utensils,
  'laundry': Shirt,
  'yacht': Ship,
  'tree': PalmtreeIcon,
  'building': Building,
};

interface DynamicIconProps extends Omit<LucideProps, 'ref'> {
  name: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, ...props }) => {
  const IconComponent = icons[name] || Home;
  return <IconComponent {...props} />;
};
