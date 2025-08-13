export interface EmailService {
  sendReportEmail(reportId: string, recipientEmail: string, subject?: string): Promise<void>;
  sendQuoteEmail(quoteId: string, recipientEmail: string, subject?: string): Promise<void>;
}

export class MockEmailService implements EmailService {
  async sendReportEmail(reportId: string, recipientEmail: string, subject?: string): Promise<void> {
    // Mock implementation - in production, this would integrate with an email service
    console.log(`📧 Sending report ${reportId} to ${recipientEmail}`);
    console.log(`Subject: ${subject || 'Inspection Report'}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In production, you would:
    // 1. Generate PDF from report data
    // 2. Send email via service like SendGrid, AWS SES, or similar
    // 3. Log the email activity
    
    console.log('✅ Report email sent successfully');
  }

  async sendQuoteEmail(quoteId: string, recipientEmail: string, subject?: string): Promise<void> {
    console.log(`📧 Sending quote ${quoteId} to ${recipientEmail}`);
    console.log(`Subject: ${subject || 'Quote'}`);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('✅ Quote email sent successfully');
  }
}

// Firebase Cloud Functions implementation would go here
export class FirebaseEmailService implements EmailService {
  private getFunctionUrl(functionName: string): string {
    const isDev = import.meta.env.DEV;
    const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
    const emulatorHost = import.meta.env.VITE_FIREBASE_EMULATOR_HOST || 'localhost';
    
    if (isDev) {
      return `http://${emulatorHost}:5001/${projectId}/us-central1/${functionName}`;
    }
    
    return `https://us-central1-${projectId}.cloudfunctions.net/${functionName}`;
  }

  async sendReportEmail(reportId: string, recipientEmail: string, subject?: string): Promise<void> {
    const response = await fetch(this.getFunctionUrl('sendReportEmail'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportId, recipientEmail, subject })
    });
    
    if (!response.ok) {
      throw new Error('Failed to send report email');
    }
  }

  async sendQuoteEmail(quoteId: string, recipientEmail: string, subject?: string): Promise<void> {
    const response = await fetch(this.getFunctionUrl('sendQuoteEmail'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quoteId, recipientEmail, subject })
    });
    
    if (!response.ok) {
      throw new Error('Failed to send quote email');
    }
  }
}