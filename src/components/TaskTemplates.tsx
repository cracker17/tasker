'use client';

import { useState } from 'react';
import { Plus, Briefcase, BookOpen, Home, Heart, ShoppingCart, Plane, Wrench } from 'lucide-react';

interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  tasks: {
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    estimatedTime?: number;
    tags: string[];
  }[];
}

interface TaskTemplatesProps {
  onCreateFromTemplate: (tasks: any[]) => void;
}

export function TaskTemplates({ onCreateFromTemplate }: TaskTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const templates: TaskTemplate[] = [
    {
      id: 'work-project',
      name: 'Work Project',
      description: 'Set up a new work project with essential tasks',
      icon: Briefcase,
      color: 'bg-blue-500',
      tasks: [
        {
          title: 'Define project scope and objectives',
          description: 'Outline the main goals and deliverables',
          priority: 'high',
          estimatedTime: 60,
          tags: ['planning', 'work']
        },
        {
          title: 'Create project timeline',
          description: 'Set milestones and deadlines',
          priority: 'high',
          estimatedTime: 45,
          tags: ['planning', 'work']
        },
        {
          title: 'Gather requirements',
          description: 'Collect all necessary information and resources',
          priority: 'medium',
          estimatedTime: 90,
          tags: ['research', 'work']
        },
        {
          title: 'Design solution',
          description: 'Create the initial design or plan',
          priority: 'medium',
          estimatedTime: 120,
          tags: ['design', 'work']
        },
        {
          title: 'Implement and test',
          description: 'Build and verify the solution',
          priority: 'medium',
          estimatedTime: 180,
          tags: ['development', 'work']
        }
      ]
    },
    {
      id: 'learning-path',
      name: 'Learning Path',
      description: 'Create a structured learning plan',
      icon: BookOpen,
      color: 'bg-green-500',
      tasks: [
        {
          title: 'Research learning resources',
          description: 'Find books, courses, and tutorials',
          priority: 'medium',
          estimatedTime: 30,
          tags: ['research', 'learning']
        },
        {
          title: 'Set learning goals',
          description: 'Define what you want to achieve',
          priority: 'high',
          estimatedTime: 15,
          tags: ['planning', 'learning']
        },
        {
          title: 'Create study schedule',
          description: 'Plan daily/weekly study sessions',
          priority: 'medium',
          estimatedTime: 20,
          tags: ['planning', 'learning']
        },
        {
          title: 'Complete first module',
          description: 'Start with the basics',
          priority: 'medium',
          estimatedTime: 120,
          tags: ['practice', 'learning']
        },
        {
          title: 'Review and practice',
          description: 'Reinforce what you learned',
          priority: 'low',
          estimatedTime: 60,
          tags: ['practice', 'learning']
        }
      ]
    },
    {
      id: 'home-maintenance',
      name: 'Home Maintenance',
      description: 'Keep your home in top condition',
      icon: Home,
      color: 'bg-purple-500',
      tasks: [
        {
          title: 'Check smoke detectors',
          description: 'Test and replace batteries if needed',
          priority: 'high',
          estimatedTime: 15,
          tags: ['safety', 'home']
        },
        {
          title: 'Clean gutters',
          description: 'Remove leaves and debris',
          priority: 'medium',
          estimatedTime: 45,
          tags: ['maintenance', 'home']
        },
        {
          title: 'Test water pressure',
          description: 'Check faucets and shower heads',
          priority: 'low',
          estimatedTime: 10,
          tags: ['maintenance', 'home']
        },
        {
          title: 'Inspect for leaks',
          description: 'Check pipes and fixtures',
          priority: 'medium',
          estimatedTime: 30,
          tags: ['maintenance', 'home']
        }
      ]
    },
    {
      id: 'health-routine',
      name: 'Health Routine',
      description: 'Maintain a healthy lifestyle',
      icon: Heart,
      color: 'bg-red-500',
      tasks: [
        {
          title: 'Morning exercise',
          description: '30-minute workout or walk',
          priority: 'high',
          estimatedTime: 30,
          tags: ['fitness', 'health']
        },
        {
          title: 'Prepare healthy meals',
          description: 'Plan and prep nutritious food',
          priority: 'medium',
          estimatedTime: 45,
          tags: ['nutrition', 'health']
        },
        {
          title: 'Meditation session',
          description: '10-minute mindfulness practice',
          priority: 'low',
          estimatedTime: 10,
          tags: ['mental-health', 'health']
        },
        {
          title: 'Doctor checkup',
          description: 'Schedule annual physical',
          priority: 'medium',
          estimatedTime: 60,
          tags: ['medical', 'health']
        }
      ]
    },
    {
      id: 'shopping-list',
      name: 'Shopping List',
      description: 'Organize your grocery shopping',
      icon: ShoppingCart,
      color: 'bg-orange-500',
      tasks: [
        {
          title: 'Plan weekly meals',
          description: 'Decide what to cook this week',
          priority: 'medium',
          estimatedTime: 20,
          tags: ['planning', 'shopping']
        },
        {
          title: 'Make shopping list',
          description: 'List all needed groceries',
          priority: 'low',
          estimatedTime: 15,
          tags: ['organization', 'shopping']
        },
        {
          title: 'Check pantry inventory',
          description: 'See what you already have',
          priority: 'low',
          estimatedTime: 10,
          tags: ['inventory', 'shopping']
        },
        {
          title: 'Go shopping',
          description: 'Purchase groceries from list',
          priority: 'medium',
          estimatedTime: 60,
          tags: ['errands', 'shopping']
        }
      ]
    },
    {
      id: 'travel-planning',
      name: 'Travel Planning',
      description: 'Plan your next trip efficiently',
      icon: Plane,
      color: 'bg-indigo-500',
      tasks: [
        {
          title: 'Choose destination',
          description: 'Research and select travel location',
          priority: 'high',
          estimatedTime: 30,
          tags: ['research', 'travel']
        },
        {
          title: 'Book flights',
          description: 'Find and reserve airline tickets',
          priority: 'high',
          estimatedTime: 20,
          tags: ['booking', 'travel']
        },
        {
          title: 'Reserve accommodation',
          description: 'Book hotel or rental property',
          priority: 'high',
          estimatedTime: 25,
          tags: ['booking', 'travel']
        },
        {
          title: 'Create itinerary',
          description: 'Plan daily activities and sights',
          priority: 'medium',
          estimatedTime: 45,
          tags: ['planning', 'travel']
        },
        {
          title: 'Pack luggage',
          description: 'Prepare clothes and essentials',
          priority: 'low',
          estimatedTime: 30,
          tags: ['preparation', 'travel']
        }
      ]
    },
    {
      id: 'home-repair',
      name: 'Home Repair',
      description: 'Fix common household issues',
      icon: Wrench,
      color: 'bg-gray-500',
      tasks: [
        {
          title: 'Assess the problem',
          description: 'Identify what needs to be fixed',
          priority: 'high',
          estimatedTime: 15,
          tags: ['assessment', 'repair']
        },
        {
          title: 'Gather tools and materials',
          description: 'Get everything needed for the repair',
          priority: 'medium',
          estimatedTime: 20,
          tags: ['preparation', 'repair']
        },
        {
          title: 'Research solution',
          description: 'Find tutorials or guides online',
          priority: 'medium',
          estimatedTime: 30,
          tags: ['research', 'repair']
        },
        {
          title: 'Perform the repair',
          description: 'Execute the fix carefully',
          priority: 'high',
          estimatedTime: 90,
          tags: ['execution', 'repair']
        },
        {
          title: 'Test and verify',
          description: 'Ensure the repair works properly',
          priority: 'medium',
          estimatedTime: 10,
          tags: ['testing', 'repair']
        }
      ]
    }
  ];

  const handleCreateFromTemplate = (template: TaskTemplate) => {
    const tasksWithIds = template.tasks.map(task => ({
      ...task,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      status: 'todo' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate: null,
      subtasks: []
    }));

    onCreateFromTemplate(tasksWithIds);
    setSelectedTemplate(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
          <Plus className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Task Templates
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Quick start with pre-built task collections
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="group relative bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 cursor-pointer border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500"
            onClick={() => setSelectedTemplate(template.id)}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${template.color} shadow-sm`}>
                <template.icon className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                  {template.name}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  {template.tasks.length} tasks
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {template.description}
            </p>
          </div>
        ))}
      </div>

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {(() => {
              const template = templates.find(t => t.id === selectedTemplate);
              if (!template) return null;

              return (
                <>
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${template.color} shadow-sm`}>
                          <template.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {template.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {template.description}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedTemplate(null)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Plus className="h-5 w-5 rotate-45" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 max-h-96 overflow-y-auto">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                      Tasks in this template ({template.tasks.length}):
                    </h4>
                    <div className="space-y-3">
                      {template.tasks.map((task, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900 dark:text-white text-sm">
                              {task.title}
                            </h5>
                            {task.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                {task.description}
                              </p>
                            )}
                            <div className="flex items-center gap-3 mt-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                task.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300' :
                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300' :
                                'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                              }`}>
                                {task.priority} priority
                              </span>
                              {task.estimatedTime && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  ~{task.estimatedTime}min
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                    <button
                      onClick={() => handleCreateFromTemplate(template)}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl font-semibold"
                    >
                      Create Tasks from Template
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}