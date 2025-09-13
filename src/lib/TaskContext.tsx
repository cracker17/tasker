'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, TaskLog, TaskStatus } from '@/types/task';

interface TaskContextType {
  tasks: Task[];
  logs: TaskLog[];
  canUndo: boolean;
  isHydrated: boolean;
  addTask: (title: string, description?: string, priority?: 'low' | 'medium' | 'high', dueDate?: Date, tags?: string[]) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  moveTask: (id: string, newStatus: TaskStatus) => void;
  deleteTask: (id: string) => void;
  startTimer: (id: string) => void;
  pauseTimer: (id: string) => void;
  completeTask: (id: string) => void;
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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [logs, setLogs] = useState<TaskLog[]>([]);
  const [undoStack, setUndoStack] = useState<Task[][]>([]);
  const [redoStack, setRedoStack] = useState<Task[][]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return; // Prevent SSR hydration issues

    try {
      const savedTasks = localStorage.getItem('tasks');
      const savedLogs = localStorage.getItem('taskLogs');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks).map((task: RawTask) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          startTime: task.startTime ? new Date(task.startTime) : undefined,
          endTime: task.endTime ? new Date(task.endTime) : undefined,
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        })));
      }
      if (savedLogs) {
        setLogs(JSON.parse(savedLogs).map((log: RawTaskLog) => ({
          ...log,
          startTime: new Date(log.startTime),
          endTime: new Date(log.endTime),
          completedAt: new Date(log.completedAt),
        })));
      }
      setIsHydrated(true);
    } catch (error) {
      console.warn('Failed to load data from localStorage:', error);
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage whenever tasks or logs change (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.warn('Failed to save tasks to localStorage:', error);
    }
  }, [tasks]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('taskLogs', JSON.stringify(logs));
    } catch (error) {
      console.warn('Failed to save logs to localStorage:', error);
    }
  }, [logs]);

  const addTask = (title: string, description?: string, priority?: 'low' | 'medium' | 'high', dueDate?: Date, tags?: string[]) => {
    // Validation
    if (!title.trim()) {
      throw new Error('Task title is required');
    }

    if (dueDate && dueDate < new Date()) {
      throw new Error('Due date cannot be in the past');
    }

    saveStateForUndo();

    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description?.trim(),
      status: 'todo',
      createdAt: new Date(),
      updatedAt: new Date(),
      priority,
      dueDate,
      tags: tags?.filter(tag => tag.trim()),
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    saveStateForUndo();
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
    ));
  };

  const moveTask = (id: string, newStatus: TaskStatus) => {
    updateTask(id, { status: newStatus });
  };

  const deleteTask = (id: string) => {
    saveStateForUndo();
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const startTimer = (id: string) => {
    const now = new Date();
    updateTask(id, { status: 'doing', startTime: now });
  };

  const pauseTimer = (id: string) => {
    updateTask(id, { status: 'on_hold' });
  };

  const completeTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const now = new Date();
    const totalTime = task.startTime ? now.getTime() - task.startTime.getTime() : 0;

    updateTask(id, {
      status: 'done',
      endTime: now,
      totalTime: (task.totalTime || 0) + totalTime,
    });

    // Add to logs
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

  const saveStateForUndo = () => {
    setUndoStack(prev => [...prev.slice(-9), [...tasks]]); // Keep last 10 states
    setRedoStack([]); // Clear redo stack when new action is performed
  };

  const undo = () => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1];
      setRedoStack(prev => [...prev, [...tasks]]);
      setTasks(previousState);
      setUndoStack(prev => prev.slice(0, -1));
    }
  };

  const value: TaskContextType = {
    tasks,
    logs,
    canUndo: undoStack.length > 0,
    isHydrated,
    addTask,
    updateTask,
    moveTask,
    deleteTask,
    startTimer,
    pauseTimer,
    completeTask,
    undo,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};