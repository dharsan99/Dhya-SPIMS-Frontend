import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  AlertTriangle, 
  MessageSquare, 
  User, 
  Building, 
  Clock,
  ArrowRight,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { getHighPriorityReplyTasks, type GrowthTask } from '../api/growth';

interface HighPriorityTaskAlertProps {
  onDismiss?: () => void;
  showDismissButton?: boolean;
  maxTasks?: number;
}

export const HighPriorityTaskAlert: React.FC<HighPriorityTaskAlertProps> = ({ 
  onDismiss,
  showDismissButton = false,
  maxTasks = 5
}) => {
  const navigate = useNavigate();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['high-priority-reply-tasks'],
    queryFn: getHighPriorityReplyTasks,
    refetchInterval: 60000, // Refetch every minute
  });

  const visibleTasks = tasks.slice(0, maxTasks);

  const handleViewTasks = () => {
    navigate('/app/growth/tasks');
  };

  const handleTaskClick = (taskId: string) => {
    navigate(`/app/growth/tasks?task=${taskId}`);
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const created = new Date(dateString);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  if (isLoading || tasks.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-300">
                High Priority Reply Tasks
              </h3>
              <span className="bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 text-xs font-medium px-2 py-1 rounded-full">
                {tasks.length} pending
              </span>
            </div>
            
            <p className="text-red-700 dark:text-red-400 text-sm mb-4">
              You have incoming replies that need immediate follow-up. Don't let opportunities slip away!
            </p>

            <div className="space-y-3">
              {visibleTasks.map((task) => (
                <TaskPreview
                  key={task.id}
                  task={task}
                  onClick={() => handleTaskClick(task.id)}
                  formatTimeAgo={formatTimeAgo}
                />
              ))}
              
              {tasks.length > maxTasks && (
                <div className="text-sm text-red-600 dark:text-red-400">
                  +{tasks.length - maxTasks} more reply tasks waiting...
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleViewTasks}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                View All Tasks
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
              
              <button
                onClick={() => navigate('/app/growth/analytics')}
                className="inline-flex items-center px-4 py-2 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 text-sm font-medium rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                View Analytics
              </button>
            </div>
          </div>
        </div>

        {showDismissButton && onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-1 text-red-400 hover:text-red-600 dark:hover:text-red-300"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

interface TaskPreviewProps {
  task: GrowthTask;
  onClick: () => void;
  formatTimeAgo: (date: string) => string;
}

const TaskPreview: React.FC<TaskPreviewProps> = ({ task, onClick, formatTimeAgo }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-700 rounded-md p-3 cursor-pointer hover:shadow-md transition-shadow group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-3 h-3 text-red-600" />
            <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400">
              {task.title}
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
            {task.contactName && (
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>{task.contactName}</span>
              </div>
            )}
            
            {task.companyName && (
              <div className="flex items-center gap-1">
                <Building className="w-3 h-3" />
                <span>{task.companyName}</span>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{formatTimeAgo(task.createdAt)}</span>
            </div>
          </div>
          
          {task.replySubject && (
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 italic">
              Reply: "{task.replySubject}"
            </div>
          )}
        </div>
        
        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 flex-shrink-0 ml-2" />
      </div>
    </div>
  );
};

export default HighPriorityTaskAlert; 