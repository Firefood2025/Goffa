
import { SpaceTemplateItem } from '@/types/space';

export const spaceTemplates: SpaceTemplateItem[] = [
  {
    id: 'kitchen',
    name: 'Kitchen',
    description: 'Organize your main kitchen space',
    icon: 'home',
    color: 'green',
    suggestedTasks: [
      'Clean refrigerator',
      'Organize pantry shelves',
      'Clean oven',
      'Wipe down countertops',
      'Clean microwave',
      'Sort kitchen utensils'
    ],
  },
  {
    id: 'home-office',
    name: 'Home Office',
    description: 'Manage your work space and supplies',
    icon: 'office-chair',
    color: 'wood',
    suggestedTasks: [
      'Organize desk drawers',
      'Sort documents',
      'Clean computer setup',
      'Stock office supplies',
      'File important papers',
      'Cable management'
    ],
  },
  {
    id: 'dining-room',
    name: 'Dining Room',
    description: 'Keep your dining area organized',
    icon: 'dining-table',
    color: 'stone',
    suggestedTasks: [
      'Polish dining table',
      'Clean dining chairs',
      'Organize table linens',
      'Sort tableware and utensils',
      'Dust china cabinet',
      'Clean light fixtures'
    ],
  },
  {
    id: 'laundry-room',
    name: 'Laundry Room',
    description: 'Manage laundry supplies and equipment',
    icon: 'laundry',
    color: 'berry',
    suggestedTasks: [
      'Organize detergents and supplies',
      'Clean washing machine',
      'Clean dryer lint trap',
      'Sort laundry baskets',
      'Clean behind machines',
      'Check hoses and connections'
    ],
  },
  {
    id: 'yacht',
    name: 'Yacht',
    description: 'Maintain your boat supplies and equipment',
    icon: 'yacht',
    color: 'yellow',
    suggestedTasks: [
      'Organize galley supplies',
      'Check safety equipment',
      'Inspect engine and systems',
      'Clean deck and surfaces',
      'Inventory water and food supplies',
      'Organize fishing equipment'
    ],
  },
  {
    id: 'backyard',
    name: 'Backyard',
    description: 'Maintain your outdoor space and garden',
    icon: 'tree',
    color: 'green',
    suggestedTasks: [
      'Organize garden tools',
      'Maintain lawn equipment',
      'Sort outdoor furniture',
      'Plan garden layout',
      'Check irrigation systems',
      'Organize outdoor storage'
    ],
  }
];
