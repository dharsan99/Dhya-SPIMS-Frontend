import React, { useState, useEffect } from 'react';
import { Bot, Send, Copy, Loader2, MessageSquare, User, Building, CheckCircle2, RefreshCw } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { generateAIReply, AIReplyResponse, getAIDraft, AIDraftResponse, sendAIReply, SendReplyResponse } from '../api/growth';
import { toast } from 'react-hot-toast';
import { GrowthTask } from '../api/growth';
import { TailwindDialog } from './ui/Dialog';

interface AIReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: GrowthTask;
  onTaskUpdate?: () => void; // Optional callback to refresh task list
}

export const AIReplyModal: React.FC<AIReplyModalProps> = ({ isOpen, onClose, task, onTaskUpdate }) => {
  const [aiReplyDraft, setAiReplyDraft] = useState('');
  const [] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Check if AI draft exists and load it
  const hasExistingDraft = task.description?.includes('AI REPLY DRAFT GENERATED') || false;
  const isGenerating = task.status === 'IN_PROGRESS' && task.taskType === 'REPLY_FOLLOWUP';
  const isAlreadySent = task.status === 'DONE' && task.description?.includes('AI REPLY SENT');

  // Query to fetch existing AI draft if available
  const { 
    data: existingDraft, 
    isLoading: draftLoading  } = useQuery<AIDraftResponse>({
    queryKey: ['ai-draft', task.id],
    queryFn: () => getAIDraft(task.id),
    enabled: isOpen && hasExistingDraft, // Only fetch if modal is open and draft exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false // Don't retry on error (draft might not exist)
  });

  // Load existing draft when query succeeds
  useEffect(() => {
    if (existingDraft && existingDraft.body) {
      setAiReplyDraft(existingDraft.body);
    }
  }, [existingDraft]);

  // AI Reply Generation Mutation (async)
  const generateReplyMutation = useMutation({
    mutationFn: () => generateAIReply(task.id),
    onSuccess: (data: AIReplyResponse) => {
      // Show async success message
      toast.success(`🚀 AI reply generation started! Draft will be ready in ${data.estimatedTime}. The task will update automatically.`);
      
      // Set placeholder message showing generation status
      setAiReplyDraft(`🤖 AI reply generation in progress...

This AI-powered reply is being generated in the background. The process typically takes ${data.estimatedTime}.

✅ Context gathered: ${data.context.contactName} from ${data.context.companyName}
⏱️ Estimated completion: ${data.estimatedTime}
📧 Original subject: ${data.context.originalSubject}

The generated draft will be saved automatically and the task will update when ready. You can close this modal and check back in a few minutes.

💡 Tip: You'll see the task status change from "In Progress" back to "To Do" when the AI draft is ready.`);
      
      // Auto-close modal after showing status
      setTimeout(() => {
        onClose();
      }, 8000);
    },
    onError: (error: any) => {
      console.error('❌ Failed to start AI reply generation:', error);
      toast.error(error.message || 'Failed to start AI reply generation');
    },
  });

  // Send Reply Mutation
  const sendReplyMutation = useMutation({
    mutationFn: () => sendAIReply(task.id),
    onSuccess: (data: SendReplyResponse) => {
      const action = data.isResend ? 'resent' : 'sent';
      const icon = data.isResend ? '🔄' : '📤';
      toast.success(`${icon} Reply ${action} successfully to ${data.contactName}!`);
      console.log(`✅ Reply ${action}:`, data);
      
      // Call the task update callback if provided
      if (onTaskUpdate) {
        onTaskUpdate();
      }
      
      // Close modal after successful send
      onClose();
    },
    onError: (error: any) => {
      console.error('❌ Failed to send reply:', error);
      toast.error(error.message || 'Failed to send reply');
    },
  });

  // Extract customer reply from task description
  const getCustomerReply = () => {
    if (!task.description) return 'No reply text available';
    
    const replyMatch = task.description.match(/CUSTOMER REPLY:\n(.*?)\n\n--- CONTEXT ---/s);
    return replyMatch ? replyMatch[1].trim() : 'No reply text found';
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(aiReplyDraft);
      setCopySuccess(true);
      toast.success('📋 Reply copied to clipboard!');
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleGenerateReply = () => {
    generateReplyMutation.mutate();
  };

  const handleSendReply = () => {
    sendReplyMutation.mutate();
  };

  const customerReply = getCustomerReply();

  // Get modal title based on state
  const getModalTitle = () => {
    if (isAlreadySent) {
      return 'AI Reply Already Sent';
    }
    if (hasExistingDraft) {
      return draftLoading ? 'Loading AI Draft...' : 'AI Reply Draft Ready';
    }
    if (isGenerating) {
      return 'AI Reply Generating...';
    }
    return 'AI Reply Assistant';
  };

  return (
    <TailwindDialog 
      isOpen={isOpen} 
      onClose={onClose} 
      title={getModalTitle()}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6 max-h-[75vh] overflow-y-auto">
        {/* Header Status */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isAlreadySent
              ? 'bg-purple-100 dark:bg-purple-900'
              : hasExistingDraft 
              ? 'bg-green-100 dark:bg-green-900' 
              : isGenerating 
              ? 'bg-orange-100 dark:bg-orange-900'
              : 'bg-blue-100 dark:bg-blue-900'
          }`}>
            {isAlreadySent ? (
              <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            ) : hasExistingDraft ? (
              draftLoading ? (
                <Loader2 className="w-5 h-5 text-green-600 dark:text-green-400 animate-spin" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              )
            ) : isGenerating ? (
              <Loader2 className="w-5 h-5 text-orange-600 dark:text-orange-400 animate-spin" />
            ) : (
              <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isAlreadySent
                ? 'AI reply has been successfully sent. You can resend if needed.'
                : hasExistingDraft 
                ? (draftLoading ? 'Fetching your AI-generated response...' : 'Review and send your AI-generated response')
                : isGenerating 
                ? 'AI is currently generating your reply...'
                : 'Generate an intelligent response to customer inquiry'
              }
            </p>
          </div>
        </div>

        {/* Task Context */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">Task Context</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {task.contactName && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700 dark:text-gray-300">{task.contactName}</span>
              </div>
            )}
            {task.companyName && (
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700 dark:text-gray-300">{task.companyName}</span>
              </div>
            )}
            {task.replySubject && (
              <div className="flex items-center gap-2 md:col-span-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700 dark:text-gray-300">Re: {task.replySubject}</span>
              </div>
            )}
          </div>
        </div>

        {/* Customer's Reply */}
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">Customer's Message</h3>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="text-sm text-green-800 dark:text-green-300 whitespace-pre-wrap">
              {customerReply}
            </div>
          </div>
        </div>

        {/* AI Generation */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900 dark:text-white">
              AI-Generated Reply Draft
              {isAlreadySent && (
                <span className="inline-flex items-center gap-1 ml-2 px-2 py-1 text-xs font-medium text-purple-800 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-300 rounded-md">
                  <CheckCircle2 className="w-3 h-3" />
                  Sent
                </span>
              )}
              {hasExistingDraft && !draftLoading && !isAlreadySent && (
                <span className="inline-flex items-center gap-1 ml-2 px-2 py-1 text-xs font-medium text-green-800 bg-green-100 dark:bg-green-900/20 dark:text-green-300 rounded-md">
                  <CheckCircle2 className="w-3 h-3" />
                  Ready
                </span>
              )}
              {draftLoading && (
                <span className="inline-flex items-center gap-1 ml-2 px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 rounded-md">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Loading...
                </span>
              )}
            </h3>
            
            {(hasExistingDraft && !draftLoading) && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyToClipboard}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  {copySuccess ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={handleGenerateReply}
                  disabled={generateReplyMutation.isPending}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400 rounded-md hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className="w-3 h-3" />
                  Regenerate
                </button>
              </div>
            )}
          </div>

          {/* AI Draft Area */}
          {hasExistingDraft && !draftLoading ? (
            <div className="relative">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 min-h-[300px]">
                {existingDraft?.subject && (
                  <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Subject:</div>
                    <div className="font-medium text-gray-900 dark:text-white">{existingDraft.subject}</div>
                  </div>
                )}
                <div className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                  {aiReplyDraft}
                </div>
                                 {existingDraft?.createdAt && (
                   <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                     <div className="text-xs text-gray-500 dark:text-gray-400">
                       Generated: {new Date(existingDraft.createdAt).toLocaleString()}
                     </div>
                     {isAlreadySent && (
                       <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                         ✅ Sent: {(() => {
                           const sentMatch = task.description?.match(/Sent at: ([^\\n]+)/);
                           return sentMatch ? new Date(sentMatch[1]).toLocaleString() : 'Recently';
                         })()}
                       </div>
                     )}
                   </div>
                 )}
              </div>
            </div>
          ) : draftLoading ? (
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                <span className="text-gray-600 dark:text-gray-400">Loading AI draft...</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Please wait while we fetch your AI-generated response.</p>
            </div>
          ) : isGenerating ? (
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Loader2 className="w-5 h-5 text-orange-600 dark:text-orange-400 animate-spin" />
                <span className="font-medium text-orange-900 dark:text-orange-300">AI Reply Generation in Progress</span>
              </div>
              <p className="text-sm text-orange-800 dark:text-orange-300">
                Your AI reply is being generated. This process typically takes 2-3 minutes. The task will update automatically when ready.
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <Bot className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">Ready to generate an AI-powered reply to this customer inquiry.</p>
                <button
                  onClick={handleGenerateReply}
                  disabled={generateReplyMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                >
                  {generateReplyMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Starting Generation...
                    </>
                  ) : (
                    <>
                      <Bot className="w-4 h-4" />
                      Generate AI Reply
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {hasExistingDraft && !draftLoading && (
          <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {isAlreadySent 
                ? '🔄 Reply already sent. You can resend if needed.'
                : '💡 Review the draft and send when ready'
              }
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleCopyToClipboard}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                {copySuccess ? 'Copied!' : 'Copy Reply'}
              </button>
              <button
                onClick={handleSendReply}
                disabled={sendReplyMutation.isPending}
                className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isAlreadySent 
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {sendReplyMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {isAlreadySent ? 'Resending...' : 'Sending...'}
                  </>
                ) : (
                  <>
                    {isAlreadySent ? (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        Resend AI Reply
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Reply
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </TailwindDialog>
  );
}; 