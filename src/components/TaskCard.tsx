'use client';

import { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import { useTasks } from '@/lib/TaskContext';
import { Play, Pause, Square, Wand2, Clock, Trash2, CheckCircle2, Calendar, Tag, Edit3 } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from '@/hooks/useWindowSize';
import { AIEnhancementModal } from './AIEnhancementModal';
import { EditTaskModal } from './EditTaskModal';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { updateTask, startTimer, pauseTimer, completeTask, deleteTask } = useTasks();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (typeof window === 'undefined') return; // Prevent SSR issues

    let interval: NodeJS.Timeout;
    if (task.status === 'doing' && task.startTime) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - task.startTime!.getTime());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [task.status, task.startTime]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours.toString().padStart(2, '0')}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const handleComplete = () => {
    completeTask(task.id);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const totalTime = (task.totalTime || 0) + elapsedTime;

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <>
      <div
        className="group bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
        role="article"
        aria-labelledby={`task-${task.id}-title`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3
            id={`task-${task.id}-title`}
            className="font-medium text-sm leading-tight flex-1 pr-2 text-gray-900"
          >
            {task.title}
          </h3>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowEditModal(true);
              }}
              className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
              aria-label={`Edit task: ${task.title}`}
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAIModal(true);
              }}
              className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
              aria-label={`Enhance task: ${task.title}`}
            >
              <Wand2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteTask(task.id);
              }}
              className="p-1.5 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors text-gray-500"
              aria-label={`Delete task: ${task.title}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <div
            className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed prose prose-xs max-w-none"
            dangerouslySetInnerHTML={{ __html: task.description }}
          />
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-mono">{formatTime(totalTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            {task.priority && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            )}
            {task.dueDate && (
              <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                <Calendar className="w-3 h-3" />
                {typeof window !== 'undefined' ? task.dueDate.toLocaleDateString() : task.dueDate.toDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {task.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full text-xs"
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          {task.status === 'todo' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                startTimer(task.id);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded-md text-xs font-medium hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label={`Start timer for: ${task.title}`}
            >
              <Play className="w-3.5 h-3.5" />
              Start
            </button>
          )}

          {task.status === 'doing' && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  pauseTimer(task.id);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 text-white rounded-md text-xs font-medium hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                aria-label={`Pause timer for: ${task.title}`}
              >
                <Pause className="w-3.5 h-3.5" />
                Pause
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleComplete();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white rounded-md text-xs font-medium hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                aria-label={`Complete task: ${task.title}`}
              >
                <Square className="w-3.5 h-3.5" />
                Complete
              </button>
            </>
          )}

          {task.status === 'on_hold' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                startTimer(task.id);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded-md text-xs font-medium hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label={`Resume timer for: ${task.title}`}
            >
              <Play className="w-3.5 h-3.5" />
              Resume
            </button>
          )}

          {task.status === 'done' && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-md text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Completed
            </div>
          )}
        </div>

        {/* Subtasks */}
        {task.subtasks && task.subtasks.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="text-xs text-muted-foreground mb-2 font-medium">
              Subtasks ({task.subtasks.filter(st => st.completed).length}/{task.subtasks.length})
            </div>
            <div className="space-y-2">
              {task.subtasks.map((subtask, index) => (
                <label key={index} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={(e) => {
                      const updatedSubtasks = [...task.subtasks!];
                      updatedSubtasks[index].completed = e.target.checked;
                      updateTask(task.id, { subtasks: updatedSubtasks });
                    }}
                    className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className={`text-xs leading-relaxed transition-colors ${
                    subtask.completed
                      ? 'line-through text-muted-foreground'
                      : 'group-hover:text-foreground'
                  }`}>
                    {subtask.title}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tada/Party Effect Animation */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={300}
            gravity={0.2}
            tweenDuration={4000}
            colors={['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8']}
          />
          {/* Additional celebration elements */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center animate-bounce">
              <div className="text-6xl animate-spin">🎉</div>
              <div className="text-4xl mt-4 animate-pulse text-yellow-400 font-bold">
                Task Completed!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Enhancement Modal */}
      {showAIModal && (
        <AIEnhancementModal
          task={task}
          onClose={() => setShowAIModal(false)}
          onUpdate={(updates: Partial<Task>) => updateTask(task.id, updates)}
        />
      )}

      {/* Edit Task Modal */}
      {showEditModal && (
        <EditTaskModal
          task={task}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
}