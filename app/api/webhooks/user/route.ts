import { headers } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createUser } from '@/app/api/webhooks/user/userDatabase';

export async function POST(request: NextRequest) {
  const SECRET = process.env.SVIX_SECRET;

  if (!SECRET) {
    throw new Error('Failed to get the secret key from the environment variables');
  }

  // Get the headers
  const headerPayload = headers();

  const svixId = headerPayload.get('svix-id');
  const svixIdTimeStamp = headerPayload.get('svix-timestamp');
  const svixSignature = headerPayload.get('svix-signature');

  if (!svixId || !svixIdTimeStamp || !svixSignature) {
    console.error('Error in Svix headers:', { svixId, svixIdTimeStamp, svixSignature });
    return new NextResponse('Error occured -- no svix headers', {
      status: 400,
    });
  }

  const payload = await request.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixIdTimeStamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new NextResponse('Error occured', {
      status: 400,
    });
  }

  if (evt.type === 'user.created') {
    await createUser(evt.data.email_addresses[0].email_address);
  }

  return new NextResponse('Success', {
    status: 200,
  });

  // Do something with the message...
}
