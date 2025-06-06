import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '../../../../lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email, username } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const result = await sendWelcomeEmail({
      to: email,
      username: username || 'Valued Customer',
    });

    if (!result.success) {
      console.error('Failed to send welcome email:', result.error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Welcome email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in welcome email API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 