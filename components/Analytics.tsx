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
import { Lightbulb } from "lucide-react";

interface AnalyticsProps {
  todos: Todo[];
}

export function Analytics({ todos }: AnalyticsProps) {
  const totalTasks = todos.length;
  const completedTasks = todos.filter((t) => t.completed).length;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

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
      days.push(d.toISOString().split("T")[0]);
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
  // ... your existing quotes
  "The secret of getting ahead is getting started.",
  "It always seems impossible until it's done.",
  "Don't watch the clock; do what it does. Keep going.",
  "The future depends on what you do today.",
  "Believe you can and you're halfway there.",
  "Quality is not an act, it is a habit.",
  "Your limitation—it's only your imagination.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Success doesn’t just find you. You have to go out and get it.",
  "The harder you work for something, the greater you’ll feel when you achieve it.",
  "Dream bigger. Do bigger.",
  "Don’t stop when you’re tired. Stop when you’re done.",
  "Wake up with determination. Go to bed with satisfaction.",
  
  // New additions
  "Little things make big days.",
  "It’s going to be hard, but hard does not mean impossible.",
  "Don’t wait for opportunity. Create it.",
  "Sometimes later becomes never. Do it now.",
  "Success is the sum of small efforts, repeated day in and day out.",
  "If you want to fly, give up everything that weighs you down.",
  "Doubt kills more dreams than failure ever will.",
  "I never dreamed about success. I worked for it.",
  "Efficiency is doing things right; effectiveness is doing the right things.",
  "Focus on being productive instead of busy.",
  "The only way to do great work is to love what you do.",
  "Small steps in the right direction can turn out to be the biggest step of your life.",
  "Work hard in silence, let your success be your noise.",
  "You are your only limit.",
  "Discipline is choosing between what you want now and what you want most.",
  "Action is the foundational key to all success.",
  "Do something today that your future self will thank you for.",
  "One day or day one. You decide.",
  "Focus on the step, not the whole staircase.",
  "Done is better than perfect.",
  "Motivation is what gets you started. Habit is what keeps you going.",
  "Pain is temporary. Quitting lasts forever.",
  "If you get tired, learn to rest, not to quit.",
  "What comes easy won’t last. What lasts won’t come easy.",
  "Be stronger than your excuses."
];

  const getDailyQuote = () => {
    const dayOfYear = Math.floor(
      (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        1000 /
        60 /
        60 /
        24
    );
    return quotes[dayOfYear % quotes.length];
  };

  const dailyQuote = getDailyQuote();
  const suggestions = getSuggestions();

  return (
    <div className="py-6 px-2 space-y-6 animate-in fade-in duration-500 pb-32">
      <h2 className="text-2xl font-bold mb-6">Analytics</h2>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
          <p className="text-zinc-400 text-sm">Total Tasks</p>
          <p className="text-3xl font-bold mt-1">{totalTasks}</p>
        </div>
        <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
          <p className="text-zinc-400 text-sm">Completed</p>
          <p className="text-3xl font-bold mt-1 text-green-500">
            {completedTasks}
          </p>
        </div>
      </div>

      {/* Completion Rate Bar */}
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
        <div className="flex justify-between items-end mb-2">
          <p className="text-zinc-400 text-sm">Completion Rate</p>
          <p className="text-3xl font-bold">{completionRate}%</p>
        </div>
        <div className="w-full h-2 bg-black rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-1000 ease-out"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Suggestions Section */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Lightbulb className="text-yellow-400 w-5 h-5" />
          Suggestions 
        </h3>
        
        {/* Daily Quote Card */}
        <div className="bg-linear from-zinc-800 to-black p-4 rounded-xl border border-zinc-700/50">
           <p className="text-zinc-300 italic text-sm">"{dailyQuote}"</p>
        </div>

        {suggestions.map((msg, idx) => (
          <div
            key={idx}
            className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl text-zinc-300 text-sm"
          >
            {msg}
          </div>
        ))}
      </div>

      {/* Weekly Activity Graph */}
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 h-80">
        <h3 className="text-lg font-semibold mb-4 text-zinc-300">
          Weekly Activity
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyData}>
            <XAxis
              dataKey="day"
              stroke="#52525b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              hide
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #27272a",
                borderRadius: "8px",
                color: "#fff",
              }}
              cursor={{ fill: "#27272a" }}
              itemStyle={{ color: "#a1a1aa" }}
            />
            <Bar dataKey="completed" stackId="a" fill="#22c55e" radius={[0, 0, 4, 4]} /> {/* green-500 */}
            <Bar dataKey="pending" stackId="a" fill="#3f3f46" radius={[4, 4, 0, 0]} />   {/* zinc-700 */}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Priority Distribution Graph */}
      {priorityData.length > 0 && (
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 h-72">
          <h3 className="text-lg font-semibold mb-4 text-zinc-300">
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
                            backgroundColor: "#18181b",
                            border: "1px solid #27272a",
                            borderRadius: "8px",
                            color: "#fff",
                          }}
                          itemStyle={{ color: "#fff" }}
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
                            <span className="text-zinc-400">{d.name}</span>
                        </div>
                        <span className="font-bold text-white">{d.value}</span>
                    </div>
                ))}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}