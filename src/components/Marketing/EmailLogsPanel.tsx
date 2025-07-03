import React from 'react';
import { FiMail } from 'react-icons/fi';

export interface EmailLog {
  id: string;
  subject: string;
  templateName: string;
  mailingListName: string;
  sentAt: string; // ISO string
  sentBy: string;
}

interface EmailLogsPanelProps {
  logs: EmailLog[];
}

const EmailLogsPanel: React.FC<EmailLogsPanelProps> = ({ logs }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 uppercase tracking-wide">
          <tr>
            <th className="px-4 py-3">Subject</th>
            <th className="px-4 py-3">Template</th>
            <th className="px-4 py-3">Mailing List</th>
            <th className="px-4 py-3">Sent By</th>
            <th className="px-4 py-3">Sent At</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {logs.length > 0 ? (
            logs.map((log) => (
              <tr
                key={log.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="px-4 py-2 font-medium text-blue-700 dark:text-blue-400 flex items-center gap-2">
                  <FiMail className="w-4 h-4" />
                  {log.subject}
                </td>
                <td className="px-4 py-2">{log.templateName}</td>
                <td className="px-4 py-2">{log.mailingListName}</td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{log.sentBy}</td>
                <td className="px-4 py-2">
                  {new Date(log.sentAt).toLocaleString('en-GB', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="py-6 text-center text-gray-500 italic dark:text-gray-400">
                No email logs found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmailLogsPanel;