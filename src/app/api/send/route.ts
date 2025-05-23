import { resend } from '@/lib/resend';


export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['robertsthomasd@gmail.com'],
      subject: 'Hello world',
      html: '<p>it works!</p>',
    });

    console.log('data', data, 'error', error);

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}