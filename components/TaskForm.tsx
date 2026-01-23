"use client";

import { useState, useRef, useEffect } from "react";
import { Priority } from "@/types/todo";
import { cn } from "@/lib/utils";
import { Plus, X, ArrowUp, ArrowDown, AlertCircle } from "lucide-react";

interface TaskFormProps {
  onAdd: (text: string, priority: Priority) => void;
}

export function TaskForm({ onAdd }: TaskFormProps) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const priorities: { value: Priority; color: string; icon: any }[] = [
    { value: "High", color: "text-red-400 border-red-500/30 bg-red-500/10", icon: AlertCircle },
    { value: "Medium", color: "text-amber-400 border-amber-500/30 bg-amber-500/10", icon: ArrowUp },
    { value: "Low", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10", icon: ArrowDown },
  ];

  return (
    // 1. Container: Glassy black effect (floating dock feel)
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/80 backdrop-blur-xl border-t border-zinc-800 transition-all duration-300">
      <div className="max-w-2xl mx-auto">
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 relative">
          
          {/* 2. Priority Selector: Expands Upwards */}
          {isExpanded && (
            <div className="flex items-center gap-2 mb-1 animate-in slide-in-from-bottom-2 fade-in duration-200">
              <span className="text-[10px] font-mono font-medium text-zinc-500 uppercase tracking-wider mr-2">
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
                      ? cn(p.color, "shadow-[0_0_10px_rgba(0,0,0,0.5)]") // Active: Glowing color
                      : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700" // Inactive: Dark
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
                className="text-zinc-500 hover:text-white transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* 3. Input Area */}
          <div className={cn(
            "flex items-center gap-2 p-1.5 rounded-2xl border transition-all duration-300",
            isExpanded 
              ? "bg-black border-zinc-700 ring-1 ring-zinc-700 shadow-xl" 
              : "bg-black border-zinc-800 hover:border-zinc-700"
          )}>
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              placeholder="What needs to be done?"
              className="flex-1 bg-transparent border-none px-4 py-3 text-white placeholder:text-zinc-600 focus:ring-0 focus:outline-none text-base"
              autoComplete="off"
            />
            
            {/* 4. Submit Button: High contrast white */}
            <button
              type="submit"
              disabled={!text.trim()}
              className={cn(
                "p-3 rounded-xl transition-all duration-200 flex items-center justify-center",
                text.trim()
                  ? "bg-white text-black hover:bg-zinc-200 shadow-lg cursor-pointer scale-100"
                  : "bg-zinc-800 text-zinc-600 cursor-not-allowed scale-90 opacity-50"
              )}
            >
              <Plus size={20} strokeWidth={2.5} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}