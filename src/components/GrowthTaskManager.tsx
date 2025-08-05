import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  User, 
  Calendar,
  ExternalLink,
  MessageSquare,
  Building,
  Mail,
  Plus,
  Bot,
  Loader2,
  CheckCircle2,
  Eye,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

import { 
  getGrowthTasks, 
  updateGrowthTask, 
  deleteGrowthTask,
  createGrowthTask,
  type GrowthTask,
  type TaskUpdateRequest,
  type TaskCreateRequest
} from '../api/growth';
import { AIReplyModal } from './AIReplyModal';

interface GrowthTaskManagerProps {
  showOnlyReplyTasks?: boolean;
  showCreateButton?: boolean;
  maxTasks?: number;
}

// Helper functions for AI draft detection
const hasAIDraftReady = (task: GrowthTask): boolean => {
  return task.description?.includes('AI REPLY DRAFT GENERATED') || false;
};

const isAIGenerationInProgress = (task: GrowthTask): boolean => {
  return task.status === 'IN_PROGRESS' && task.taskType === 'REPLY_FOLLOWUP';
};


const getAIReplyButtonState = (task: GrowthTask) => {
  if (isAIGenerationInProgress(task)) {
    return {
      type: 'generating' as const,
      text: 'AI Generating...',
      icon: Loader2,
      disabled: true,
      className: 'bg-orange-600 hover:bg-orange-600 cursor-not-allowed',
      spinIcon: true
    };
  }
  
  if (hasAIDraftReady(task)) {
    return {
      type: 'view' as const,
      text: 'View AI Draft',
      icon: Eye,
      disabled: false,
      className: 'bg-green-600 hover:bg-green-700',
      spinIcon: false
    };
  }
  
  return {
    type: 'generate' as const,
    text: 'Draft Reply with AI',
    icon: Bot,
    disabled: false,
    className: 'bg-blue-600 hover:bg-blue-700',
    spinIcon: false
  };
};

export const GrowthTaskManager: React.FC<GrowthTaskManagerProps> = ({ 
  showOnlyReplyTasks = false,
  showCreateButton = true,
  maxTasks 
}) => {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'TODO' | 'IN_PROGRESS' | 'DONE'>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<GrowthTask | null>(null);
  const [aiReplyTask, setAiReplyTask] = useState<GrowthTask | null>(null);

  // Fetch tasks
  const { 
    data: taskResponse, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['growth-tasks', selectedStatus, selectedPriority, showOnlyReplyTasks],
    queryFn: () => getGrowthTasks({
      status: selectedStatus === 'ALL' ? undefined : selectedStatus,
      priority: selectedPriority === 'ALL' ? undefined : selectedPriority,
      taskType: showOnlyReplyTasks ? 'REPLY_FOLLOWUP' : undefined,
      limit: maxTasks
    }),
    refetchInterval: 15000, // Refetch every 15 seconds for faster AI updates
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, updates }: { taskId: string; updates: TaskUpdateRequest }) =>
      updateGrowthTask(taskId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['growth-tasks'] });
      toast.success('✅ Task updated successfully');
    },
    onError: () => {
      toast.error('❌ Failed to update task');
    },
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: deleteGrowthTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['growth-tasks'] });
      toast.success('✅ Task deleted successfully');
    },
    onError: () => {
      toast.error('❌ Failed to delete task');
    },
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: createGrowthTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['growth-tasks'] });
      setShowCreateModal(false);
      toast.success('✅ Task created successfully');
    },
    onError: () => {
      toast.error('❌ Failed to create task');
    },
  });

  const tasks = taskResponse?.tasks || [];
  const pendingCount = taskResponse?.pendingCount || 0;
  const highPriorityCount = taskResponse?.highPriorityCount || 0;

  const handleStatusChange = (taskId: string, status: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
    updateTaskMutation.mutate({ taskId, updates: { status } });
  };

  const handlePriorityChange = (taskId: string, priority: 'HIGH' | 'MEDIUM' | 'LOW') => {
    updateTaskMutation.mutate({ taskId, updates: { priority } });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'LOW': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string, task?: GrowthTask) => {
    // Special handling for AI generation tasks
    if (task && isAIGenerationInProgress(task)) {
      return <Loader2 className="w-4 h-4 text-orange-600 animate-spin" />;
    }
    
    // Special handling for tasks with AI drafts ready
    if (task && hasAIDraftReady(task) && status === 'TODO') {
      return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    }
    
    switch (status) {
      case 'DONE': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'IN_PROGRESS': return <Clock className="w-4 h-4 text-blue-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error Loading Tasks</h3>
          <p className="text-gray-600 dark:text-gray-400">Failed to load growth tasks. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              {showOnlyReplyTasks ? (
                <>
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  Reply Follow-ups
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Growth Tasks
                </>
              )}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {pendingCount} pending • {highPriorityCount} high priority
            </p>
          </div>
          
          {showCreateButton && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => refetch()}
                className="inline-flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                title="Refresh tasks"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </button>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-4 mt-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="ALL">All Status</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
          
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="ALL">All Priority</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="p-6">
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {showOnlyReplyTasks ? 'No Reply Tasks' : 'No Tasks'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {showOnlyReplyTasks 
                ? 'No reply follow-ups needed right now. Great work!'
                : 'All caught up! Create a new task to get started.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onPriorityChange={handlePriorityChange}
                onDelete={() => deleteTaskMutation.mutate(task.id)}
                onEdit={() => setEditingTask(task)}
                onAIReply={(t) => {
                  setAiReplyTask(t);
                  setTimeout(() => refetch(), 2000);
                }}
                getPriorityColor={getPriorityColor}
                getStatusIcon={getStatusIcon}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={(task) => createTaskMutation.mutate(task)}
          isSubmitting={createTaskMutation.isPending}
        />
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSubmit={(updates) => {
            updateTaskMutation.mutate({ 
              taskId: editingTask.id, 
              updates 
            });
            setEditingTask(null);
          }}
          isSubmitting={updateTaskMutation.isPending}
        />
      )}

      {/* AI Reply Modal */}
      {aiReplyTask && (
        <AIReplyModal
          isOpen={true}
          onClose={() => setAiReplyTask(null)}
          task={aiReplyTask}
          onTaskUpdate={() => refetch()}
        />
      )}
    </div>
  );
};

// Task Card Component
interface TaskCardProps {
  task: GrowthTask;
  onStatusChange: (taskId: string, status: 'TODO' | 'IN_PROGRESS' | 'DONE') => void;
  onPriorityChange: (taskId: string, priority: 'HIGH' | 'MEDIUM' | 'LOW') => void;
  onDelete: () => void;
  onEdit: () => void;
  onAIReply?: (task: GrowthTask) => void;
  getPriorityColor: (priority: string) => string;
  getStatusIcon: (status: string, task?: GrowthTask) => React.ReactNode;
  formatDate: (date: string) => string;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onStatusChange,
  onDelete,
  onEdit,
  onAIReply,
  getPriorityColor,
  getStatusIcon,
  formatDate,
}) => {
  const replyButtonState = getAIReplyButtonState(task);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Task Header */}
          <div className="flex items-start gap-3 mb-3">
            <div className="mt-1">
              {getStatusIcon(task.status, task)}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                {task.title}
                {/* AI Draft Ready Indicator */}
                {hasAIDraftReady(task) && (
                  <span className="inline-flex items-center gap-1 ml-2 px-2 py-1 text-xs font-medium text-green-800 bg-green-100 dark:bg-green-900/20 dark:text-green-300 rounded-md">
                    <CheckCircle2 className="w-3 h-3" />
                    AI Draft Ready
                  </span>
                )}
                {/* AI Generation In Progress Indicator */}
                {isAIGenerationInProgress(task) && (
                  <span className="inline-flex items-center gap-1 ml-2 px-2 py-1 text-xs font-medium text-orange-800 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-300 rounded-md">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    AI Generating...
                  </span>
                )}
              </h3>
              {task.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {task.description}
                </p>
              )}
              
              {/* Reply Context */}
              {task.taskType === 'REPLY_FOLLOWUP' && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-md p-3 mb-3 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
                      Reply Context
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    {task.contactName && (
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3 text-blue-600" />
                        <span className="text-blue-800 dark:text-blue-300">{task.contactName}</span>
                      </div>
                    )}
                    
                    {task.companyName && (
                      <div className="flex items-center gap-2">
                        <Building className="w-3 h-3 text-blue-600" />
                        <span className="text-blue-800 dark:text-blue-300">{task.companyName}</span>
                      </div>
                    )}
                    
                    {task.contactEmail && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 text-blue-600" />
                        <span className="text-blue-800 dark:text-blue-300">{task.contactEmail}</span>
                      </div>
                    )}
                    
                    {task.replySubject && (
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-3 h-3 text-blue-600" />
                        <span className="text-blue-800 dark:text-blue-300 truncate">
                          "{task.replySubject}"
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    {task.originalEmailId && (
                      <button className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        <ExternalLink className="w-3 h-3" />
                        View Original Email
                      </button>
                    )}
                    
                    {/* AI Reply Button */}
                    {onAIReply && (
                      <button
                        onClick={() => onAIReply(task)}
                        className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-medium text-white rounded-md transition-colors ${replyButtonState.className}`}
                        title={replyButtonState.text}
                        disabled={replyButtonState.disabled}
                      >
                        {replyButtonState.spinIcon ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <replyButtonState.icon className="w-3 h-3" />
                        )}
                        {replyButtonState.text}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Task Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(task.createdAt)}</span>
            </div>
            
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Due {formatDate(task.dueDate)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Task Controls */}
        <div className="flex items-center gap-2 ml-4">
          {/* Priority Badge */}
          <span className={`px-2 py-1 text-xs font-medium rounded-md ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>

          {/* Status Dropdown */}
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value as any)}
            className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>

          {/* Action Buttons */}
          <button
            onClick={onEdit}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            title="Edit Task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          <button
            onClick={onDelete}
            className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
            title="Delete Task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Create Task Modal Component
interface CreateTaskModalProps {
  onClose: () => void;
  onSubmit: (task: TaskCreateRequest) => void;
  isSubmitting: boolean;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ onClose, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState<TaskCreateRequest>({
    title: '',
    description: '',
    priority: 'MEDIUM',
    taskType: 'GENERAL',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Create New Task
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter task title"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter task description"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Edit Task Modal Component
interface EditTaskModalProps {
  task: GrowthTask;
  onClose: () => void;
  onSubmit: (updates: TaskUpdateRequest) => void;
  isSubmitting: boolean;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, onClose, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState<TaskUpdateRequest>({
    title: task.title,
    description: task.description || '',
    priority: task.priority,
    status: task.status,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      toast.error('Please enter a task title');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Edit Task
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Updating...' : 'Update Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GrowthTaskManager; 