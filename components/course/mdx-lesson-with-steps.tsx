'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Clock,
  BookOpen,
  Target,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Zap,
  Brain,
  Trophy,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MDXContentProvider } from '@/components/mdx-provider';
import { useProgress } from '@/lib/progress';

const getDynamicMDXComponent = (moduleId: string, lessonId: string) => {
  return dynamic(
    () =>
      import(`@/content/modules/${moduleId}/lessons/${lessonId}.mdx`).catch(
        () => {
          const ErrorComponent = () => (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Lesson content not found. Please check if the MDX file exists.
              </AlertDescription>
            </Alert>
          );
          ErrorComponent.displayName = 'LessonErrorComponent';
          return ErrorComponent;
        }
      ),
    {
      ssr: false,
    }
  );
};

interface MDXLessonWithStepsProps {
  moduleId: string;
  lessonId: string;
  frontmatter?: {
    title: string;
    description: string;
    objectives: string[];
    duration?: number;
    prerequisites?: string[];
    simulations?: Array<{
      id: string;
      title: string;
      component: string;
      description: string;
    }>;
  };
  onComplete: () => void;
  isCompleted: boolean;
  onPreviousLesson?: () => void;
  onNextLesson?: () => void;
  hasPreviousLesson?: boolean;
  hasNextLesson?: boolean;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'content':
      return <BookOpen className="h-5 w-5 text-blue-500" />;
    case 'simulation':
      return <Zap className="h-5 w-5 text-orange-500" />;
    case 'checkpoint':
      return <Target className="h-5 w-5 text-indigo-500" />;
    case 'quiz':
      return <Brain className="h-5 w-5 text-purple-500" />;
    default:
      return <BookOpen className="h-5 w-5 text-blue-500" />;
  }
};

const getTypeBadgeVariant = (
  type: string
): 'default' | 'secondary' | 'outline' | 'destructive' => {
  switch (type) {
    case 'content':
      return 'default';
    case 'simulation':
      return 'secondary';
    case 'checkpoint':
      return 'outline';
    default:
      return 'destructive';
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'concept':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'simulation':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'demo':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    case 'exercise':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};

export function MDXLessonWithSteps({
  moduleId,
  lessonId,
  frontmatter,
  onComplete,
  isCompleted,
  onPreviousLesson,
  onNextLesson,
  hasPreviousLesson = false,
  hasNextLesson = false,
}: MDXLessonWithStepsProps) {
  const {
    completedSteps: persistedSteps,
    markStepComplete,
    markStepIncomplete,
  } = useProgress();
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(
    null
  );
  const [, setRegisteredSteps] = useState<Set<string>>(new Set());
  const [isInitialized, setIsInitialized] = useState(false);

  const completedStepsForLesson = useMemo(
    () => new Set(persistedSteps[lessonId] || []),
    [persistedSteps, lessonId]
  );

  const registerStep = useCallback(
    (stepId: string) => {
      setRegisteredSteps(prev => {
        if (!prev.has(stepId)) {
          const newSet = new Set([...prev, stepId]);
          const stepNumbers = Array.from(newSet).map(id => {
            const match = id.match(/step-(\d+)/);
            return match ? parseInt(match[1], 10) : 0;
          });
          const maxStep = Math.max(...stepNumbers);
          setTotalSteps(maxStep + 1);

          if (!isInitialized) {
            setIsInitialized(true);
          }

          return newSet;
        }
        return prev;
      });
    },
    [isInitialized]
  );

  const goToNextStep = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setSlideDirection('right');
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, totalSteps]);

  const handleStepComplete = useCallback(
    (stepId: string) => {
      const match = stepId.match(/step-(\d+)/);
      const stepIndex = match ? parseInt(match[1], 10) : 0;

      if (completedStepsForLesson.has(stepId)) {
        markStepIncomplete(lessonId, stepId);
      } else {
        markStepComplete(lessonId, stepId);

        if (stepIndex === currentStep && currentStep < totalSteps - 1) {
          setTimeout(() => {
            goToNextStep();
          }, 500);
        }
      }
    },
    [
      lessonId,
      markStepComplete,
      markStepIncomplete,
      completedStepsForLesson,
      currentStep,
      totalSteps,
      goToNextStep,
    ]
  );

  const goToPreviousStep = useCallback(() => {
    if (currentStep > 0) {
      setSlideDirection('left');
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback(
    (stepIndex: number) => {
      if (
        stepIndex !== currentStep &&
        stepIndex >= 0 &&
        stepIndex < totalSteps
      ) {
        const direction = stepIndex > currentStep ? 'right' : 'left';
        setSlideDirection(direction);
        setCurrentStep(stepIndex);
      }
    },
    [currentStep, totalSteps]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goToNextStep();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPreviousStep();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextStep, goToPreviousStep]);

  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;
  const MDXContent = getDynamicMDXComponent(moduleId, lessonId);

  const Step = ({
    id,
    title,
    children,
    type = 'content',
  }: {
    id: string;
    title: string;
    children: React.ReactNode;
    type?: 'content' | 'simulation' | 'checkpoint' | 'quiz';
  }) => {
    const match = id.match(/step-(\d+)/);
    const stepIndex = match ? parseInt(match[1], 10) : 0;
    const isCurrentStep = stepIndex === currentStep;
    const isCompleted = completedStepsForLesson.has(id);

    useEffect(() => {
      registerStep(id);
    }, [id]);

    return (
      <div className={isCurrentStep ? 'block' : 'hidden'}>
        <AnimatePresence mode="wait">
          {isCurrentStep && (
            <motion.div
              key={id}
              initial={{ opacity: 0, x: slideDirection === 'right' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: slideDirection === 'right' ? -20 : 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full"
            >
              <Card className="relative overflow-hidden">
                <div className="p-6 border-b bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(type)}
                      <div>
                        <h3 className="text-xl font-semibold">{title}</h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getTypeBadgeVariant(type)}>{type}</Badge>
                      <CheckCircle
                        className={`h-5 w-5 text-green-500 transition-opacity duration-200 ${
                          isCompleted ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    {children}
                  </div>

                  <div className="flex justify-between items-center pt-6 gap-4">
                    <div className="flex gap-2">
                      {stepIndex > 0 && (
                        <Button
                          variant="outline"
                          onClick={goToPreviousStep}
                          size="sm"
                        >
                          <ChevronLeft className="h-4 w-4 mr-2" />
                          Previous
                        </Button>
                      )}
                      {stepIndex < totalSteps - 1 && (
                        <Button
                          variant="outline"
                          onClick={goToNextStep}
                          size="sm"
                        >
                          Next
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      )}
                    </div>

                    <Button
                      onClick={() => handleStepComplete(id)}
                      variant={isCompleted ? 'secondary' : 'default'}
                      size="lg"
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Completed
                        </>
                      ) : type === 'simulation' ? (
                        <>
                          <Target className="h-4 w-4 mr-2" />
                          Mark Simulation Complete
                        </>
                      ) : type === 'checkpoint' ? (
                        <>
                          <Target className="h-4 w-4 mr-2" />
                          Mark as Understood
                        </>
                      ) : type === 'quiz' ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark Quiz Complete
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark as Complete
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const Checkpoint = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="my-8">
      <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <CardTitle className="text-amber-800 dark:text-amber-200">
              Checkpoint: {title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-amber-700 dark:text-amber-300">{children}</div>
        </CardContent>
      </Card>
    </div>
  );

  const stepComponents = {
    Step,
    Checkpoint,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 relative">
      <div className="bg-background border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">
            Step {currentStep + 1} of {totalSteps}
          </h2>
          <span className="text-sm text-muted-foreground">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <Progress value={progress} className="h-2" />

        <div className="text-center pt-3 text-sm text-muted-foreground">
          Use ←→ arrow keys or space to navigate • Click side buttons to go
          back/forward
        </div>
      </div>

      {frontmatter && currentStep === 0 && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {frontmatter.duration && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {frontmatter.duration} min
                    </div>
                  )}
                </div>
                <CardTitle className="text-2xl">{frontmatter.title}</CardTitle>
                <CardDescription className="mt-2">
                  {frontmatter.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          {(frontmatter.objectives?.length > 0 ||
            (frontmatter.prerequisites &&
              frontmatter.prerequisites.length > 0)) && (
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {frontmatter.objectives?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <h4 className="font-semibold text-green-800 dark:text-green-200">
                        Learning Objectives
                      </h4>
                    </div>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {frontmatter.objectives.map((objective, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-600 dark:text-green-400 mt-1">
                            •
                          </span>
                          {objective}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {frontmatter.prerequisites &&
                  frontmatter.prerequisites.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                          Prerequisites
                        </h4>
                      </div>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {frontmatter.prerequisites.map((prereq, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-600 dark:text-blue-400 mt-1">
                              •
                            </span>
                            {prereq}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      <div className="relative">
        <div className="absolute left-0 top-0 -translate-x-16 z-20">
          {currentStep === 0 && hasPreviousLesson && onPreviousLesson ? (
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <Button
                variant="outline"
                size="icon"
                onClick={onPreviousLesson}
                className="w-12 h-12 rounded-full bg-background/90 backdrop-blur-sm border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-primary"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{
                x: 0,
                opacity: currentStep === 0 ? 0.3 : 1,
              }}
              whileHover={{
                scale: currentStep === 0 ? 1 : 1.1,
                x: currentStep === 0 ? 0 : 5,
              }}
              whileTap={{ scale: currentStep === 0 ? 1 : 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <Button
                variant="outline"
                size="icon"
                onClick={goToPreviousStep}
                disabled={currentStep === 0}
                className="w-12 h-12 rounded-full bg-background/90 backdrop-blur-sm border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-primary disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </div>

        <div className="absolute right-0 top-0 translate-x-16 z-20">
          {currentStep === totalSteps - 1 && hasNextLesson && onNextLesson ? (
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <Button
                size="icon"
                onClick={onNextLesson}
                className="w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{
                x: 0,
                opacity: currentStep === totalSteps - 1 ? 0.3 : 1,
              }}
              whileHover={{
                scale: currentStep === totalSteps - 1 ? 1 : 1.1,
                x: currentStep === totalSteps - 1 ? 0 : -5,
              }}
              whileTap={{ scale: currentStep === totalSteps - 1 ? 1 : 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <Button
                size="icon"
                onClick={goToNextStep}
                disabled={currentStep === totalSteps - 1}
                className="w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </div>

        <MDXContentProvider additionalComponents={stepComponents}>
          <MDXContent />
        </MDXContentProvider>
      </div>

      <div className="relative w-full bg-gradient-to-r from-background/80 to-background border rounded-xl p-4 sm:p-6 backdrop-blur-sm shadow-sm">
        <div className="flex items-center justify-center">
          {Array.from({ length: totalSteps }, (_, index) => (
            <div key={`step-${index}`} className="flex items-center">
              <button
                onClick={() => goToStep(index)}
                className={`relative group flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  index === currentStep
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-110'
                    : completedStepsForLesson.has(`step-${index}`)
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                      : 'bg-muted hover:bg-muted/80 text-muted-foreground border-2 border-muted-foreground/20'
                }`}
                title={`Step ${index + 1}`}
              >
                {completedStepsForLesson.has(`step-${index}`) &&
                index !== currentStep ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-center"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.div>
                ) : (
                  <span className="text-xs font-semibold">{index + 1}</span>
                )}

                {index === currentStep && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-600/30"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  Step {index + 1}
                </div>
              </button>

              {index < totalSteps - 1 && (
                <div className="relative mx-2 h-0.5 w-8 bg-muted-foreground/20 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{
                      width: completedStepsForLesson.has(`step-${index}`)
                        ? '100%'
                        : '0%',
                    }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  />
                  {index === currentStep && (
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500/60 to-purple-600/60 rounded-full"
                      animate={{ width: ['0%', '100%', '0%'] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-xs font-medium shadow-sm border whitespace-nowrap">
          {completedStepsForLesson.size} of {totalSteps} completed
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8"
      >
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Lesson Progress
                </h3>
                <p className="text-muted-foreground mb-4">
                  Complete all steps and mark the lesson as finished to earn
                  points and unlock the next lesson.
                </p>

                <div className="flex items-center gap-4 mb-4">
                  <div className="text-sm">
                    <span className="font-semibold">
                      {completedStepsForLesson.size}
                    </span>{' '}
                    of <span className="font-semibold">{totalSteps}</span> steps
                    completed
                  </div>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-xs">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          totalSteps > 0
                            ? (completedStepsForLesson.size / totalSteps) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button
                  onClick={onComplete}
                  disabled={isCompleted}
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Lesson Completed
                    </>
                  ) : (
                    <>
                      <Trophy className="h-4 w-4 mr-2" />
                      Complete Lesson (+10 pts)
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
