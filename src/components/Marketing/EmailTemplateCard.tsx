import React, { useState } from 'react';
import { EmailTemplate } from '../../types/marketing';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.bubble.css';

interface Props {
  template: EmailTemplate;
  onEdit?: () => void;
  onDelete?: () => void;
}

const EmailTemplateCard: React.FC<Props> = ({ template, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border rounded-lg p-4 bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
            {template.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 break-all">ID: {template.id}</p>
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              title="Edit Template"
            >
              <FiEdit2 className="w-5 h-5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              title="Delete Template"
            >
              <FiTrash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Subject */}
      <div className="mb-3">
        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Subject</p>
        <p className="text-sm text-gray-800 dark:text-gray-100">{template.subject}</p>
      </div>

      {/* Body Preview using ReactQuill */}
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Body (HTML Preview)</p>
        <div
          className={`mt-2 border rounded dark:border-gray-700 bg-white dark:bg-gray-800 ${
            expanded ? '' : 'max-h-56 overflow-hidden'
          }`}
        >
          <ReactQuill
            value={template.bodyHtml}
            readOnly
            theme="bubble"
            className="prose dark:prose-invert"
          />
        </div>
        {template.bodyHtml.length > 200 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 text-xs text-blue-600 hover:underline"
          >
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmailTemplateCard;