"use client";

import { ListTodo, CalendarClock, ChartBar, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface BottomNavProps {
  currentView: 'list' | 'analytics' | 'deadlines';
  onChange: (view: 'list' | 'analytics' | 'deadlines') => void;
}

export function BottomNav({ currentView, onChange }: BottomNavProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {/* 1. Analytics */}
        <button
          onClick={() => onChange('analytics')}
          className={cn(
            "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200",
            currentView === 'analytics' 
              ? "text-primary" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <ChartBar size={24} strokeWidth={currentView === 'analytics' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Analytics</span>
        </button>

         {/* 2. Tasks */}
         <button
          onClick={() => onChange('list')}
          className={cn(
            "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200",
            currentView === 'list' 
              ? "text-primary" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <ListTodo size={24} strokeWidth={currentView === 'list' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Tasks</span>
        </button>

        {/* 3. Deadlines */}
        <button
          onClick={() => onChange('deadlines')}
          className={cn(
            "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200",
            currentView === 'deadlines' 
              ? "text-primary" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <CalendarClock size={24} strokeWidth={currentView === 'deadlines' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Deadlines</span>
        </button>

        {/* 4. Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200 text-muted-foreground hover:text-foreground"
        >
          {mounted && theme === 'dark' ? (
             <Moon size={24} strokeWidth={2} />
          ) : (
             <Sun size={24} strokeWidth={2} />
          )}
          <span className="text-[10px] font-medium">Theme</span>
        </button>
      </div>
    </nav>
  );
}
