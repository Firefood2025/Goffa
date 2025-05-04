
import { LucideIcon } from "lucide-react";

export type SpaceTemplateType = 
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
  notes?: string;
  assignee?: string;
}

export interface Space {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  template: SpaceTemplateType;
  tasks: SpaceTask[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SpaceTemplateItem {
  id: SpaceTemplateType;
  name: string;
  description: string;
  icon: string;
  color: string;
  suggestedTasks: string[];
}
