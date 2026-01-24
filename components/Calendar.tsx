"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarProps {
  selected: Date | null;
  onSelect: (date: Date) => void;
  className?: string;
}

export function Calendar({ selected, onSelect, className }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selected || new Date());

  // Reset to selected date if it changes externally
  useEffect(() => {
    if (selected) {
      setCurrentMonth(selected);
    }
  }, [selected]);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleSelectDate = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onSelect(newDate);
  };

  const renderDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysCount = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);
    
    const days = [];
    
    // Empty cells for days before start of month
    for (let i = 0; i < startDay; i++) {
        days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
    }

    const today = new Date();
    today.setHours(0,0,0,0);

    for (let i = 1; i <= daysCount; i++) {
        const date = new Date(year, month, i);
        const isSelected = selected && 
            date.getDate() === selected.getDate() && 
            date.getMonth() === selected.getMonth() && 
            date.getFullYear() === selected.getFullYear();
        
        const isToday = 
            date.getDate() === today.getDate() && 
            date.getMonth() === today.getMonth() && 
            date.getFullYear() === today.getFullYear();

        days.push(
            <button
                key={i}
                onClick={() => handleSelectDate(i)}
                className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-sm transition-all duration-200",
                    isSelected 
                        ? "bg-white text-black font-bold shadow-[0_0_10px_rgba(255,255,255,0.4)]" 
                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white",
                    !isSelected && isToday && "border border-zinc-600 text-white"
                )}
            >
                {i}
            </button>
        );
    }
    return days;
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className={cn("p-4 bg-black border border-zinc-800 rounded-xl shadow-2xl w-64 select-none", className)}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
            <button onClick={handlePrevMonth} className="p-1 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-white transition-colors">
                <ChevronLeft size={16} />
            </button>
            <span className="font-semibold text-white text-sm">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button onClick={handleNextMonth} className="p-1 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-white transition-colors">
                <ChevronRight size={16} />
            </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="h-8 w-8 flex items-center justify-center text-[10px] font-bold text-zinc-600 uppercase">
                    {day}
                </div>
            ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1">
            {renderDays()}
        </div>
    </div>
  );
}
