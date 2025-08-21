import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Brain } from 'lucide-react';

interface ThinkAboutItProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function ThinkAboutIt({
  children,
  title = 'Think About It',
  className,
}: ThinkAboutItProps) {
  return (
    <Card
      className={cn(
        'bg-purple-100 border-purple-600 shadow-[4px_4px_0px_0px_#9333ea] dark:bg-purple-950 dark:bg-opacity-30',
        className
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
          <div className="p-1.5 bg-purple-200 dark:bg-purple-800 rounded-base border-2 border-purple-600">
            <Brain className="h-4 w-4" />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none text-purple-700 dark:text-purple-300 [&_p]:mb-3 [&_ul]:my-2 [&_li]:my-1">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
