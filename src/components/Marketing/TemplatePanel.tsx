import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import CreateTemplatePanel from './CreateTemplatePanel';
import TemplateEditorModal from './TemplateEditorModal';
import EmailTemplateCard from './EmailTemplateCard';
import {
  getEmailTemplates,
  updateEmailTemplate,
  deleteEmailTemplate,
} from '../../api/emailTemplates';
import { EmailTemplate, EditableEmailTemplate } from '../../types/marketing';
import { useOptimizedToast } from '@/hooks/useOptimizedToast';

const TemplatePanel: React.FC = () => {
  const queryClient = useQueryClient();
  const { success, error } = useOptimizedToast();

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EditableEmailTemplate | null>(null);

  const { data: templates = [], isLoading } = useQuery<EmailTemplate[]>({
    queryKey: ['emailTemplates'],
    queryFn: getEmailTemplates,
  });

  const updateMutation = useMutation({
    mutationFn: (template: EditableEmailTemplate) =>
      updateEmailTemplate(template.id!, template),
    onSuccess: () => {
      success('Template updated');
      queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
    },
    onError: () => error('Failed to update template'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEmailTemplate,
    onSuccess: () => {
      success('Template deleted');
      queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
    },
    onError: () => error('Failed to delete template'),
  });

  const handleEditSave = (template: EditableEmailTemplate) => {
    if (template.id) {
      updateMutation.mutate(template);
    }
    setEditModalOpen(false);
    setEditingTemplate(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Email Templates</h2>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          <FiPlus /> New Template
        </button>
      </div>
  
      {/* 🔳 White Card Wrapper */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Saved Templates</h3>
  
        <div className="grid md:grid-cols-2 gap-4">
          {isLoading ? (
            <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading templates...</p>
          ) : templates.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 italic">No templates found.</p>
          ) : (
            templates.map((template) => (
              <EmailTemplateCard
                key={template.id}
                template={template}
                onEdit={() => {
                  setEditingTemplate({
                    id: template.id,
                    name: template.name,
                    subject: template.subject,
                    body: template.bodyHtml,
                  });
                  setEditModalOpen(true);
                }}
                onDelete={() => deleteMutation.mutate(template.id)}
              />
            ))
          )}
        </div>
      </div>
  
      {/* Modals */}
      {isEditModalOpen && editingTemplate && (
        <TemplateEditorModal
          initialData={editingTemplate}
          onClose={() => {
            setEditModalOpen(false);
            setEditingTemplate(null);
          }}
          onSave={handleEditSave}
        />
      )}
  
      {isCreateModalOpen && (
        <CreateTemplatePanel
          isOpen={true}
          onClose={() => setCreateModalOpen(false)}
        />
      )}
    </div>
  );
};

export default TemplatePanel;