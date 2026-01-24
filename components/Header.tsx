"use client";

import { ChevronLeft, ChevronRight, CalendarDays, Flag } from "lucide-react";

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
  const isToday = new Date().toDateString() === currentDate.toDateString();
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    // 1. Container: Pure black with subtle bottom border
    <header className="sticky top-0 z-10 bg-black border-b border-zinc-800 p-3  flex flex-col gap-1">
      <div className="flex items-center justify-between">
        {/* Left Nav Button */}
        <button 
          onClick={onPrev}
          disabled={view !== 'list'}
          className={`group p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 transition-all active:scale-95 ${view !== 'list' ? 'opacity-0 cursor-default' : 'hover:text-white hover:border-zinc-700'}`}
          aria-label="Previous day"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
        </button>
        
        {/* Center Content */}
        <div className="flex flex-col items-center gap-2">
          
          {/* Date Display */}
          <div className="flex items-center gap-2">
             {view === 'list' && isToday && (
                 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-black uppercase tracking-wider">
                     Today
                 </span>
             )}
             <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                {view === 'analytics' ? (
                  "Analytics"
                ) : view === 'deadlines' ? (
                  "Deadlines"
                ) : (
                  <>
                    {!isToday && <CalendarDays className="w-4 h-4 text-zinc-500" />}
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
          className={`group p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 transition-all active:scale-95 ${view !== 'list' ? 'opacity-0 cursor-default' : 'hover:text-white hover:border-zinc-700'}`}
          aria-label="Next day"
        >
          <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

       {/* View Toggle */}
       <div className="flex justify-center gap-4 text-xs font-medium text-zinc-500">
            <button
                onClick={() => onToggleView('list')}
                className={`hover:text-white transition-colors ${view === 'list' ? 'text-white underline underline-offset-4 decoration-zinc-700' : ''}`}
            >
                Tasks
            </button>
            <button
                onClick={() => onToggleView('deadlines')}
                className={`hover:text-white transition-colors ${view === 'deadlines' ? 'text-white underline underline-offset-4 decoration-zinc-700' : ''}`}
            >
                Deadlines
            </button>
            <button
                onClick={() => onToggleView('analytics')}
                className={`hover:text-white transition-colors ${view === 'analytics' ? 'text-white underline underline-offset-4 decoration-zinc-700' : ''}`}
            >
                Analytics
            </button>
       </div>
       
       {view === 'list' && totalCount > 0 && (
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-top-1 duration-300 w-full justify-center">
            <span className="text-xs font-medium text-zinc-500 font-mono">
              {Math.round(progressPercentage)}%
            </span>
            <div className="w-32 h-1 bg-zinc-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="text-xs font-medium text-zinc-500 font-mono">
              {completedCount}/{totalCount}
            </span>
          </div>
        )}
    </header>
  );
}