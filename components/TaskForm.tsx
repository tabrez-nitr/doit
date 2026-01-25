"use client";

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Priority } from "@/types/todo";
import { cn } from "@/lib/utils";
import { Plus, X, ArrowUp, ArrowDown, AlertCircle, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface TaskFormHandle {
  focus: () => void;
}

interface TaskFormProps {
  onAdd: (text: string, priority: Priority) => void;
}

export const TaskForm = forwardRef<TaskFormHandle, TaskFormProps>(({ onAdd }, ref) => {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      setIsOpen(true);
      setTimeout(() => inputRef.current?.focus(), 100); 
    }
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text, priority);
      setText("");
      setIsOpen(false);
    }
  };

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const priorities: { value: Priority; color: string; icon: any }[] = [
    { value: "High", color: "text-red-500 border-red-500/30 bg-red-500/10 dark:text-red-400", icon: AlertCircle },
    { value: "Medium", color: "text-amber-500 border-amber-500/30 bg-amber-500/10 dark:text-amber-400", icon: ArrowUp },
    { value: "Low", color: "text-emerald-500 border-emerald-500/30 bg-emerald-500/10 dark:text-emerald-400", icon: ArrowDown },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-background/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] left-0 right-0 z-50 flex justify-end pointer-events-none px-4 pb-4">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.button
              key="fab"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setIsOpen(true)}
              className="pointer-events-auto shadow-lg bg-primary text-primary-foreground rounded-2xl p-3 hover:scale-105 transition-transform"
            >
              <Plus size={24} strokeWidth={2.5} />
            </motion.button>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="pointer-events-auto w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden p-4"
            >
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                   <input
                    ref={inputRef}
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="New task..."
                    className="flex-1 bg-transparent text-lg text-foreground placeholder:text-muted-foreground outline-none"
                    autoComplete="on"
                   />
                   <button 
                     type="button"
                     onClick={() => setIsOpen(false)}
                     className="p-2 text-muted-foreground hover:text-foreground"
                   >
                     <X size={20} />
                   </button>
                </div>

                <div className="flex items-center justify-between mt-2">
                   {/* Priority Chips */}
                   <div className="flex gap-2">
                      {priorities.map((p) => (
                        <button
                          key={p.value}
                          type="button"
                          onClick={() => setPriority(p.value)}
                          className={cn(
                            "flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-medium rounded-[7px] border transition-all",
                            priority === p.value
                              ? cn(p.color, "ring-1 ring-inset")
                              : "bg-secondary border-transparent text-muted-foreground hover:bg-secondary/80"
                          )}
                        >
                          <p.icon className="w-3 h-3" />
                          {p.value}
                        </button>
                      ))}
                   </div>

                   <button
                    type="submit"
                    disabled={!text.trim()}
                    className={cn(
                      "p-2.5 rounded-xl bg-primary text-primary-foreground transition-all",
                      !text.trim() && "opacity-50 cursor-not-allowed"
                    )}
                   >
                     <Send size={18} />
                   </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
});

TaskForm.displayName = "TaskForm";