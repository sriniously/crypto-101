'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileCourseCarousel } from '@/components/course/mobile-course-carousel';
import {
  PlayCircle,
  Lock,
  CheckCircle,
  Clock,
  BookOpen,
  ArrowRight,
  Target,
  Coins,
  Shield,
  Zap,
} from 'lucide-react';
import {
  TokenBTC,
  TokenETH,
  TokenUSDC,
  TokenUNI,
  TokenLINK,
  TokenAAVE,
  TokenCOMP,
  TokenMATIC,
  TokenSOL,
  TokenADA,
} from '@web3icons/react';
import { Module, Lesson } from '@/lib/course-data';

interface CoursePathProps {
  modules: Module[];
}

interface LessonNodeProps {
  lesson: Lesson;
  moduleId: string;
  isLocked: boolean;
  isCompleted: boolean;
  isCurrent: boolean;
  position: { x: number; y: number };
}

interface ModuleNodeProps {
  module: Module;
  position: { x: number; y: number };
  isUnlocked: boolean;
}

const LessonNode: React.FC<LessonNodeProps> = ({
  lesson,
  moduleId,
  isLocked,
  isCompleted,
  isCurrent,
  position,
}) => {
  const getStatusIcon = () => {
    if (isCompleted) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (isCurrent) return <PlayCircle className="w-4 h-4 text-main" />;
    if (isLocked) return <Lock className="w-4 h-4 text-gray-400" />;
    return <BookOpen className="w-4 h-4 text-blue-500" />;
  };

  const getCardStyle = () => {
    if (isCompleted)
      return 'bg-green-50 border-green-500 shadow-[3px_3px_0px_0px_#22c55e]';
    if (isCurrent)
      return 'bg-main/20 border-main shadow-[3px_3px_0px_0px_var(--main)]';
    if (isLocked)
      return 'bg-gray-50 border-gray-300 shadow-[3px_3px_0px_0px_#d1d5db] opacity-60';
    return 'bg-blue-50 border-blue-500 shadow-[3px_3px_0px_0px_#3b82f6] hover:shadow-[4px_4px_0px_0px_#3b82f6]';
  };

  const content = (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="absolute"
      style={{ left: position.x, top: position.y }}
    >
      <Card
        className={`p-3 sm:p-4 w-full max-w-64 sm:w-64 border-2 transition-all duration-200 ${getCardStyle()}`}
      >
        <div className="flex items-start gap-3">
          {getStatusIcon()}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs border-black">
                {lesson.number}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                {lesson.duration}m
              </Badge>
            </div>
            <h3 className="font-semibold text-sm mb-1 leading-tight">
              {lesson.title}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {lesson.description}
            </p>
            <div className="flex items-center gap-1 mt-2">
              <Target className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {lesson.objectives?.length || 0} objectives
              </span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  if (isLocked) {
    return content;
  }

  return <Link href={`/course/${moduleId}/${lesson.id}`}>{content}</Link>;
};

const ModuleNode: React.FC<ModuleNodeProps> = ({
  module,
  position,
  isUnlocked,
}) => {
  const cardStyle = isUnlocked
    ? 'bg-main border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000]'
    : 'bg-gray-100 border-gray-400 shadow-[4px_4px_0px_0px_#9ca3af] opacity-70';

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="absolute"
      style={{ left: position.x, top: position.y }}
    >
      <Card
        className={`p-4 sm:p-6 w-full max-w-80 sm:w-80 border-2 transition-all duration-200 ${cardStyle}`}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-main-foreground text-main flex items-center justify-center font-bold text-xl border-2 border-black">
              {module.number}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-secondary-background text-foreground border-black">
                Module {module.number}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {module.track}
              </Badge>
            </div>
            <h2 className="font-bold text-lg mb-1 leading-tight">
              {module.title}
            </h2>
            <p className="text-sm text-main-foreground/80 mb-3">
              {module.subtitle}
            </p>
            <p className="text-xs text-main-foreground/70 leading-relaxed mb-3">
              {module.description}
            </p>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {module.lessons.length} lessons
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {module.duration}m
                </span>
              </div>
              {isUnlocked && <ArrowRight className="w-4 h-4" />}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  if (!isUnlocked) {
    return content;
  }

  return <Link href={`/course/${module.id}`}>{content}</Link>;
};

const PathConnector: React.FC<{
  from: { x: number; y: number };
  to: { x: number; y: number };
}> = ({ from, to }) => {
  const midY = from.y + (to.y - from.y) / 2;

  return (
    <svg
      className="absolute pointer-events-none"
      style={{
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    >
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        d={`M ${from.x + 160} ${from.y + 100} Q ${from.x + 200} ${midY} ${
          to.x + 160
        } ${to.y}`}
        stroke="#facc00"
        strokeWidth="3"
        fill="none"
        strokeDasharray="8,4"
        className="drop-shadow-sm"
      />
    </svg>
  );
};

export const CoursePath: React.FC<CoursePathProps> = ({ modules }) => {
  const isMobile = useIsMobile();

  React.useEffect(() => {
    console.log(
      'isMobile:',
      isMobile,
      'window width:',
      typeof window !== 'undefined' ? window.innerWidth : 'SSR'
    );
  }, [isMobile]);

  const calculatePositions = () => {
    const positions: Array<{
      module: { x: number; y: number };
      lessons: Array<{ x: number; y: number }>;
    }> = [];
    let currentY = 100;

    modules.forEach((currentModule, _moduleIndex) => {
      const moduleX = 100;
      const moduleY = currentY;

      const lessonPositions = currentModule.lessons.map((_, lessonIndex) => ({
        x: 500 + (lessonIndex % 2) * 300,
        y: currentY + lessonIndex * 150,
      }));

      positions.push({
        module: { x: moduleX, y: moduleY },
        lessons: lessonPositions,
      });

      currentY += Math.max(300, currentModule.lessons.length * 150 + 100);
    });

    return positions;
  };

  const positions = calculatePositions();

  return (
    <div className="relative min-h-screen p-4 sm:p-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            className="flex justify-center items-center gap-3 sm:gap-6 mb-4 sm:mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <TokenBTC size={isMobile ? 48 : 72} variant="branded" />
            <TokenETH size={isMobile ? 48 : 72} variant="branded" />
            <Coins
              className={`${
                isMobile ? 'w-12 h-12' : 'w-16 h-16'
              } text-yellow-500`}
            />
            <Shield
              className={`${
                isMobile ? 'w-12 h-12' : 'w-16 h-16'
              } text-green-500`}
            />
          </motion.div>
          <Badge className="mb-3 sm:mb-4 border-2 border-black shadow-[2px_2px_0px_0px_#000] bg-main text-main-foreground text-xs sm:text-sm">
            <BookOpen className="w-3 h-3 mr-1" />
            Your Learning Journey
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 bg-clip-text text-transparent px-2 sm:px-0">
            Web3 Crypto 101
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-3 sm:mb-4 px-2 sm:px-0">
            From Zero to DeFi Hero
          </p>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4 sm:px-0">
            Master blockchain fundamentals, understand DeFi protocols, and build
            the future of finance through interactive lessons and hands-on
            simulations.
          </p>

          {!isMobile ? (
            <motion.div
              className="mb-8 max-w-5xl mx-auto relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.h3
                className="text-2xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                Understand the Entire Web3 Ecosystem
              </motion.h3>

              <div className="relative h-96 overflow-hidden">
                {[
                  {
                    icon: TokenBTC,
                    name: 'Bitcoin',
                    x: '10%',
                    y: '20%',
                    delay: 0,
                  },
                  {
                    icon: TokenETH,
                    name: 'Ethereum',
                    x: '85%',
                    y: '15%',
                    delay: 0.2,
                  },
                  {
                    icon: TokenUSDC,
                    name: 'USDC',
                    x: '70%',
                    y: '50%',
                    delay: 0.4,
                  },
                  {
                    icon: TokenUNI,
                    name: 'Uniswap',
                    x: '15%',
                    y: '70%',
                    delay: 0.6,
                  },
                  {
                    icon: TokenAAVE,
                    name: 'Aave',
                    x: '50%',
                    y: '10%',
                    delay: 0.8,
                  },
                  {
                    icon: TokenCOMP,
                    name: 'Compound',
                    x: '90%',
                    y: '75%',
                    delay: 1.0,
                  },
                  {
                    icon: TokenLINK,
                    name: 'Chainlink',
                    x: '25%',
                    y: '45%',
                    delay: 1.2,
                  },
                  {
                    icon: TokenMATIC,
                    name: 'Polygon',
                    x: '60%',
                    y: '80%',
                    delay: 1.4,
                  },
                  {
                    icon: TokenSOL,
                    name: 'Solana',
                    x: '80%',
                    y: '30%',
                    delay: 1.6,
                  },
                  {
                    icon: TokenADA,
                    name: 'Cardano',
                    x: '40%',
                    y: '60%',
                    delay: 1.8,
                  },
                ].map((token, index) => (
                  <motion.div
                    key={token.name}
                    className="absolute cursor-pointer group"
                    style={{ left: token.x, top: token.y }}
                    initial={{
                      opacity: 0,
                      scale: 0,
                      rotate: -180,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      rotate: 0,
                      y: [0, -20, 0],
                      x: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 0.8,
                      delay: token.delay,
                      type: 'spring',
                      stiffness: 100,
                      y: {
                        duration: 4 + index * 0.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: index * 0.3,
                      },
                      x: {
                        duration: 6 + index * 0.3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: index * 0.2,
                      },
                    }}
                    whileHover={{
                      scale: 1.3,
                      rotate: 15,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{
                      scale: 0.9,
                      rotate: -15,
                    }}
                  >
                    <motion.div
                      className="relative"
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 20 + index * 5,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    >
                      <token.icon
                        size={48 + (index % 3) * 8}
                        variant="branded"
                        className="filter drop-shadow-2xl hover:drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                      />

                      <motion.div
                        className="absolute inset-0 rounded-full bg-blue-400/20"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0, 0.3, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: index * 0.4,
                        }}
                      />
                    </motion.div>

                    <motion.div
                      className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap"
                      initial={{ y: 10 }}
                      whileHover={{ y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {token.name}
                    </motion.div>
                  </motion.div>
                ))}

                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{ zIndex: -1 }}
                >
                  <defs>
                    <linearGradient
                      id="connectionGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
                      <stop
                        offset="50%"
                        stopColor="#8b5cf6"
                        stopOpacity="0.2"
                      />
                      <stop
                        offset="100%"
                        stopColor="#06b6d4"
                        stopOpacity="0.1"
                      />
                    </linearGradient>
                  </defs>

                  <motion.circle
                    cx="50%"
                    cy="50%"
                    r="120"
                    fill="none"
                    stroke="url(#connectionGradient)"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                      pathLength: 1,
                      opacity: [0, 0.5, 0],
                      rotate: [0, 360],
                    }}
                    transition={{
                      pathLength: { duration: 3, delay: 2 },
                      opacity: {
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      },
                      rotate: {
                        duration: 30,
                        repeat: Infinity,
                        ease: 'linear',
                      },
                    }}
                  />

                  <motion.circle
                    cx="50%"
                    cy="50%"
                    r="180"
                    fill="none"
                    stroke="url(#connectionGradient)"
                    strokeWidth="0.5"
                    strokeDasharray="2,6"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                      pathLength: 1,
                      opacity: [0, 0.3, 0],
                      rotate: [360, 0],
                    }}
                    transition={{
                      pathLength: { duration: 4, delay: 2.5 },
                      opacity: {
                        duration: 6,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      },
                      rotate: {
                        duration: 40,
                        repeat: Infinity,
                        ease: 'linear',
                      },
                    }}
                  />
                </svg>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="mb-6 px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h3 className="text-xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Master Web3 Ecosystem
              </h3>
              <div className="grid grid-cols-5 gap-2 max-w-sm mx-auto">
                {[TokenBTC, TokenETH, TokenUSDC, TokenUNI, TokenAAVE].map(
                  (Icon, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      className="flex justify-center"
                    >
                      <Icon size={32} variant="branded" />
                    </motion.div>
                  )
                )}
              </div>
            </motion.div>
          )}

          <div className="flex justify-center gap-4 sm:gap-8 text-xs sm:text-sm px-4">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-main border border-black rounded-full"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 border border-black rounded-full"></div>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-300 border border-black rounded-full"></div>
              <span>Locked</span>
            </div>
          </div>
        </motion.div>

        <div className="block md:hidden">
          <MobileCourseCarousel modules={modules} />
        </div>
        <div className="hidden md:block">
          <div
            className="relative"
            style={{
              height: `${
                positions[positions.length - 1]?.module.y + 400 || 800
              }px`,
            }}
          >
            {positions.map((pos, moduleIndex) => {
              const currentModule = modules[moduleIndex];
              const isUnlocked = moduleIndex === 0 || true;

              return (
                <React.Fragment key={currentModule.id}>
                  <ModuleNode
                    module={currentModule}
                    position={pos.module}
                    isUnlocked={isUnlocked}
                  />

                  {pos.lessons.map((lessonPos, lessonIndex) => {
                    const lesson = currentModule.lessons[lessonIndex];
                    const isLocked = !isUnlocked || lessonIndex > 0;
                    const isCompleted = false;
                    const isCurrent = moduleIndex === 0 && lessonIndex === 0;

                    return (
                      <React.Fragment key={lesson.id}>
                        <PathConnector from={pos.module} to={lessonPos} />
                        <LessonNode
                          lesson={lesson}
                          moduleId={currentModule.id}
                          isLocked={isLocked}
                          isCompleted={isCompleted}
                          isCurrent={isCurrent}
                          position={lessonPos}
                        />
                      </React.Fragment>
                    );
                  })}

                  {moduleIndex < modules.length - 1 && (
                    <PathConnector
                      from={{ x: pos.module.x, y: pos.module.y + 100 }}
                      to={positions[moduleIndex + 1].module}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-8 sm:mt-12 mx-4 sm:mx-0 p-4 sm:p-8 bg-gradient-to-r from-blue-600 to-purple-600 border-2 border-black shadow-[3px_3px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000] rounded-lg"
        >
          <div className="flex justify-center items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
            <TokenBTC
              size={isMobile ? 24 : 36}
              variant="branded"
              className="text-orange-300"
            />
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Ready to Enter Web3?
            </h2>
            <TokenETH
              size={isMobile ? 24 : 36}
              variant="branded"
              className="text-blue-300"
            />
          </div>
          <p className="text-blue-100 mb-4 sm:mb-6 text-sm sm:text-base px-2 sm:px-0">
            Begin your journey from Web2 dependency to Web3 ownership with
            interactive lessons, real simulations, and practical understanding.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Button
              size={isMobile ? 'default' : 'lg'}
              className="bg-orange-500 hover:bg-orange-600 text-white border-2 border-orange-700 shadow-[2px_2px_0px_0px_#ea580c] hover:shadow-[3px_3px_0px_0px_#ea580c] sm:hover:shadow-[4px_4px_0px_0px_#ea580c] font-semibold w-full sm:w-auto"
              asChild
            >
              <Link href="/course/module-1/lesson-1-1">
                <PlayCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Start Your Web3 Journey
              </Link>
            </Button>
            <div className="flex items-center gap-2 text-blue-100 text-xs sm:text-sm">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>~2 hours to complete Module 1</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
