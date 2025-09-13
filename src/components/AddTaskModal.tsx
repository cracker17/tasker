'use client';

import { useState, useEffect } from 'react';
import { useTasks } from '@/lib/TaskContext';
import { X, Plus, Sparkles, Calendar, Tag, AlertCircle, CheckCircle2 } from 'lucide-react';
import OpenAI from 'openai';
import { RichTextEditor } from './RichTextEditor';

interface AddTaskModalProps {
  onClose: () => void;
}

type Priority = 'low' | 'medium' | 'high';

export function AddTaskModal({ onClose }: AddTaskModalProps) {
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // AI-powered suggestions
  const generateAiSuggestions = async () => {
    if (!title.trim()) return;

    setIsGeneratingAi(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
      if (!apiKey) {
        setAiSuggestions(['AI suggestions require OpenAI API key configuration']);
        return;
      }

      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true,
      });

      const prompt = `Based on the task title "${title}", suggest 3 specific improvements or additions that would make this task more actionable and complete. Focus on:
1. Breaking it into smaller steps
2. Adding specific details or requirements
3. Setting realistic timeframes or priorities
4. Adding relevant context or dependencies

Provide 3 concise, practical suggestions.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        const suggestions = content.split('\n')
          .filter(line => line.trim().match(/^\d+\./))
          .map(line => line.replace(/^\d+\.\s*/, '').trim());
        setAiSuggestions(suggestions);
      }
    } catch (error) {
      console.error('AI suggestion error:', error);
      setAiSuggestions(['Unable to generate AI suggestions at this time']);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const applyAiSuggestion = (suggestion: string) => {
    // Simple parsing to update relevant fields
    const lower = suggestion.toLowerCase();

    if (lower.includes('priority') || lower.includes('urgent') || lower.includes('important')) {
      if (lower.includes('high') || lower.includes('urgent')) setPriority('high');
      else if (lower.includes('low')) setPriority('low');
    }

    if (lower.includes('due') || lower.includes('deadline') || lower.includes('by')) {
      // Could parse dates, but for now just show the suggestion in description
      setDescription(prev => prev ? `${prev}\n\nAI Suggestion: ${suggestion}` : `AI Suggestion: ${suggestion}`);
    } else {
      // Add to description
      setDescription(prev => prev ? `${prev}\n\nAI Suggestion: ${suggestion}` : `AI Suggestion: ${suggestion}`);
    }

    setShowAiSuggestions(false);
  };

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

    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const parsedDueDate = dueDate ? new Date(dueDate) : undefined;
      const parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);

      addTask(
        title.trim(),
        description.trim() || undefined,
        priority,
        parsedDueDate,
        parsedTags.length > 0 ? parsedTags : undefined
      );

      // Reset form
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      setTags('');
      setErrors({});

      onClose();
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to create task' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      // Ctrl/Cmd + Enter to submit
      e.preventDefault();
      const form = (e.target as HTMLElement).closest('form');
      if (form) {
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        form.dispatchEvent(submitEvent);
      }
    }
  };

  // Auto-generate AI suggestions when title changes
  useEffect(() => {
    if (title.trim().length > 5) {
      const timeoutId = setTimeout(() => {
        generateAiSuggestions();
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [title]);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white border border-gray-200 rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 id="modal-title" className="text-xl font-semibold flex items-center gap-2 text-gray-900">
            <Plus className="w-5 h-5 text-blue-500" />
            Add New Task
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-foreground">
              Task Title <span className="text-destructive">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="What needs to be done?"
              required
              autoFocus
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
            <label className="block text-sm font-medium text-foreground">
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
              <label className="block text-sm font-medium text-foreground">
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
              <label htmlFor="dueDate" className="block text-sm font-medium text-foreground">
                Due Date
              </label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.dueDate ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              />
              {errors.dueDate && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.dueDate}
                </p>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label htmlFor="tags" className="block text-sm font-medium text-foreground">
              Tags
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="work, urgent, personal (comma-separated)"
              disabled={isSubmitting}
            />
          </div>

          {/* AI Suggestions */}
          {aiSuggestions.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-900">AI Suggestions</span>
              </div>
              <div className="space-y-2">
                {aiSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => applyAiSuggestion(suggestion)}
                    className="w-full text-left p-3 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-sm text-gray-700"
                    disabled={isSubmitting}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

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
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || isSubmitting}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Create Task
                </>
              )}
            </button>
          </div>

          {/* Keyboard Shortcuts Hint */}
          <div className="text-xs text-gray-500 text-center">
            Press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Enter</kbd> to save • <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Esc</kbd> to cancel
          </div>
        </form>
      </div>
    </div>
  );
}