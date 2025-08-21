'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  getModuleByIdMDX,
  getLessonByIdMDX,
  getNextLessonMDX,
  getPreviousLessonMDX,
} from '@/lib/course-mdx';
import {
  useHydratedProgress,
  getAchievementForMilestone,
} from '@/lib/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import Confetti from 'react-confetti';
import { ChevronLeft, CheckCircle, Trophy } from 'lucide-react';

import { MDXLessonWithSteps } from '@/components/course/mdx-lesson-with-steps';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params.moduleId as string;
  const lessonId = params.lessonId as string;
  const [showConfetti, setShowConfetti] = useState(false);

  const currentModule = getModuleByIdMDX(moduleId);
  const lesson = getLessonByIdMDX(moduleId, lessonId);
  const nextLessonData = getNextLessonMDX(moduleId, lessonId);
  const previousLessonData = getPreviousLessonMDX(moduleId, lessonId);

  const {
    completedLessons,
    markLessonComplete,
    setCurrentLesson,
    addAchievement,
    totalPoints,
  } = useHydratedProgress();

  useEffect(() => {
    if (lesson) {
      setCurrentLesson(moduleId, lessonId);
    }
  }, [lesson, moduleId, lessonId, setCurrentLesson]);

  if (!currentModule || !lesson) {
    return <div>Lesson not found</div>;
  }

  const isCompleted = completedLessons.includes(lessonId);

  const handleCompleteLesson = () => {
    if (!isCompleted) {
      markLessonComplete(lessonId);
      setShowConfetti(true);
      toast.success('Lesson completed! +10 points', {
        icon: <Trophy className="h-5 w-5 text-yellow-500" />,
      });

      const totalCompleted = completedLessons.length + 1;

      const milestoneAchievement = getAchievementForMilestone(totalCompleted);
      if (milestoneAchievement) {
        addAchievement(milestoneAchievement);
        toast.success(`Achievement unlocked: ${milestoneAchievement.title}!`, {
          icon: <Trophy className="h-5 w-5 text-yellow-500" />,
        });
      }

      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  const handleNextLesson = () => {
    if (nextLessonData) {
      router.push(
        `/course/${nextLessonData.module.id}/${nextLessonData.lesson.id}`
      );
    }
  };

  const handlePreviousLesson = () => {
    if (previousLessonData) {
      router.push(
        `/course/${previousLessonData.module.id}/${previousLessonData.lesson.id}`
      );
    } else {
      router.push(`/course/${moduleId}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <AnimatePresence>
        {showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={200}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="sm" onClick={handlePreviousLesson}>
              <ChevronLeft className="h-4 w-4" />
              Back to Module
            </Button>
          </div>

          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">Lesson {lesson.number}</Badge>
                <Badge
                  variant="default"
                  className={`bg-green-500 transition-opacity duration-200 ${
                    isCompleted
                      ? 'opacity-100'
                      : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              </div>

              <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
              <p className="text-lg text-muted-foreground">
                {lesson.description}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-muted-foreground">Points earned</p>
              <p className="text-2xl font-bold">{totalPoints}</p>
            </div>
          </div>
        </div>

        <MDXLessonWithSteps
          moduleId={moduleId}
          lessonId={lessonId}
          frontmatter={{
            title: lesson.title,
            description: lesson.description,
            objectives: lesson.objectives,
            duration: lesson.duration,
            simulations: lesson.simulations,
          }}
          onComplete={handleCompleteLesson}
          isCompleted={isCompleted}
          onPreviousLesson={handlePreviousLesson}
          onNextLesson={handleNextLesson}
          hasPreviousLesson={!!previousLessonData}
          hasNextLesson={!!nextLessonData}
        />
      </motion.div>
    </div>
  );
}
