import * as React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { GitCompare, Check, X, Minus } from 'lucide-react';

interface ComparisonItem {
  label: string;
  leftValue: React.ReactNode;
  rightValue: React.ReactNode;
  type?: 'text' | 'boolean' | 'rating' | 'custom';
}

interface ComparisonProps {
  title: string;
  leftTitle: string;
  rightTitle: string;
  leftBadge?: string;
  rightBadge?: string;
  items: ComparisonItem[];
  className?: string;
}

function ComparisonValue({
  value,
  type = 'text',
  delay = 0,
}: {
  value: React.ReactNode;
  type?: 'text' | 'boolean' | 'rating' | 'custom';
  delay?: number;
}) {
  if (type === 'boolean') {
    if (value === true || value === 'true' || value === 'yes') {
      return (
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.4, delay, ease: 'backOut' }}
        >
          <Check className="h-4 w-4 text-green-600" />
        </motion.div>
      );
    }
    if (value === false || value === 'false' || value === 'no') {
      return (
        <motion.div
          initial={{ scale: 0, rotate: 90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.4, delay, ease: 'backOut' }}
        >
          <X className="h-4 w-4 text-red-600" />
        </motion.div>
      );
    }
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay }}
      >
        <Minus className="h-4 w-4 text-gray-400" />
      </motion.div>
    );
  }

  return (
    <motion.span
      className="text-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      {value}
    </motion.span>
  );
}

export function Comparison({
  title,
  leftTitle,
  rightTitle,
  leftBadge,
  rightBadge,
  items = [],
  className,
}: ComparisonProps) {
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

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
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
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
              <motion.div
                className="p-1.5 bg-slate-200 dark:bg-slate-800 rounded-base border-2 border-slate-600"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: 'backOut' }}
              >
                <GitCompare className="h-4 w-4" />
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
          <div className="space-y-4">
            <motion.div
              className="grid grid-cols-3 gap-4 pb-4 border-b border-slate-300 dark:border-slate-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div></div>
              <div className="text-center">
                <div className="flex flex-col items-center gap-2">
                  <motion.h4
                    className="font-heading text-slate-800 dark:text-slate-200"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                  >
                    {leftTitle}
                  </motion.h4>
                  {leftBadge && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 }}
                    >
                      <Badge variant="secondary" className="text-xs">
                        {leftBadge}
                      </Badge>
                    </motion.div>
                  )}
                </div>
              </div>
              <div className="text-center">
                <div className="flex flex-col items-center gap-2">
                  <motion.h4
                    className="font-heading text-slate-800 dark:text-slate-200"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.7 }}
                  >
                    {rightTitle}
                  </motion.h4>
                  {rightBadge && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.8 }}
                    >
                      <Badge variant="secondary" className="text-xs">
                        {rightBadge}
                      </Badge>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>

            {items &&
              Array.isArray(items) &&
              items.map((item, index) => (
                <motion.div
                  key={index}
                  className="grid grid-cols-3 gap-4 py-3 border-b border-slate-200 dark:border-slate-800 last:border-b-0"
                  variants={rowVariants}
                  custom={index}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  whileHover={{
                    backgroundColor: 'rgba(0,0,0,0.02)',
                    transition: { duration: 0.2 },
                  }}
                >
                  <motion.div
                    className="font-heading text-sm text-slate-700 dark:text-slate-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                  >
                    {item.label}
                  </motion.div>
                  <div className="text-center text-slate-600 dark:text-slate-400">
                    <ComparisonValue
                      value={item.leftValue}
                      type={item.type}
                      delay={1.0 + index * 0.1}
                    />
                  </div>
                  <div className="text-center text-slate-600 dark:text-slate-400">
                    <ComparisonValue
                      value={item.rightValue}
                      type={item.type}
                      delay={1.1 + index * 0.1}
                    />
                  </div>
                </motion.div>
              ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
