import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const HadithSkeleton: React.FC = () => (
  <Card>
    <CardContent className="p-0">
      <div className="p-4 pb-3 border-b border-border/30 bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex gap-1">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
      </div>
      <div className="p-4 space-y-4">
        <Skeleton className="h-20 w-full" />
        <div className="pt-3 border-t border-border/30">
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default HadithSkeleton;
