
export type ChefCategory = 'breakfast' | 'lunch' | 'dinner' | 'dessert' | 'event' | 'all';
export type ChefStyle = 'Mexican' | 'Italian' | 'Healthy' | 'Mediterranean' | 'Asian' | 'Meal Prep' | 'Brunch' | 'all';

export interface Chef {
  id: string;
  name: string;
  image: string;
  rating: number;
  specialties: ChefCategory[];
  styles: ChefStyle[];
  hourlyRate: number;
  location: string;
  description: string;
  gallery: string[];
}
