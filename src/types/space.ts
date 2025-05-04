
import { LucideIcon } from "lucide-react";

export type SpaceTemplate = 
  | 'kitchen'
  | 'home-office' 
  | 'dining-room' 
  | 'laundry-room'
  | 'yacht'
  | 'backyard'
  | 'custom';

export interface SpaceTask {
  id: string;
  name: string;
  completed: boolean;
  dueDate?: Date;
}

export interface Space {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  template: SpaceTemplate;
  tasks: SpaceTask[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SpaceTemplate {
  id: SpaceTemplate;
  name: string;
  description: string;
  icon: string;
  color: string;
  suggestedTasks: string[];
}
