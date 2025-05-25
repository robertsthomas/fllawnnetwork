import { resend } from '@/lib/resend';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    const { name, email, phone, message, providerId } = formData;
    
    // Construct the email content
    const subject = providerId 
      ? `New Contact Form Submission (Provider ID: ${providerId})`
      : 'New Contact Form Submission';
    
    const htmlContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      ${providerId ? `<p><strong>Provider ID:</strong> ${providerId}</p>` : ''}
      <h3>Message:</h3>
      <p>${message}</p>
    `;

    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['robertsthomasd@gmail.com'],
      subject: subject,
      html: htmlContent,
      replyTo: email,
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