import { NextRequest, NextResponse } from 'next/server';
import { sendQuoteRequestEmail } from '../../../../lib/email';

export async function POST(req: NextRequest) {
  try {
    const {
      providerEmail,
      providerName,
      customerName,
      customerEmail,
      customerPhone,
      propertyAddress,
      serviceType,
      requestNotes,
      requestId,
    } = await req.json();

    if (!providerEmail) {
      return NextResponse.json(
        { error: 'Provider email is required' },
        { status: 400 }
      );
    }

    if (!customerName || !customerEmail) {
      return NextResponse.json(
        { error: 'Customer information is required' },
        { status: 400 }
      );
    }

    if (!serviceType) {
      return NextResponse.json(
        { error: 'Service type is required' },
        { status: 400 }
      );
    }

    const result = await sendQuoteRequestEmail({
      to: providerEmail,
      providerName: providerName || 'Lawn Care Provider',
      customerName,
      customerEmail,
      customerPhone: customerPhone || 'Not provided',
      propertyAddress: propertyAddress || 'Not provided',
      serviceType,
      requestNotes: requestNotes || 'No additional notes provided.',
      requestId: requestId || `REQ-${Date.now().toString(36)}`,
    });

    if (!result.success) {
      console.error('Failed to send quote request email:', result.error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Quote request email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in quote request email API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 