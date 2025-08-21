import * as React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';

interface CommonMistakeProps {
  children: React.ReactNode;
  title?: string;
  severity?: 'warning' | 'critical';
  className?: string;
}

export function CommonMistake({
  children,
  title = 'Common Mistake',
  severity = 'warning',
  className,
}: CommonMistakeProps) {
  const severityConfig = {
    warning: {
      bg: 'bg-yellow-100 border-yellow-600 shadow-[4px_4px_0px_0px_#ca8a04] dark:bg-yellow-950 dark:bg-opacity-30',
      iconColor: 'text-yellow-600',
      titleColor: 'text-yellow-800 dark:text-yellow-200',
      textColor: 'text-yellow-700 dark:text-yellow-300',
    },
    critical: {
      bg: 'bg-red-100 border-red-600 shadow-[4px_4px_0px_0px_#dc2626] dark:bg-red-950 dark:bg-opacity-30',
      iconColor: 'text-red-600',
      titleColor: 'text-red-800 dark:text-red-200',
      textColor: 'text-red-700 dark:text-red-300',
    },
  };

  const config = severityConfig[severity];

  return (
    <Alert className={cn(config.bg, className)}>
      <AlertTriangle className={cn('h-4 w-4', config.iconColor)} />
      <AlertTitle className={cn(config.titleColor, 'font-heading')}>
        {title}
      </AlertTitle>
      <AlertDescription className={config.textColor}>
        <div className="prose prose-sm max-w-none [&_p]:mb-2 [&_ul]:my-2 [&_li]:my-1">
          {children}
        </div>
      </AlertDescription>
    </Alert>
  );
}
