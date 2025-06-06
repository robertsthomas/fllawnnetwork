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