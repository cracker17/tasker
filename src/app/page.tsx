'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  CheckSquare,
  Plus,
  BarChart3,
  Clock,
  Users,
  Zap,
  Star,
  ArrowRight,
  Bell,
  Filter,
  FileText,
  Download
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { NotificationCenter } from '@/components/NotificationCenter';
import { DashboardStats } from '@/components/DashboardStats';
import { TaskFilters } from '@/components/TaskFilters';
import { TaskTemplates } from '@/components/TaskTemplates';
import { TaskExportImport } from '@/components/TaskExportImport';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { NotificationProvider, useNotifications } from '@/lib/NotificationContext';

function HomeContent() {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({
    users: 0,
    tasks: 0,
    hours: 0,
    satisfaction: 0
  });

  const [tasks] = useLocalStorage('tasker-tasks', []);
  const { addNotification } = useNotifications();

  const phrases = [
    "Master Your Tasks",
    "Track Your Time",
    "Boost Efficiency",
    "Collaborate Seamlessly",
    "Analyze Progress",
    "Prioritize Smartly",
    "Save Hours Daily"
  ];

  const features = [
    {
      icon: CheckSquare,
      title: 'Task Management',
      description: 'Organize and track your tasks with our intuitive Kanban board interface.',
      animation: 'animate-bounce'
    },
    {
      icon: Clock,
      title: 'Time Tracking',
      description: 'Built-in timers to track time spent on each task with detailed analytics.',
      animation: 'animate-pulse'
    },
    {
      icon: BarChart3,
      title: 'Progress Analytics',
      description: 'Visual reports and statistics to monitor your productivity over time.',
      animation: 'animate-bounce'
    },
    {
      icon: Zap,
      title: 'AI Enhancement',
      description: 'Get smart suggestions for task prioritization and time estimates.',
      animation: 'animate-pulse'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Share tasks and collaborate with your team members seamlessly.',
      animation: 'animate-bounce'
    },
    {
      icon: Star,
      title: 'Priority Management',
      description: 'Set priorities and deadlines to stay focused on what matters most.',
      animation: 'animate-pulse'
    }
  ];

  const statsData = [
    { label: 'Active Users', value: 10000, suffix: '+' },
    { label: 'Tasks Completed', value: 500000, suffix: '+' },
    { label: 'Time Saved', value: 2000000, suffix: '+ hours' },
    { label: 'Satisfaction Rate', value: 98, suffix: '%' }
  ];

  // Cycling text animation - synchronized with slide animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [phrases.length]);

  // Counter animation
  useEffect(() => {
    setIsVisible(true);
    const duration = 2000;
    const steps = 60;
    const increment = duration / steps;

    statsData.forEach((stat, index) => {
      let current = 0;
      const target = stat.value;
      const step = target / steps;

      const timer = setTimeout(() => {
        const counter = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(counter);
          }

          setAnimatedStats(prev => ({
            ...prev,
            [index === 0 ? 'users' : index === 1 ? 'tasks' : index === 2 ? 'hours' : 'satisfaction']: Math.floor(current)
          }));
        }, increment);
      }, index * 200);

      return () => clearTimeout(timer);
    });
  }, []);

  const handleSearch = (query: string) => {
    addNotification({
      type: 'info',
      title: 'Search Feature',
      message: `Searching for: "${query}"`
    });
  };

  const handleFilter = (filters: any) => {
    addNotification({
      type: 'info',
      title: 'Filters Applied',
      message: 'Task filters have been updated'
    });
  };

  const handleClear = () => {
    addNotification({
      type: 'success',
      title: 'Filters Cleared',
      message: 'All filters have been reset'
    });
  };

  const handleCreateFromTemplate = (templateTasks: any[]) => {
    addNotification({
      type: 'success',
      title: 'Template Applied',
      message: `Created ${templateTasks.length} tasks from template`
    });
  };

  const handleImport = (importedTasks: any[]) => {
    addNotification({
      type: 'success',
      title: 'Tasks Imported',
      message: `Successfully imported ${importedTasks.length} tasks`
    });
  };

  const stats = [
    { label: 'Active Users', value: '10K+' },
    { label: 'Tasks Completed', value: '500K+' },
    { label: 'Time Saved', value: '2M+ hours' },
    { label: 'Satisfaction Rate', value: '98%' }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gray-900">
        {/* Animated Silhouette Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating geometric shapes */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 dark:bg-blue-800/20 rounded-full animate-bounce"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200/20 dark:bg-purple-800/20 rounded-lg animate-pulse"></div>
          <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-green-200/20 dark:bg-green-800/20 rounded-full animate-ping"></div>
          <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-indigo-200/20 dark:bg-indigo-800/20 rounded-lg animate-bounce"></div>

          {/* Time-related overlays */}
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10">
            <Clock className="w-64 h-64 text-blue-300 animate-spin" style={{animationDuration: '20s'}} />
          </div>
          <div className="absolute bottom-1/3 right-1/4 opacity-10">
            <div className="w-48 h-48 border-4 border-purple-300 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-800/50 text-blue-200 rounded-full text-sm font-medium mb-8 animate-fade-in border border-blue-700/50">
              <Star className="h-4 w-4 animate-spin" style={{animationDuration: '3s'}} />
              #1 Task Management Solution
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in">
              {phrases[currentPhraseIndex].split(' ')[0]} Your
              <span className="block relative overflow-hidden z-20 mb-4 leading-tight">
                <span className="inline-block animate-slide-up animate-color-highlight relative z-30 py-2">
                  {phrases[currentPhraseIndex].split(' ').slice(1).join(' ')}
                </span>
              </span>
            </h1>

            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in animation-delay-500">
              Streamline your workflow with our comprehensive task management platform.
              Track time, organize projects, and boost your productivity with AI-powered insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in animation-delay-1000">
              <Link
                href="/setup"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-lg"
              >
                Start Managing Tasks
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 font-semibold text-lg"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 animate-counter">
                {animatedStats.users.toLocaleString()}+
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm lg:text-base">
                Active Users
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2 animate-counter">
                {animatedStats.tasks.toLocaleString()}+
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm lg:text-base">
                Tasks Completed
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 animate-counter">
                {animatedStats.hours.toLocaleString()}+
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm lg:text-base">
                Hours Saved
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2 animate-counter">
                {animatedStats.satisfaction}%
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm lg:text-base">
                Satisfaction Rate
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features for
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Modern Teams
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to manage tasks efficiently and boost your team's productivity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700 group"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 mb-4 ${feature.animation} group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Experience Tasker Live
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Try our interactive features right here on the homepage. All data is stored locally in your browser.
            </p>
          </div>

          {/* Dashboard Preview */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Your Dashboard</h3>
            <DashboardStats tasks={tasks} />
          </div>

          {/* Interactive Features */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Task Filters & Search</h3>
              <TaskFilters onSearch={handleSearch} onFilter={handleFilter} onClear={handleClear} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Templates</h3>
              <TaskTemplates onCreateFromTemplate={handleCreateFromTemplate} />
            </div>
          </div>

          {/* Export/Import */}
          <div className="mb-12">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">Data Management</h3>
            <TaskExportImport tasks={tasks} onImport={handleImport} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who have streamlined their task management with Tasker.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/setup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-lg"
            >
              <Plus className="h-5 w-5" />
              Create Your First Task
            </Link>
            <Link
              href="/auth/signin"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-200 font-semibold text-lg"
            >
              Sign In to Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                <CheckSquare className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">Tasker</span>
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
              <a href="#about" className="hover:text-blue-400 transition-colors">About</a>
              <a href="/auth/signin" className="hover:text-blue-400 transition-colors">Sign In</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2024 Tasker. All rights reserved. Built with ❤️{' '}
            <a
              href="https://julevajeto.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Julev Ajeto
            </a>
          </div>
        </div>
      </footer>
  </div>
);
}

export default function Home() {
  return (
    <NotificationProvider>
      <HomeContent />
    </NotificationProvider>
  );
}
