
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
    <Card className={cn("bg-white/80 backdrop-blur-sm shadow-lg", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <h3 className="text-xl font-bold font-heading text-kitchen-dark">{title}</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewModeChange('grid')}
            className={cn(viewMode === 'grid' && "bg-muted")}
            aria-label="Grid view"
          >
            <Grid size={20} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewModeChange('list')}
            className={cn(viewMode === 'list' && "bg-muted")}
            aria-label="List view"
          >
            <ListIcon size={20} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
