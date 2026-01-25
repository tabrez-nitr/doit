"use client";

import { useState, useRef, useEffect } from "react";
import { useExpenses } from "@/hooks/useExpenses";
import { Expense } from "@/types/expense";
import { Plus, Trash2, ChevronLeft, ChevronRight, Check, CalendarDays, IndianRupee, X, Pencil } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/Calendar";

export function FinanceSection() {
  const { expenses, addExpense, deleteExpense, editExpense, isLoaded } = useExpenses();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const calendarRef = useRef<HTMLDivElement>(null);

    // Close calendar on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };
    if (isCalendarOpen) {
        document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCalendarOpen]);

  if (!isLoaded) {
      return <div className="flex h-full items-center justify-center text-muted-foreground">Loading...</div>;
  }

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const monthlyExpenses = expenses.filter(e => {
      const d = new Date(e.date);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalAmount = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    if (editingId) {
        editExpense(editingId, {
            description,
            amount: parseFloat(amount),
            date: date.toISOString(),
        });
    } else {
        const newExpense: Expense = {
            id: Math.random().toString(36).substring(2, 9),
            description,
            amount: parseFloat(amount),
            date: date.toISOString(),
            category: "General",
        };
        addExpense(newExpense);
    }

    resetForm();
  };

  const handleEdit = (expense: Expense) => {
      setEditingId(expense.id);
      setDescription(expense.description);
      setAmount(expense.amount.toString());
      setDate(new Date(expense.date));
      setIsFormOpen(true);
  };

  const resetForm = () => {
      setDescription("");
      setAmount("");
      setDate(new Date());
      setEditingId(null);
      setIsFormOpen(false);
      setIsCalendarOpen(false);
  };
  
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
     setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500 relative min-h-[80vh]">
      {/* Header Card */}
      <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col items-center justify-center relative overflown-hidden">
        
        {/* Month Navigation */}
        <div className="flex items-center gap-4 text-muted-foreground mb-4">
            <button onClick={prevMonth} className="p-1 hover:text-foreground transition-colors hover:bg-secondary rounded-full">
                <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium uppercase tracking-widest">{monthName}</span>
            <button onClick={nextMonth} className="p-1 hover:text-foreground transition-colors hover:bg-secondary rounded-full">
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>

        {/* Total Amount */}
        <div className="flex flex-col items-center">
            <h2 className="text-4xl font-bold text-foreground tracking-tight flex items-start gap-1">
                <span className="text-lg font-medium text-muted-foreground mt-1">₹</span>
                {totalAmount.toFixed(2)}
            </h2>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest">Total Expenses</p>
        </div>
      </div>

      {/* Expenses List */}
      <div className="space-y-2">
        {monthlyExpenses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground/40 border border-dashed border-border/50 rounded-xl">
                <p className="text-sm font-medium">No expenses</p>
            </div>
        ) : (
            <AnimatePresence mode="popLayout">
            {monthlyExpenses.map((expense) => (
                <motion.div
                    key={expense.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="group flex items-center justify-between p-3 rounded-lg hover:bg-secondary/40 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium text-foreground/70">
                            {expense.description.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-foreground">{expense.description}</p>
                            <p className="text-[10px] text-muted-foreground">{new Date(expense.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-foreground tabular-nums flex items-center mr-2">
                             <span className="text-[10px] text-muted-foreground mr-0.5">₹</span>
                             {expense.amount.toFixed(2)}
                        </span>
                        <button
                            onClick={() => handleEdit(expense)}
                            className="text-muted-foreground/50 hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/10"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                        </button>
                         <button
                            onClick={() => deleteExpense(expense.id)}
                            className="text-muted-foreground/50 hover:text-destructive transition-colors p-2 rounded-full hover:bg-destructive/10"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </motion.div>
            ))}
            </AnimatePresence>
        )}
      </div>

      {/* Floating Action Button */}
      <AnimatePresence>
      {!isFormOpen && (
          <motion.button
            layoutId="fab"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { resetForm(); setIsFormOpen(true); }}
            className="fixed bottom-24 right-6 z-40 bg-zinc-800 text-white rounded-2xl p-4 shadow-xl shadow-black/20"
          >
            <Plus className="w-6 h-6" strokeWidth={2.5} />
          </motion.button>
      )}
      </AnimatePresence>

      {/* Minimalism Modal Form - Centered & Compact (Mobile Friendly) */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-black/60 backdrop-blur-sm"
               onClick={resetForm}
            />
            
            <motion.div
               initial={{ opacity: 0, scale: 0.9, y: 10 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 10 }}
               transition={{ type: "spring", damping: 25, stiffness: 300 }}
               className="relative w-full max-w-xs sm:max-w-sm bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 shadow-2xl ring-1 ring-white/5"
            >
               {/* Close Header */}
               <div className="absolute top-4 right-4 z-10">
                   <button onClick={resetForm} className="text-zinc-500 hover:text-zinc-300 bg-zinc-900 hover:bg-zinc-800 rounded-full p-1.5 transition-colors">
                        <X className="w-4 h-4" />
                   </button>
               </div>
               
               <form onSubmit={handleSubmit} className="space-y-6 pt-2">
                   {/* Title - Context Aware */}
                   <div className="text-center -mt-2 mb-4">
                       <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">
                           {editingId ? 'Edit Expense' : 'New Expense'}
                       </span>
                   </div>

                   {/* Date Picker - Pill - Centered Top */}
                   <div className="flex justify-center -mt-1 mb-2 relative">
                        <button 
                            type="button"
                            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                            className="relative inline-flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 rounded-full px-4 py-1.5 transition-colors group border border-white/5"
                        >
                            <CalendarDays className="w-3.5 h-3.5 text-zinc-400 mr-2" />
                            <span className="text-[11px] font-medium text-zinc-400 group-hover:text-zinc-200 uppercase tracking-wider">
                                {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                        </button>
                        
                         {/* Calendar Popover */}
                        <AnimatePresence>
                            {isCalendarOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-10 left-1/2 -translate-x-1/2 z-60"
                                    ref={calendarRef}
                                >
                                    <Calendar 
                                        selected={date} 
                                        onSelect={(d) => {
                                            setDate(d);
                                            setIsCalendarOpen(false);
                                        }} 
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                   </div>

                   {/* Amount Input - Center Stage & Compact */}
                   <div className="flex justify-center items-center gap-1.5">
                            <span className="text-3xl text-zinc-600 font-light translate-y-[-2px]">₹</span>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="bg-transparent text-5xl font-bold text-white placeholder:text-zinc-800 focus:outline-none text-center w-full max-w-[160px] caret-zinc-500"
                                autoFocus
                            />
                   </div>

                   {/* Description - Minimal Underline */}
                   <div className="px-2">
                       <input
                           type="text"
                           placeholder="What for?"
                           value={description}
                           onChange={(e) => setDescription(e.target.value)}
                           className="w-full bg-zinc-900/50 border-b border-zinc-800 rounded-t-lg py-3 text-center text-sm text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-colors"
                       />
                   </div>

                   {/* Submit Button - Compact */}
                   <button
                       type="submit"
                       disabled={!amount || !description}
                       className="w-full bg-white text-black font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 transform duration-100 text-sm shadow-lg shadow-white/5"
                   >
                       {editingId ? 'Update Expense' : 'Save Expense'}
                   </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
