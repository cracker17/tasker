'use client';

import { useState, useRef } from 'react';
import { Download, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface TaskExportImportProps {
  tasks: any[];
  onImport: (tasks: any[]) => void;
}

export function TaskExportImport({ tasks, onImport }: TaskExportImportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportToJSON = () => {
    setIsExporting(true);
    try {
      const dataStr = JSON.stringify(tasks, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

      const exportFileDefaultName = `tasker-tasks-${new Date().toISOString().split('T')[0]}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      setTimeout(() => setIsExporting(false), 1000);
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
    }
  };

  const exportToCSV = () => {
    setIsExporting(true);
    try {
      if (tasks.length === 0) {
        alert('No tasks to export');
        setIsExporting(false);
        return;
      }

      // CSV headers
      const headers = ['Title', 'Description', 'Status', 'Priority', 'Due Date', 'Tags', 'Created At', 'Updated At'];

      // Convert tasks to CSV rows
      const csvRows = tasks.map(task => [
        task.title || '',
        task.description || '',
        task.status || '',
        task.priority || '',
        task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '',
        task.tags ? task.tags.join('; ') : '',
        task.createdAt ? new Date(task.createdAt).toLocaleString() : '',
        task.updatedAt ? new Date(task.updatedAt).toLocaleString() : ''
      ]);

      // Combine headers and rows
      const csvContent = [headers, ...csvRows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');

      // Create and download file
      const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
      const exportFileDefaultName = `tasker-tasks-${new Date().toISOString().split('T')[0]}.csv`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      setTimeout(() => setIsExporting(false), 1000);
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportStatus('idle');
    setImportMessage('');

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        let importedTasks: any[] = [];

        if (file.name.endsWith('.json')) {
          importedTasks = JSON.parse(content);
        } else if (file.name.endsWith('.csv')) {
          importedTasks = parseCSV(content);
        } else {
          throw new Error('Unsupported file format. Please use .json or .csv files.');
        }

        // Validate and transform imported tasks
        const validTasks = importedTasks
          .filter(task => task.title) // Must have a title
          .map(task => ({
            ...task,
            id: task.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
            status: task.status || 'todo',
            priority: task.priority || 'medium',
            tags: Array.isArray(task.tags) ? task.tags : [],
            createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
            updatedAt: task.updatedAt ? new Date(task.updatedAt) : new Date(),
            dueDate: task.dueDate ? new Date(task.dueDate) : null,
            subtasks: Array.isArray(task.subtasks) ? task.subtasks : []
          }));

        onImport(validTasks);
        setImportStatus('success');
        setImportMessage(`Successfully imported ${validTasks.length} tasks!`);

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Import failed:', error);
        setImportStatus('error');
        setImportMessage(error instanceof Error ? error.message : 'Failed to import tasks');
      } finally {
        setIsImporting(false);
      }
    };

    reader.readAsText(file);
  };

  const parseCSV = (csvText: string): any[] => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());

    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.replace(/"/g, '').trim());
      const task: any = {};

      headers.forEach((header, index) => {
        const value = values[index];
        switch (header.toLowerCase()) {
          case 'title':
            task.title = value;
            break;
          case 'description':
            task.description = value;
            break;
          case 'status':
            task.status = value;
            break;
          case 'priority':
            task.priority = value;
            break;
          case 'due date':
            task.dueDate = value ? new Date(value) : null;
            break;
          case 'tags':
            task.tags = value ? value.split(';').map((t: string) => t.trim()) : [];
            break;
          case 'created at':
            task.createdAt = value ? new Date(value) : new Date();
            break;
          case 'updated at':
            task.updatedAt = value ? new Date(value) : new Date();
            break;
        }
      });

      return task;
    }).filter(task => task.title);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-blue-600 shadow-lg">
          <FileText className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Export & Import Tasks
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Backup your tasks or import from other sources
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Section */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-white">Export Tasks</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Download your tasks as JSON or CSV files for backup or sharing.
          </p>

          <div className="flex gap-3">
            <button
              onClick={exportToJSON}
              disabled={isExporting || tasks.length === 0}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Download className="h-4 w-4" />
              {isExporting ? 'Exporting...' : 'Export JSON'}
            </button>

            <button
              onClick={exportToCSV}
              disabled={isExporting || tasks.length === 0}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Download className="h-4 w-4" />
              {isExporting ? 'Exporting...' : 'Export CSV'}
            </button>
          </div>

          {tasks.length === 0 && (
            <p className="text-sm text-amber-600 dark:text-amber-400">
              No tasks available to export.
            </p>
          )}
        </div>

        {/* Import Section */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-white">Import Tasks</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Upload JSON or CSV files to import tasks into your workspace.
          </p>

          <div className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.csv"
              onChange={handleFileImport}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Upload className="h-4 w-4" />
              {isImporting ? 'Importing...' : 'Choose File'}
            </button>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Supports .json and .csv files
            </p>
          </div>

          {/* Import Status */}
          {importStatus !== 'idle' && (
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              importStatus === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }`}>
              {importStatus === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              )}
              <p className={`text-sm ${
                importStatus === 'success'
                  ? 'text-green-700 dark:text-green-300'
                  : 'text-red-700 dark:text-red-300'
              }`}>
                {importMessage}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Usage Tips */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">💡 Tips</h5>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• JSON export preserves all task data including dates and metadata</li>
          <li>• CSV export is perfect for spreadsheet applications</li>
          <li>• Imported tasks will be added to your existing tasks</li>
          <li>• Make sure CSV files have headers matching the expected format</li>
        </ul>
      </div>
    </div>
  );
}