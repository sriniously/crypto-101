import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MessageCircle } from 'lucide-react';

interface DiscussionProps {
  children: React.ReactNode;
  title?: string;
  type?: 'question' | 'debate' | 'reflection' | 'community';
  className?: string;
}

const typeConfig = {
  question: {
    badge: 'bg-cyan-400 text-black border-cyan-600',
    bg: 'bg-cyan-100 border-cyan-600 shadow-[4px_4px_0px_0px_#0891b2] dark:bg-cyan-950 dark:bg-opacity-30',
    iconBg: 'bg-cyan-200 dark:bg-cyan-800',
    titleColor: 'text-cyan-800 dark:text-cyan-200',
    textColor: 'text-cyan-700 dark:text-cyan-300',
    title: 'Discussion Question',
  },
  debate: {
    badge: 'bg-red-400 text-black border-red-600',
    bg: 'bg-red-100 border-red-600 shadow-[4px_4px_0px_0px_#dc2626] dark:bg-red-950 dark:bg-opacity-30',
    iconBg: 'bg-red-200 dark:bg-red-800',
    titleColor: 'text-red-800 dark:text-red-200',
    textColor: 'text-red-700 dark:text-red-300',
    title: 'Debate Topic',
  },
  reflection: {
    badge: 'bg-indigo-400 text-black border-indigo-600',
    bg: 'bg-indigo-100 border-indigo-600 shadow-[4px_4px_0px_0px_#4f46e5] dark:bg-indigo-950 dark:bg-opacity-30',
    iconBg: 'bg-indigo-200 dark:bg-indigo-800',
    titleColor: 'text-indigo-800 dark:text-indigo-200',
    textColor: 'text-indigo-700 dark:text-indigo-300',
    title: 'Reflection',
  },
  community: {
    badge: 'bg-green-400 text-black border-green-600',
    bg: 'bg-green-100 border-green-600 shadow-[4px_4px_0px_0px_#16a34a] dark:bg-green-950 dark:bg-opacity-30',
    iconBg: 'bg-green-200 dark:bg-green-800',
    titleColor: 'text-green-800 dark:text-green-200',
    textColor: 'text-green-700 dark:text-green-300',
    title: 'Community Discussion',
  },
};

export function Discussion({
  children,
  title,
  type = 'question',
  className,
}: DiscussionProps) {
  const config = typeConfig[type];
  const displayTitle = title || config.title;

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
              <MessageCircle className="h-4 w-4" />
            </div>
            {displayTitle}
          </CardTitle>
          <Badge className={config.badge}>{type}</Badge>
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
