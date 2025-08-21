import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Lightbulb } from 'lucide-react';

interface ProTipProps {
  children: React.ReactNode;
  title?: string;
  level?: 'intermediate' | 'advanced' | 'expert';
  className?: string;
}

const levelConfig = {
  intermediate: {
    badge: 'bg-blue-400 text-black border-blue-600',
    bg: 'bg-blue-100 border-blue-600 shadow-[4px_4px_0px_0px_#2563eb] dark:bg-blue-950 dark:bg-opacity-30',
    iconBg: 'bg-blue-200 dark:bg-blue-800',
    titleColor: 'text-blue-800 dark:text-blue-200',
    textColor: 'text-blue-700 dark:text-blue-300',
  },
  advanced: {
    badge: 'bg-purple-400 text-black border-purple-600',
    bg: 'bg-purple-100 border-purple-600 shadow-[4px_4px_0px_0px_#9333ea] dark:bg-purple-950 dark:bg-opacity-30',
    iconBg: 'bg-purple-200 dark:bg-purple-800',
    titleColor: 'text-purple-800 dark:text-purple-200',
    textColor: 'text-purple-700 dark:text-purple-300',
  },
  expert: {
    badge: 'bg-orange-400 text-black border-orange-600',
    bg: 'bg-orange-100 border-orange-600 shadow-[4px_4px_0px_0px_#ea580c] dark:bg-orange-950 dark:bg-opacity-30',
    iconBg: 'bg-orange-200 dark:bg-orange-800',
    titleColor: 'text-orange-800 dark:text-orange-200',
    textColor: 'text-orange-700 dark:text-orange-300',
  },
};

export function ProTip({
  children,
  title = 'Pro Tip',
  level = 'intermediate',
  className,
}: ProTipProps) {
  const config = levelConfig[level];

  return (
    <Card className={cn(config.bg, className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle
            className={cn('flex items-center gap-2', config.titleColor)}
          >
            <div
              className={cn(
                'p-1.5 rounded-base border-2 border-current',
                config.iconBg
              )}
            >
              <Lightbulb className="h-4 w-4" />
            </div>
            {title}
          </CardTitle>
          <Badge className={config.badge}>{level}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            'prose prose-sm max-w-none [&_p]:mb-3 [&_ul]:my-2 [&_li]:my-1',
            config.textColor
          )}
        >
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
