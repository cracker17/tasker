'use client';

import { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import { useTasks } from '@/lib/TaskContext';
import { X, Edit, AlertCircle, CheckCircle2, Undo2 } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';

interface EditTaskModalProps {
  task: Task;
  onClose: () => void;
}

type Priority = 'low' | 'medium' | 'high';

export function EditTaskModal({ task, onClose }: EditTaskModalProps) {
  const { updateTask } = useTasks();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority] = useState<Priority>(task.priority || 'medium');
  const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.toISOString().split('T')[0] : '');
  const [tags, setTags] = useState(task.tags?.join(', ') || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Track changes
  useEffect(() => {
    const changes =
      title !== task.title ||
      description !== (task.description || '') ||
      priority !== (task.priority || 'medium') ||
      dueDate !== (task.dueDate ? task.dueDate.toISOString().split('T')[0] : '') ||
      tags !== (task.tags?.join(', ') || '');

    setHasChanges(changes);
  }, [title, description, priority, dueDate, tags, task]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Task title is required';
    }

    if (dueDate) {
      const selectedDate = new Date(dueDate);
      if (selectedDate < new Date()) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || isSubmitting || !hasChanges) return;

    setIsSubmitting(true);
    try {
      const updates: Partial<Task> = {};

      if (title !== task.title) updates.title = title.trim();
      if (description !== (task.description || '')) updates.description = description.trim() || undefined;
      if (priority !== (task.priority || 'medium')) updates.priority = priority;
      if (dueDate !== (task.dueDate ? task.dueDate.toISOString().split('T')[0] : '')) {
        updates.dueDate = dueDate ? new Date(dueDate) : undefined;
      }

      const parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      const currentTags = task.tags || [];
      if (JSON.stringify(parsedTags.sort()) !== JSON.stringify(currentTags.sort())) {
        updates.tags = parsedTags.length > 0 ? parsedTags : undefined;
      }

      if (Object.keys(updates).length > 0) {
        updateTask(task.id, updates);
      }

      onClose();
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to update task' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setTitle(task.title);
    setDescription(task.description || '');
    setPriority(task.priority || 'medium');
    setDueDate(task.dueDate ? task.dueDate.toISOString().split('T')[0] : '');
    setTags(task.tags?.join(', ') || '');
    setErrors({});
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-modal-title"
    >
      <div className="bg-white border border-gray-200 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 id="edit-modal-title" className="text-xl font-semibold flex items-center gap-2">
            <Edit className="w-5 h-5 text-blue-500" />
            Edit Task
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="edit-title" className="block text-sm font-medium text-gray-900">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              Description
            </label>
            <RichTextEditor
              value={description}
              onChange={setDescription}
              placeholder="Add more details about this task (optional)"
              disabled={isSubmitting}
            />
          </div>

          {/* Priority and Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                disabled={isSubmitting}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-dueDate" className="block text-sm font-medium text-gray-900">
                Due Date
              </label>
              <input
                id="edit-dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.dueDate ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              />
              {errors.dueDate && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.dueDate}
                </p>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label htmlFor="edit-tags" className="block text-sm font-medium text-gray-900">
              Tags
            </label>
            <input
              id="edit-tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="work, urgent, personal (comma-separated)"
              disabled={isSubmitting}
            />
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.submit}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleReset}
              disabled={!hasChanges || isSubmitting}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
            >
              <Undo2 className="w-4 h-4" />
              Reset
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!hasChanges || isSubmitting}
              className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>

          {/* Keyboard Shortcuts Hint */}
          <div className="text-xs text-gray-500 text-center">
            Press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Esc</kbd> to cancel
          </div>
        </form>
      </div>
    </div>
  );
}