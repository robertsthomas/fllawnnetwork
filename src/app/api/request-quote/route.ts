import { resend } from '~/lib/resend';
import { NextRequest } from 'next/server';
import { validateFormData, sanitizeHTML } from '~/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    const { name, email, phone, message, providerId } = formData;
    
    // Validate form data
    const validation = validateFormData({
      name,
      email,
      phone,
      message
    });

    if (!validation.isValid) {
      return Response.json({ error: validation.errors.join(', ') }, { status: 400 });
    }

    // Sanitize all user input
    const sanitizedName = sanitizeHTML(name);
    const sanitizedEmail = sanitizeHTML(email);
    const sanitizedPhone = phone ? sanitizeHTML(phone) : '';
    const sanitizedMessage = sanitizeHTML(message);
    
    const subject = `New Quote Request (Provider ID: ${providerId})`;
    
    const htmlContent = `
      <h2>New Quote Request</h2>
      <p><strong>Name:</strong> ${sanitizedName}</p>
      <p><strong>Email:</strong> ${sanitizedEmail}</p>
      <p><strong>Phone:</strong> ${sanitizedPhone || 'Not provided'}</p>
      <p><strong>Provider ID:</strong> ${providerId}</p>
      <h3>Message:</h3>
      <p>${sanitizedMessage}</p>
    `;

    const { data, error } = await resend.emails.send({
      from: 'contact@fllawnnetwork.com',
      to: ['thomas.roberts@fllawnnetwork.com'],
      subject: subject,
      html: htmlContent,
      replyTo: sanitizedEmail,
    });

    if (error) {
      console.error('Resend API error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, data });
  } catch (error) {
    console.error('Server error:', error);
    return Response.json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 });
  }
} 