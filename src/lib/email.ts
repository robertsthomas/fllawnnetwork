import { Resend } from 'resend';
import ProviderConfirmationEmail from '../emails/provider-confirmation';
import QuoteRequestEmail from '../emails/quote-request';
import WelcomeEmail from '~/emails/welcome-preview';

// Initialize Resend with API key and fallback for build time
const apiKey = process.env.RESEND_API_KEY || process.env.NEXT_PUBLIC_RESEND_API_KEY || 'dummy-key-for-build';

// Validate API key format (Resend keys start with 're_')
const isValidKey = apiKey.startsWith('re_') || apiKey === 'dummy-key-for-build';
const finalKey = isValidKey ? apiKey : 'dummy-key-for-build';

const resend = new Resend(finalKey);

// Default from email address
const defaultFrom = 'Lawn Care Directory <noreply@lawncare-directory.com>';

// Email sending interface
interface SendEmailOptions {
  to: string | string[];
  subject: string;
  react: JSX.Element;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
}

/**
 * Send an email using Resend
 */
export async function sendEmail({
  to,
  subject,
  react,
  from = defaultFrom,
  cc,
  bcc,
  replyTo,
}: SendEmailOptions) {
  // Skip email sending during build time or when no valid API key is available
  const hasValidApiKey = (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.startsWith('re_')) || 
                         (process.env.NEXT_PUBLIC_RESEND_API_KEY && process.env.NEXT_PUBLIC_RESEND_API_KEY.startsWith('re_'));
  
  if (!hasValidApiKey) {
    console.log('Skipping email send - no valid API key available');
    return { success: true, data: { id: 'build-time-skip' } };
  }

  try {
    // Send the email using Resend with React component
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      react,
      cc,
      bcc,
      replyTo,
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception sending email:', error);
    return { success: false, error };
  }
}

/**
 * Send a welcome email to a new user
 */
export async function sendWelcomeEmail({
  to,
  username,
}: {
  to: string;
  username: string;
}) {
  return sendEmail({
    to,
    subject: 'Welcome to Lawn Care Directory',
    react: WelcomeEmail({ name: username, email: to }),
  });
}

/**
 * Send a provider confirmation email
 */
export async function sendProviderConfirmationEmail({
  to,
  providerName,
  providerEmail,
  profileUrl,
}: {
  to: string;
  providerName: string;
  providerEmail: string;
  profileUrl: string;
}) {
  return sendEmail({
    to,
    subject: 'Your Provider Profile is Confirmed!',
    react: ProviderConfirmationEmail({
      providerName,
      providerEmail,
      profileUrl,
    }),
  });
}

/**
 * Send a quote request email to a provider
 */
export async function sendQuoteRequestEmail({
  to,
  providerName,
  customerName,
  customerEmail,
  customerPhone,
  propertyAddress,
  serviceType,
  requestNotes,
  requestId,
}: {
  to: string;
  providerName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  propertyAddress: string;
  serviceType: string;
  requestNotes: string;
  requestId: string;
}) {
  return sendEmail({
    to,
    subject: `New Quote Request: ${serviceType}`,
    react: QuoteRequestEmail({
      providerName,
      customerName,
      customerEmail,
      customerPhone,
      propertyAddress,
      serviceType,
      requestNotes,
      requestId,
    }),
  });
} 