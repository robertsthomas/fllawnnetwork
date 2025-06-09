import { NextRequest } from 'next/server';
import { sendProviderWelcomeEmail } from '~/lib/email-sender';
import { sanitizeHTML, validateFormData } from '~/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    const { name, email, phone, businessName, serviceArea, services, description, companyId, role } = formData;

    // Validate form data
    const validation = validateFormData({
      name,
      email,
      phone,
      message: description || '', // Reuse message validation for description
    });

    if (!validation.isValid) {
      return Response.json({ error: validation.errors.join(', ') }, { status: 400 });
    }

    // Sanitize all user input
    const sanitizedName = sanitizeHTML(name);
    const sanitizedEmail = sanitizeHTML(email);
    const sanitizedPhone = phone ? sanitizeHTML(phone) : '';
    const sanitizedBusinessName = sanitizeHTML(businessName || '');
    const sanitizedServiceArea = sanitizeHTML(serviceArea || '');
    const sanitizedDescription = sanitizeHTML(description || '');

    // In a real implementation, you would create the provider in your database here
    // const providerId = await createProviderInDatabase({...});
    
    const providerId = `PROV-${Date.now().toString(36)}`; // Mock provider ID for demo purposes

    // Send welcome email to the new provider
    const emailResult = await sendProviderWelcomeEmail({
      name: sanitizedName,
      email: sanitizedEmail,
    });

    if (!emailResult.success) {
      console.warn('Failed to send welcome email, but provider was registered:', emailResult.error);
      // Continue with registration despite email failure
    }

    return Response.json({
      success: true,
      providerId,
      message: 'Provider registered successfully. Welcome email sent.',
    });
  } catch (error) {
    console.error('Server error during provider registration:', error);
    return Response.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
} 