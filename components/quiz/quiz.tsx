'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CheckCircle,
  XCircle,
  Brain,
  Lightbulb,
  RefreshCw,
  Trophy,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProgress, getAchievementForQuiz } from '@/lib/progress';
import { toast } from 'sonner';

interface QuizOption {
  id: string;
  text: string;
  correct?: boolean;
}

interface QuizQuestion {
  id: string;
  type: 'single' | 'multiple';
  question: string;
  options: QuizOption[];
  explanation?: string;
  hint?: string;
  points?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface QuizProps {
  id: string;
  title?: string;
  description?: string;
  questions: QuizQuestion[];
  passingScore?: number;
  maxAttempts?: number;
  showHints?: boolean;
  onComplete?: (score: number, passed: boolean) => void;
}

export function Quiz({
  id,
  title = 'Knowledge Check',
  description,
  questions,
  passingScore = 70,
  maxAttempts = 3,
  showHints = true,
  onComplete,
}: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string[]>
  >({});
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const { saveQuizScore, quizScores, addAchievement } = useProgress();

  const getQuizScore = useCallback(
    (assessmentId: string) => quizScores[assessmentId] || 0,
    [quizScores]
  );

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const totalQuestions = questions.length;

  useEffect(() => {
    const savedAttempts = localStorage.getItem(`quiz-attempts-${id}`);
    if (savedAttempts) {
      setAttemptCount(parseInt(savedAttempts));
    }

    const savedScore = getQuizScore(id);
    if (savedScore && savedScore >= passingScore) {
      setQuizCompleted(true);
    }
  }, [id, passingScore, getQuizScore]);

  const handleOptionSelect = (optionId: string) => {
    if (showResults) return;

    const questionId = currentQuestion.id;

    if (currentQuestion.type === 'single') {
      setSelectedAnswers(prev => ({
        ...prev,
        [questionId]: [optionId],
      }));
    } else {
      setSelectedAnswers(prev => {
        const current = prev[questionId] || [];
        const isSelected = current.includes(optionId);

        return {
          ...prev,
          [questionId]: isSelected
            ? current.filter(id => id !== optionId)
            : [...current, optionId],
        };
      });
    }
  };

  const calculateScore = () => {
    let totalPoints = 0;
    let earnedPoints = 0;

    questions.forEach(question => {
      const questionPoints = question.points || 1;
      totalPoints += questionPoints;

      const userAnswers = selectedAnswers[question.id] || [];
      const correctOptions = question.options
        .filter(opt => opt.correct)
        .map(opt => opt.id);

      if (question.type === 'single') {
        if (
          userAnswers.length === 1 &&
          correctOptions.includes(userAnswers[0])
        ) {
          earnedPoints += questionPoints;
        }
      } else {
        const correctSelected = userAnswers.filter(id =>
          correctOptions.includes(id)
        ).length;
        const incorrectSelected = userAnswers.filter(
          id => !correctOptions.includes(id)
        ).length;
        const correctNotSelected = correctOptions.filter(
          id => !userAnswers.includes(id)
        ).length;

        if (incorrectSelected === 0 && correctNotSelected === 0) {
          earnedPoints += questionPoints;
        } else if (correctSelected > 0 && incorrectSelected === 0) {
          earnedPoints +=
            (correctSelected / correctOptions.length) * questionPoints;
        }
      }
    });

    return Math.round((earnedPoints / totalPoints) * 100);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswers[currentQuestion.id]?.length) return;

    setShowResults(true);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      handleSubmitQuiz();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowResults(false);
      setShowExplanation(false);
    }
  };

  const handleSubmitQuiz = () => {
    const score = calculateScore();
    const passed = score >= passingScore;
    const newAttemptCount = attemptCount + 1;

    setAttemptCount(newAttemptCount);
    localStorage.setItem(`quiz-attempts-${id}`, newAttemptCount.toString());

    if (passed) {
      setQuizCompleted(true);
      saveQuizScore(id, score);

      toast.success(`Quiz passed! Score: ${score}%`, {
        icon: <Trophy className="h-5 w-5 text-yellow-500" />,
      });

      const achievement = getAchievementForQuiz(score, id);
      if (achievement) {
        addAchievement(achievement);
        toast.success(`Achievement unlocked: ${achievement.title}!`, {
          icon: <Trophy className="h-5 w-5 text-yellow-500" />,
        });
      }
    } else {
      toast.error(
        `Quiz failed. Score: ${score}% (Need ${passingScore}% to pass)`
      );
    }

    onComplete?.(score, passed);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setShowExplanation(false);
  };

  const getOptionStatus = (option: QuizOption) => {
    if (!showResults) return null;

    const userAnswers = selectedAnswers[currentQuestion.id] || [];
    const isSelected = userAnswers.includes(option.id);
    const isCorrect = option.correct;

    if (isSelected && isCorrect) return 'correct';
    if (isSelected && !isCorrect) return 'incorrect';
    if (!isSelected && isCorrect) return 'missed';
    return null;
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'hard':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-blue-500" />
            <div>
              <CardTitle className="text-xl">{title}</CardTitle>
              {description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {currentQuestionIndex + 1} / {totalQuestions}
            </Badge>
            {currentQuestion.difficulty && (
              <div
                className={cn(
                  'w-3 h-3 rounded-full',
                  getDifficultyColor(currentQuestion.difficulty)
                )}
              />
            )}
          </div>
        </div>

        <Progress value={progress} className="mt-4" />

        {maxAttempts && attemptCount >= maxAttempts && !quizCompleted && (
          <Alert>
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              You&apos;ve reached the maximum number of attempts ({maxAttempts}
              ).
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>

      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium leading-relaxed">
                  {currentQuestion.question}
                </h3>

                {currentQuestion.hint && showHints && !showResults && (
                  <Alert>
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Hint:</strong> {currentQuestion.hint}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-3">
                {currentQuestion.options.map(option => {
                  const status = getOptionStatus(option);
                  const isSelected = selectedAnswers[
                    currentQuestion.id
                  ]?.includes(option.id);

                  return (
                    <motion.div
                      key={option.id}
                      whileHover={!showResults ? { scale: 1.02 } : {}}
                      whileTap={!showResults ? { scale: 0.98 } : {}}
                    >
                      <button
                        onClick={() => handleOptionSelect(option.id)}
                        disabled={showResults}
                        className={cn(
                          'w-full p-4 text-left border rounded-lg transition-all duration-200',
                          'hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                          isSelected &&
                            !showResults &&
                            'border-blue-500 bg-blue-50 dark:bg-blue-950/20',
                          status === 'correct' &&
                            'border-green-500 bg-green-50 dark:bg-green-950/20',
                          status === 'incorrect' &&
                            'border-red-500 bg-red-50 dark:bg-red-950/20',
                          status === 'missed' &&
                            'border-orange-500 bg-orange-50 dark:bg-orange-950/20',
                          showResults && 'cursor-default'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{option.text}</span>
                          {showResults && (
                            <div>
                              {status === 'correct' && (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              )}
                              {status === 'incorrect' && (
                                <XCircle className="h-5 w-5 text-red-500" />
                              )}
                              {status === 'missed' && (
                                <CheckCircle className="h-5 w-5 text-orange-500" />
                              )}
                            </div>
                          )}
                        </div>
                      </button>
                    </motion.div>
                  );
                })}
              </div>

              {showExplanation && currentQuestion.explanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert>
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Explanation:</strong>{' '}
                      {currentQuestion.explanation}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <div className="flex justify-between items-center pt-4">
                <Button
                  variant="outline"
                  onClick={resetQuiz}
                  disabled={currentQuestionIndex === 0 && !showResults}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset
                </Button>

                <div className="flex gap-3">
                  {!showResults ? (
                    <Button
                      onClick={handleSubmitAnswer}
                      disabled={!selectedAnswers[currentQuestion.id]?.length}
                    >
                      Submit Answer
                    </Button>
                  ) : (
                    <Button onClick={handleNextQuestion}>
                      {isLastQuestion ? 'Complete Quiz' : 'Next Question'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
