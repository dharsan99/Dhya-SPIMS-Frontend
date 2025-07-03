import axios from './axios';
import { EditableEmailTemplate, EmailTemplate } from '../types/marketing';


export const getEmailTemplates = async (): Promise<EmailTemplate[]> => {
    const res = await axios.get('/email-templates');
    return res.data; // ✅ Only return the actual array
  };
export const getEmailTemplateById = (id: string) =>
  axios.get(`/email-templates/${id}`);

export const sendBulkEmail = (data: {
    mailingListId: string;
    subject: string;
    bodyHtml: string;
  }) => axios.post('/email/send-bulk', data);
  
export const createEmailTemplate = (template: EditableEmailTemplate) => {
    return axios.post('/email-templates', {
      name: template.name,
      subject: template.subject,
      bodyHtml: template.body,
    });
  };

  export const updateEmailTemplate = (id: string, template: EditableEmailTemplate) => {
    return axios.put(`/email-templates/${id}`, {
      name: template.name,
      subject: template.subject,
      bodyHtml: template.body,
    });
  };

export const deleteEmailTemplate = (id: string) =>
  axios.delete(`/email-templates/${id}`);