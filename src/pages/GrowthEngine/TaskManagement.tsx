import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft,
  CheckCircle,
  MessageSquare,
  Plus,
  AlertTriangle
} from 'lucide-react';

import { GrowthTaskManager } from '../../components/GrowthTaskManager';
import { HighPriorityTaskAlert } from '../../components/HighPriorityTaskAlert';

const TaskManagement = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'all' | 'replies' | 'general'>('all');
  
  // Check URL params for initial filter
  useEffect(() => {
    const filter = searchParams.get('filter');
    const taskId = searchParams.get('task');
    
    if (filter === 'replies') {
      setActiveTab('replies');
    } else if (taskId) {
      // If a specific task is requested, show all tasks
      setActiveTab('all');
    }
  }, [searchParams]);

  const tabs = [
    {
      id: 'all' as const,
      label: 'All Tasks',
      icon: CheckCircle,
      description: 'View and manage all growth tasks'
    },
    {
      id: 'replies' as const,
      label: 'Reply Follow-ups',
      icon: MessageSquare,
      description: 'High-priority tasks from email replies'
    },
    {
      id: 'general' as const,
      label: 'General Tasks',
      icon: Plus,
      description: 'Custom tasks and general activities'
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/app/growth')}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Back to Growth Engine"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Task Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage growth tasks and reply follow-ups
                </p>
              </div>
            </div>
          </div>

          {/* High Priority Alert - Only show for replies or all tasks */}
          {(activeTab === 'all' || activeTab === 'replies') && (
            <HighPriorityTaskAlert 
              maxTasks={5}
              showDismissButton={false}
            />
          )}

          {/* Task Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TaskStatsCard
              title="Total Tasks"
              icon={CheckCircle}
              color="blue"
              endpoint="/api/growth/tasks"
            />
            <TaskStatsCard
              title="Reply Follow-ups"
              icon={MessageSquare}
              color="red"
              endpoint="/api/growth/tasks?taskType=REPLY_FOLLOWUP&status=TODO"
            />
            <TaskStatsCard
              title="High Priority"
              icon={AlertTriangle}
              color="orange"
              endpoint="/api/growth/tasks?priority=HIGH&status=TODO"
            />
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Description */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {tabs.find(tab => tab.id === activeTab)?.description}
              </p>
            </div>
          </div>

          {/* Task Manager Content */}
          <div className="space-y-6">
            {activeTab === 'all' && (
              <GrowthTaskManager
                showOnlyReplyTasks={false}
                showCreateButton={true}
              />
            )}
            
            {activeTab === 'replies' && (
              <GrowthTaskManager
                showOnlyReplyTasks={true}
                showCreateButton={false}
              />
            )}
            
            {activeTab === 'general' && (
              <GrowthTaskManager
                showOnlyReplyTasks={false}
                showCreateButton={true}
              />
            )}
          </div>

          {/* Help Section */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
              How Task Management Works
            </h3>
            <div className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
              <div>
                <strong>• Automated Reply Tasks:</strong> When prospects reply to your outreach emails, 
                high-priority follow-up tasks are automatically created.
              </div>
              <div>
                <strong>• Real-time Updates:</strong> Tasks refresh automatically to show new replies 
                and status changes.
              </div>
              <div>
                <strong>• Context Preservation:</strong> Each reply task includes contact details, 
                company information, and links to the original conversation.
              </div>
              <div>
                <strong>• Priority Management:</strong> Tasks are automatically prioritized to ensure 
                important replies get immediate attention.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Task Statistics Card Component
interface TaskStatsCardProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'red' | 'orange' | 'green';
  endpoint: string;
}

const TaskStatsCard: React.FC<TaskStatsCardProps> = ({ title, icon: Icon, color, endpoint }) => {
  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This would normally fetch from the API endpoint
    // For now, showing placeholder values
    const timer = setTimeout(() => {
      setCount(Math.floor(Math.random() * 10));
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [endpoint]);

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-100 dark:bg-blue-900/20',
          text: 'text-blue-600 dark:text-blue-400',
          icon: 'text-blue-600 dark:text-blue-400'
        };
      case 'red':
        return {
          bg: 'bg-red-100 dark:bg-red-900/20',
          text: 'text-red-600 dark:text-red-400',
          icon: 'text-red-600 dark:text-red-400'
        };
      case 'orange':
        return {
          bg: 'bg-orange-100 dark:bg-orange-900/20',
          text: 'text-orange-600 dark:text-orange-400',
          icon: 'text-orange-600 dark:text-orange-400'
        };
      case 'green':
        return {
          bg: 'bg-green-100 dark:bg-green-900/20',
          text: 'text-green-600 dark:text-green-400',
          icon: 'text-green-600 dark:text-green-400'
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-900/20',
          text: 'text-gray-600 dark:text-gray-400',
          icon: 'text-gray-600 dark:text-gray-400'
        };
    }
  };

  const colors = getColorClasses(color);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          {isLoading ? (
            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1"></div>
          ) : (
            <p className={`text-3xl font-bold ${colors.text} mt-1`}>
              {count}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colors.bg}`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
      </div>
    </div>
  );
};

export default TaskManagement; 