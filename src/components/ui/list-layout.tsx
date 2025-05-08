
import React from 'react';
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Grid, List as ListIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from "@/hooks/use-mobile";

export type ViewMode = 'grid' | 'list';

interface ListLayoutProps {
  title: string;
  children: React.ReactNode;
  viewMode: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  className?: string;
}

export function ListLayout({
  title,
  children,
  viewMode,
  onViewModeChange,
  className
}: ListLayoutProps) {
  const isMobile = useIsMobile();

  return (
    <Card className={cn("bg-white/80 backdrop-blur-sm shadow-lg border-0", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 border-b px-3 md:px-4 py-2 md:py-3">
        <h3 className="text-base md:text-lg font-bold font-heading text-kitchen-dark">{title}</h3>
        {onViewModeChange && (
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className={cn(
                "rounded-md transition-all h-7 w-7", 
                viewMode === 'grid' ? "bg-white shadow-sm" : "hover:bg-white/60"
              )}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
            >
              <Grid size={isMobile ? 14 : 16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewModeChange('list')}
              className={cn(
                "rounded-md transition-all h-7 w-7", 
                viewMode === 'list' ? "bg-white shadow-sm" : "hover:bg-white/60"
              )}
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
            >
              <ListIcon size={isMobile ? 14 : 16} />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-3 md:p-4 pt-3 md:pt-4">{children}</CardContent>
    </Card>
  );
}
