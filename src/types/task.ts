export type TaskStatus = 'todo' | 'doing' | 'on_hold' | 'done';

export interface Task {
  _id?: string; // MongoDB ObjectId
  id: string; // Client-side ID for backward compatibility
  title: string;
  description?: string;
  status: TaskStatus;
  startTime?: Date;
  endTime?: Date;
  totalTime?: number; // in milliseconds
  createdAt: Date;
  updatedAt: Date;
  priority?: 'low' | 'medium' | 'high';
  estimatedTime?: number; // in minutes
  dueDate?: Date;
  tags?: string[];
  subtasks?: Subtask[];
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskLog {
  id: string;
  taskId: string;
  taskName: string;
  startTime: Date;
  endTime: Date;
  totalTime: number;
  completedAt: Date;
}

export interface KanbanColumn {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}