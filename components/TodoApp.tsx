"use client";

import { useState } from "react";
import { Header } from "./Header";
import { TaskForm } from "./TaskForm";
import { TaskItem } from "./TaskItem";
import { useTodos } from "@/hooks/useTodos";
import { Priority, Todo } from "@/types/todo";
import { Plus } from "lucide-react";
// import { v4 as uuidv4 } from "uuid"; // Removed to avoid dependency

// Simple UUID generator if we don't want to install uuid package yet, 
// strictly for a simple checklist. 
const generateId = () => Math.random().toString(36).substring(2, 9);

export function TodoApp() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { todos, addTodo, toggleTodo, deleteTodo, editTodo, updatePriority, isLoaded } = useTodos();

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
      completed: false, // Default to false
    };
    addTodo(newTodo);
  };

  if (!isLoaded) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  const completedCount = sortedTodos.filter(todo => todo.completed).length;
  const totalCount = sortedTodos.length;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      <Header 
        currentDate={currentDate} 
        onPrev={handlePrevDay} 
        onNext={handleNextDay}
        completedCount={completedCount}
        totalCount={totalCount}
      />

      <main className="flex-1 p-6 pb-32 overflow-y-auto">
        {sortedTodos.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-gray-400 mt-20 animate-in fade-in duration-500">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-black border border-white rounded-full flex items-center justify-center">
                <Plus size={32} className="text-gray-500" />
              </div>
              <div>
                <p className="text-xl font-medium text-gray-300">No tasks for this day</p>
                <p className="text-sm text-gray-500 mt-2">Tap the + button below to add your first task</p>
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
        )}
      </main>

      <TaskForm onAdd={handleAddTodo} />
    </div>
  );
}
