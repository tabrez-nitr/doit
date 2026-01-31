export type Priority = 'High' | 'Medium' | 'Low';

export interface Todo {
  id: string;
  text: string;
  priority: Priority;
  date: string; // YYYY-MM-DD
  deadline?: string; // YYYY-MM-DD
  completed: boolean;
}

export interface Goal {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}
