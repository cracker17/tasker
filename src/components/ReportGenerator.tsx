'use client';

import { useState } from 'react';
import { useTasks } from '@/lib/TaskContext';
import { TaskLog } from '@/types/task';
import { generateDailyTaskReport, TaskReportData } from '@/utils/pdfGenerator';
import { Calendar, Download, Filter, X, Clock } from 'lucide-react';

interface ReportGeneratorProps {
  onClose: () => void;
}

type DateRange = 'today' | 'yesterday' | 'weekly' | 'monthly' | 'custom';

export function ReportGenerator({ onClose }: ReportGeneratorProps) {
  const { logs } = useTasks();
  const [selectedRange, setSelectedRange] = useState<DateRange>('weekly');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);


  const getDateRange = (range: DateRange) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (range) {
      case 'today':
        return {
          start: today,
          end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1),
          label: 'Today'
        };
      case 'yesterday':
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        return {
          start: yesterday,
          end: new Date(yesterday.getTime() + 24 * 60 * 60 * 1000 - 1),
          label: 'Yesterday'
        };
      case 'weekly':
        const weekStart = new Date(today.getTime() - today.getDay() * 24 * 60 * 60 * 1000);
        return {
          start: weekStart,
          end: new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000 - 1),
          label: 'This Week'
        };
      case 'monthly':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return {
          start: monthStart,
          end: new Date(monthEnd.getTime() + 24 * 60 * 60 * 1000 - 1),
          label: 'This Month'
        };
      case 'custom':
        if (customStartDate && customEndDate) {
          return {
            start: new Date(customStartDate),
            end: new Date(customEndDate + 'T23:59:59'),
            label: `${new Date(customStartDate).toLocaleDateString()} - ${new Date(customEndDate).toLocaleDateString()}`
          };
        }
        return null;
      default:
        return null;
    }
  };

  const filterLogsByDateRange = (logs: TaskLog[], start: Date, end: Date): TaskLog[] => {
    return logs.filter(log => log.completedAt >= start && log.completedAt <= end);
  };

  const generateReport = async () => {
    const dateRange = getDateRange(selectedRange);
    if (!dateRange) {
      alert('Please select a valid date range');
      return;
    }

    setIsGenerating(true);

    try {
      const filteredLogs = filterLogsByDateRange(logs, dateRange.start, dateRange.end);

      if (filteredLogs.length === 0) {
        alert(`No completed tasks found for ${dateRange.label}. Please complete some tasks first.`);
        return;
      }

      // Convert TaskLog to TaskReportData format
      const reportData = filteredLogs.map(log => ({
        title: log.taskName,
        description: '', // TaskLog doesn't have description
        priority: undefined, // TaskLog doesn't have priority
        completedAt: log.completedAt,
        totalTime: log.totalTime,
        tags: undefined, // TaskLog doesn't have tags
      }));

      generateDailyTaskReport(reportData, dateRange.label);
      onClose();
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const dateRange = getDateRange(selectedRange);
  const previewLogs = dateRange ? filterLogsByDateRange(logs, dateRange.start, dateRange.end) : [];
  const totalTime = previewLogs.reduce((sum, log) => sum + log.totalTime, 0);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
    >
      <div className="bg-white border border-gray-200 rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 id="report-modal-title" className="text-xl font-semibold flex items-center gap-2 text-gray-900">
            <Download className="w-5 h-5 text-blue-500" />
            Generate Task Report
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close report generator"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          {/* Date Range Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <label className="text-sm font-medium text-gray-900">Select Date Range</label>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { value: 'today', label: 'Today' },
                { value: 'yesterday', label: 'Yesterday' },
                { value: 'weekly', label: 'This Week' },
                { value: 'monthly', label: 'This Month' },
                { value: 'custom', label: 'Custom Range' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedRange(option.value as DateRange)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                    selectedRange === option.value
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white hover:bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                  disabled={isGenerating}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Custom Date Inputs */}
            {selectedRange === 'custom' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2 text-gray-900">
                    <Calendar className="w-4 h-4" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    disabled={isGenerating}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2 text-gray-900">
                    <Calendar className="w-4 h-4" />
                    End Date
                  </label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    disabled={isGenerating}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Preview */}
          {dateRange && dateRange.label && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{dateRange.label}</h3>
                  <p className="text-sm text-gray-600">
                    {previewLogs.length} completed tasks
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    {Math.round(totalTime / 1000 / 60 / 60 * 100) / 100}h
                  </div>
                  <div className="text-xs text-gray-500">Total time</div>
                </div>
              </div>

              {/* Task Preview */}
              {previewLogs.length > 0 && (
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {previewLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate text-gray-900">{log.taskName}</div>
                        <div className="text-xs text-gray-500">
                          {log.completedAt.toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-sm font-mono text-gray-700">
                        {Math.round(log.totalTime / 1000 / 60 * 100) / 100}m
                      </div>
                    </div>
                  ))}
                  {previewLogs.length > 5 && (
                    <div className="text-center text-sm text-gray-500 py-2">
                      ... and {previewLogs.length - 5} more tasks
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={isGenerating}
            >
              Cancel
            </button>
            <button
              onClick={generateReport}
              disabled={isGenerating || !dateRange || previewLogs.length === 0}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              {isGenerating ? (
                <>
                  <Clock className="w-4 h-4 animate-clock-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Generate PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}