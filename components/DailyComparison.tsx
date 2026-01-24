"use client";

import { Todo } from "@/types/todo";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useTheme } from "next-themes";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useEffect, useState } from "react";

interface DailyComparisonProps {
  todos: Todo[];
}

export function DailyComparison({ todos }: DailyComparisonProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === 'dark';

  // Helper to get formatted date string
  const getDateString = (date: Date) => date.toISOString().split("T")[0];

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const todayStr = getDateString(today);
  const yesterdayStr = getDateString(yesterday);

  // Stats for Today
  const todayTasks = todos.filter((t) => t.date === todayStr);
  const todayCompleted = todayTasks.filter((t) => t.completed).length;

  // Stats for Yesterday
  const yesterdayTasks = todos.filter((t) => t.date === yesterdayStr);
  const yesterdayCompleted = yesterdayTasks.filter((t) => t.completed).length;

  // Calculate Difference
  const diff = todayCompleted - yesterdayCompleted;
  
  let TrendIcon = Minus;
  let trendColor = "text-muted-foreground";
  let trendText = "Same as yesterday";

  if (diff > 0) {
    TrendIcon = TrendingUp;
    trendColor = "text-green-500";
    trendText = "More than yesterday";
  } else if (diff < 0) {
    TrendIcon = TrendingDown;
    trendColor = "text-red-500";
    trendText = "Less than yesterday";
  }

  // Radial Bar Data
  // Max value calculation for domain scaling (so rings aren't always 100% full or tiny)
  const maxValue = Math.max(todayCompleted, yesterdayCompleted, 1); 
  // Add a buffer so even the max value isn't a complete 360 circle (aesthetic choice)
  // OR make it 100% of a "Goal" - but we don't have a goal. 
  // Let's make it relative to the Max of the two + 20%
  const domainMax = maxValue * 1.25;

  const data = [
    {
      name: "Yesterday",
      uv: yesterdayCompleted,
      fill: "#8b5cf6", // Purple-500
    },
    {
      name: "Today",
      uv: todayCompleted,
      fill: "#3b82f6", // Blue-500
    },
  ];

  return (
    <div className="bg-card p-6 rounded-xl border border-border shadow-sm relative overflow-hidden">
      <div className="flex flex-row justify-between items-center z-10 relative">
        {/* Text Section */}
        <div className="flex-1 space-y-4">
          <div>
             <p className="text-muted-foreground text-sm font-medium">Daily Focus</p>
             <h3 className="text-2xl font-bold mt-1 text-foreground">
                {todayCompleted} <span className="text-lg text-muted-foreground font-normal">tasks</span>
             </h3>
             <p className="text-xs text-muted-foreground">completed today</p>
          </div>

          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg w-fit">
            <div className={`p-1.5 rounded-full bg-background ${trendColor}`}>
                <TrendIcon className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
                <span className={`text-xs font-bold leading-none ${trendColor}`}>
                    {diff > 0 ? '+' : ''}{diff}
                </span>
                <span className="text-[10px] text-muted-foreground leading-none mt-0.5">
                    vs yesterday
                </span>
            </div>
          </div>
        </div>

        {/* Radial Chart Section */}
        <div className="h-32 w-32 sm:h-40 sm:w-40 relative flex-none">
            <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                    innerRadius="40%" 
                    outerRadius="100%" 
                    barSize={10} 
                    data={data}
                    startAngle={90} 
                    endAngle={-270}
                >
                    <RadialBar
                        background={{ fill: isDark ? '#27272a' : '#f4f4f5' }}
                        dataKey="uv"
                        cornerRadius={10}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </RadialBar>
                    <Tooltip 
                        cursor={false}
                         contentStyle={{
                            backgroundColor: isDark ? '#000000' : '#ffffff',
                            borderRadius: '8px',
                            border: `1px solid ${isDark ? '#27272a' : '#e4e4e7'}`,
                            padding: '8px',
                        }}
                        itemStyle={{
                            color: isDark ? '#fafafa' : '#09090b',
                            fontSize: '12px',
                            fontWeight: 500
                        }}
                    />
                </RadialBarChart>
            </ResponsiveContainer>
            
            {/* Center Legend/Label */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="text-center">
                  <span className="text-xs font-medium text-muted-foreground block">Today</span>
               </div>
            </div>
        </div>
      </div>
    </div>
  );
}
