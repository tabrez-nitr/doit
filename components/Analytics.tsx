"use client";

import { Todo } from "@/types/todo";
import { DailyQuote } from "./DailyQuote";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { Plus, CalendarClock } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ActivityHeatmap } from "./ActivityHeatmap";
import { toLocalDateString } from "@/lib/utils";

interface AnalyticsProps {
  todos: Todo[];
  permission: NotificationPermission;
  onRequestPermission: () => Promise<NotificationPermission>;
}

export function Analytics({ todos, permission, onRequestPermission }: AnalyticsProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === 'dark';
  
  const COLORS = {
     background: isDark ? "#000000" : "#ffffff",
     foreground: isDark ? "#fafafa" : "#09090b",
     primary: isDark ? "#fafafa" : "#18181b",
     grid: isDark ? "#27272a" : "#e4e4e7",
     bars: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"]
  };
  const totalTasks = todos.length;
  const completedTasks = todos.filter((t) => t.completed).length;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Month Progress Calculation
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const monthProgress = ((now.getTime() - startOfMonth.getTime()) / (endOfMonth.getTime() - startOfMonth.getTime())) * 100;
  const monthProgressFormatted = monthProgress.toFixed(1);
  const currentMonthName = now.toLocaleString('default', { month: 'long' });

  const highPriority = todos.filter((t) => t.priority === "High").length;
  const mediumPriority = todos.filter((t) => t.priority === "Medium").length;
  const lowPriority = todos.filter((t) => t.priority === "Low").length;
  
  // Day Progress Calculation
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const msPassed = now.getTime() - startOfDay.getTime();
  const msInDay = 24 * 60 * 60 * 1000;
  const dayProgress = Math.min(100, Math.max(0, (msPassed / msInDay) * 100));
  const dayProgressData = [
    { name: "Passed", value: dayProgress, color: isDark ? "#fafafa" : "#18181b" },
    { name: "Remaining", value: 100 - dayProgress, color: isDark ? "#27272a" : "#e4e4e7" }
  ];

  const monthProgressData = [
    { name: "Passed", value: monthProgress, color: isDark ? "#fafafa" : "#18181b" },
    { name: "Remaining", value: 100 - monthProgress, color: isDark ? "#27272a" : "#e4e4e7" }
  ];

  // --- Data Preparation for Graphs ---

  // 1. Weekly Activity (Last 7 Days)
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(toLocalDateString(d));
    }
    return days;
  };

  const last7Days = getLast7Days();
  const weeklyData = last7Days.map((date) => {
    const dayTodos = todos.filter((t) => t.date === date);
    return {
      day: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
      completed: dayTodos.filter((t) => t.completed).length,
      pending: dayTodos.filter((t) => !t.completed).length,
    };
  });

  // 2. Priority Distribution
  const priorityData = [
    { name: "High", value: highPriority, color: "#ef4444" }, // red-500
    { name: "Medium", value: mediumPriority, color: "#eab308" }, // yellow-500
    { name: "Low", value: lowPriority, color: "#3b82f6" }, // blue-500
  ].filter((d) => d.value > 0);

 

  return (
    <div className="py-6  space-y-6 animate-in fade-in duration-500 pb-32">
     
       {/* Notifications Check */}
        {permission === 'default' && (
          <div className="bg-card border border-border p-4 rounded-xl flex items-center justify-between shadow-sm">
             <div className="mr-4">
               <h4 className="text-sm font-semibold text-foreground">Turn on Notifications?</h4>
               <p className="text-xs text-muted-foreground">Get reminded when tasks are due.</p>
             </div>
             <button
               onClick={onRequestPermission}
               className="bg-primary text-primary-foreground text-xs font-medium px-3 py-2 rounded-lg hover:opacity-90 transition-opacity"
             >
               Enable
             </button>
          </div>
        )}

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
          <p className="text-muted-foreground text-sm">Total Tasks</p>
          <p className="text-3xl font-bold mt-1 text-foreground">{totalTasks}</p>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
          <p className="text-muted-foreground text-sm">Completed</p>
          <p className="text-3xl font-bold mt-1 text-green-500">
            {completedTasks}
          </p>
        </div>
      </div>

      {/* Completion Rate Bar */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex justify-between items-end mb-2">
            <p className="text-muted-foreground text-sm">Completion Rate</p>
            <p className="text-3xl font-bold text-foreground">{completionRate}%</p>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-1000 ease-out"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>




        {/* Month Progress Bar */}
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex justify-between items-end mb-2">
            <div className="flex items-center gap-2">
               <CalendarClock className="w-4 h-4 text-muted-foreground" />
               <p className="text-muted-foreground text-sm">{currentMonthName} Over</p>
            </div>
            <p className="text-3xl font-bold text-foreground">{monthProgressFormatted}%</p>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-1000 ease-out"
              style={{ width: `${monthProgress}%` }}
            />
          </div>
        </div>

        {/* Day Progress Ring */}
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center justify-between relative overflow-hidden group">
             {/* Glow Effect */}
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
             
             <div className="flex flex-col z-10">
                 <p className="text-muted-foreground text-sm font-medium">Day Progress</p>
                 <p className="text-3xl font-bold mt-1 text-foreground">{Math.round(dayProgress)}%</p>
                 <p className="text-xs text-muted-foreground mt-2 opacity-60">of 24hrs passed</p>
             </div>
             
             <div className="h-24 w-24 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={dayProgressData}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={40}
                            startAngle={90}
                            endAngle={-270}
                            dataKey="value"
                            stroke="none"
                        >
                            {dayProgressData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                {/* Center dot/icon could go here */}
             </div>
        </div>
      </div>

      {/* Activity Heatmap */}
      <ActivityHeatmap todos={todos} />

      {/* Daily Quote Section */}
      <div className="space-y-3">
        {/* Daily Quote Card */}
        <DailyQuote />
      </div>

      {/* Weekly Activity Graph */}
      <div className="bg-card p-6 rounded-xl border border-border h-80 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-foreground">
          Weekly Activity
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyData}>
            <XAxis
              dataKey="day"
              stroke={isDark ? "#52525b" : "#a1a1aa"}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              hide
            />
            <Tooltip
              contentStyle={{
                backgroundColor: COLORS.background,
                border: `1px solid ${COLORS.grid}`,
                borderRadius: "8px",
                color: COLORS.foreground,
              }}
              cursor={{ fill: COLORS.grid, opacity: 0.5 }}
              itemStyle={{ color: COLORS.foreground }}
            />
            <Bar dataKey="completed" stackId="a" fill="#22c55e" radius={[0, 0, 4, 4]} /> {/* green-500 */}
            <Bar dataKey="pending" stackId="a" fill={isDark ? "#3f3f46" : "#e4e4e7"} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Priority Distribution Graph */}
      {priorityData.length > 0 && (
        <div className="bg-card p-6 rounded-xl border border-border h-72 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-foreground">
            Priority Breakdown
          </h3>
          <div className="flex items-center justify-between h-full pb-8">
             <div className="w-1/2 h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie
                        data={priorityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                    </Pie>
                    <Tooltip 
                         contentStyle={{
                            backgroundColor: COLORS.background,
                            border: `1px solid ${COLORS.grid}`,
                            borderRadius: "8px",
                            color: COLORS.foreground,
                          }}
                          itemStyle={{ color: COLORS.foreground }}
                    />
                    </PieChart>
                </ResponsiveContainer>
             </div>
             
             {/* Legend */}
             <div className="w-1/2 space-y-3 pl-4">
                {priorityData.map((d) => (
                    <div key={d.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                            <span className="text-muted-foreground">{d.name}</span>
                        </div>
                        <span className="font-bold text-foreground">{d.value}</span>
                    </div>
                ))}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}