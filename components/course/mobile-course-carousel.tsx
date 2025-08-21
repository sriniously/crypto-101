'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Clock,
  Lock,
  CheckCircle,
  PlayCircle,
  Target,
  Sparkles,
} from 'lucide-react';
import { Module } from '@/lib/course-data';
import { cn } from '@/lib/utils';

interface MobileCourseCarouselProps {
  modules: Module[];
}

export function MobileCourseCarousel({ modules }: MobileCourseCarouselProps) {
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);

  const currentModule = modules[currentModuleIndex];
  const isFirstModule = currentModuleIndex === 0;
  const isLastModule = currentModuleIndex === modules.length - 1;

  const goToPrevious = () => {
    if (!isFirstModule) {
      setCurrentModuleIndex(currentModuleIndex - 1);
      setExpandedLesson(null);
    }
  };

  const goToNext = () => {
    if (!isLastModule) {
      setCurrentModuleIndex(currentModuleIndex + 1);
      setExpandedLesson(null);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: goToNext,
    onSwipedRight: goToPrevious,
    trackMouse: true,
  });

  const getLessonStatus = (lessonIndex: number) => {
    if (currentModuleIndex === 0 && lessonIndex === 0) return 'current';
    if (currentModuleIndex > 0 || lessonIndex > 0) return 'locked';
    return 'available';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'current':
        return <PlayCircle className="w-4 h-4 text-main animate-pulse" />;
      case 'locked':
        return <Lock className="w-4 h-4 text-gray-400" />;
      default:
        return <BookOpen className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="relative w-full px-4" {...swipeHandlers}>
      <div className="flex justify-center gap-1.5 mb-6">
        {modules.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentModuleIndex(index)}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              index === currentModuleIndex
                ? 'w-8 bg-main'
                : 'w-1.5 bg-gray-300 hover:bg-gray-400'
            )}
            aria-label={`Go to module ${index + 1}`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentModule.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <Card className="p-6 border-2 border-black shadow-[4px_4px_0px_0px_#000] bg-main">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-main-foreground text-main flex items-center justify-center font-bold text-lg border-2 border-black">
                    {currentModule.number}
                  </div>
                  <div>
                    <Badge className="bg-secondary-background text-foreground border-black text-xs">
                      Module {currentModule.number}
                    </Badge>
                    <Badge variant="outline" className="text-xs ml-1">
                      {currentModule.track}
                    </Badge>
                  </div>
                </div>
                <Sparkles className="w-5 h-5 text-main-foreground" />
              </div>

              <h2 className="font-bold text-xl mb-2 text-main-foreground">
                {currentModule.title}
              </h2>
              <p className="text-sm text-main-foreground/90 mb-3">
                {currentModule.subtitle}
              </p>
              <p className="text-xs text-main-foreground/80 leading-relaxed">
                {currentModule.description}
              </p>
            </div>

            <div className="flex items-center gap-4 mb-4 text-sm text-main-foreground">
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{currentModule.lessons.length} lessons</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{currentModule.duration}m</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-sm mb-2 text-main-foreground">
                Lessons
              </h3>
              {currentModule.lessons.map((lesson, index) => {
                const status = getLessonStatus(index);
                const isExpanded = expandedLesson === lesson.id;
                const isClickable = status !== 'locked';

                return (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div
                      className={cn(
                        'p-3 rounded-lg border transition-all duration-200',
                        status === 'current'
                          ? 'bg-white/90 border-main shadow-[2px_2px_0px_0px_var(--main)]'
                          : status === 'locked'
                            ? 'bg-gray-100/50 border-gray-300 opacity-60'
                            : 'bg-white/80 border-blue-300 hover:border-blue-400',
                        isClickable && 'cursor-pointer'
                      )}
                      onClick={() =>
                        isClickable &&
                        setExpandedLesson(isExpanded ? null : lesson.id)
                      }
                    >
                      <div className="flex items-start gap-3">
                        {getStatusIcon(status)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant="outline"
                              className="text-xs border-black"
                            >
                              {lesson.number}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {lesson.duration}m
                            </Badge>
                          </div>
                          <h4 className="font-medium text-sm leading-tight">
                            {lesson.title}
                          </h4>

                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-2 space-y-2"
                            >
                              <p className="text-xs text-muted-foreground">
                                {lesson.description}
                              </p>
                              <div className="flex items-center gap-1">
                                <Target className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {lesson.objectives?.length || 0} objectives
                                </span>
                              </div>
                              {status === 'current' && (
                                <Button
                                  size="sm"
                                  className="w-full mt-2"
                                  asChild
                                >
                                  <Link
                                    href={`/course/${currentModule.id}/${lesson.id}`}
                                  >
                                    <PlayCircle className="w-3 h-3 mr-1" />
                                    Start Lesson
                                  </Link>
                                </Button>
                              )}
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <Button
              className="w-full mt-4 bg-main-foreground text-main hover:bg-black border-2 border-black shadow-[2px_2px_0px_0px_#000]"
              asChild
            >
              <Link href={`/course/${currentModule.id}`}>View Full Module</Link>
            </Button>
          </Card>

          <div className="flex justify-between items-center mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevious}
              disabled={isFirstModule}
              className={cn(
                'border-2',
                !isFirstModule && 'border-black shadow-[2px_2px_0px_0px_#000]'
              )}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>

            <span className="text-sm text-muted-foreground">
              {currentModuleIndex + 1} of {modules.length}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={goToNext}
              disabled={isLastModule}
              className={cn(
                'border-2',
                !isLastModule && 'border-black shadow-[2px_2px_0px_0px_#000]'
              )}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center text-xs text-muted-foreground mt-4"
      >
        Swipe or use arrows to navigate modules
      </motion.p>
    </div>
  );
}
