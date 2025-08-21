import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useState, useEffect } from 'react';
import { Achievement } from './types';

export interface Progress {
  completedLessons: string[];
  completedModules: string[];
  completedSteps: Record<string, string[]>;
  currentModule?: string;
  currentLesson?: string;
  achievements: Achievement[];
  totalPoints: number;
  codeSnippets: Record<string, string>;
  quizScores: Record<string, number>;
}

interface ProgressStore extends Progress {
  markLessonComplete: (lessonId: string) => void;
  markModuleComplete: (moduleId: string) => void;
  markStepComplete: (lessonId: string, stepId: string) => void;
  markStepIncomplete: (lessonId: string, stepId: string) => void;
  setCurrentLesson: (moduleId: string, lessonId: string) => void;
  addAchievement: (achievement: Omit<Achievement, 'unlockedAt'>) => void;
  saveCodeSnippet: (lessonId: string, code: string) => void;
  saveQuizScore: (assessmentId: string, score: number) => void;
  reset: () => void;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

const initialState: Progress = {
  completedLessons: [],
  completedModules: [],
  completedSteps: {},
  achievements: [],
  totalPoints: 0,
  codeSnippets: {},
  quizScores: {},
};

export const useProgress = create<ProgressStore>()(
  persist(
    set => ({
      ...initialState,
      hasHydrated: false,

      setHasHydrated: state => {
        set({
          hasHydrated: state,
        });
      },

      markLessonComplete: lessonId =>
        set(state => {
          if (state.completedLessons.includes(lessonId)) return state;
          return {
            completedLessons: [...state.completedLessons, lessonId],
            totalPoints: state.totalPoints + 10,
          };
        }),

      markModuleComplete: moduleId =>
        set(state => {
          if (state.completedModules.includes(moduleId)) return state;
          return {
            completedModules: [...state.completedModules, moduleId],
            totalPoints: state.totalPoints + 100,
          };
        }),

      markStepComplete: (lessonId, stepId) =>
        set(state => {
          const currentSteps = state.completedSteps[lessonId] || [];
          if (currentSteps.includes(stepId)) return state;
          return {
            completedSteps: {
              ...state.completedSteps,
              [lessonId]: [...currentSteps, stepId],
            },
          };
        }),

      markStepIncomplete: (lessonId, stepId) =>
        set(state => {
          const currentSteps = state.completedSteps[lessonId] || [];
          const filteredSteps = currentSteps.filter(id => id !== stepId);
          return {
            completedSteps: {
              ...state.completedSteps,
              [lessonId]: filteredSteps,
            },
          };
        }),

      setCurrentLesson: (moduleId, lessonId) =>
        set({ currentModule: moduleId, currentLesson: lessonId }),

      addAchievement: achievement =>
        set(state => ({
          achievements: [
            ...state.achievements,
            { ...achievement, unlockedAt: new Date() },
          ],
          totalPoints: state.totalPoints + 50,
        })),

      saveCodeSnippet: (lessonId, code) =>
        set(state => ({
          codeSnippets: { ...state.codeSnippets, [lessonId]: code },
        })),

      saveQuizScore: (assessmentId, score) =>
        set(state => ({
          quizScores: { ...state.quizScores, [assessmentId]: score },
        })),

      reset: () => set(initialState),
    }),
    {
      name: 'crypto-101-progress',
      partialize: state => ({
        ...state,
        achievements: state.achievements.map(achievement => ({
          ...achievement,
          unlockedAt: achievement.unlockedAt.toISOString(),
        })),
      }),
      onRehydrateStorage: () => state => {
        if (state) {
          state.achievements = state.achievements.map(achievement => ({
            ...achievement,
            unlockedAt: new Date(achievement.unlockedAt),
          }));
        }
        useProgress.getState().setHasHydrated(true);
      },
    }
  )
);

export function calculateModuleProgress(
  moduleId: string,
  completedLessons: string[],
  totalLessons: number
): number {
  const moduleCompletedLessons = completedLessons.filter(id =>
    id.startsWith(`lesson-${moduleId.split('-')[1]}`)
  ).length;
  return totalLessons > 0 ? (moduleCompletedLessons / totalLessons) * 100 : 0;
}

export function getAchievementForQuiz(
  score: number,
  assessmentId: string
): Achievement | null {
  if (score >= 100) {
    return {
      id: `perfect-${assessmentId}`,
      title: 'Perfect Score!',
      description: 'Got 100% on a quiz!',
      icon: '💯',
      unlockedAt: new Date(),
    };
  } else if (score >= 90) {
    return {
      id: `excellent-${assessmentId}`,
      title: 'Excellent!',
      description: 'Scored 90%+ on a quiz!',
      icon: '⭐',
      unlockedAt: new Date(),
    };
  }
  return null;
}

export function useHydratedProgress() {
  const [isClient, setIsClient] = useState(false);
  const progress = useProgress();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return {
      ...progress,
      completedLessons: [],
      completedModules: [],
      totalPoints: 0,
      achievements: [],
    };
  }

  return progress;
}

export function getAchievementForMilestone(
  completedLessons: number
): Achievement | null {
  const milestones = [
    {
      count: 1,
      achievement: {
        id: 'first-lesson',
        title: 'First Steps',
        description: 'Completed your first lesson!',
        icon: '🎯',
      },
    },
    {
      count: 5,
      achievement: {
        id: 'five-lessons',
        title: 'Making Progress',
        description: 'Completed 5 lessons!',
        icon: '⭐',
      },
    },
    {
      count: 10,
      achievement: {
        id: 'ten-lessons',
        title: 'Dedicated Learner',
        description: 'Completed 10 lessons!',
        icon: '🏆',
      },
    },
    {
      count: 25,
      achievement: {
        id: 'twenty-five-lessons',
        title: 'Web3 Enthusiast',
        description: 'Completed 25 lessons!',
        icon: '🚀',
      },
    },
    {
      count: 50,
      achievement: {
        id: 'fifty-lessons',
        title: 'Blockchain Expert',
        description: 'Completed 50 lessons!',
        icon: '💎',
      },
    },
  ];

  const milestone = milestones.find(m => m.count === completedLessons);
  return milestone
    ? { ...milestone.achievement, unlockedAt: new Date() }
    : null;
}
