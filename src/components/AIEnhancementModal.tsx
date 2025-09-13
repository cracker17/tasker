'use client';

import { useState } from 'react';
import { Task } from '@/types/task';
import { X, Loader2 } from 'lucide-react';
import OpenAI from 'openai';

interface AIEnhancementModalProps {
  task: Task;
  onClose: () => void;
  onUpdate: (updates: Partial<Task>) => void;
}

export function AIEnhancementModal({ task, onClose, onUpdate }: AIEnhancementModalProps) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generateSuggestions = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
      console.log('API Key check:', apiKey ? 'Present' : 'Missing', apiKey?.substring(0, 10) + '...');

      if (!apiKey) {
        throw new Error('OpenAI API key is not configured. Please add NEXT_PUBLIC_OPENAI_API_KEY to your .env.local file.');
      }

      if (!apiKey.startsWith('sk-')) {
        throw new Error('Invalid OpenAI API key format. The key should start with "sk-".');
      }

      // For development/testing when OpenAI API is not available
      if (process.env.NODE_ENV === 'development' && !apiKey.startsWith('sk-proj-') && !apiKey.startsWith('sk-svcacct-')) {
        console.log('Using mock AI suggestions for development');
        setTimeout(() => {
          setSuggestions([
            '1. Break this task into smaller subtasks for better tracking',
            '2. Set priority to high for timely completion',
            '3. Estimate time: approximately 2 hours',
            '4. Add description for better context'
          ]);
        }, 1000); // Simulate API delay
        return;
      }

      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true,
      });

      const prompt = `Analyze this task and provide 3-5 specific, actionable suggestions to improve it. Consider breaking it into subtasks, adding priorities, estimating time, or rephrasing for clarity.

Task: ${task.title}
${task.description ? `Description: ${task.description}` : ''}

Provide suggestions in a numbered list, each being concise and practical.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        const lines = content.split('\n').filter(line => line.trim().match(/^\d+\./));
        setSuggestions(lines);
      } else {
        throw new Error('No response received from OpenAI API.');
      }
    } catch (err: unknown) {
      console.error('AI enhancement error:', err);

      let errorMessage = 'Failed to generate suggestions. ';

      if (err instanceof Error) {
        if (err.message.includes('API key')) {
          errorMessage += 'Please check your OpenAI API key configuration.';
        } else if (err.message.includes('quota') || err.message.includes('billing')) {
          errorMessage += 'Your OpenAI account may have insufficient credits or billing issues.';
        } else if (err.message.includes('network') || err.message.includes('fetch')) {
          errorMessage += 'Network error. Please check your internet connection.';
        } else if (err.message.includes('rate limit')) {
          errorMessage += 'Rate limit exceeded. Please try again later.';
        } else {
          errorMessage += err.message;
        }
      } else {
        errorMessage += 'An unexpected error occurred. Please try again.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const applySuggestion = (suggestion: string) => {
    // Simple parsing - in a real app, this could be more sophisticated
    const lower = suggestion.toLowerCase();

    if (lower.includes('priority')) {
      if (lower.includes('high')) onUpdate({ priority: 'high' });
      else if (lower.includes('medium')) onUpdate({ priority: 'medium' });
      else if (lower.includes('low')) onUpdate({ priority: 'low' });
    }

    if (lower.includes('estimate') || lower.includes('time')) {
      const timeMatch = lower.match(/(\d+)\s*(minute|hour|min|hr)s?/i);
      if (timeMatch) {
        const num = parseInt(timeMatch[1]);
        const unit = timeMatch[2].toLowerCase();
        if (unit.includes('hour') || unit.includes('hr')) {
          onUpdate({ estimatedTime: num * 60 });
        } else {
          onUpdate({ estimatedTime: num });
        }
      }
    }

    if (lower.includes('subtask') || lower.includes('break')) {
      // For simplicity, we'll just show the suggestion
      // In a real app, parse and create subtasks
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-gray-200 rounded-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">AI Task Enhancement</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-accent"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mb-4">
          <h3 className="font-medium mb-2">Current Task</h3>
          <div className="bg-muted p-3 rounded-md">
            <p className="font-medium">{task.title}</p>
            {task.description && <p className="text-sm text-muted-foreground mt-1">{task.description}</p>}
          </div>
        </div>

        {!suggestions.length && !loading && (
          <button
            onClick={generateSuggestions}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 mb-4"
          >
            Generate AI Suggestions
          </button>
        )}

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="ml-2">Generating suggestions...</span>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {suggestions.length > 0 && (
          <div>
            <h3 className="font-medium mb-3">AI Suggestions</h3>
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-md">
                  <div className="flex-1">
                    <p className="text-sm">{suggestion}</p>
                  </div>
                  <button
                    onClick={() => applySuggestion(suggestion)}
                    className="px-3 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600"
                  >
                    Apply
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}