"use client";

import { useState, useEffect } from "react";
import { Expense } from "@/types/expense";

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("doit-expenses");
    if (stored) {
      try {
        setExpenses(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse expenses", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("doit-expenses", JSON.stringify(expenses));
    }
  }, [expenses, isLoaded]);

  const addExpense = (expense: Expense) => {
    setExpenses((prev) => [expense, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const getExpensesByMonth = (year: number, month: number) => {
    return expenses.filter((e) => {
      const date = new Date(e.date);
      return date.getFullYear() === year && date.getMonth() === month;
    });
  };

  const editExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  return {
    expenses,
    addExpense,
    deleteExpense,
    editExpense,
    getExpensesByMonth,
    isLoaded,
  };
}
