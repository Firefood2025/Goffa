
import React from 'react';
import { 
  Home, 
  OfficeChair, 
  DiningTable, 
  Laundry, 
  Yacht, 
  Tree,
  Building,
  LucideIcon,
  LucideProps 
} from 'lucide-react';

const icons: Record<string, LucideIcon> = {
  'home': Home,
  'office-chair': OfficeChair,
  'dining-table': DiningTable,
  'laundry': Laundry,
  'yacht': Yacht,
  'tree': Tree,
  'building': Building,
};

interface DynamicIconProps extends Omit<LucideProps, 'ref'> {
  name: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, ...props }) => {
  const IconComponent = icons[name] || Home;
  return <IconComponent {...props} />;
};
