'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BookOpen, ChevronDown, ChevronRight } from 'lucide-react';

interface GlossaryItem {
  term: string;
  definition: React.ReactNode;
  category?: string;
}

interface GlossaryProps {
  items: GlossaryItem[];
  title?: string;
  className?: string;
}

interface TermProps {
  term: string;
  definition: React.ReactNode;
  className?: string;
}

export function GlossaryTerm({ term, definition, className }: TermProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div
      className={cn(
        'border-b border-gray-200 dark:border-gray-700 last:border-b-0',
        className
      )}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <span className="font-heading text-sm text-gray-800 dark:text-gray-200">
          {term}
        </span>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-500" />
        )}
      </button>
      {isExpanded && (
        <div className="px-3 pb-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="prose prose-sm max-w-none [&_p]:mb-2 [&_ul]:my-1 [&_li]:my-0.5">
            {definition}
          </div>
        </div>
      )}
    </div>
  );
}

export function Glossary({
  items,
  title = 'Glossary',
  className,
}: GlossaryProps) {
  const groupedItems = React.useMemo(() => {
    const groups: Record<string, GlossaryItem[]> = {};
    items.forEach(item => {
      const category = item.category || 'General';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
    });

    Object.keys(groups).forEach(category => {
      groups[category].sort((a, b) => a.term.localeCompare(b.term));
    });

    return groups;
  }, [items]);

  return (
    <Card
      className={cn(
        'bg-slate-100 border-slate-600 shadow-[4px_4px_0px_0px_#475569] dark:bg-slate-950 dark:bg-opacity-30',
        className
      )}
    >
      <div className="flex items-center gap-2 p-4 border-b border-slate-600">
        <div className="p-1.5 bg-slate-200 dark:bg-slate-800 rounded-base border-2 border-slate-600">
          <BookOpen className="h-4 w-4 text-slate-600" />
        </div>
        <h3 className="font-heading text-slate-800 dark:text-slate-200">
          {title}
        </h3>
      </div>
      <CardContent className="p-0">
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <div key={category}>
            {Object.keys(groupedItems).length > 1 && (
              <div className="px-4 py-2 bg-slate-200 dark:bg-slate-800 border-b border-slate-600">
                <span className="text-xs font-heading text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  {category}
                </span>
              </div>
            )}
            {categoryItems.map((item, index) => (
              <GlossaryTerm
                key={`${category}-${index}`}
                term={item.term}
                definition={item.definition}
              />
            ))}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
