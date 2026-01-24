"use client";

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Priority } from "@/types/todo";
import { cn } from "@/lib/utils";
import { Plus, X, ArrowUp, ArrowDown, AlertCircle } from "lucide-react";

export interface TaskFormHandle {
  focus: () => void;
}

interface TaskFormProps {
  onAdd: (text: string, priority: Priority) => void;
}

export const TaskForm = forwardRef<TaskFormHandle, TaskFormProps>(({ onAdd }, ref) => {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      setIsExpanded(true);
      // Timeout to ensure state update has rendered the input visible (if it was hidden)
      // though here the input is always rendered, just the wrapper expands.
      setTimeout(() => inputRef.current?.focus(), 50); 
    }
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text, priority);
      setText("");
      setIsExpanded(false);
      inputRef.current?.blur(); // Dismiss keyboard/focus
    }
  };

  // Close form on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isExpanded) {
        setIsExpanded(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isExpanded]);

  // Priorities retain their colors as they are semantic alerts
  const priorities: { value: Priority; color: string; icon: any }[] = [
    { value: "High", color: "text-red-500 border-red-500/30 bg-red-500/10 dark:text-red-400", icon: AlertCircle },
    { value: "Medium", color: "text-amber-500 border-amber-500/30 bg-amber-500/10 dark:text-amber-400", icon: ArrowUp },
    { value: "Low", color: "text-emerald-500 border-emerald-500/30 bg-emerald-500/10 dark:text-emerald-400", icon: ArrowDown },
  ];

  return (
    // 1. Container: Glassy effect
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/80 backdrop-blur-xl border-t border-border transition-all duration-300">
      <div className="max-w-2xl mx-auto">
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 relative">
          
          {/* 2. Priority Selector: Expands Upwards */}
          {isExpanded && (
            <div className="flex items-center gap-2 mb-1 animate-in slide-in-from-bottom-2 fade-in duration-200">
              <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-wider mr-2">
                Priority
              </span>
              {priorities.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200",
                    priority === p.value
                      ? cn(p.color, "shadow-sm dark:shadow-[0_0_10px_rgba(0,0,0,0.5)]") // Active
                      : "bg-secondary border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/50" // Inactive
                  )}
                >
                  <p.icon className="w-3 h-3" />
                  {p.value}
                </button>
              ))}
              
              <div className="flex-1" />
              
              {/* Close Button */}
              <button 
                type="button" 
                onClick={() => setIsExpanded(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* 3. Input Area */}
          <div className={cn(
            "flex items-center gap-2 p-1.5 rounded-2xl border transition-all duration-300",
            isExpanded 
              ? "bg-background border-input ring-1 ring-ring shadow-xl" 
              : "bg-muted/50 border-transparent hover:border-input hover:bg-muted"
          )}>
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              placeholder="What needs to be done?"
              className="flex-1 bg-transparent border-none px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-0 focus:outline-none text-base"
              autoComplete="off"
            />
            
            {/* 4. Submit Button: High contrast */}
            <button
              type="submit"
              disabled={!text.trim()}
              className={cn(
                "p-3 rounded-xl transition-all duration-200 flex items-center justify-center",
                text.trim()
                  ? "bg-primary text-primary-foreground hover:opacity-90 shadow-lg cursor-pointer scale-100"
                  : "bg-muted text-muted-foreground cursor-not-allowed scale-90 opacity-50"
              )}
            >
              <Plus size={20} strokeWidth={2.5} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

TaskForm.displayName = "TaskForm";