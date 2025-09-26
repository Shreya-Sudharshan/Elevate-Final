import { create } from "zustand";
import supabase from "../lib/supabase";

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: "HR" | "IT" | "Compliance" | "General" | "Personal" | "Learning" | "Technical";
  dueDate: string;           
  points: number;
  isMandatory: boolean;          
  status: "todo" | "done" | "snoozed";
  completedAt?: string;         
}

type DbTask = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string | null;
  due_date: string | null;    
  points: number | null;
  is_mandatory: boolean | null;
  status: "todo" | "done" | "snoozed" | null;
  completed_at: string | null;
};

const fromDB = (row: DbTask): Task => ({
  id: row.id,
  user_id: row.user_id,
  title: row.title,
  description: row.description ?? "",
  category: (row.category as Task["category"]) ?? "General",
  dueDate: row.due_date ?? "",               
  points: row.points ?? 0,
  isMandatory: !!row.is_mandatory,           
  status: (row.status as Task["status"]) ?? "todo",
  completedAt: row.completed_at ?? undefined, 
});

// UI -> DB (only map provided fields)
const toDB = (task: Partial<Task>) => ({
  ...(task.id ? { id: task.id } : {}),
  ...(task.user_id ? { user_id: task.user_id } : {}),
  ...(task.title !== undefined ? { title: task.title } : {}),
  ...(task.description !== undefined ? { description: task.description } : {}),
  ...(task.category !== undefined ? { category: task.category } : {}),
  ...(task.dueDate !== undefined ? { due_date: task.dueDate } : {}),      
  ...(task.points !== undefined ? { points: task.points } : {}),
  ...(task.isMandatory !== undefined ? { is_mandatory: task.isMandatory } : {}),
  ...(task.status !== undefined ? { status: task.status } : {}),
  ...(task.completedAt !== undefined ? { completed_at: task.completedAt } : {}),
});

interface TaskState {
  tasks: Task[];
  fetchTasks: (userId: string) => Promise<void>;
  addTask: (task: Omit<Task, "id">) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  snoozeTask: (id: string) => Promise<void>;
  editTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],

  fetchTasks: async (userId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/tasks/${userId}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data.all_tasks) {
          set({ tasks: result.data.all_tasks.map(fromDB) });
        }
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  },

  addTask: async (task) => {
    try {
      const response = await fetch('http://localhost:3001/api/tasks/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: task.user_id,
          title: task.title,
          category: task.category,
          dueDate: task.dueDate,
          points: task.points,
          isMandatory: task.isMandatory
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.task) {
          set((state) => ({ tasks: [...state.tasks, fromDB(result.task)] }));
        }
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  },

  completeTask: async (id) => {
    try {
      const response = await fetch('http://localhost:3001/api/tasks/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: id,
          userId: get().tasks.find(t => t.id === id)?.user_id
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === id ? { ...t, status: t.status === "done" ? "todo" : "done" } : t
            ),
          }));
        }
      }
    } catch (error) {
      console.error("Error completing task:", error);
    }
  },

  snoozeTask: async (id) => {
    const { error } = await supabase
      .from("tasks")
      .update({ status: "snoozed" })
      .eq("id", id);

    if (error) {
      console.error("Error snoozing task:", error);
      return;
    }

    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, status: "snoozed" } : t
      ),
    }));
  },

  editTask: async (id, updates) => {
    const { error } = await supabase
      .from("tasks")
      .update(toDB(updates))
      .eq("id", id);

    if (error) {
      console.error("Error editing task:", error);
      return;
    }

    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  },

  deleteTask: async (id) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) {
      console.error("Error deleting task:", error);
      return;
    }
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
  },
}));
