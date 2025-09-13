'use client';

import { useTasks } from '@/lib/TaskContext';
import { Clock } from 'lucide-react';

export function TaskHistory() {
  const { logs } = useTasks();

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours.toString().padStart(2, '0')}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (logs.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No completed tasks yet</h3>
        <p className="text-muted-foreground">Complete some tasks to see your history here.</p>
      </div>
    );
  }

  const totalTime = logs.reduce((sum, log) => sum + log.totalTime, 0);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Task History</h2>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Total completed tasks: {logs.length}</span>
          <span>Total time spent: {formatTime(totalTime)}</span>
        </div>
      </div>

      <div className="space-y-4">
        {logs
          .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())
          .map((log) => (
            <div key={log.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium mb-1">{log.taskName}</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>Started: {formatDate(log.startTime)}</div>
                    <div>Completed: {formatDate(log.endTime)}</div>
                    <div>Duration: {formatTime(log.totalTime)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-mono font-medium">
                    {formatTime(log.totalTime)}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}