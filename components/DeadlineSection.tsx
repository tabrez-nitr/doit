"use client";

import { useState } from "react";
import { Todo, Priority } from "@/types/todo";
import { Plus, Calendar as CalendarIcon, Flag, Clock, Trash2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "./Calendar";

interface DeadlineSectionProps {
  todos: Todo[];
  onAdd: (text: string, priority: Priority, deadline: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function DeadlineSection({ todos, onAdd, onToggle, onDelete, onUpdate }: DeadlineSectionProps & { onUpdate: (id: string, updates: Partial<Todo>) => void }) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [deadline, setDeadline] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editPriority, setEditPriority] = useState<Priority>("Medium");
  const [showEditCalendar, setShowEditCalendar] = useState(false);

  // Filter only todos that have a deadline
  const deadlineTodos = todos
    .filter((t) => t.deadline)
    .sort((a, b) => {
       // Sort incomplete first, then by date
       if (a.completed !== b.completed) return a.completed ? 1 : -1;
       return new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime();
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && deadline) {
      onAdd(text, priority, deadline);
      setText("");
      setDeadline("");
      setIsFormOpen(false);
      setShowCalendar(false);
    }
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
    setEditDate(todo.deadline || "");
    setEditPriority(todo.priority);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText("");
    setEditDate("");
    setShowEditCalendar(false);
  };

  const saveEdit = () => {
    if (editingId && editText.trim() && editDate) {
      onUpdate(editingId, {
        text: editText,
        deadline: editDate,
        date: editDate, // Update the date key as well to keep them in sync
        priority: editPriority
      });
      setEditingId(null);
      setShowEditCalendar(false);
    }
  };

  const getDaysLeft = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return `${diffDays} days left`;
  };

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case "High": return "text-red-400";
      case "Medium": return "text-amber-400";
      case "Low": return "text-emerald-400";
    }
  };

  const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="pb-32 space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Upcoming Deadlines</h2>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="p-2 bg-white text-black rounded-full hover:bg-zinc-200 transition-colors"
        >
          <Plus size={20} className={cn("transition-transform duration-300", isFormOpen ? "rotate-45" : "")} />
        </button>
      </div>

      {/* Add Deadline Form */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl space-y-4 animate-in slide-in-from-top-2 relative z-20">
          <div>
            <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1 block">Task</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What is due?"
              className="w-full bg-black border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-white transition-colors"
              autoFocus
            />
          </div>
          
          <div className="flex gap-4 relative">
            <div className="flex-1 relative">
              <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1 block">Due Date</label>
              
              <div className="relative">
                <button
                    type="button"
                    onClick={() => setShowCalendar(!showCalendar)}
                    className={cn(
                        "w-full bg-black border rounded-lg p-2 text-left flex items-center gap-2 transition-colors",
                        showCalendar ? "border-white text-white" : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
                    )}
                >
                    <CalendarIcon size={16} />
                    <span className={!deadline ? "text-zinc-600" : "text-white"}>
                        {deadline ? formatDateForInput(deadline) : "Select Date"}
                    </span>
                </button>

                {showCalendar && (
                    <div className="absolute top-full left-0 mt-2 z-50">
                        <Calendar 
                            selected={deadline ? new Date(deadline) : null}
                            onSelect={(date) => {
                                const offset = date.getTimezoneOffset();
                                const localDate = new Date(date.getTime() - (offset*60*1000));
                                setDeadline(localDate.toISOString().split('T')[0]);
                                setShowCalendar(false);
                            }}
                        />
                    </div>
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1 block">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-black border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-white transition-colors appearance-none"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={!text.trim() || !deadline}
            className="w-full bg-white text-black font-semibold py-2 rounded-lg hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add Deadline
          </button>
        </form>
      )}

      {/* Deadlines List */}
      <div className="space-y-3">
        {deadlineTodos.length === 0 ? (
          <div className="text-center py-10 text-zinc-500">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No upcoming deadlines</p>
          </div>
        ) : (
          deadlineTodos.map((todo) => {
            const daysLeft = getDaysLeft(todo.deadline!);
            const isOverdue = daysLeft === "Overdue";
            const isEditing = editingId === todo.id;
            
            if (isEditing) {
               return (
                  <div key={todo.id} className="bg-zinc-900 border border-zinc-700 p-4 rounded-xl space-y-3 animate-in fade-in zoom-in-95 relative z-10">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full bg-black border border-zinc-800 rounded p-2 text-white"
                      />
                      <div className="flex gap-2 relative">
                         <div className="flex-1 relative">
                             <button
                                type="button"
                                onClick={() => setShowEditCalendar(!showEditCalendar)}
                                className={cn(
                                    "w-full bg-black border rounded p-2 text-left flex items-center gap-2 transition-colors",
                                    showEditCalendar ? "border-white text-white" : "border-zinc-800 text-zinc-300"
                                )}
                            >
                                <CalendarIcon size={14} />
                                <span>{editDate ? formatDateForInput(editDate) : "Select Date"}</span>
                            </button>
                            {showEditCalendar && (
                                <div className="absolute top-full left-0 mt-2 z-50">
                                    <Calendar 
                                        selected={editDate ? new Date(editDate) : null}
                                        onSelect={(date) => {
                                            const offset = date.getTimezoneOffset();
                                            const localDate = new Date(date.getTime() - (offset*60*1000));
                                            setEditDate(localDate.toISOString().split('T')[0]);
                                            setShowEditCalendar(false);
                                        }}
                                    />
                                </div>
                            )}
                         </div>

                         <select
                            value={editPriority}
                            onChange={(e) => setEditPriority(e.target.value as Priority)}
                            className="flex-1 bg-black border border-zinc-800 rounded p-2 text-white"
                         >
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                         </select>
                      </div>
                      <div className="flex justify-end gap-2">
                         <button onClick={cancelEditing} className="px-3 py-1 text-sm text-zinc-400 hover:text-white">Cancel</button>
                         <button onClick={saveEdit} className="px-3 py-1 text-sm bg-white text-black rounded hover:bg-zinc-200">Save</button>
                      </div>
                  </div>
               );
             }

            return (
              <div 
                key={todo.id}
                className={cn(
                  "group relative p-4 rounded-xl border transition-all hover:border-zinc-600",
                  todo.completed ? "bg-zinc-900/30 border-zinc-800/50 opacity-60" : "bg-black",
                  !todo.completed && isOverdue ? "border-red-900/50 bg-red-950/10" : "border-zinc-800"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0" onClick={() => !todo.completed && startEditing(todo)}>
                    {todo.completed ? (
                      <div className="flex items-center gap-2 mb-1 opacity-50">
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-500">
                             Done
                          </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn("text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800", isOverdue ? "text-red-400 border-red-900" : "text-zinc-400")}>
                          {daysLeft}
                        </span>
                        <span className={cn("text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded", 
                            todo.priority === 'High' ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                            todo.priority === 'Medium' ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                            "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        )}>
                            {todo.priority}
                        </span>
                      </div>
                    )}
                    
                    <h3 className={cn(
                        "text-lg font-medium truncate transition-all",
                        todo.completed ? "text-zinc-500 line-through decoration-zinc-700" : "text-zinc-100 cursor-pointer hover:underline decoration-zinc-700 underline-offset-4"
                    )}>
                        {todo.text}
                    </h3>
                    
                    {!todo.completed && (
                        <div className="flex items-center gap-2 text-zinc-500 text-sm mt-1">
                        <CalendarIcon className="w-3 h-3" />
                        {new Date(todo.deadline!).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                        onClick={() => onDelete(todo.id)}
                        className="p-2 text-zinc-600 hover:text-red-400 transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                    <button
                        onClick={() => onToggle(todo.id)}
                        className={cn(
                          "w-6 h-6 flex items-center justify-center rounded-md border transition-all duration-200 shrink-0 ml-2",
                          todo.completed
                            ? "bg-white border-white text-black shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                            : "bg-transparent border-zinc-700 hover:border-zinc-500 text-transparent"
                        )}
                        title={todo.completed ? "Mark as incomplete" : "Mark as complete"}
                    >
                        <Check size={14} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
