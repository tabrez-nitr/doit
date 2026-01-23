"use client";

import { useState, useRef, useEffect } from "react";
import { Todo, Priority } from "@/types/todo";
import { PriorityBadge } from "./PriorityBadge";
import { Trash2, Check, Pencil, Save } from "lucide-react";
import { cn } from "@/lib/utils";

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

  return (
    // 1. Container: Pure black with subtle zinc border that lights up on hover
    <div className={cn(
      "relative flex items-center gap-3 p-4 mb-3 rounded-xl border transition-all duration-300 group",
      isEditing 
        ? "bg-zinc-900/50 border-zinc-700 ring-1 ring-zinc-700" 
        : "bg-black border-zinc-800 hover:border-zinc-700 hover:shadow-lg hover:shadow-black/50"
    )}>
      
      {/* 2. Custom Checkbox: Tactile feel */}
      <button
        onClick={() => onToggle(todo.id)}
        className={cn(
          "w-5 h-5 flex items-center justify-center rounded-md border transition-all duration-200 shrink-0",
          todo.completed
            ? "bg-white border-white text-black shadow-[0_0_10px_rgba(255,255,255,0.3)]" // Active: White Glow
            : "bg-transparent border-zinc-700 hover:border-zinc-500 text-transparent" // Inactive: Empty Void
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
              className="w-full bg-transparent text-base text-white outline-none border-b border-zinc-700 focus:border-white pb-1 transition-colors placeholder:text-zinc-600"
            />
            <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
               Press Enter to save <span className="text-zinc-700">|</span> Esc to cancel
            </div>
          </div>
        ) : (
          // Display Text
          <div className="flex flex-col gap-1.5">
            <span
              className={cn(
                "text-base leading-snug break-all transition-all duration-300 select-none",
                todo.completed ? "text-zinc-600 line-through decoration-zinc-800" : "text-zinc-200"
              )}
            >
              {todo.text}
            </span>
            
            {/* 4. Metadata Row: Priority Badge + Menu */}
            <div className="flex items-center gap-3">
               <div className="relative" ref={menuRef}>
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowPriorityMenu(!showPriorityMenu); }}
                    className="hover:opacity-80 transition-opacity active:scale-95"
                  >
                    <PriorityBadge priority={todo.priority} />
                  </button>
                  
                  {/* Glassy Dropdown Menu */}
                  {showPriorityMenu && (
                    <div className="absolute top-full left-0 mt-2 z-20 w-32 bg-black border border-zinc-800 rounded-lg shadow-xl p-1 animate-in fade-in zoom-in-95 duration-100">
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
                              ? "bg-zinc-900 text-white" 
                              : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"
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
          <button onClick={handleSaveEdit} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
            <Save size={16} />
          </button>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors"
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
            >
              <Trash2 size={15} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
