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
import { Lightbulb, Plus } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface AnalyticsProps {
  todos: Todo[];
}

export function Analytics({ todos }: AnalyticsProps) {
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
  "Stay hungry, stay foolish. — Steve Jobs",
  "The best way to predict the future is to invent it. — Alan Kay",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. — Winston Churchill",
  "In the middle of every difficulty lies opportunity. — Albert Einstein",
  "It does not matter how slowly you go as long as you do not stop. — Confucius",
  "Whether you think you can or you think you can’t, you’re right. — Henry Ford",
  "The only limit to our realization of tomorrow will be our doubts of today. — Franklin D. Roosevelt",
  "Dream big and dare to fail. — Norman Vaughan",
  "Don’t watch the clock; do what it does. Keep going. — Sam Levenson",
  "You miss 100% of the shots you don’t take. — Wayne Gretzky",
  "The secret of getting ahead is getting started. — Mark Twain",
  "Fall seven times and stand up eight. — Japanese Proverb",
  "Happiness depends upon ourselves. — Aristotle",
  "He who has a why to live can bear almost any how. — Friedrich Nietzsche",
  "Act as if what you do makes a difference. It does. — William James",
  "Do what you can, with what you have, where you are. — Theodore Roosevelt",
  "Everything you’ve ever wanted is on the other side of fear. — George Addair",
  "Hardships often prepare ordinary people for an extraordinary destiny. — C.S. Lewis",
  "Quality is not an act, it is a habit. — Aristotle",
  "If you are going through hell, keep going. — Winston Churchill",
  "The future belongs to those who prepare for it today. — Malcolm X",
  "Success usually comes to those who are too busy to be looking for it. — Henry David Thoreau",
  "What lies behind us and what lies before us are tiny matters compared to what lies within us. — Ralph Waldo Emerson",
  "Believe you can and you’re halfway there. — Theodore Roosevelt",
  "It always seems impossible until it’s done. — Nelson Mandela",
  "I never dreamed about success. I worked for it. — Estée Lauder",
  "Don’t wait. The time will never be just right. — Napoleon Hill",
  "If opportunity doesn’t knock, build a door. — Milton Berle",
  "Success is the sum of small efforts repeated day in and day out. — Robert Collier",
  "Discipline is the bridge between goals and accomplishment. — Jim Rohn",
  "The only way to do great work is to love what you do. — Steve Jobs",
  "Small deeds done are better than great deeds planned. — Peter Marshall",
  "Focus on being productive instead of busy. — Tim Ferriss",
  "A person who never made a mistake never tried anything new. — Albert Einstein",
  "You don’t have to be great to start, but you have to start to be great. — Zig Ziglar",
  "Dreams don’t work unless you do. — John C. Maxwell",
  "Work hard in silence, let your success be your noise. — Frank Ocean",
  "If you get tired, learn to rest, not to quit. — Banksy",
  "Don’t let yesterday take up too much of today. — Will Rogers",
  "Action is the foundational key to all success. — Pablo Picasso",
  "One day or day one. You decide. — Paulo Coelho",
  "Do something today that your future self will thank you for. — Sean Patrick Flanery",
  "What comes easy won’t last. What lasts won’t come easy. — Anonymous",
  "Be stronger than your excuses. — Anonymous",
  "Learning never exhausts the mind. — Leonardo da Vinci",
  "Simplicity is the ultimate sophistication. — Leonardo da Vinci",
  "The man who moves a mountain begins by carrying away small stones. — Confucius",
  "You become what you believe. — Oprah Winfrey",
  "Success is walking from failure to failure with no loss of enthusiasm. — Winston Churchill",
  "If you want to shine like a sun, first burn like a sun. — A.P.J. Abdul Kalam",
  "Arise, awake, and stop not till the goal is reached. — Swami Vivekananda",
  "Excellence is a continuous process, not an accident. — A.P.J. Abdul Kalam",
  "Take risks in your life. If you win, you can lead. If you lose, you can guide. — Swami Vivekananda",
  "The journey of a thousand miles begins with one step. — Lao Tzu",
  "Failure is simply the opportunity to begin again, this time more intelligently. — Henry Ford",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. — Winston Churchill",
  "I have not failed. I've just found 10,000 ways that won't work. — Thomas Edison",
  "Only those who dare to fail greatly can ever achieve greatly. — Robert F. Kennedy",
  "Do not be embarrassed by your failures, learn from them and start again. — Richard Branson",
  "Failure is the condiment that gives success its flavor. — Truman Capote",
  "Mistakes are proof that you are trying. — Jennifer Lim",
  "Our greatest glory is not in never failing, but in rising every time we fail. — Confucius",
  "Failure should be our teacher, not our undertaker. — Zig Ziglar",
  "You may encounter many defeats, but you must not be defeated. — Maya Angelou",
  "It’s not how far you fall, but how high you bounce that counts. — Zig Ziglar",
  "There is no failure except in no longer trying. — Elbert Hubbard",
  "Failure is success in progress. — Albert Einstein",
  "Every adversity, every failure, every heartache carries with it the seed of an equal or greater benefit. — Napoleon Hill",
  "The only real mistake is the one from which we learn nothing. — Henry Ford",
  "A person who never made a mistake never tried anything new. — Albert Einstein",
  "Winners are not afraid of losing. But losers are. Failure is part of the process of success. — Robert Kiyosaki",
  "Failure is unimportant. It takes courage to make a fool of yourself. — Charlie Chaplin",
  "Success is stumbling from failure to failure with no loss of enthusiasm. — Winston Churchill",
  "Pain is temporary. Quitting lasts forever. — Lance Armstrong",
  "Failure is a bruise, not a tattoo. — Jon Sinclair",
  "You build on failure. You use it as a stepping stone. — Johnny Cash",
  "There are no failures — just experiences and lessons. — Oprah Winfrey",
  "Failure is not the opposite of success; it’s part of success. — Arianna Huffington",
  "I can accept failure. Everyone fails at something. But I can’t accept not trying. — Michael Jordan",
  "What defines us is how well we rise after falling. — Lionel Messi",
  "If you’re not failing every now and again, it’s a sign you’re not doing anything very innovative. — Woody Allen",
  "Failure is the key to success; each mistake teaches us something. — Morihei Ueshiba",
  "Rock bottom became the solid foundation on which I rebuilt my life. — J.K. Rowling",
  "Success grows out of struggles to overcome difficulties. — A.P.J. Abdul Kalam",
  "If you fail, never give up because FAIL means ‘First Attempt In Learning’. — A.P.J. Abdul Kalam",
  "Take risks in your life. If you win, you can lead. If you lose, you can guide. — Swami Vivekananda",
  "Arise, awake, and stop not till the goal is reached. — Swami Vivekananda",
  "Doubt kills more dreams than failure ever will. — Suzy Kassem",
  "Failure is a delay, not a defeat. — Denis Waitley",
  "Courage doesn’t always roar. Sometimes it’s the quiet voice saying, ‘I will try again tomorrow.’ — Mary Anne Radmacher",
  "Don’t fear failure. Fear being in the same place next year. — Anonymous",
  "Failure is the tuition you pay for success. — Walter Brunell",
  "What matters is not the failure, but the lesson learned from it. — Dalai Lama"
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
      <h2 className="text-2xl font-bold mb-6 text-foreground">Analytics</h2>

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

      {/* Suggestions Section */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
          <Lightbulb className="text-yellow-400 w-5 h-5" />
          Suggestions 
        </h3>
        
        {/* Daily Quote Card */}
        <div className="bg-gradient-to-br from-zinc-800 to-black p-4 rounded-xl border border-zinc-700/50 shadow-md">
           <p className="text-zinc-300 italic text-sm">"{dailyQuote}"</p>
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