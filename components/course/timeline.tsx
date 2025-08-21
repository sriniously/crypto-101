import * as React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Clock, Circle } from 'lucide-react';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: React.ReactNode;
  category?: string;
  highlight?: boolean;
}

interface TimelineProps {
  events: TimelineEvent[];
  title: string;
  className?: string;
}

const categoryColors: Record<string, string> = {
  bitcoin: 'bg-orange-400 text-black border-orange-600',
  ethereum: 'bg-blue-400 text-black border-blue-600',
  defi: 'bg-green-400 text-black border-green-600',
  nft: 'bg-pink-400 text-black border-pink-600',
  regulation: 'bg-red-400 text-black border-red-600',
  default: 'bg-gray-400 text-black border-gray-600',
};

function TimelineItem({
  event,
  isLast,
  index,
}: {
  event: TimelineEvent;
  isLast: boolean;
  index: number;
}) {
  const categoryColor = categoryColors[event.category || 'default'];

  const itemVariants = {
    hidden: {
      opacity: 0,
      x: -50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
    },
  };

  const dotVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
    },
  };

  const lineVariants = {
    hidden: { scaleY: 0 },
    visible: {
      scaleY: 1,
    },
  };

  return (
    <motion.div
      className="relative flex gap-4"
      initial="hidden"
      animate="visible"
      variants={itemVariants}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: 'easeOut',
      }}
    >
      <div className="flex flex-col items-center">
        <motion.div
          className={cn(
            'w-4 h-4 rounded-full border-2 border-slate-600 relative overflow-hidden',
            event.highlight
              ? 'bg-yellow-400 shadow-[2px_2px_0px_0px_#ca8a04]'
              : 'bg-white dark:bg-slate-800 shadow-[2px_2px_0px_0px_#475569]'
          )}
          variants={dotVariants}
          transition={{
            duration: 0.4,
            delay: index * 0.15 + 0.2,
            ease: 'backOut',
          }}
          whileHover={{ scale: 1.2 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.3,
              delay: index * 0.15 + 0.5,
              ease: 'easeOut',
            }}
          >
            <Circle className="w-2 h-2 m-0.5 text-slate-600" />
          </motion.div>
          {event.highlight && (
            <motion.div
              className="absolute inset-0 bg-yellow-300 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
        </motion.div>
        {!isLast && (
          <motion.div
            className="w-0.5 h-full bg-slate-300 dark:bg-slate-700 mt-2 origin-top"
            variants={lineVariants}
            transition={{
              duration: 0.5,
              delay: index * 0.15 + 0.4,
              ease: 'easeOut',
            }}
          />
        )}
      </div>

      <div className="flex-1 pb-8">
        <motion.div
          className="flex items-start justify-between gap-4 mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: index * 0.15 + 0.3,
          }}
        >
          <div>
            <motion.h4
              className={cn(
                'font-heading text-lg',
                event.highlight
                  ? 'text-yellow-800 dark:text-yellow-200'
                  : 'text-slate-800 dark:text-slate-200'
              )}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.15 + 0.4,
              }}
            >
              {event.title}
            </motion.h4>
            <motion.p
              className="text-sm text-slate-600 dark:text-slate-400 font-mono"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.15 + 0.5,
              }}
            >
              {event.date}
            </motion.p>
          </div>
          {event.category && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.15 + 0.6,
                ease: 'backOut',
              }}
            >
              <Badge className={categoryColor}>{event.category}</Badge>
            </motion.div>
          )}
        </motion.div>
        <motion.div
          className={cn(
            'prose prose-sm max-w-none [&_p]:mb-2 [&_ul]:my-2 [&_li]:my-1',
            event.highlight
              ? 'text-yellow-700 dark:text-yellow-300'
              : 'text-slate-700 dark:text-slate-300'
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: index * 0.15 + 0.7,
          }}
        >
          {event.description}
        </motion.div>
      </div>
    </motion.div>
  );
}

export function Timeline({ events, title, className }: TimelineProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      transition={{
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }}
    >
      <Card
        className={cn(
          'bg-slate-100 border-slate-600 shadow-[4px_4px_0px_0px_#475569] dark:bg-slate-950 dark:bg-opacity-30',
          className
        )}
      >
        <CardHeader>
          <motion.div
            variants={headerVariants}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
              <motion.div
                className="p-1.5 bg-slate-200 dark:bg-slate-800 rounded-base border-2 border-slate-600"
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1, ease: 'backOut' }}
              >
                <Clock className="h-4 w-4" />
              </motion.div>
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                {title}
              </motion.span>
            </CardTitle>
          </motion.div>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {events.map((event, index) => (
              <TimelineItem
                key={`${event.id}-${index}`}
                event={event}
                isLast={index === events.length - 1}
                index={index}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
