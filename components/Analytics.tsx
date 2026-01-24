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
  "Nobody is coming to save you. — Unknown",
  "Life doesn't get easier or more forgiving, we get stronger and more resilient. — Steve Maraboli",
  "The world is full of suffering, but it is also full of the overcoming of it. — Helen Keller (but realize most don't overcome it)",
  "Most people die at 25 and aren't buried until 75. — Benjamin Franklin",
  "You will never be criticized by someone who is doing more than you. You will only be criticized by someone doing less. — Denzel Washington",
  "Hard work doesn't guarantee success, but not working guarantees failure. — Unknown",
  "People don't change. They just become more of who they really are. — Unknown",
  "The only thing that is constant is change, and most people hate change. — Heraclitus (adapted reality check)",
  "Life is unfair. Get used to it. — Bill Gates",
  "Your biggest enemy is the one in the mirror. — Unknown",
  "No one cares about your struggles as much as you think they do. — Unknown",
  "Time you enjoy wasting is not wasted time — but wasted time is still gone forever. — Adapted from Marthe Troly-Curtin",
  "The graveyard is full of indispensable people. — French Proverb",
  "You are not owed anything. Earn it or lose it. — Unknown",
  "Comfort is the enemy of progress. — Unknown",
  "Excuses are the nails used to build a house of failure. — Jim Rohn",
  "Most people fail not because of lack of talent, but because of lack of persistence. — Unknown",
  "The pain of discipline is temporary; the pain of regret lasts forever. — Unknown",
  "What you allow is what will continue. — Unknown",
  "People will forget what you said, people will forget what you did, but people will never forget how you made them feel — and most will use it against you later. — Adapted from Maya Angelou",
  "Success is liking yourself, liking what you do, and liking how you do it — but the world doesn't care if you like it or not. — Maya Angelou (harsh twist)",
  "You can have excuses or results, but not both. — Unknown",
  "The world doesn't care about your intentions. It cares about your results. — Unknown",
  "Everyone you meet is fighting a battle you know nothing about — and most won't tell you because it doesn't benefit them. — Adapted",
  "Dreams don't pay bills. Action does. — Unknown",
  "If it was easy, everyone would do it. — Unknown",
  "Your network is your net worth — and most people have poor networks because they're lazy. — Unknown",
  "Life isn't about finding yourself. Life is about creating yourself — or wasting away trying. — Adapted from George Bernard Shaw",
  "The only place success comes before work is in the dictionary. — Vidal Sassoon",
  "You reap what you sow — and sometimes you reap what others sowed if you're lucky, but luck runs out. — Unknown",
  "Entitlement is the death of growth. — Unknown",
  "People remember the times you helped them when they needed it least and appreciated it most — but they also remember when you didn't. — Unknown",
  "Stop waiting for the perfect moment. It doesn't exist. — Unknown",
  "Fear is temporary. Regret is permanent. — Unknown",
  "You don't drown by falling in the water; you drown by staying there. — Edwin Louis Cole",
  "The truth hurts for a little while, but lies hurt for a lifetime. — Unknown",
  "Not everyone who smiles at you is your friend. — Unknown",
  "Life will test you until you break or become unbreakable. Choose. — Unknown",
  "Your potential means nothing if you don't act on it. — Unknown",
  "The clock is ticking louder than your excuses. — Unknown",
  "You can't change people, but you can change the people you allow in your life. — Unknown",
  "Most of your problems are because you think life should be fair. — Unknown",
  "Pain is inevitable. Suffering is optional. — Haruki Murakami (but most choose suffering)",
  "What got you here won't get you there. — Marshall Goldsmith",
  "The moment you accept responsibility for everything in your life is the moment you gain the power to change anything in your life. — Hal Elrod",
  "Everyone wants to eat, but few are willing to hunt. — Unknown",
  "Your life is your fault — good or bad. Own it. — Unknown",
  "Mediocrity is a choice. — Unknown",
  "The price of discipline is always less than the pain of regret. — Unknown",
  "Reality doesn't care about your feelings. — Unknown",
  "You either get busy living or get busy dying. — Stephen King (from Shawshank Redemption)",
  "No one is coming to rescue you from your bad decisions. — Unknown",
  "The world rewards results, not effort. — Unknown",
  "Stop romanticizing the struggle. Sometimes it's just poor choices. — Unknown",
  "You become what you tolerate. — Unknown",
  "Life doesn't give you what you want. It gives you what you earn. — Unknown",
  "You are the average of the five people you spend the most time with—and most people surround themselves with mediocrity. — Jim Rohn (adapted reality)",
  "The world doesn't owe you happiness; it owes you nothing. — Unknown",
  "Most relationships end because people change—or because they realize they never really knew each other. — Unknown",
  "You can be right, or you can be happy. Pick one. — Unknown",
  "Time doesn't heal anything; it just teaches you how to live with the pain. — Unknown",
  "Your parents won't always be there, and you'll regret the things you didn't say more than the things you did. — Unknown",
  "Friendships fade when convenience ends. True ones survive silence. — Unknown",
  "Money doesn't buy happiness, but poverty buys a lot of misery. — Unknown",
  "The older you get, the more you realize most people are full of shit. — Unknown",
  "You don't miss the person; you miss the version of life they gave you. — Unknown",
  "People will use your kindness as weakness until you show them it's a choice. — Unknown",
  "Regret weighs more than failure ever will. — Unknown",
  "You teach people how to treat you by what you accept. — Unknown",
  "Life is short, and we're all dying—most just pretend it's not happening. — Unknown",
  "The person who cares least in a relationship has all the power. — Unknown",
  "Nobody's thinking about you as much as you think they are. — Unknown",
  "Your health is your real wealth—ignore it and watch everything crumble. — Unknown",
  "You can't fix people who don't want to be fixed. Stop trying. — Unknown",
  "Betrayal comes from the people you trust most because strangers can't betray you. — Unknown",
  "Success changes people; failure reveals them. — Unknown",
  "The truth is lonely—most prefer comfortable lies. — Unknown",
  "You lose people in life: some by death, most by choice. — Unknown",
  "Your ego is the loudest voice keeping you small. — Unknown",
  "What you tolerate becomes your standard. Raise it or stay stuck. — Unknown",
  "Life punishes indecision harder than wrong decisions. — Unknown",
  "People remember your silence more than your words. — Unknown",
  "The moment you stop caring what others think is the moment you start living. — Unknown",
  "Forgive others, but never forget—trust is earned, not given blindly. — Unknown",
  "Your past is a lesson, not a life sentence—unless you keep replaying it. — Unknown",
  "Everyone is replaceable, including you. Act accordingly. — Unknown",
  "Happiness isn't found; it's built—and most people are too lazy to build. — Unknown",
  "The hardest prison to escape is the one in your mind. — Unknown",
  "You attract what you are, not what you want. Fix yourself first. — Unknown",
  "Death is the only thing that makes life fair—everyone gets the same end. — Unknown",
  "Stop waiting for closure; sometimes it never comes. Move anyway. — Unknown",
  "Your excuses are louder than your ambitions. — Unknown",
  "People show you who they are—believe them the first time. — Maya Angelou (harsh edition)",
  "The best revenge is massive success, but most settle for bitterness. — Unknown",
  "Life doesn't pause for your breakdowns. Keep moving or get left behind. — Unknown",
  "You can't pour from an empty cup, but most people keep trying until they break. — Unknown",
  "Trust is like glass: once shattered, even if glued, the cracks remain. — Unknown",
  "The loneliest place is in a crowd of people who don't really know you. — Unknown",
  "Your comfort zone is a beautiful place, but nothing ever grows there. — Unknown",
  "Most arguments are about pride, not facts. — Unknown",
  "You become what you feed your mind—garbage in, garbage out. — Unknown",
  "Time reveals everything: loyalty, love, character. Just wait. — Unknown",
  "The person you think about most probably doesn't think about you at all. — Unknown",
  "Life is brutal, but complaining won't change the rules. — Unknown",
  "You only regret the chances you didn't take—especially the ones with people. — Unknown",
  "Everyone leaves eventually. Some just do it slower. — Unknown",
  "Your story isn't special until you make it one. — Unknown",
  "The universe doesn't conspire for or against you—it just doesn't care. — Unknown",
  "Pain is the best teacher, but most students skip class. — Unknown",
  "Stop romanticizing potential. Results are what matter. — Unknown",
  "You can't outrun your own bullshit forever. — Unknown"
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
    <div className="py-6 px-1 space-y-6 animate-in fade-in duration-500 pb-32">
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