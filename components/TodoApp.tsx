"use client";

import { useState, useRef } from "react";
import { Header } from "./Header";
import { TaskForm, TaskFormHandle } from "./TaskForm";
import { TaskItem } from "./TaskItem";
import { Analytics } from "./Analytics";
import { DeadlineSection } from "./DeadlineSection";
import { useTodos } from "@/hooks/useTodos";
import { Priority, Todo } from "@/types/todo";
import { Plus } from "lucide-react";
import { useSwipeable } from "react-swipeable";

const generateId = () => Math.random().toString(36).substring(2, 9);

export function TodoApp() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'list' | 'analytics' | 'deadlines'>('list');
  const { todos, addTodo, toggleTodo, deleteTodo, editTodo, updatePriority, updateTodo, isLoaded } = useTodos();
  const taskFormRef = useRef<TaskFormHandle>(null);

  const handlePrevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const toDateString = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const currentKey = toDateString(currentDate);

  const filteredTodos = todos.filter(t => t.date === currentKey);

  // Sorting: High > Medium > Low, then by creation (implicit by array order)
  const priorityOrder: Record<Priority, number> = { High: 3, Medium: 2, Low: 1 };
  
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    // Sort by completion first (incomplete on top)
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    // Then by priority
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  const handleAddTodo = (text: string, priority: Priority) => {
    const newTodo: Todo = {
      id: generateId(),
      text,
      priority,
      date: currentKey,
      completed: false, 
    };
    addTodo(newTodo);
  };

  const handleAddDeadline = (text: string, priority: Priority, deadline: string) => {
    const newTodo: Todo = {
      id: generateId(),
      text,
      priority,
      date: deadline, // You might want separate field, but for now associating with that date
      deadline: deadline, // Tracking the deadline explicitly
      completed: false,
    };
    addTodo(newTodo);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (view === 'analytics') setView('list');
      else if (view === 'list') setView('deadlines');
    },
    onSwipedRight: () => {
      if (view === 'deadlines') setView('list');
      else if (view === 'list') setView('analytics');
    },
    trackMouse: true
  });

  if (!isLoaded) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  const completedCount = sortedTodos.filter(todo => todo.completed).length;
  const totalCount = sortedTodos.length;

  return (
    <div {...handlers} className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300">
      <Header 
        currentDate={currentDate} 
        onPrev={handlePrevDay} 
        onNext={handleNextDay}
        completedCount={completedCount}
        totalCount={totalCount}
        view={view}
        onToggleView={setView}
      />

      <main className="flex-1 p-6 pb-32 overflow-y-auto">
        {view === 'analytics' ? (
          <Analytics todos={todos} />
        ) : view === 'deadlines' ? (
          <DeadlineSection 
            todos={todos} 
            onAdd={handleAddDeadline}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onUpdate={updateTodo}
          />
        ) : (
          sortedTodos.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground mt-20 animate-in fade-in duration-500">
              <div className="text-center space-y-4">
                <button 
                  onClick={() => taskFormRef.current?.focus()}
                  className="w-16 h-16 mx-auto bg-primary border-2 border-primary-foreground/20 rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors cursor-pointer group shadow-lg"
                >
                  <Plus size={32} className="text-primary-foreground group-hover:scale-110 transition-transform" />
                </button>
                <div>
                  <p className="text-xl font-medium text-foreground">No tasks for this day</p>
                  <p className="text-sm text-muted-foreground mt-2">Tap the + button below to add your first task</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {sortedTodos.map((todo) => (
                <TaskItem 
                  key={todo.id} 
                  todo={todo} 
                  onToggle={toggleTodo} 
                  onDelete={deleteTodo}
                  onEdit={editTodo}
                  onUpdatePriority={updatePriority}
                />
              ))}
            </div>
          )
        )}
      </main>

      {view === 'list' && <TaskForm ref={taskFormRef} onAdd={handleAddTodo} />}
    </div>
  );
}
