import { supabase } from '../lib/supabase';

export interface NotificationPayload {
  recipientEmail: string;
  recipientName: string;
  type: 'order_confirmed' | 'reservation_confirmed';
  id: string;
  details: string;
}

class NotificationService {
  private RESEND_API_KEY = ''; // Placeholder for user's API key

  async sendEmail(payload: NotificationPayload) {
    console.log(`[RAWAQ-NOTIFY] Preparing email for ${payload.recipientEmail}...`);
    
    const htmlContent = `
      <div style="font-family: serif; color: #1a1a1a; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #e5e5e5;">
        <h1 style="text-transform: uppercase; letter-spacing: 4px; text-align: center; border-bottom: 2px solid #c5a059; padding-bottom: 20px;">RAWAQ IMPERIAL</h1>
        <p style="font-size: 18px; margin-top: 40px;">Beloved ${payload.recipientName},</p>
        <p style="line-height: 1.6;">It is our distinct pleasure to inform you that your <strong>${payload.type === 'order_confirmed' ? 'culinary selection' : 'imperial reservation'}</strong> (#${payload.id.slice(0, 8)}) has been personally confirmed by our Chef de Cuisine.</p>
        <div style="background: #f9f9f9; padding: 20px; margin: 30px 0; font-style: italic;">
          "${payload.details}"
        </div>
        <p style="line-height: 1.6;">We look forward to welcoming you to the Imperial Plaza for an unforgettable experience.</p>
        <div style="margin-top: 60px; text-align: center; font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 2px;">
          RAWAQ DINING · IMPERIAL PLAZA · RIYADH
        </div>
      </div>
    `;

    try {
      // 1. Log to DB
      const { error: dbError } = await supabase
        .from('notifications')
        .insert([{
          user_id: (await supabase.auth.getUser()).data.user?.id,
          recipient_email: payload.recipientEmail,
          type: payload.type,
          content: htmlContent,
          status: this.RESEND_API_KEY ? 'sent' : 'pending' // Mark as sent if key exists, otherwise pending
        }]);

      if (dbError) console.error('[RAWAQ-NOTIFY] DB Log Error:', dbError);

      if (!this.RESEND_API_KEY) {
        console.warn('[RAWAQ-NOTIFY] No Resend API Key found. Email simulated in console.');
        // In a real environment, you'd show a UI notification that email is simulated
        return { success: true, simulated: true };
      }

      // 2. Real Email Sending (using Resend as an example)
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: 'RAWAQ Imperial <concierge@rawaq.resort>',
          to: [payload.recipientEmail],
          subject: `Imperial Confirmation: Your RAWAQ Experience`,
          html: htmlContent
        })
      });

      if (!response.ok) throw new Error('Resend API failed');
      
      return { success: true };
    } catch (err) {
      console.error('[RAWAQ-NOTIFY] Email Service Error:', err);
      return { success: false, error: err };
    }
  }
}

export const notificationService = new NotificationService();
