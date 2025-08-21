import * as React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

interface KeyTakeawayProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function KeyTakeaway({
  children,
  title = 'Key Takeaway',
  className,
}: KeyTakeawayProps) {
  return (
    <Alert
      className={cn(
        'bg-blue-100 border-blue-600 shadow-[4px_4px_0px_0px_#2563eb] dark:bg-blue-950 dark:bg-opacity-30',
        className
      )}
    >
      <CheckCircle className="h-4 w-4 text-blue-600" />
      <AlertTitle className="text-blue-800 dark:text-blue-200 font-heading">
        {title}
      </AlertTitle>
      <AlertDescription className="text-blue-700 dark:text-blue-300">
        <div className="prose prose-sm max-w-none [&_p]:mb-2 [&_ul]:my-2 [&_li]:my-1">
          {children}
        </div>
      </AlertDescription>
    </Alert>
  );
}
