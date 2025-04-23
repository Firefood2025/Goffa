
import React from 'react';
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Grid, List as ListIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type ViewMode = 'grid' | 'list';

interface ListLayoutProps {
  title: string;
  children: React.ReactNode;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  className?: string;
}

export function ListLayout({
  title,
  children,
  viewMode,
  onViewModeChange,
  className
}: ListLayoutProps) {
  return (
    <Card className={cn("bg-white/80 backdrop-blur-sm shadow-lg border-0", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 border-b">
        <h3 className="text-xl font-bold font-heading text-kitchen-dark">{title}</h3>
        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewModeChange('grid')}
            className={cn(
              "rounded-md transition-all", 
              viewMode === 'grid' ? "bg-white shadow-sm" : "hover:bg-white/60"
            )}
            aria-label="Grid view"
            aria-pressed={viewMode === 'grid'}
          >
            <Grid size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewModeChange('list')}
            className={cn(
              "rounded-md transition-all", 
              viewMode === 'list' ? "bg-white shadow-sm" : "hover:bg-white/60"
            )}
            aria-label="List view"
            aria-pressed={viewMode === 'list'}
          >
            <ListIcon size={18} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-4">{children}</CardContent>
    </Card>
  );
}
