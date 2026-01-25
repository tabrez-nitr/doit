"use client";

import { Todo } from "@/types/todo";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { cn, toLocalDateString } from "@/lib/utils";

interface ActivityHeatmapProps {
  todos: Todo[];
}

export function ActivityHeatmap({ todos }: ActivityHeatmapProps) {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    // Auto-scroll to the end (current month)
    if (scrollRef.current) {
        scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, []);

  // 1. Generate the last 6 months grouping by month
  const getMonths = () => {
    const months: Record<string, string[]> = {}; // "Jan 2026" -> ["2026-01-01", ...]
    const today = new Date();
    
    // Iterate backwards from today to get roughly 6 months of data
    // Or iterate forwards from 6 months ago
    const startDate = new Date(today);
    startDate.setMonth(today.getMonth() - 5); // Go back 5 months + current month = 6 months
    startDate.setDate(1); // Start from 1st of that month

    // Create a loop until today
    const current = new Date(startDate);
    const end = new Date(today);
    
    while (current <= end) {
        const monthKey = current.toLocaleString('default', { month: 'short', year: 'numeric' });
        const dateStr = toLocalDateString(current);
        
        if (!months[monthKey]) {
            months[monthKey] = [];
        }
        months[monthKey].push(dateStr);
        
        current.setDate(current.getDate() + 1);
    }
    
    return months;
  };

  const months = getMonths();

  // 2. Count completed tasks per day
  const activityMap = todos.filter(t => t.completed).reduce((acc, todo) => {
    const date = todo.date; 
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 3. Determine intensity
  const getIntensityClass = (count: number) => {
    if (count === 0) return "bg-muted/40";
    if (count === 1) return "bg-emerald-500/30 dark:bg-emerald-900/40";
    if (count === 2) return "bg-emerald-500/50 dark:bg-emerald-800/60";
    if (count === 3) return "bg-emerald-500/70 dark:bg-emerald-700/80";
    return "bg-emerald-500 dark:bg-emerald-500";
  };

  return (
    <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
        Activity Log
        <span className="text-xs font-normal text-muted-foreground ml-auto">Last 6 Months</span>
      </h3>
      
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-muted-foreground/20"
      >
        {Object.entries(months).map(([monthName, dates]) => (
            <div key={monthName} className="flex flex-col gap-2 min-w-max">
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{monthName}</span>
                <div className="grid grid-rows-7 grid-flow-col gap-1">
                    {dates.map((date) => {
                        const count = activityMap[date] || 0;
                        return (
                            <div
                                key={date}
                                className={cn(
                                    "w-3 h-3 rounded-[2px] transition-colors hover:ring-1 hover:ring-foreground/50",
                                    getIntensityClass(count)
                                )}
                                title={`${date}: ${count} tasks`}
                            />
                        );
                    })}
                </div>
            </div>
        ))}
      </div>
      
      <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground justify-end">
        <span>Less</span>
        <div className="flex gap-1">
             <div className="w-2.5 h-2.5 rounded-[1px] bg-muted/40" />
             <div className="w-2.5 h-2.5 rounded-[1px] bg-emerald-500/30 dark:bg-emerald-900/40" />
             <div className="w-2.5 h-2.5 rounded-[1px] bg-emerald-500/70 dark:bg-emerald-700/80" />
             <div className="w-2.5 h-2.5 rounded-[1px] bg-emerald-500 dark:bg-emerald-500" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
