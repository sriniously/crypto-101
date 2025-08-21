import * as React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CryptoConceptBoxProps {
  title: string;
  children: React.ReactNode;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  icon?: React.ReactNode;
  className?: string;
}

const difficultyConfig = {
  beginner: {
    badge: 'bg-green-400 text-black border-green-600',
    cardBg: 'bg-green-50 border-green-600 shadow-[4px_4px_0px_0px_#16a34a]',
    iconBg: 'bg-green-200',
  },
  intermediate: {
    badge: 'bg-yellow-400 text-black border-yellow-600',
    cardBg: 'bg-yellow-50 border-yellow-600 shadow-[4px_4px_0px_0px_#ca8a04]',
    iconBg: 'bg-yellow-200',
  },
  advanced: {
    badge: 'bg-red-400 text-black border-red-600',
    cardBg: 'bg-red-50 border-red-600 shadow-[4px_4px_0px_0px_#dc2626]',
    iconBg: 'bg-red-200',
  },
};

export function CryptoConceptBox({
  title,
  children,
  difficulty = 'beginner',
  icon,
  className,
}: CryptoConceptBoxProps) {
  const config = difficultyConfig[difficulty];

  const containerVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
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
        duration: 0.5,
        ease: 'easeOut',
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }}
      whileHover={{
        scale: 1.02,
        y: -2,
        transition: { duration: 0.2 },
      }}
    >
      <Card className={cn(config.cardBg, 'dark:bg-opacity-20', className)}>
        <CardHeader>
          <motion.div
            className="flex items-start justify-between"
            variants={headerVariants}
          >
            <div className="flex items-center gap-3">
              {icon && (
                <motion.div
                  className={cn(
                    'p-2 rounded-base border-2 border-black',
                    config.iconBg
                  )}
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.3,
                    ease: 'backOut',
                  }}
                >
                  {icon}
                </motion.div>
              )}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <CardTitle className="text-lg font-heading">{title}</CardTitle>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: 10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.5,
                ease: 'backOut',
              }}
            >
              <Badge className={config.badge}>{difficulty}</Badge>
            </motion.div>
          </motion.div>
        </CardHeader>
        <CardContent>
          <motion.div
            className="prose prose-sm max-w-none text-foreground [&_p]:mb-3 [&_ul]:my-2 [&_li]:my-1"
            variants={contentVariants}
          >
            {children}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
