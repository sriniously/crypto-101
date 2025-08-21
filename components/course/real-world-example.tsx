import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Globe } from 'lucide-react';

interface RealWorldExampleProps {
  children: React.ReactNode;
  title: string;
  protocol?: string;
  category?: 'DeFi' | 'NFT' | 'DAO' | 'Infrastructure' | 'Gaming' | 'Other';
  className?: string;
}

const categoryColors = {
  DeFi: 'bg-green-400 text-black border-green-600',
  NFT: 'bg-pink-400 text-black border-pink-600',
  DAO: 'bg-indigo-400 text-black border-indigo-600',
  Infrastructure: 'bg-gray-400 text-black border-gray-600',
  Gaming: 'bg-orange-400 text-black border-orange-600',
  Other: 'bg-blue-400 text-black border-blue-600',
};

export function RealWorldExample({
  children,
  title,
  protocol,
  category = 'Other',
  className,
}: RealWorldExampleProps) {
  return (
    <Card
      className={cn(
        'bg-emerald-100 border-emerald-600 shadow-[4px_4px_0px_0px_#059669] dark:bg-emerald-950 dark:bg-opacity-30',
        className
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
            <div className="p-1.5 bg-emerald-200 dark:bg-emerald-800 rounded-base border-2 border-emerald-600">
              <Globe className="h-4 w-4" />
            </div>
            {title}
          </CardTitle>
          <div className="flex gap-2">
            <Badge className={categoryColors[category]}>{category}</Badge>
            {protocol && (
              <Badge
                variant="outline"
                className="border-emerald-600 text-emerald-700 dark:text-emerald-300"
              >
                {protocol}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none text-emerald-700 dark:text-emerald-300 [&_p]:mb-3 [&_ul]:my-2 [&_li]:my-1">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
