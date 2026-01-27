"use client";

import { useState, useRef, useEffect } from "react";
import { Header } from "./Header";
import { TaskForm, TaskFormHandle } from "./TaskForm";
import { TaskItem } from "./TaskItem";
import { Analytics } from "./Analytics";
import { DeadlineSection } from "./DeadlineSection";
import { cn, toLocalDateString } from "@/lib/utils";
import { FinanceSection } from "./FinanceSection";

import { useTodos } from "@/hooks/useTodos";
import { useLocalNotifications } from "@/hooks/useLocalNotifications"; // [NEW]
import { Priority, Todo } from "@/types/todo";
import { Plus } from "lucide-react";
import { useSwipeable } from "react-swipeable";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav } from "./BottomNav";

const generateId = () => Math.random().toString(36).substring(2, 9);
// ... existing code ...


const variants = {
  enter: (direction: number) => ({
    opacity: 0,
    scale: 0.96,
  }),
  center: {
    zIndex: 1,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    opacity: 0,
    scale: 0.96,
  }),
};

export function TodoApp() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'list' | 'analytics' | 'deadlines' | 'finance'>('list');
  const [direction, setDirection] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  const { todos, addTodo, toggleTodo, deleteTodo, editTodo, updatePriority, updateTodo, isLoaded } = useTodos();
  const { permission, requestPermission } = useLocalNotifications(todos); // [NEW]
  const taskFormRef = useRef<TaskFormHandle>(null);

  useEffect(() => {
    // Hide splash screen after 2.5 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const VIEWS = ['analytics', 'list', 'deadlines', 'finance'] as const;

  const handleViewChange = (newView: typeof view) => {
    if (view === newView) return;
    const currentIndex = VIEWS.indexOf(view);
    const newIndex = VIEWS.indexOf(newView);
    const newDirection = newIndex > currentIndex ? 1 : -1;
    setDirection(newDirection);
    setView(newView);
  };

  const handleSwipe = (direction: 'left' | 'right') => {
      const currentIndex = VIEWS.indexOf(view);
      if (direction === 'left') {
          // Next view (swiping left moves content to left, reveals right content)
          // Actually swipe LEFT means we want to see the thing on the RIGHT.
          // List (1) -> Deadlines (2).
          if (currentIndex < VIEWS.length - 1) {
              handleViewChange(VIEWS[currentIndex + 1]);
          }
      } else {
          // Prev view
          if (currentIndex > 0) {
              handleViewChange(VIEWS[currentIndex - 1]);
          }
      }
  };

  const handlers = useSwipeable({
      onSwipedLeft: (eventData) => {
        // Prevent conflict: If target is inside a scrollable container (like Heatmap) or TaskItem
        const target = eventData.event.target as HTMLElement;
        if (target.closest('.overflow-x-auto')) return; // Heatmap check
        if (target.closest('.task-card')) return; // TaskItem check
        
        handleSwipe('left');
      },
      onSwipedRight: (eventData) => {
        const target = eventData.event.target as HTMLElement;
        if (target.closest('.overflow-x-auto')) return;
        if (target.closest('.task-card')) return;

        handleSwipe('right');
      },
      preventScrollOnSwipe: false,
      trackMouse: true
  });

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
    return toLocalDateString(date);
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
      date: deadline, 
      deadline: deadline,
      completed: false,
    };
    addTodo(newTodo);
  };



  if (!isLoaded) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  const completedCount = sortedTodos.filter(todo => todo.completed).length;
  const totalCount = sortedTodos.length;

  return (
    <>
  

      <div 
          {...handlers}
          className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300 touch-pan-y overflow-hidden"
      >
      {view !== 'finance' && view !== 'deadlines' && (
      <Header 
        currentDate={currentDate} 
        onPrev={handlePrevDay} 
        onNext={handleNextDay}
        completedCount={completedCount}
        totalCount={totalCount}
        view={view}
        onToggleView={handleViewChange}
      />
      )}

      <main className={cn("flex-1 p-4 pb-32 overflow-y-auto overflow-x-hidden", view === 'deadlines' ? "px-4 pt-0" : "p-6")}>
        <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
                key={view}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                    duration: 0.4,
                    ease: [0.32, 0.72, 0, 1]
                }}
            >
                {view === 'analytics' ? (
                <Analytics 
                    todos={todos} 
                    permission={permission} 
                    onRequestPermission={requestPermission} 
                />
                ) : view === 'deadlines' ? (
                <DeadlineSection 
                    todos={todos} 
                    onAdd={handleAddDeadline}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                    onUpdate={updateTodo}
                />
                ) : view === 'finance' ? (
                  <FinanceSection />
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
            </motion.div>
        </AnimatePresence>
      </main>

      {view === 'list' && <TaskForm ref={taskFormRef} onAdd={handleAddTodo} />}
      <BottomNav currentView={view} onChange={handleViewChange} />
    </div>
    </>
  );
}
