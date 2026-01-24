"use client";

import { ChevronLeft, ChevronRight, CalendarDays, Flag, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface HeaderProps {
  currentDate: Date;
  onPrev: () => void;
  onNext: () => void;
  completedCount?: number;
  totalCount?: number;
  view: 'list' | 'analytics' | 'deadlines';
  onToggleView: (view: 'list' | 'analytics' | 'deadlines') => void;
}

export function Header({ currentDate, onPrev, onNext, completedCount = 0, totalCount = 0, view, onToggleView }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isToday = new Date().toDateString() === currentDate.toDateString();
  
  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    // 1. Container: Semantic background and border
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border p-3 flex flex-col gap-1 transition-colors duration-300">
      <div className="flex items-center justify-between">
        {/* Left Nav Button */}
        <button 
          onClick={onPrev}
          disabled={view !== 'list'}
          className={`group p-2.5 rounded-xl border border-border text-muted-foreground transition-all active:scale-95 ${view !== 'list' ? 'opacity-0 cursor-default' : 'hover:bg-accent hover:text-accent-foreground'}`}
          aria-label="Previous day"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
        </button>
        
        {/* Center Content */}
        <div className="flex flex-col items-center gap-2">
          
          {/* Date Display */}
          <div className="flex items-center gap-2">
             {view === 'list' && isToday && (
                 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-primary-foreground uppercase tracking-wider">
                     Today
                 </span>
             )}
             <h1 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
                {view === 'analytics' ? (
                  "Analytics"
                ) : view === 'deadlines' ? (
                  "Deadlines"
                ) : (
                  <>
                    {!isToday && <CalendarDays className="w-4 h-4 text-muted-foreground" />}
                    {formatDate(currentDate)}
                  </>
                )}
             </h1>
          </div>
        </div>
  
        {/* Right Nav Button */}
        <button 
          onClick={onNext}
          disabled={view !== 'list'}
          className={`group p-2.5 rounded-xl border border-border text-muted-foreground transition-all active:scale-95 ${view !== 'list' ? 'opacity-0 cursor-default' : 'hover:bg-accent hover:text-accent-foreground'}`}
          aria-label="Next day"
        >
          <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

       {/* View Toggle */}
       <div className="flex justify-center gap-4 text-xs font-medium text-muted-foreground items-center">
            
            <button
                onClick={() => onToggleView('deadlines')}
                className={`hover:text-foreground transition-colors ${view === 'deadlines' ? 'text-foreground underline underline-offset-4 decoration-primary' : ''}`}
            >
                Deadlines
            </button>
             <button
                onClick={() => onToggleView('list')}
                className={`hover:text-foreground transition-colors ${view === 'list' ? 'text-foreground underline underline-offset-4 decoration-primary' : ''}`}
            >
                Tasks
            </button>
            <button
                onClick={() => onToggleView('analytics')}
                className={`hover:text-foreground transition-colors ${view === 'analytics' ? 'text-foreground underline underline-offset-4 decoration-primary' : ''}`}
            >
                Analytics
            </button>
            
            {/* Theme Toggle */}
            <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="ml-2 p-1.5 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors text-muted-foreground"
                aria-label="Toggle theme"
            >
                {mounted && theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
            </button>
       </div>
       
       {view === 'list' && totalCount > 0 && (
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-top-1 duration-300 w-full justify-center">
            <span className="text-xs font-medium text-muted-foreground font-mono">
              {Math.round(progressPercentage)}%
            </span>
            <div className="w-32 h-1 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary shadow-[0_0_10px_rgba(255,255,255,0.2)] transition-all duration-500 ease-out dark:shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="text-xs font-medium text-muted-foreground font-mono">
              {completedCount}/{totalCount}
            </span>
          </div>
        )}
    </header>
  );
}