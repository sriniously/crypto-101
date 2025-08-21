'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useProgress } from '@/lib/progress';
import { MODULES_MDX as modules } from '@/lib/course-mdx';
import CertificateGenerator from '@/components/achievements/certificate-generator';
import { motion } from 'framer-motion';
import {
  Trophy,
  BookOpen,
  Target,
  Download,
  Share2,
  BarChart3,
} from 'lucide-react';

export default function ProfilePage() {
  const {
    completedLessons,
    completedModules,
    achievements,
    totalPoints,
    currentModule,
    currentLesson,
  } = useProgress();

  const [showCertificate, setShowCertificate] = useState(false);

  const totalLessons = modules.reduce(
    (sum, module) => sum + module.lessons.length,
    0
  );
  const overallProgress = (completedLessons.length / totalLessons) * 100;

  const recentAchievements = achievements.slice(-3).reverse();

  const averageGrade =
    completedModules.length > 0 ? 85 + Math.random() * 10 : 0;

  const certificateData = {
    studentName: 'Web3 Student',
    courseName: 'Web3 Crypto 101: From Zero to DeFi Hero',
    completionDate: new Date(),
    grade: Math.round(averageGrade),
    credentialId: `CRYPTO101-${Date.now().toString(36).toUpperCase()}`,
    moduleScores: modules.reduce(
      (acc, module, idx) => {
        if (idx < completedModules.length) {
          acc[`Module ${module.number}`] = Math.round(80 + Math.random() * 20);
        }
        return acc;
      },
      {} as Record<string, number>
    ),
    skills: [
      'Blockchain Fundamentals',
      'Smart Contracts',
      'DeFi Protocols',
      'NFT Development',
      'Web3 Security',
      'dApp Architecture',
    ],
    totalHours: Math.round(
      completedLessons.length * 0.5 + completedModules.length * 2
    ),
  };

  const canGenerateCertificate =
    completedModules.length >= 6 && overallProgress >= 80;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              WL
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">Web3 Learner</h1>
              <p className="text-muted-foreground mb-4">
                Blockchain Enthusiast • Joined {new Date().toLocaleDateString()}
              </p>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {totalPoints}
                  </div>
                  <div className="text-sm text-muted-foreground">Points</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {completedLessons.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Lessons</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">
                    {completedModules.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Modules</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">
                    {achievements.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Achievements
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share Progress
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCertificate(!showCertificate)}
                disabled={!canGenerateCertificate}
              >
                <Download className="h-4 w-4 mr-2" />
                Certificate
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Learning Progress
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Overall Course Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {completedLessons.length}/{totalLessons} lessons
                    </span>
                  </div>
                  <Progress value={overallProgress} className="h-3" />
                  <p className="text-sm text-muted-foreground mt-1">
                    {Math.round(overallProgress)}% complete
                  </p>
                </div>

                {['foundation', 'defi', 'dapp'].map(track => {
                  const trackModules = modules.filter(m => m.track === track);
                  const trackLessons = trackModules.reduce(
                    (sum, m) => sum + m.lessons.length,
                    0
                  );
                  const completedTrackLessons = completedLessons.filter(id =>
                    trackModules.some(m => m.lessons.some(l => l.id === id))
                  ).length;
                  const trackProgress =
                    (completedTrackLessons / trackLessons) * 100;

                  return (
                    <div key={track}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="capitalize font-medium">
                          {track === 'foundation' && '🎯 Foundation Track'}
                          {track === 'defi' && '💰 DeFi Understanding Track'}
                          {track === 'dapp' && '🚀 dApp Concepts Track'}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {completedTrackLessons}/{trackLessons}
                        </span>
                      </div>
                      <Progress value={trackProgress} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </Card>

            {(currentModule || currentLesson) && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Continue Learning
                </h2>
                <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Currently Studying</h3>
                  <p className="text-sm text-muted-foreground">
                    {currentModule && `Module: ${currentModule}`}
                    {currentLesson && ` • Lesson: ${currentLesson}`}
                  </p>
                  <Button className="mt-3" size="sm">
                    Continue Learning
                  </Button>
                </div>
              </Card>
            )}

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Module Progress</h2>
              <div className="space-y-3">
                {modules.slice(0, 6).map(module => {
                  const moduleCompleted = completedModules.includes(module.id);
                  const moduleLessonsCompleted = module.lessons.filter(lesson =>
                    completedLessons.includes(lesson.id)
                  ).length;
                  const moduleProgress =
                    (moduleLessonsCompleted / module.lessons.length) * 100;

                  return (
                    <div key={module.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">
                            Module {module.number}: {module.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {moduleLessonsCompleted}/{module.lessons.length}{' '}
                            lessons
                          </p>
                        </div>
                        {moduleCompleted && (
                          <Badge className="bg-green-500 text-white">
                            Completed
                          </Badge>
                        )}
                      </div>
                      <Progress value={moduleProgress} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {showCertificate && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8"
            >
              <CertificateGenerator
                certificateData={certificateData}
                onDownload={() => console.log('Certificate downloaded')}
                onShare={() => console.log('Certificate shared')}
              />
            </motion.div>
          )}

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Recent Achievements
              </h2>
              {recentAchievements.length > 0 ? (
                <div className="space-y-3">
                  {recentAchievements.map(achievement => (
                    <div
                      key={achievement.id}
                      className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                    >
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <h3 className="font-medium">{achievement.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          {new Date(
                            achievement.unlockedAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Complete lessons to earn achievements!
                </p>
              )}
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Certificate
              </h2>
              {canGenerateCertificate ? (
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-300 font-medium mb-2">
                      🎉 Congratulations!
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      You&apos;ve completed enough modules to earn your
                      certificate!
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowCertificate(!showCertificate)}
                    className="w-full"
                    variant={showCertificate ? 'outline' : 'default'}
                  >
                    {showCertificate
                      ? 'Hide Certificate'
                      : 'Generate Certificate'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <p className="text-sm font-medium mb-1">Almost there!</p>
                    <p className="text-xs text-muted-foreground mb-2">
                      Complete {6 - completedModules.length} more modules and
                      maintain 80%+ progress
                    </p>
                    <Progress value={overallProgress} className="h-2" />
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Learning Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Lessons per day:
                  </span>
                  <span className="font-medium">2.3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current streak:</span>
                  <span className="font-medium">🔥 3 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Favorite topic:</span>
                  <span className="font-medium">DeFi</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time spent:</span>
                  <span className="font-medium">12h 30m</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Next Goals
              </h2>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <h3 className="font-medium text-sm">Complete 5 lessons</h3>
                  <p className="text-xs text-muted-foreground">
                    Unlock &quot;Making Progress&quot; achievement
                  </p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <h3 className="font-medium text-sm">
                    Finish Foundation Track
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Master the basics of blockchain
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
