import { resend } from '~/lib/resend';
import { renderWelcomeEmail, renderProviderConfirmationEmail, renderQuoteRequestEmail, renderBusinessClaimEmail } from './email-templates';

/**
 * Sends a welcome email to a new provider
 */
export async function sendProviderWelcomeEmail({ 
  name, 
  email 
}: { 
  name: string; 
  email: string; 
}) {
  // Skip email sending during build time or when no valid API key is available
  const hasValidApiKey = (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.startsWith('re_')) || 
                         (process.env.NEXT_PUBLIC_RESEND_API_KEY && process.env.NEXT_PUBLIC_RESEND_API_KEY.startsWith('re_'));
  
  if (!hasValidApiKey) {
    console.log('Skipping email send - no valid API key available');
    return { success: true, data: { id: 'build-time-skip' } };
  }

  try {
    const html = await renderWelcomeEmail({ name, email });
    
    const { data, error } = await resend.emails.send({
      from: 'Florida Lawn Network <contact@fllawnnetwork.com>',
      to: [email],
      subject: 'Welcome to the Lawn Care Directory!',
      html,
      replyTo: 'support@fllawnnetwork.com',
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception sending welcome email:', error);
    return { success: false, error };
  }
}

/**
 * Sends a confirmation email to a provider when their profile is approved
 */
export async function sendProviderConfirmationEmail({ 
  name, 
  email, 
  providerId 
}: { 
  name: string; 
  email: string; 
  providerId: string;
}) {
  // Skip email sending during build time or when no valid API key is available
  const hasValidApiKey = (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.startsWith('re_')) || 
                         (process.env.NEXT_PUBLIC_RESEND_API_KEY && process.env.NEXT_PUBLIC_RESEND_API_KEY.startsWith('re_'));
  
  if (!hasValidApiKey) {
    console.log('Skipping email send - no valid API key available');
    return { success: true, data: { id: 'build-time-skip' } };
  }

  try {
    const html = await renderProviderConfirmationEmail({ 
      name, 
      email, 
      providerId 
    });
    
    const { data, error } = await resend.emails.send({
      from: 'Florida Lawn Network <contact@fllawnnetwork.com>',
      to: [email],
      subject: 'Your Provider Profile is Confirmed!',
      html,
      replyTo: 'providers@fllawnnetwork.com',
    });

    if (error) {
      console.error('Error sending provider confirmation email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception sending provider confirmation email:', error);
    return { success: false, error };
  }
}

/**
 * Sends a quote request email to a provider
 */
export async function sendQuoteRequestEmail({ 
  name, 
  email, 
  phone, 
  message, 
  providerId,
  providerEmail
}: { 
  name: string; 
  email: string; 
  phone: string;
  message: string;
  providerId: string;
  providerEmail: string;
}) {
  // Skip email sending during build time or when no valid API key is available
  const hasValidApiKey = (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.startsWith('re_')) || 
                         (process.env.NEXT_PUBLIC_RESEND_API_KEY && process.env.NEXT_PUBLIC_RESEND_API_KEY.startsWith('re_'));
  
  if (!hasValidApiKey) {
    console.log('Skipping email send - no valid API key available');
    return { success: true, data: { id: 'build-time-skip' } };
  }

  try {
    const html = await renderQuoteRequestEmail({ 
      name, 
      email, 
      phone, 
      message, 
      providerId 
    });
    
    const { data, error } = await resend.emails.send({
      from: 'Florida Lawn Network <contact@fllawnnetwork.com>',
      to: [providerEmail],
      subject: `New Quote Request: Lawn Care Service`,
      html,
      replyTo: email,
    });

    if (error) {
      console.error('Error sending quote request email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception sending quote request email:', error);
    return { success: false, error };
  }
} 