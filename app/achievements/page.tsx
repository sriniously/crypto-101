'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useProgress } from '@/lib/progress';
import { motion } from 'framer-motion';
import { Trophy, Target, Award, Crown, Zap } from 'lucide-react';

const allAchievements = [
  {
    id: 'first-lesson',
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🎯',
    points: 50,
    requirement: 1,
    type: 'lessons',
  },
  {
    id: 'five-lessons',
    title: 'Making Progress',
    description: 'Complete 5 lessons',
    icon: '⭐',
    points: 100,
    requirement: 5,
    type: 'lessons',
  },
  {
    id: 'ten-lessons',
    title: 'Dedicated Learner',
    description: 'Complete 10 lessons',
    icon: '🏆',
    points: 200,
    requirement: 10,
    type: 'lessons',
  },
  {
    id: 'module-complete',
    title: 'Module Master',
    description: 'Complete your first module',
    icon: '🎓',
    points: 250,
    requirement: 1,
    type: 'modules',
  },
  {
    id: 'simulation-expert',
    title: 'Simulation Expert',
    description: 'Try all simulations in a module',
    icon: '🔬',
    points: 150,
    requirement: 4,
    type: 'simulations',
  },
  {
    id: 'streak-week',
    title: 'Weekly Warrior',
    description: 'Learn for 7 days straight',
    icon: '🔥',
    points: 300,
    requirement: 7,
    type: 'streak',
  },
];

export default function AchievementsPage() {
  const { completedLessons, completedModules, achievements, totalPoints } =
    useProgress();

  const getProgress = (achievement: any) => {
    switch (achievement.type) {
      case 'lessons':
        return Math.min(completedLessons.length, achievement.requirement);
      case 'modules':
        return Math.min(completedModules.length, achievement.requirement);
      default:
        return 0;
    }
  };

  const isUnlocked = (achievement: any) => {
    return achievements.some(a => a.id === achievement.id);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Achievements</h1>
          <p className="text-xl text-muted-foreground">
            Track your Web3 learning journey and celebrate your progress
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center">
            <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">{totalPoints}</div>
            <div className="text-sm text-muted-foreground">Total Points</div>
          </Card>
          <Card className="p-4 text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-gold-500" />
            <div className="text-2xl font-bold">{achievements.length}</div>
            <div className="text-sm text-muted-foreground">Achievements</div>
          </Card>
          <Card className="p-4 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{completedLessons.length}</div>
            <div className="text-sm text-muted-foreground">Lessons</div>
          </Card>
          <Card className="p-4 text-center">
            <Crown className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">{completedModules.length}</div>
            <div className="text-sm text-muted-foreground">Modules</div>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allAchievements.map((achievement, index) => {
            const progress = getProgress(achievement);
            const unlocked = isUnlocked(achievement);
            const progressPercentage =
              (progress / achievement.requirement) * 100;

            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className={`p-6 relative overflow-hidden ${
                    unlocked
                      ? 'border-gold-200 bg-gold-50 dark:bg-gold-950/10'
                      : ''
                  }`}
                >
                  {unlocked && (
                    <div className="absolute top-2 right-2">
                      <Award className="h-6 w-6 text-gold-500" />
                    </div>
                  )}

                  <div className="text-center mb-4">
                    <div
                      className={`text-4xl mb-2 ${unlocked ? '' : 'grayscale opacity-50'}`}
                    >
                      {achievement.icon}
                    </div>
                    <h3
                      className={`text-lg font-semibold ${unlocked ? 'text-gold-700 dark:text-gold-300' : ''}`}
                    >
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Progress
                      </span>
                      <Badge variant={unlocked ? 'default' : 'secondary'}>
                        {progress}/{achievement.requirement}
                      </Badge>
                    </div>

                    <Progress
                      value={progressPercentage}
                      className={`h-2 ${unlocked ? 'bg-gold-200' : ''}`}
                    />

                    <div className="text-center">
                      <Badge variant="outline" className="text-xs">
                        +{achievement.points} points
                      </Badge>
                    </div>
                  </div>

                  {unlocked && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 pointer-events-none"
                    >
                      <div className="absolute top-4 left-4 w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
                      <div className="absolute top-8 right-8 w-1 h-1 bg-gold-300 rounded-full animate-pulse delay-300" />
                      <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-gold-500 rounded-full animate-pulse delay-700" />
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
            <h3 className="text-2xl font-bold mb-4">Keep Learning!</h3>
            <p className="text-muted-foreground mb-6">
              Complete more lessons and modules to unlock additional
              achievements and earn more points.
            </p>
            <div className="flex justify-center gap-4">
              <Badge className="text-sm px-4 py-2">
                🎯 Next: Complete 5 lessons for ⭐ Making Progress
              </Badge>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
