'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { MODULES_MDX as modules } from '@/lib/course-mdx';
import { useHydratedProgress, calculateModuleProgress } from '@/lib/progress';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, User } from 'lucide-react';
import {
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';

export function CourseNavigation() {
  const pathname = usePathname();
  const { completedLessons, completedModules, totalPoints } =
    useHydratedProgress();

  const currentModuleId = pathname.split('/')[2];

  return (
    <div className="flex flex-col h-full min-w-0">
      <div className="flex-1 overflow-y-auto sidebar-scrollbar min-h-0 pt-4">
        <SidebarGroup className="flex-shrink-0">
          <SidebarGroupContent>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl p-4 mx-4 my-4 border border-blue-100 dark:border-blue-800/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  Your Progress
                </span>
                <Badge
                  variant="secondary"
                  className="text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
                >
                  🎯 {totalPoints} pts
                </Badge>
              </div>
              <Progress
                value={(completedLessons.length / 48) * 100}
                className="h-3 mb-3"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground font-medium">
                  {completedLessons.length} of 48 lessons completed
                </p>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  {Math.round((completedLessons.length / 48) * 100)}%
                </span>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {['foundation', 'defi', 'dapp'].map((track, index) => (
          <SidebarGroup
            key={track}
            className={cn('flex-shrink-0', index > 0 ? 'mt-2' : 'mt-1')}
          >
            <SidebarGroupLabel className="text-xs font-black uppercase tracking-wider px-4 py-2 text-gray-600 dark:text-gray-400 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg mx-3 mb-3 shadow-sm border border-gray-200/50 dark:border-gray-600/30">
              {track === 'foundation' && '🏗️ Foundation Track'}
              {track === 'defi' && '💰 DeFi Understanding Track'}
              {track === 'dapp' && '🛠️ dApp Concepts Track'}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2 px-2">
                {modules
                  .filter(m => m.track === track)
                  .map(module => {
                    const moduleProgress = calculateModuleProgress(
                      module.id,
                      completedLessons,
                      module.lessons.length
                    );
                    const isCompleted = completedModules.includes(module.id);

                    return (
                      <SidebarMenuItem key={module.id}>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname.includes(module.id)}
                          className={cn(
                            'rounded-xl mx-1 mb-2 transition-all duration-200 border border-transparent !h-auto [&>span:last-child]:!text-clip [&>span:last-child]:!whitespace-normal',
                            pathname.includes(module.id)
                              ? '!bg-yellow-50 dark:!bg-yellow-950/30 border-l-4 shadow-md border-yellow-300/60 dark:border-yellow-700/60'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:shadow-sm hover:border-gray-200/50 dark:hover:border-gray-700/50'
                          )}
                        >
                          <Link
                            href={`/course/${module.id}`}
                            className="flex items-start gap-3 py-4 px-4 w-full"
                          >
                            <div className="flex-shrink-0 mt-0.5 relative">
                              <div className="h-5 w-5 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                <Circle className="h-3.5 w-3.5 text-gray-400" />
                              </div>
                              <div
                                className={`absolute inset-0 h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center transition-opacity duration-200 ${
                                  isCompleted ? 'opacity-100' : 'opacity-0'
                                }`}
                              >
                                <CheckCircle className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0 overflow-visible">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                  Module {module.number}
                                </span>
                                <Badge
                                  variant="outline"
                                  className={`text-xs border-green-200 text-green-700 dark:border-green-800 dark:text-green-300 bg-green-50 dark:bg-green-900/20 transition-opacity duration-200 ${
                                    isCompleted
                                      ? 'opacity-100'
                                      : 'opacity-0 pointer-events-none'
                                  }`}
                                >
                                  ✓ Completed
                                </Badge>
                              </div>
                              <h4 className="font-semibold text-sm leading-relaxed mb-2 text-gray-900 dark:text-gray-100">
                                {module.title}
                              </h4>
                              {moduleProgress > 0 && !isCompleted && (
                                <div className="mt-2">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-muted-foreground font-medium">
                                      {Math.round(moduleProgress)}% complete
                                    </span>
                                  </div>
                                  <Progress
                                    value={moduleProgress}
                                    className="h-2"
                                  />
                                </div>
                              )}
                            </div>
                          </Link>
                        </SidebarMenuButton>

                        {currentModuleId === module.id && (
                          <SidebarMenuSub className="mt-2 ml-5 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                            {module.lessons.map(lesson => {
                              const lessonCompleted = completedLessons.includes(
                                lesson.id
                              );
                              const isCurrentLesson = pathname.includes(
                                lesson.id
                              );

                              return (
                                <SidebarMenuSubItem
                                  key={lesson.id}
                                  className="mb-1"
                                >
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={isCurrentLesson}
                                    className={cn(
                                      'rounded-lg transition-all duration-200 ml-0 border border-transparent !h-auto [&>span:last-child]:!text-clip [&>span:last-child]:!whitespace-normal',
                                      isCurrentLesson
                                        ? '!bg-yellow-50 dark:!bg-yellow-950/30 border-l-3 shadow-sm border-yellow-300/60 dark:border-yellow-700/60'
                                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/30 hover:border-gray-200/50 dark:hover:border-gray-700/50'
                                    )}
                                  >
                                    <Link
                                      href={`/course/${module.id}/${lesson.id}`}
                                      className="flex items-start gap-3 py-4 px-3 w-full"
                                    >
                                      <div className="flex-shrink-0 mt-0.5 relative">
                                        <div className="h-4 w-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                          <Circle className="h-2.5 w-2.5 text-gray-400" />
                                        </div>
                                        <div
                                          className={`absolute inset-0 h-4 w-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center transition-opacity duration-200 ${
                                            lessonCompleted
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          }`}
                                        >
                                          <CheckCircle className="h-2.5 w-2.5 text-green-600 dark:text-green-400" />
                                        </div>
                                      </div>
                                      <div className="flex-1 min-w-0 overflow-visible">
                                        <div className="flex items-center justify-between mb-1">
                                          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                                            Lesson {lesson.number}
                                          </span>
                                        </div>
                                        <span className="text-sm font-medium leading-relaxed text-gray-900 dark:text-gray-100 block">
                                          {lesson.title}
                                        </span>
                                      </div>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        )}
                      </SidebarMenuItem>
                    );
                  })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </div>

      <SidebarFooter className="border-t mt-2 bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-900/50 dark:to-gray-800/50 flex-shrink-0">
        <SidebarMenu className="p-3 space-y-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="rounded-xl h-12 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
            >
              <Link href="/profile" className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-medium">Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </div>
  );
}
