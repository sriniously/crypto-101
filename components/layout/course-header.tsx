'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Sparkles } from 'lucide-react';
import { TokenETH } from '@web3icons/react';

export function CourseHeader() {
  return (
    <header className="sticky top-0 z-30 border-b-2 border-black bg-background shadow-[0px_4px_0px_0px_#000] dark:border-white dark:shadow-[0px_4px_0px_0px_#fff]">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <TokenETH size={20} variant="branded" />
            <Sparkles className="h-4 w-4 text-main" />
            <span className="font-semibold">Learning Web3</span>
          </div>
        </div>
      </div>
    </header>
  );
}
