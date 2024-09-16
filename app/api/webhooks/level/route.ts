import fs from 'fs/promises';
import path from 'path';

import { NextRequest } from 'next/server';

const location = path.join(process.cwd(), '/app/api/webhooks/level/webhook.json');
export async function POST(request: NextRequest) {
  const payload = await request.json();
  // save to file system

  fs.appendFile(location, JSON.stringify(payload, null, 2));
  fs.appendFile(location, '\n');
  return new Response('Success', { status: 200 });
}
