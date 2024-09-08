import { headers } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { Webhook } from 'svix';

const secret = process.env.SVIX_SECRET || '';

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const payloadString = JSON.stringify(payload);
  const headerPayload = headers();
  const svixId = headerPayload.get('svix-id');
  const svixIdTimeStamp = headerPayload.get('svix-timestamp');
  const svixSignature = headerPayload.get('svix-signature');

  if (!svixId || !svixIdTimeStamp || !svixSignature) {
    console.log('svixId', svixId);
    console.log('svixIdTimeStamp', svixIdTimeStamp);
    console.log('svixSignature', svixSignature);
    return new NextResponse('Error occured', {
      status: 400,
    });
  }

  const svixHeaders = {
    'svix-id': svixId,
    'svix-timestamp': svixIdTimeStamp,
    'svix-signature': svixSignature,
  };

  if (!secret) {
    console.log('SVIX_SECRET is not found');
    return new NextResponse('Error occured', {
      status: 500,
    });
  }

  const wh = new Webhook(secret);
  let evt;

  try {
    evt = wh.verify(payloadString, svixHeaders);
  } catch (err) {
    console.log("Error: Can't verify the webhook");
    return new NextResponse('Error occured', {
      status: 400,
    });
  }

  console.log(evt);

  return new NextResponse('Success', {
    status: 200,
  });

  // Do something with the message...
}
