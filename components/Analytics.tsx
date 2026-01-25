"use client";

import { Todo } from "@/types/todo";
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
import { Lightbulb, Plus, CalendarClock } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ActivityHeatmap } from "./ActivityHeatmap";
import { DailyComparison } from "./DailyComparison";
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

  // --- Suggestions Engine ---
  const getSuggestions = () => {
    const suggestions = [];

    if (completionRate < 50 && totalTasks > 0) {
      suggestions.push(
        "You have a few pending tasks. Try clearing the quick wins first!"
      );
    }
    if (highPriority > 3) {
      suggestions.push(
        "You have a lot of High Priority tasks. Focus on them before adding new ones."
      );
    }
    if (completedTasks > 5) {
      suggestions.push(
        "Great momentum! You've completed more than 5 tasks. Keep it up!"
      );
    }
    if (totalTasks === 0) {
      suggestions.push(
        "Your list is empty. Start by adding a key goal for today."
      );
    }

    // Default encouragement if no specific conditions met
    if (suggestions.length === 0) {
      suggestions.push("Steady progress is key. Tackle one task at a time.");
    }

    return suggestions.slice(0, 2); // Return top 2 suggestions
  };

  // --- Daily Quote Engine ---
 const quotes = [
  "Energy and persistence conquer all things. — Benjamin Franklin",
  "Nothing in this world can take the place of persistence. Talent will not; nothing is more common than unsuccessful men with talent. Persistence and determination alone are omnipotent. — Calvin Coolidge",
  "The price of success is hard work, dedication to the job at hand, and the determination that whether we win or lose, we have applied the best of ourselves to the task at hand. — Vince Lombardi",
  "There is no substitute for hard work. — Thomas Edison",
  "I hated every minute of training, but I said, 'Don't quit. Suffer now and live the rest of your life as a champion.' — Muhammad Ali",
  "Far and away the best prize that life offers is the chance to work hard at work worth doing. — Theodore Roosevelt",
  "Perseverance is the hard work you do after you get tired of doing the hard work you already did. — Newt Gingrich",
  "Hard work beats talent when talent doesn't work hard. — Tim Notke",
  "The only thing that overcomes hard luck is hard work. — Harry Golden",
  "There are no shortcuts to any place worth going. — Beverly Sills",
  "If you are not willing to risk the unusual, you will have to settle for the ordinary. — Jim Rohn",
  "The biggest risk is not taking any risk... In a world that's changing really quickly, the only strategy that is guaranteed to fail is not taking risks. — Mark Zuckerberg",
  "Only those who will risk going too far can possibly find out how far one can go. — T.S. Eliot",
  "Man cannot discover new oceans until he has the courage to lose sight of the shore. — André Gide",
  "Leap and the net will appear. — John Burroughs",
  "To win without risk is to triumph without glory. — Pierre Corneille",
  "Living at risk is jumping off the cliff and building your wings on the way down. — Ray Bradbury",
  "Don't be too timid and squeamish about your actions. All life is an experiment. The more experiments you make the better. — Ralph Waldo Emerson",
  "Screw it, let's do it. — Richard Branson",
  "I knew that if I failed I wouldn't regret that, but I knew the one thing I might regret is not trying. — Jeff Bezos",
  "If you're offered a seat on a rocket ship, don't ask what seat. Just get on. — Sheryl Sandberg",
  "Be brave, take risks. Nothing can substitute experience. — Paulo Coelho",
  "He who is not courageous enough to take risks will accomplish nothing in life. — Muhammad Ali",
  "Courage is resistance to fear, mastery of fear—not absence of fear. — Mark Twain",
  "The man who moves a mountain begins by carrying away small stones. — Confucius",
  "There is one quality which one must possess to win, and that is definiteness of purpose, the knowledge of what one wants, and a burning desire to possess it. — Napoleon Hill, Think and Grow Rich",
  "If you are of those who believe that hard work and honesty, alone, will bring riches, perish the thought! Riches, when they come in huge quantities, are never the result of hard work! — Napoleon Hill, Think and Grow Rich",
  "Don't aim at success. The more you aim at it and make it a target, the more you are going to miss it. For success, like happiness, cannot be pursued; it must ensue... as the unintended side-effect of one's personal dedication to a cause greater than oneself. — Viktor E. Frankl, Man's Search for Meaning",
  "When we are no longer able to change a situation, we are challenged to change ourselves. — Viktor E. Frankl, Man's Search for Meaning",
  "Everything can be taken from a man but one thing: the last of the human freedoms—to choose one's attitude in any given set of circumstances, to choose one's own way. — Viktor E. Frankl, Man's Search for Meaning",
  "Your success depends on the risks you take. Your survival depends on the risks you avoid. — James Clear (from his writings and newsletters)",
  "Every action you take is a vote for the type of person you wish to become. — James Clear, Atomic Habits",
  "The greatest threat to success is not failure but boredom. We get bored with habits because they stop delighting us. — James Clear, Atomic Habits",
  "You don't have to be great to start, but you have to start to be great. — Zig Ziglar",
  "The secret of getting ahead is getting started. — Mark Twain",
  "I have not failed. I've just found 10,000 ways that won't work. — Thomas Edison",
  "Success is the sum of small efforts, repeated day in and day out. — Robert Collier",
  "Discipline is the bridge between goals and accomplishment. — Jim Rohn",
  "The only way to do great work is to love what you do. — Steve Jobs",
  "You miss 100% of the shots you don't take. — Wayne Gretzky",
  "It always seems impossible until it's done. — Nelson Mandela",
  "The best way out is always through. — Robert Frost",
  "No man is worth his salt who is not ready at all times to risk his well-being, to risk his body, to risk his life in a great cause. — Theodore Roosevelt",
  "Courage doesn't always roar. Sometimes courage is the quiet voice at the end of the day saying 'I will try again tomorrow.' — Mary Anne Radmacher",
  "Adventure is worthwhile. — Aesop",
  "A ship in harbor is safe, but that is not what ships are built for. — John A. Shedd",
  "Risk more than others think is safe. Dream more than others think is practical. — Howard Schultz",
  "If you don't build your dream, someone else will hire you to help build theirs. — Tony Gaskins",
  "Work like there is someone working 24 hours a day to take it away from you. — Mark Cuban",
  "Great works are performed not by strength but by perseverance. — Samuel Johnson",
  "Effort only fully releases its reward after a person refuses to quit. — Napoleon Hill"
 
  
  
];

  const getQuote = () => {
    const hours = 4;
    const msPerInterval = hours * 60 * 60 * 1000;
    const intervalIndex = Math.floor(new Date().getTime() / msPerInterval);
    return quotes[intervalIndex % quotes.length];
  };

  const currentQuote = getQuote();
  const suggestions = getSuggestions();

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

        {/* Daily Performance Comparison */}
        <DailyComparison todos={todos} />

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
      </div>

      {/* Activity Heatmap */}
      <ActivityHeatmap todos={todos} />

      {/* Suggestions Section */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
          <Lightbulb className="text-yellow-400 w-5 h-5" />
          Suggestions 
        </h3>
        
        {/* Daily Quote Card */}
        <div className="bg-linear-to-br from-zinc-800 to-black p-4 rounded-xl border border-zinc-700/50 shadow-md">
           <p className="text-zinc-300 italic text-sm">"{currentQuote}"</p>
        </div>

       

        {suggestions.map((msg, idx) => (
          <div
            key={idx}
            className="bg-muted/50 border border-border p-4 rounded-xl text-muted-foreground text-sm"
          >
            {msg}
          </div>
        ))}
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