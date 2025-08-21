'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Trophy, User, Coins, GraduationCap, Menu } from 'lucide-react';
import { TokenBTC } from '@web3icons/react';
import { cn } from '@/lib/utils';
import { useHydratedProgress } from '@/lib/progress';
import { Badge } from '@/components/ui/badge';

export function Navigation() {
  const pathname = usePathname();
  const { totalPoints, completedLessons } = useHydratedProgress();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b-2 border-black bg-background shadow-[0px_4px_0px_0px_#000] dark:border-white dark:shadow-[0px_4px_0px_0px_#fff]">
      <div className="container flex h-16 items-center">
        <div className="flex items-center">
          <Link
            href="/"
            className="mr-6 flex items-center space-x-2 p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <TokenBTC size={24} variant="branded" />
            <span className="font-bold text-sm sm:text-base">Crypto 101</span>
          </Link>
        </div>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/achievements"
                  className={cn(
                    'group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50',
                    !isActive('/achievements') && 'bg-accent'
                  )}
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  Achievements
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/profile"
                  className={cn(
                    'group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50',
                    !isActive('/profile') && 'bg-accent'
                  )}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center space-x-2 sm:space-x-4 ml-auto">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Badge
              variant="secondary"
              className="hidden sm:inline-flex border-2 border-black shadow-[2px_2px_0px_0px_#000]"
            >
              <GraduationCap className="mr-1 h-3 w-3" />
              {completedLessons.length} Lessons
            </Badge>
            <Badge
              variant="default"
              className="hidden xs:inline-flex sm:inline-flex bg-main text-main-foreground border-2 border-black shadow-[2px_2px_0px_0px_#000] text-xs"
            >
              <Coins className="mr-1 h-3 w-3" />
              {totalPoints} pts
            </Badge>
          </div>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <TokenBTC size={24} variant="branded" />
                  Crypto 101
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg p-4 border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">Your Progress</span>
                    <Badge variant="secondary" className="text-xs">
                      {totalPoints} pts
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {completedLessons.length} lessons completed
                  </div>
                </div>

                <div className="space-y-2">
                  <Link
                    href="/achievements"
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg transition-colors text-sm font-medium',
                      isActive('/achievements')
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <Trophy className="h-4 w-4" />
                    Achievements
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg transition-colors text-sm font-medium',
                      isActive('/profile')
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
