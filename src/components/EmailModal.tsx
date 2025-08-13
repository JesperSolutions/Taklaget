import React, { useState } from 'react';
import { X, Mail, Send } from 'lucide-react';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (email: string, subject: string, message: string) => Promise<void>;
  defaultEmail?: string;
  defaultSubject?: string;
  type: 'report' | 'quote';
}

export default function EmailModal({ 
  isOpen, 
  onClose, 
  onSend, 
  defaultEmail = '', 
  defaultSubject = '',
  type 
}: EmailModalProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [subject, setSubject] = useState(defaultSubject || `${type === 'report' ? 'Inspection Report' : 'Quote'}`);
  const [message, setMessage] = useState(
    type === 'report' 
      ? 'Please find attached your inspection report. If you have any questions, please don\'t hesitate to contact us.'
      : 'Please find attached your quote. This quote is valid until the date specified. If you have any questions, please don\'t hesitate to contact us.'
  );
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    
    try {
      await onSend(email, subject, message);
      onClose();
      // Reset form
      setEmail(defaultEmail);
      setSubject(defaultSubject || `${type === 'report' ? 'Inspection Report' : 'Quote'}`);
      setMessage(
        type === 'report' 
          ? 'Please find attached your inspection report. If you have any questions, please don\'t hesitate to contact us.'
          : 'Please find attached your quote. This quote is valid until the date specified. If you have any questions, please don\'t hesitate to contact us.'
      );
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Failed to send email. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Mail className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">
                  Send {type === 'report' ? 'Report' : 'Quote'} by Email
                </h3>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Recipient Email</label>
                <input
                  type="email"
                  required
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@example.com"
                />
              </div>

              <div>
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">Message</label>
                <textarea
                  rows={4}
                  className="form-input"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a personal message..."
                />
              </div>

              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm text-blue-800">
                  📎 The {type === 'report' ? 'inspection report' : 'quote'} will be attached as a PDF to this email.
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary"
                  disabled={sending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="btn-primary flex items-center"
                >
                  {sending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Email
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}