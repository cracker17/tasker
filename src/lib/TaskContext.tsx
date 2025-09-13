'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { Task, TaskLog, TaskStatus } from '@/types/task';

interface TaskContextType {
  tasks: Task[];
  logs: TaskLog[];
  isLoading: boolean;
  isHydrated: boolean;
  canUndo: boolean;
  addTask: (title: string, description?: string, priority?: 'low' | 'medium' | 'high', dueDate?: Date, tags?: string[]) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  moveTask: (id: string, newStatus: TaskStatus) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  startTimer: (id: string) => Promise<void>;
  pauseTimer: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  undo: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

interface RawTask {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  startTime?: string;
  endTime?: string;
  totalTime?: number;
  createdAt: string;
  updatedAt: string;
  priority?: 'low' | 'medium' | 'high';
  estimatedTime?: number;
  dueDate?: string;
  tags?: string[];
  subtasks?: Array<{ id: string; title: string; completed: boolean }>;
}

interface RawTaskLog {
  id: string;
  taskId: string;
  taskName: string;
  startTime: string;
  endTime: string;
  totalTime: number;
  completedAt: string;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [logs, setLogs] = useState<TaskLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [canUndo, setCanUndo] = useState(false);

  // Load tasks from database when session is available
  useEffect(() => {
    if (session?.user?.id) {
      loadTasks();
    } else {
      setTasks([]);
      setLogs([]);
      setIsHydrated(true);
    }
  }, [session]);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tasks');
      if (response.ok) {
        const data = await response.json();
        setTasks(data.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          startTime: task.startTime ? new Date(task.startTime) : undefined,
          endTime: task.endTime ? new Date(task.endTime) : undefined,
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        })));
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setIsLoading(false);
      setIsHydrated(true);
    }
  };

  const addTask = async (title: string, description?: string, priority?: 'low' | 'medium' | 'high', dueDate?: Date, tags?: string[]) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, priority, dueDate, tags }),
      });

      if (response.ok) {
        const newTask = await response.json();
        setTasks(prev => [...prev, {
          ...newTask,
          createdAt: new Date(newTask.createdAt),
          updatedAt: new Date(newTask.updatedAt),
          dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
        }]);
      }
    } catch (error) {
      console.error('Failed to add task:', error);
      throw error;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(prev => prev.map(task =>
          task._id === id ? {
            ...updatedTask,
            createdAt: new Date(updatedTask.createdAt),
            updatedAt: new Date(updatedTask.updatedAt),
            startTime: updatedTask.startTime ? new Date(updatedTask.startTime) : undefined,
            endTime: updatedTask.endTime ? new Date(updatedTask.endTime) : undefined,
            dueDate: updatedTask.dueDate ? new Date(updatedTask.dueDate) : undefined,
          } : task
        ));
      }
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  };

  const moveTask = async (id: string, newStatus: TaskStatus) => {
    await updateTask(id, { status: newStatus });
  };

  const deleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTasks(prev => prev.filter(task => task._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  };

  const startTimer = async (id: string) => {
    const now = new Date();
    await updateTask(id, { status: 'doing', startTime: now });
  };

  const pauseTimer = async (id: string) => {
    await updateTask(id, { status: 'on_hold' });
  };

  const completeTask = async (id: string) => {
    const task = tasks.find(t => t._id === id);
    if (!task) return;

    const now = new Date();
    const totalTime = task.startTime ? now.getTime() - task.startTime.getTime() : 0;

    await updateTask(id, {
      status: 'done',
      endTime: now,
      totalTime: (task.totalTime || 0) + totalTime,
    });

    // Add to logs (in a real app, this would be stored in the database)
    const log: TaskLog = {
      id: Date.now().toString(),
      taskId: id,
      taskName: task.title,
      startTime: task.startTime || now,
      endTime: now,
      totalTime,
      completedAt: now,
    };
    setLogs(prev => [...prev, log]);
  };

  const undo = () => {
    // Simple undo functionality - in a real app, this would be more sophisticated
    setCanUndo(false);
  };

  const value: TaskContextType = {
    tasks,
    logs,
    isLoading,
    isHydrated,
    canUndo,
    undo,
    addTask,
    updateTask,
    moveTask,
    deleteTask,
    startTimer,
    pauseTimer,
    completeTask,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};