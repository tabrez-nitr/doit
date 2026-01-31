"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, CheckCircle2, Circle, Trash2 } from "lucide-react";
import { Goal } from "@/types/todo";
import { cn } from "@/lib/utils";

interface GoalSettingProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GoalSetting({ isOpen, onClose }: GoalSettingProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState("");

  // Load goals from local storage
  useEffect(() => {
    const savedGoals = localStorage.getItem("goals");
    if (savedGoals) {
      try {
        setGoals(JSON.parse(savedGoals));
      } catch (e) {
        console.error("Failed to parse goals", e);
      }
    }
  }, []);

  // Save goals to local storage
  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  const addGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.trim()) return;

    const goal: Goal = {
      id: Math.random().toString(36).substring(2, 9),
      text: newGoal.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setGoals([goal, ...goals]);
    setNewGoal("");
  };

  const toggleGoal = (id: string) => {
    setGoals(
      goals.map((g) =>
        g.id === id ? { ...g, completed: !g.completed } : g
      )
    );
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter((g) => g.id !== id));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl rounded-b-[2.5rem] shadow-2xl overflow-hidden border-b border-white/10"
            style={{ maxHeight: "85vh" }}
          >
            <div className="p-6 pb-8 space-y-6 max-w-xl mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-foreground">My Goals</h2>
                  <p className="text-muted-foreground text-sm font-medium">Focus on what matters most</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-muted/20 hover:bg-muted/40 transition-colors border border-white/5"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Input */}
              <form onSubmit={addGoal} className="relative group">
                <input
                  type="text"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="Set a new goal..."
                  className="w-full bg-muted/40 border border-white/10 rounded-2xl px-5 py-5 pr-14 text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/50 transition-all shadow-sm"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!newGoal.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-primary text-primary-foreground rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all shadow-md active:scale-95"
                >
                  <Plus size={20} strokeWidth={3} />
                </button>
              </form>

              {/* Goals List */}
              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                {goals.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground/40 flex flex-col items-center gap-3">
                    <Circle className="w-12 h-12 opacity-20" />
                    <p className="font-medium">No goals set yet</p>
                  </div>
                ) : (
                  goals.map((goal) => (
                    <div
                      key={goal.id}
                      className={cn(
                        "group relative flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-card/40 hover:bg-card/60 transition-all duration-200 shadow-sm",
                        goal.completed && "bg-muted/30 border-transparent"
                      )}
                    >
                      <div
                        className="flex items-center gap-4 flex-1 cursor-pointer"
                        onClick={() => toggleGoal(goal.id)}
                      >
                        <div className={cn(
                            "transition-all duration-300 transform group-hover:scale-110",
                            goal.completed ? "text-green-500" : "text-muted-foreground/70"
                        )}>
                            {goal.completed ? <CheckCircle2 size={26} className="fill-current/20" /> : <Circle size={26} strokeWidth={1.5} />}
                        </div>
                        <span
                          className={cn(
                            "text-lg font-medium transition-all duration-300",
                            goal.completed ? "line-through text-muted-foreground/60" : "text-foreground"
                          )}
                        >
                          {goal.text}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteGoal(goal.id);
                        }}
                        className="p-3 text-muted-foreground/50 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                        aria-label="Delete goal"
                      >
                        <Trash2 size={20} strokeWidth={1.5} />
                      </button>
                    </div>
                  ))
                )}
              </div>
              
               {/* Footer / Drag Handle */}
               <div className="w-full flex flex-col items-center gap-4 pt-2">
                 {goals.some(g => g.completed) && (
                    <button 
                        onClick={() => setGoals(goals.filter(g => !g.completed))}
                        className="text-xs font-medium text-muted-foreground hover:text-red-400 transition-colors px-3 py-1 rounded-full hover:bg-red-400/10"
                    >
                        Clear Completed
                    </button>
                 )}
                 <div className="w-16 h-1.5 bg-muted-foreground/20 rounded-full" />
               </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
