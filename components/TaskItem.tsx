"use client";

import { useState, useRef, useEffect } from "react";
import { Todo, Priority } from "@/types/todo";
import { PriorityBadge } from "./PriorityBadge";
import { Trash2, Check, Pencil, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSwipeable, SwipeEventData } from "react-swipeable";

interface TaskItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onUpdatePriority: (id: string, newPriority: Priority) => void;
}

export function TaskItem({ todo, onToggle, onDelete, onEdit, onUpdatePriority }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // Click outside to close priority menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowPriorityMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSaveEdit = () => {
    if (editText.trim() && editText.trim() !== todo.text) {
      onEdit(todo.id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  // Swipe Handlers
  const handlers = useSwipeable({
    onSwiping: (eventData: SwipeEventData) => {
        if (isEditing) return;
        setSwipeOffset(eventData.deltaX);
    },
    onSwipedLeft: (eventData: SwipeEventData) => {
        if (isEditing) return;
        if (eventData.deltaX < -100) {
            onDelete(todo.id);
        } else {
            setSwipeOffset(0);
        }
    },
    onSwipedRight: (eventData: SwipeEventData) => {
        if (isEditing) return;
        if (eventData.deltaX > 100) {
            onToggle(todo.id);
            setSwipeOffset(0); // Reset after toggle
        } else {
            setSwipeOffset(0);
        }
    },
    onTouchEndOrOnMouseUp: () => {
        if (Math.abs(swipeOffset) < 100) {
             setSwipeOffset(0);
        }
    },
    trackMouse: true
  });

  const getSwipeBackground = () => {
      if (swipeOffset > 0) return "bg-emerald-500/20"; // Right Swipe (Complete)
      if (swipeOffset < 0) return "bg-destructive/20"; // Left Swipe (Delete)
      return "bg-card";
  };

  return (
    <div className={cn(
      "relative mb-3 group rounded-xl transition-all",
      showPriorityMenu ? "z-50" : "z-auto"
    )}>
        {/* Swipe Background Visuals */}
        <div className={cn(
            "absolute inset-0 flex items-center px-6 transition-colors duration-200 rounded-xl", 
            getSwipeBackground()
        )}>
             {swipeOffset > 0 && (
                 <div className="flex items-center gap-2 text-emerald-500 ml-0 mr-auto opacity-0 animate-in fade-in slide-in-from-left-4" style={{ opacity: Math.min(swipeOffset / 100, 1) }}>
                     <Check size={20} strokeWidth={3} />
                     <span className="font-bold uppercase tracking-wider text-xs">Complete</span>
                 </div>
             )}
             {swipeOffset < 0 && (
                 <div className="flex items-center gap-2 text-destructive ml-auto mr-0 opacity-0 animate-in fade-in slide-in-from-right-4" style={{ opacity: Math.min(Math.abs(swipeOffset) / 100, 1) }}>
                     <span className="font-bold uppercase tracking-wider text-xs">Delete</span>
                     <Trash2 size={20} strokeWidth={2.5} />
                 </div>
             )}
        </div>

        {/* Main Swipeable Content */}
        <div 
            {...handlers}
            style={{ transform: `translateX(${swipeOffset}px)` }}
            className={cn(
            "relative flex items-center gap-3 p-4 rounded-xl border transition-transform duration-75 ease-out", // fast duration for direct mapping
            isEditing 
                ? "bg-secondary/50 border-input ring-1 ring-ring" 
                : "bg-card border-border hover:border-muted-foreground/50 hover:shadow-lg dark:hover:shadow-black/50"
            )}
        >
        
        {/* 2. Custom Checkbox: Tactile feel */}
        <button
            onClick={() => onToggle(todo.id)}
            className={cn(
            "w-5 h-5 flex items-center justify-center rounded-md border transition-all duration-200 shrink-0",
            todo.completed
                ? "bg-primary border-primary text-primary-foreground shadow-[0_0_10px_rgba(255,255,255,0.3)] dark:shadow-none" // Active
                : "bg-transparent border-muted-foreground/30 hover:border-muted-foreground text-transparent" // Inactive
            )}
        >
            <Check size={12} strokeWidth={4} />
        </button>

        <div className="flex-1 min-w-0 flex flex-col gap-1">
            {isEditing ? (
            // 3. Seamless Input: Looks like text but editable
            <div className="flex flex-col gap-2 w-full">
                <input
                ref={inputRef}
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit();
                    if (e.key === 'Escape') handleCancelEdit();
                }}
                className="w-full bg-transparent text-base text-foreground outline-none border-b border-border focus:border-foreground pb-1 transition-colors placeholder:text-muted-foreground"
                />
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                Press Enter to save <span className="text-foreground/50">|</span> Esc to cancel
                </div>
            </div>
            ) : (
            // Display Text
            <div className="flex flex-col gap-1.5">
                <span
                className={cn(
                    "text-base leading-snug break-all transition-all duration-300 select-none",
                    todo.completed ? "text-muted-foreground line-through decoration-border" : "text-foreground"
                )}
                >
                {todo.text}
                </span>
                
                {/* 4. Metadata Row: Priority Badge + Menu */}
                <div className="flex items-center gap-3">
                <div 
                    className="relative" 
                    ref={menuRef}
                    onPointerDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowPriorityMenu(!showPriorityMenu); }}
                        className="hover:opacity-80 transition-opacity active:scale-95"
                    >
                        <PriorityBadge priority={todo.priority} />
                    </button>
                    
                    {/* Glassy Dropdown Menu */}
                    {showPriorityMenu && (
                        <div className="absolute top-full left-0 mt-2 z-20 w-32 bg-popover border border-border rounded-lg shadow-xl p-1 animate-in fade-in zoom-in-95 duration-100">
                        {(['High', 'Medium', 'Low'] as Priority[]).map((priority) => (
                            <button
                            key={priority}
                            onClick={() => {
                                onUpdatePriority(todo.id, priority);
                                setShowPriorityMenu(false);
                            }}
                            className={cn(
                                "w-full text-left px-3 py-2 text-xs font-medium rounded-md transition-colors font-mono uppercase",
                                todo.priority === priority 
                                ? "bg-secondary text-foreground" 
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                            )}
                            >
                            {priority}
                            </button>
                        ))}
                        </div>
                    )}
                </div>
                </div>
            </div>
            )}
        </div>

        {/* 5. Actions: Always visible */}
        <div className="flex items-center gap-1">
            {isEditing ? (
            <button onClick={handleSaveEdit} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
                <Save size={16} />
            </button>
            ) : (
            <>
                <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                >
                <Pencil size={15} />
                </button>
                <button
                onClick={() => onDelete(todo.id)}
                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                >
                <Trash2 size={15} />
                </button>
            </>
            )}
        </div>
        </div>
    </div>
  );
}
