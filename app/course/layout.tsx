'use client';

import { useState, useRef, useEffect } from 'react';
import { ImperativePanelHandle } from 'react-resizable-panels';
import { CourseNavigation } from '@/components/layout/course-navigation';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { PanelLeftIcon, Menu } from 'lucide-react';

export default function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const sidebarRef = useRef<ImperativePanelHandle>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile]);

  const toggleSidebar = () => {
    if (sidebarRef.current) {
      const targetSize = isCollapsed ? 20 : 0;
      const startSize = sidebarRef.current.getSize();
      const duration = 500;
      const startTime = performance.now();

      const easeOutQuart = (t: number): number => {
        return 1 - Math.pow(1 - t, 4);
      };

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);

        const currentSize =
          startSize + (targetSize - startSize) * easedProgress;
        sidebarRef.current?.resize(Math.max(0, Math.min(40, currentSize)));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
      setIsCollapsed(!isCollapsed);
    }
  };

  if (isMobile) {
    return (
      <SidebarProvider>
        <div className="flex flex-col min-h-screen">
          <div className="flex items-center border-b p-4 bg-background">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Course Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[280px] sm:w-[320px] p-0 h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] overflow-hidden flex flex-col mt-16"
              >
                <CourseNavigation />
              </SheetContent>
            </Sheet>
          </div>

          <main className="flex-1 p-4 sm:p-6 overflow-y-auto">{children}</main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex w-full" style={{ height: 'calc(100vh - 4rem)' }}>
        <ResizablePanelGroup
          direction="horizontal"
          style={{ height: 'calc(100vh - 4rem)' }}
        >
          <ResizablePanel
            ref={sidebarRef}
            defaultSize={20}
            minSize={15}
            maxSize={40}
            collapsible={true}
            collapsedSize={0}
          >
            <Sidebar collapsible="none" className="border-r h-full w-full pt-16">
              <SidebarContent className="h-full flex flex-col overflow-hidden">
                <CourseNavigation />
              </SidebarContent>
            </Sidebar>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={70}>
            <SidebarInset className="flex flex-col h-full">
              <div className="flex items-center border-b p-4 flex-shrink-0">
                <Button
                  variant="noShadow"
                  size="icon"
                  onClick={toggleSidebar}
                  className="size-7"
                >
                  <PanelLeftIcon className="h-4" />
                  <span className="sr-only">Toggle Sidebar</span>
                </Button>
              </div>
              <main className="flex-1 overflow-y-auto p-6 lesson-scrollbar">
                {children}
              </main>
            </SidebarInset>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </SidebarProvider>
  );
}
