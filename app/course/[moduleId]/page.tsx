'use client';

import { useParams, useRouter } from 'next/navigation';
import { getModuleByIdMDX } from '@/lib/course-mdx';
import { useProgress } from '@/lib/progress';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  PlayCircle,
  CheckCircle,
  Book,
  Code,
  Zap,
  Target,
  Trophy,
} from 'lucide-react';

export default function ModulePage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params.moduleId as string;
  const currentModule = getModuleByIdMDX(moduleId);
  const {
    completedLessons,
    completedModules,
    markModuleComplete,
    addAchievement,
  } = useProgress();

  if (!currentModule) {
    return <div>Module not found</div>;
  }

  const completedLessonsInModule = currentModule.lessons.filter(lesson =>
    completedLessons.includes(lesson.id)
  ).length;

  const moduleProgress =
    (completedLessonsInModule / currentModule.lessons.length) * 100;
  const isModuleCompleted = completedModules.includes(currentModule.id);

  const handleCompleteModule = () => {
    if (!isModuleCompleted && moduleProgress === 100) {
      markModuleComplete(currentModule.id);

      addAchievement({
        id: `module-complete-${currentModule.id}`,
        title: 'Module Master',
        description: `Completed ${currentModule.title}!`,
        icon: '🎓',
      });

      toast.success('Module completed! +100 points', {
        icon: <Trophy className="h-5 w-5 text-yellow-500" />,
      });
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'concept':
        return Book;
      case 'simulation':
        return Zap;
      case 'demo':
        return PlayCircle;
      case 'exercise':
        return Code;
      default:
        return Book;
    }
  };

  const handleStartLesson = (lessonId: string) => {
    router.push(`/course/${moduleId}/${lessonId}`);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 sm:mb-8">
          <Badge
            className="mb-3 sm:mb-4 text-xs sm:text-sm"
            variant={
              currentModule.track === 'foundation'
                ? 'default'
                : currentModule.track === 'defi'
                  ? 'secondary'
                  : 'outline'
            }
          >
            Module {currentModule.number}
          </Badge>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
            {currentModule.title}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-3 sm:mb-4">
            {currentModule.subtitle}
          </p>
          <p className="text-sm sm:text-base lg:text-lg italic text-muted-foreground">
            {currentModule.description}
          </p>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Module Progress</span>
              <span className="text-sm text-muted-foreground">
                {Math.round(moduleProgress)}%
              </span>
            </div>
            <Progress value={moduleProgress} className="h-3" />
          </div>
        </div>

        <Card className="p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
            <Target className="h-4 w-4 sm:h-5 sm:w-5" />
            Learning Objectives
          </h2>
          <ul className="space-y-2">
            {currentModule.objectives.map((objective, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start gap-2"
              >
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm sm:text-base">{objective}</span>
              </motion.li>
            ))}
          </ul>
        </Card>

        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
            Lessons
          </h2>
          {currentModule.lessons.map((lesson, index) => {
            const isCompleted = completedLessons.includes(lesson.id);

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card
                  className="p-4 sm:p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleStartLesson(lesson.id)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-0.5 sm:mt-1">
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                        ) : (
                          <Book className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                            Lesson {lesson.number}
                          </span>
                          <Badge
                            variant="secondary"
                            className={`text-xs transition-opacity duration-200 ${
                              isCompleted
                                ? 'opacity-100'
                                : 'opacity-0 pointer-events-none'
                            }`}
                          >
                            Completed
                          </Badge>
                        </div>

                        <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">
                          {lesson.title}
                        </h3>
                        <p className="text-sm sm:text-base text-muted-foreground">
                          {lesson.description}
                        </p>

                        {lesson.simulations &&
                          lesson.simulations.length > 0 && (
                            <div className="mt-2 sm:mt-3 flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                              <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
                              {lesson.simulations.length} interactive simulation
                              {lesson.simulations.length > 1 ? 's' : ''}
                            </div>
                          )}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={e => {
                        e.stopPropagation();
                        handleStartLesson(lesson.id);
                      }}
                      className="w-full sm:w-auto"
                    >
                      {isCompleted ? 'Review' : 'Start'}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {moduleProgress === 100 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8"
          >
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200 dark:border-yellow-800">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold mb-2 flex items-center gap-2">
                      <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                      Module Complete!
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                      🎉 Congratulations! You&apos;ve finished all lessons in
                      this module. Complete the module to earn bonus points and
                      unlock achievements.
                    </p>

                    <div className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium">
                      ✅ All {currentModule.lessons.length} lessons completed
                    </div>
                  </div>

                  <div className="text-center">
                    <Button
                      onClick={handleCompleteModule}
                      disabled={isModuleCompleted}
                      size="default"
                      className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 w-full sm:w-auto"
                    >
                      {isModuleCompleted ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Module Completed
                        </>
                      ) : (
                        <>
                          <Trophy className="h-4 w-4 mr-2" />
                          Complete Module (+100 pts)
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
