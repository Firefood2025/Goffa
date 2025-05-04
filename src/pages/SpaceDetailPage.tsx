
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DynamicIcon } from '@/components/spaces/DynamicIcon';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useSpaces } from '@/hooks/use-spaces';
import { SpaceTask } from '@/types/space';

const SpaceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSpaceById, updateSpace } = useSpaces();
  const space = getSpaceById(id || '');
  
  const [newTaskName, setNewTaskName] = useState('');
  
  useEffect(() => {
    if (!space) {
      navigate('/spaces');
    }
  }, [space, navigate]);

  if (!space) {
    return null;
  }

  const { name, description, icon, color, tasks } = space;
  
  const handleToggleTask = (taskId: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    
    updateSpace(space.id, { tasks: updatedTasks });
  };
  
  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    updateSpace(space.id, { tasks: updatedTasks });
  };
  
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTaskName.trim()) return;
    
    const newTask: SpaceTask = {
      id: `task-${Date.now()}`,
      name: newTaskName,
      completed: false,
    };
    
    updateSpace(space.id, { tasks: [...tasks, newTask] });
    setNewTaskName('');
  };
  
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  return (
    <div className="min-h-screen bg-kitchen-cream kitchen-texture flex flex-col">
      <Header showBack onBack={() => navigate('/spaces')} title={name} />
      
      <main className="flex-1 px-4 py-6 mb-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center">
            <div className={cn("p-3 rounded-full mr-3", {
              "bg-kitchen-green/10 text-kitchen-green": color === 'green',
              "bg-kitchen-wood/10 text-kitchen-wood": color === 'wood',
              "bg-kitchen-stone/10 text-kitchen-stone": color === 'stone',
              "bg-kitchen-berry/10 text-kitchen-berry": color === 'berry',
              "bg-kitchen-yellow/10 text-kitchen-yellow": color === 'yellow',
            })}>
              <DynamicIcon name={icon} size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-heading text-kitchen-dark">{name}</h1>
              {description && <p className="text-muted-foreground">{description}</p>}
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{completedTasks}/{totalTasks} tasks completed</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={cn("h-full rounded-full", {
                  "bg-kitchen-green": color === 'green',
                  "bg-kitchen-wood": color === 'wood',
                  "bg-kitchen-stone": color === 'stone',
                  "bg-kitchen-berry": color === 'berry',
                  "bg-kitchen-yellow": color === 'yellow',
                })}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddTask} className="flex space-x-2 mb-4">
                <Input
                  placeholder="Add a new task..."
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </form>
              
              {tasks.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  No tasks yet. Add your first task above.
                </div>
              ) : (
                <div className="space-y-2">
                  {tasks.map((task) => (
                    <div 
                      key={task.id}
                      className="flex items-center justify-between p-3 border rounded-md bg-white"
                    >
                      <div 
                        className="flex items-center cursor-pointer flex-1"
                        onClick={() => handleToggleTask(task.id)}
                      >
                        <div className={cn(
                          "w-5 h-5 flex items-center justify-center rounded border mr-3",
                          task.completed ? cn({
                            "bg-kitchen-green border-kitchen-green": color === 'green',
                            "bg-kitchen-wood border-kitchen-wood": color === 'wood',
                            "bg-kitchen-stone border-kitchen-stone": color === 'stone',
                            "bg-kitchen-berry border-kitchen-berry": color === 'berry',
                            "bg-kitchen-yellow border-kitchen-yellow": color === 'yellow',
                          }) : "border-gray-300"
                        )}>
                          {task.completed && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <span className={cn("flex-1", {
                          "line-through text-muted-foreground": task.completed
                        })}>
                          {task.name}
                        </span>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SpaceDetailPage;
