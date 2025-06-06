import { NextRequest, NextResponse } from 'next/server';
import { sendProviderConfirmationEmail } from '../../../../lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email, providerName, providerEmail, profileUrl } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!providerName) {
      return NextResponse.json(
        { error: 'Provider name is required' },
        { status: 400 }
      );
    }

    const result = await sendProviderConfirmationEmail({
      to: email,
      providerName,
      providerEmail: providerEmail || email,
      profileUrl: profileUrl || '/',
    });

    if (!result.success) {
      console.error('Failed to send provider confirmation email:', result.error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Provider confirmation email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in provider confirmation email API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 