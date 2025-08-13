import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';

// Initialize Firebase Admin with environment variables
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

// Email configuration
const transporter = nodemailer.createTransporter({
  service: 'gmail', // or your preferred email service
  auth: {
    user: functions.config().email?.user || process.env.EMAIL_USER,
    pass: functions.config().email?.password || process.env.EMAIL_PASSWORD,
  },
});

// Send Report Email Function
export const sendReportEmail = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { reportId, recipientEmail, subject, message } = data;

  try {
    // Get report data from Firestore
    const reportDoc = await admin.firestore().collection('inspectionReports').doc(reportId).get();
    
    if (!reportDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Report not found');
    }

    const report = reportDoc.data();

    // Generate PDF (you would implement PDF generation here)
    // const pdfBuffer = await generateReportPDF(report);

    // Send email
    const mailOptions = {
      from: functions.config().email?.user || process.env.EMAIL_USER,
      to: recipientEmail,
      subject: subject || `Inspection Report - ${report?.customer?.name}`,
      html: `
        <h2>Inspection Report</h2>
        <p>${message || 'Please find attached your inspection report.'}</p>
        <hr>
        <p><strong>Customer:</strong> ${report?.customer?.name}</p>
        <p><strong>Address:</strong> ${report?.address}</p>
        <p><strong>Roof Type:</strong> ${report?.roofType}</p>
        <p><strong>Status:</strong> ${report?.status}</p>
        <hr>
        <p>Best regards,<br>Taklaget Team</p>
      `,
      // attachments: [
      //   {
      //     filename: `inspection-report-${reportId}.pdf`,
      //     content: pdfBuffer,
      //   },
      // ],
    };

    await transporter.sendMail(mailOptions);

    // Log the email activity
    await admin.firestore().collection('emailLogs').add({
      type: 'report',
      reportId,
      recipientEmail,
      subject,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      sentBy: context.auth.uid,
    });

    return { success: true, message: 'Report email sent successfully' };
  } catch (error) {
    console.error('Error sending report email:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send email');
  }
});

// Send Quote Email Function
export const sendQuoteEmail = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { quoteId, recipientEmail, subject, message } = data;

  try {
    // Get quote data from Firestore
    const quoteDoc = await admin.firestore().collection('quotes').doc(quoteId).get();
    
    if (!quoteDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Quote not found');
    }

    const quote = quoteDoc.data();

    // Generate line items HTML
    const lineItemsHtml = quote?.lineItems?.map((item: any) => 
      `<tr>
        <td>${item.description}</td>
        <td>${item.quantity}</td>
        <td>${item.unitPrice} ${quote.currency}</td>
        <td>${item.total} ${quote.currency}</td>
      </tr>`
    ).join('');

    // Send email
    const mailOptions = {
      from: functions.config().email?.user || process.env.EMAIL_USER,
      to: recipientEmail,
      subject: subject || `Quote - ${quote?.customer?.name}`,
      html: `
        <h2>Quote</h2>
        <p>${message || 'Please find your quote details below.'}</p>
        <hr>
        <p><strong>Customer:</strong> ${quote?.customer?.name}</p>
        <p><strong>Valid Until:</strong> ${new Date(quote?.validUntil).toLocaleDateString()}</p>
        
        <h3>Line Items</h3>
        <table border="1" style="border-collapse: collapse; width: 100%;">
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${lineItemsHtml}
          </tbody>
        </table>
        
        <p><strong>Subtotal:</strong> ${quote?.subtotal} ${quote?.currency}</p>
        <p><strong>Tax:</strong> ${quote?.tax} ${quote?.currency}</p>
        <p><strong>Total:</strong> ${quote?.total} ${quote?.currency}</p>
        
        <hr>
        <p>Best regards,<br>Taklaget Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Log the email activity
    await admin.firestore().collection('emailLogs').add({
      type: 'quote',
      quoteId,
      recipientEmail,
      subject,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      sentBy: context.auth.uid,
    });

    return { success: true, message: 'Quote email sent successfully' };
  } catch (error) {
    console.error('Error sending quote email:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send email');
  }
});

// Generate PDF Function (placeholder)
export const generateReportPDF = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  // This would use Puppeteer or similar to generate PDFs
  // Implementation depends on your specific PDF requirements
  
  return { success: true, message: 'PDF generation not yet implemented' };
});