'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { GitBranch, ArrowDown, ArrowRight } from 'lucide-react';

interface FlowStep {
  id: string;
  title: string;
  description?: string;
  highlight?: boolean;
  icon?: React.ReactNode;
}

interface FlowDiagramProps {
  steps: FlowStep[];
  title: string;
  direction?: 'vertical' | 'horizontal';
  className?: string;
}

function FlowStep({
  step,
  isLast,
  direction,
  index,
}: {
  step: FlowStep;
  isLast: boolean;
  direction: 'vertical' | 'horizontal';
  index: number;
}) {
  const stepVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: direction === 'vertical' ? 20 : 0,
      x: direction === 'horizontal' ? -20 : 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      x: 0,
    },
  };

  const arrowVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
    },
  };

  return (
    <motion.div
      className={cn(
        'flex',
        direction === 'horizontal' ? 'items-center my-2' : 'flex-col'
      )}
      initial="hidden"
      animate="visible"
      variants={stepVariants}
      transition={{
        duration: 0.5,
        delay: index * 0.2,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      <motion.div
        className={cn(
          'relative flex items-center gap-3 p-4 rounded-base border-2',
          step.highlight
            ? 'bg-yellow-100 border-yellow-600 shadow-[4px_4px_0px_0px_#ca8a04] dark:bg-yellow-950 dark:bg-opacity-30'
            : 'bg-white border-gray-600 shadow-[4px_4px_0px_0px_#4b5563] dark:bg-gray-950 dark:bg-opacity-30'
        )}
        whileHover={{
          scale: 1.02,
          y: -2,
          transition: { duration: 0.2 },
        }}
      >
        {step.icon && (
          <motion.div
            className={cn(
              'p-2 rounded-base border-2 border-gray-600',
              step.highlight ? 'bg-yellow-200' : 'bg-gray-100 dark:bg-gray-800'
            )}
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{
              duration: 0.4,
              delay: index * 0.2 + 0.2,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            {step.icon}
          </motion.div>
        )}
        <div className="flex-1">
          <motion.h4
            className={cn(
              'font-heading text-sm',
              step.highlight
                ? 'text-yellow-800 dark:text-yellow-200'
                : 'text-gray-800 dark:text-gray-200'
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.2 + 0.3,
            }}
          >
            {step.title}
          </motion.h4>
          {step.description && (
            <motion.p
              className={cn(
                'text-xs mt-1',
                step.highlight
                  ? 'text-yellow-700 dark:text-yellow-300'
                  : 'text-gray-600 dark:text-gray-400'
              )}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.2 + 0.4,
              }}
            >
              {step.description}
            </motion.p>
          )}
        </div>
      </motion.div>

      {!isLast && (
        <motion.div
          className={cn(
            'flex items-center justify-center',
            direction === 'horizontal' ? 'mx-4' : 'my-4 self-center'
          )}
          initial="hidden"
          animate="visible"
          variants={arrowVariants}
          transition={{
            duration: 0.3,
            delay: index * 0.2 + 0.3,
            ease: 'easeOut',
          }}
        >
          <motion.div
            animate={{
              x: direction === 'horizontal' ? [0, 5, 0] : 0,
              y: direction === 'vertical' ? [0, 5, 0] : 0,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {direction === 'horizontal' ? (
              <ArrowRight className="h-6 w-6 text-gray-400" />
            ) : (
              <ArrowDown className="h-6 w-6 text-gray-400" />
            )}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

export function FlowDiagram({
  steps = [],
  title,
  direction = 'vertical',
  className,
}: FlowDiagramProps) {
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
          'bg-gray-100 border-gray-600 shadow-[4px_4px_0px_0px_#4b5563] dark:bg-gray-950 dark:bg-opacity-30',
          className
        )}
      >
        <CardHeader>
          <motion.div variants={headerVariants}>
            <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
              <motion.div
                className="p-1.5 bg-gray-200 dark:bg-gray-800 rounded-base border-2 border-gray-600"
                initial={{ rotate: -90, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <GitBranch className="h-4 w-4" />
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
          <div
            className={cn(
              'flex',
              direction === 'horizontal'
                ? 'flex-wrap items-start gap-0'
                : 'flex-col gap-0'
            )}
          >
            {steps &&
              Array.isArray(steps) &&
              steps.map((step, index) => (
                <FlowStep
                  key={step.id}
                  step={step}
                  isLast={index === steps.length - 1}
                  direction={direction}
                  index={index}
                />
              ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
