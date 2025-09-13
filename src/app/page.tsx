'use client';

import { useState, useEffect } from 'react';
import { useTasks } from '@/lib/TaskContext';
import { Plus, History, CheckSquare, Undo2, FileText, Loader2, Clock } from 'lucide-react';
import { KanbanBoard } from '@/components/KanbanBoard';
import { TaskHistory } from '@/components/TaskHistory';
import { AddTaskModal } from '@/components/AddTaskModal';
import { ReportGenerator } from '@/components/ReportGenerator';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Footer } from '@/components/Footer';

export default function Home() {
  const { canUndo, undo, logs, isHydrated } = useTasks();
  const [showAddTask, setShowAddTask] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showReportGenerator, setShowReportGenerator] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading state until hydration is complete
  if (!mounted || !isHydrated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-16 h-16 text-blue-500 animate-clock-spin mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Tasker</h1>
          <p className="text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }


  return (
    <div
      className="min-h-screen bg-background text-foreground"
    >
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo/Brand */}
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
                <CheckSquare className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-gray-900">Tasker</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Project Management</p>
              </div>
            </div>

            {/* Navigation & Actions */}
            <nav className="flex items-center gap-1">
              {/* History Toggle */}
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  showHistory
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent'
                }`}
                aria-label={showHistory ? 'Show kanban board' : 'Show task history'}
                aria-pressed={showHistory}
              >
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">History</span>
              </button>

              {/* PDF Report Button */}
              <button
                onClick={() => setShowReportGenerator(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent transition-all duration-200"
                aria-label="Generate task report"
                title="Generate PDF Report"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Report</span>
              </button>

              {/* Undo Button */}
              <button
                onClick={undo}
                disabled={!canUndo}
                className={`inline-flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${
                  canUndo
                    ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent'
                    : 'text-gray-400 cursor-not-allowed border border-transparent'
                }`}
                aria-label="Undo last action"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="w-5 h-5" />
              </button>


              {/* Add Task Button */}
              <button
                onClick={() => setShowAddTask(true)}
                className="group relative inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 overflow-hidden"
                aria-label="Add new task"
              >
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-lg"></div>

                {/* Gentle pulse ring */}
                <div className="absolute inset-0 rounded-lg border-2 border-blue-300 opacity-0 group-hover:opacity-60 group-hover:animate-ping"></div>

                {/* Icon */}
                <Plus className="w-4 h-4 relative z-10 group-hover:rotate-12 transition-transform duration-200" />

                {/* Text */}
                <span className="hidden sm:inline relative z-10">
                  Add Task
                </span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 min-h-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Page Title */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                {showHistory ? 'Task History' : 'Kanban Board'}
              </h2>
              <p className="text-gray-600 mt-1">
                {showHistory
                  ? 'View completed tasks and track your productivity over time'
                  : 'Organize and manage your tasks with our intuitive drag-and-drop interface'
                }
              </p>
            </div>

            {/* Content Area */}
            <div className="min-h-[600px]">
              <ErrorBoundary>
                {showHistory ? <TaskHistory /> : <KanbanBoard />}
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {showAddTask && (
        <AddTaskModal onClose={() => setShowAddTask(false)} />
      )}

      {showReportGenerator && (
        <ReportGenerator onClose={() => setShowReportGenerator(false)} />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
