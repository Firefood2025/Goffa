
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DynamicIcon } from './DynamicIcon';
import { SpaceTemplate, Space } from '@/types/space';
import { cn } from '@/lib/utils';
import { spaceTemplates } from '@/lib/space-templates';

interface CreateSpaceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSpace: (space: Omit<Space, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const CreateSpaceDialog: React.FC<CreateSpaceDialogProps> = ({
  isOpen,
  onClose,
  onCreateSpace,
}) => {
  const [activeTab, setActiveTab] = useState<'template' | 'custom'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<SpaceTemplate | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('home');
  const [selectedColor, setSelectedColor] = useState('green');
  
  const iconOptions = [
    { value: 'home', label: 'Home' },
    { value: 'office-chair', label: 'Office' },
    { value: 'dining-table', label: 'Dining' },
    { value: 'laundry', label: 'Laundry' },
    { value: 'yacht', label: 'Yacht' },
    { value: 'tree', label: 'Tree' },
    { value: 'building', label: 'Building' },
  ];
  
  const colorOptions = [
    { value: 'green', label: 'Green' },
    { value: 'wood', label: 'Wood' },
    { value: 'stone', label: 'Stone' },
    { value: 'berry', label: 'Berry' },
    { value: 'yellow', label: 'Yellow' },
  ];
  
  const handleTemplateSelect = (template: SpaceTemplate) => {
    setSelectedTemplate(template);
    setName(template.name);
    setDescription(template.description);
    setSelectedIcon(template.icon);
    setSelectedColor(template.color);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tasks = selectedTemplate 
      ? selectedTemplate.suggestedTasks.map((task, index) => ({
          id: `task-${Date.now()}-${index}`,
          name: task,
          completed: false,
        }))
      : [];
    
    onCreateSpace({
      name,
      description,
      icon: selectedIcon,
      color: selectedColor,
      template: selectedTemplate?.id || 'custom',
      tasks,
    });
    
    resetForm();
    onClose();
  };
  
  const resetForm = () => {
    setName('');
    setDescription('');
    setSelectedTemplate(null);
    setSelectedIcon('home');
    setSelectedColor('green');
    setActiveTab('template');
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Space</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="template">Use Template</TabsTrigger>
            <TabsTrigger value="custom">Custom Space</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit}>
            <TabsContent value="template" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {spaceTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={cn(
                      "p-3 border rounded-md cursor-pointer transition-all",
                      selectedTemplate?.id === template.id
                        ? "border-primary ring-2 ring-primary/20"
                        : "hover:border-primary/50"
                    )}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={cn("p-2 rounded-full", {
                        "bg-kitchen-green/10 text-kitchen-green": template.color === 'green',
                        "bg-kitchen-wood/10 text-kitchen-wood": template.color === 'wood',
                        "bg-kitchen-stone/10 text-kitchen-stone": template.color === 'stone',
                        "bg-kitchen-berry/10 text-kitchen-berry": template.color === 'berry',
                        "bg-kitchen-yellow/10 text-kitchen-yellow": template.color === 'yellow',
                      })}>
                        <DynamicIcon name={template.icon} size={20} />
                      </div>
                      <span className="font-medium">{template.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                ))}
              </div>
              
              {selectedTemplate && (
                <div className="space-y-4 pt-4 border-t">
                  <div>
                    <Label htmlFor="template-name">Space Name</Label>
                    <Input
                      id="template-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter space name"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="template-description">Description (Optional)</Label>
                    <Textarea
                      id="template-description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief description of this space"
                      className="resize-none"
                      rows={2}
                    />
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <Label>Icon</Label>
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {iconOptions.map((icon) => (
                          <div
                            key={icon.value}
                            className={cn(
                              "p-2 border rounded-md flex items-center justify-center cursor-pointer transition-all",
                              selectedIcon === icon.value
                                ? "border-primary bg-primary/5"
                                : "hover:border-primary/50"
                            )}
                            onClick={() => setSelectedIcon(icon.value)}
                          >
                            <DynamicIcon name={icon.value} size={20} />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <Label>Color</Label>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {colorOptions.map((color) => (
                          <div
                            key={color.value}
                            className={cn(
                              "w-full aspect-square rounded-md cursor-pointer transition-all",
                              {
                                "ring-2 ring-offset-2": selectedColor === color.value,
                                "bg-kitchen-green": color.value === 'green',
                                "bg-kitchen-wood": color.value === 'wood',
                                "bg-kitchen-stone": color.value === 'stone',
                                "bg-kitchen-berry": color.value === 'berry',
                                "bg-kitchen-yellow": color.value === 'yellow',
                              }
                            )}
                            onClick={() => setSelectedColor(color.value)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Included Tasks</Label>
                    <div className="mt-2 border rounded-md p-3 max-h-40 overflow-y-auto">
                      <ul className="space-y-2">
                        {selectedTemplate.suggestedTasks.map((task, index) => (
                          <li key={index} className="text-sm flex items-center">
                            <span className="w-2 h-2 rounded-full bg-kitchen-green mr-2"></span>
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="custom" className="space-y-4">
              <div>
                <Label htmlFor="custom-name">Space Name</Label>
                <Input
                  id="custom-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter space name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="custom-description">Description (Optional)</Label>
                <Textarea
                  id="custom-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of this space"
                  className="resize-none"
                  rows={3}
                />
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <Label>Icon</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {iconOptions.map((icon) => (
                      <div
                        key={icon.value}
                        className={cn(
                          "p-2 border rounded-md flex items-center justify-center cursor-pointer transition-all",
                          selectedIcon === icon.value
                            ? "border-primary bg-primary/5"
                            : "hover:border-primary/50"
                        )}
                        onClick={() => setSelectedIcon(icon.value)}
                      >
                        <DynamicIcon name={icon.value} size={20} />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex-1">
                  <Label>Color</Label>
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {colorOptions.map((color) => (
                      <div
                        key={color.value}
                        className={cn(
                          "w-full aspect-square rounded-md cursor-pointer transition-all",
                          {
                            "ring-2 ring-offset-2": selectedColor === color.value,
                            "bg-kitchen-green": color.value === 'green',
                            "bg-kitchen-wood": color.value === 'wood',
                            "bg-kitchen-stone": color.value === 'stone',
                            "bg-kitchen-berry": color.value === 'berry',
                            "bg-kitchen-yellow": color.value === 'yellow',
                          }
                        )}
                        onClick={() => setSelectedColor(color.value)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={(activeTab === 'template' && !selectedTemplate) || !name.trim()}
              >
                Create Space
              </Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSpaceDialog;
