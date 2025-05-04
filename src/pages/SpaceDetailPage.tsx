
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, Plus, Trash2, CalendarIcon, Image, FileText, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DynamicIcon } from '@/components/spaces/DynamicIcon';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useSpaces } from '@/hooks/use-spaces';
import { SpaceTask } from '@/types/space';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const SpaceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSpaceById, updateSpace } = useSpaces();
  const space = getSpaceById(id || '');
  
  const [newTaskName, setNewTaskName] = useState('');
  const [taskNotes, setTaskNotes] = useState<Record<string, string>>({});
  const [taskAssignees, setTaskAssignees] = useState<Record<string, string>>({});
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<SpaceTask | null>(null);
  
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
    
    if (updatedTasks.find(task => task.id === taskId)?.completed) {
      toast({
        title: "Task completed! 🎉",
        description: "Great job completing this task.",
      });
    }
  };
  
  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    updateSpace(space.id, { tasks: updatedTasks });
    toast({
      title: "Task deleted",
      description: "The task has been removed.",
    });
  };
  
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTaskName.trim()) return;
    
    const newTask: SpaceTask = {
      id: `task-${Date.now()}`,
      name: newTaskName.trim(),
      completed: false,
      notes: '',
      assignee: '',
    };
    
    updateSpace(space.id, { tasks: [...tasks, newTask] });
    setNewTaskName('');
    toast({
      title: "Task added",
      description: "New task has been added successfully.",
    });
  };
  
  const handleTaskClick = (task: SpaceTask) => {
    setCurrentTask(task);
    setTaskNotes({ ...taskNotes, [task.id]: task.notes || '' });
    setTaskAssignees({ ...taskAssignees, [task.id]: task.assignee || '' });
    setIsTaskDialogOpen(true);
  };
  
  const handleUpdateTask = () => {
    if (!currentTask) return;
    
    const updatedTasks = tasks.map(task => 
      task.id === currentTask.id 
        ? { 
            ...currentTask, 
            notes: taskNotes[currentTask.id] || '',
            assignee: taskAssignees[currentTask.id] || '',
          } 
        : task
    );
    
    updateSpace(space.id, { tasks: updatedTasks });
    setIsTaskDialogOpen(false);
    toast({
      title: "Task updated",
      description: "The task details have been updated.",
    });
  };
  
  const handleSetDueDate = (taskId: string, date: Date | undefined) => {
    if (!date) return;
    
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, dueDate: date } : task
    );
    
    updateSpace(space.id, { tasks: updatedTasks });
    
    if (currentTask) {
      setCurrentTask({ ...currentTask, dueDate: date });
    }
    
    toast({
      title: "Due date set",
      description: `Due date set to ${format(date, "PPP")}`,
    });
  };
  
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  // Format due date or return a default message
  const formatDueDate = (dueDate?: Date) => {
    if (!dueDate) return "No due date";
    return format(new Date(dueDate), "PPP");
  };
  
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
                      className="flex items-center justify-between p-3 border rounded-md bg-white hover:bg-gray-50"
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
                        <div className="flex-1">
                          <span className={cn("block", {
                            "line-through text-muted-foreground": task.completed
                          })}>
                            {task.name}
                          </span>
                          
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            {task.assignee && (
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span>{task.assignee}</span>
                              </div>
                            )}
                            
                            {task.dueDate && (
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="h-3 w-3" />
                                <span>{formatDueDate(task.dueDate)}</span>
                              </div>
                            )}
                            
                            {task.notes && (
                              <div className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                <span>Has notes</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleTaskClick(task)}
                        >
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* Task Edit Dialog */}
      <AlertDialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>{currentTask?.name}</AlertDialogTitle>
            <AlertDialogDescription>
              Update task details and assign it to someone
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="assignee" className="text-sm font-medium">
                Assign to
              </label>
              <Input
                id="assignee"
                placeholder="Enter name of assignee"
                value={currentTask?.id ? taskAssignees[currentTask.id] || '' : ''}
                onChange={(e) => currentTask?.id && setTaskAssignees({
                  ...taskAssignees,
                  [currentTask.id]: e.target.value
                })}
              />
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Due date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {currentTask?.dueDate ? (
                      format(new Date(currentTask.dueDate), "PPP")
                    ) : (
                      <span>Pick a due date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={currentTask?.dueDate}
                    onSelect={(date) => currentTask?.id && handleSetDueDate(currentTask.id, date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="notes" className="text-sm font-medium">
                Notes
              </label>
              <Textarea
                id="notes"
                placeholder="Add notes, comments or instructions..."
                rows={4}
                value={currentTask?.id ? taskNotes[currentTask.id] || '' : ''}
                onChange={(e) => currentTask?.id && setTaskNotes({
                  ...taskNotes,
                  [currentTask.id]: e.target.value
                })}
              />
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUpdateTask}>Save changes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Footer />
    </div>
  );
};

export default SpaceDetailPage;
