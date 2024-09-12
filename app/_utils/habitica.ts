const X_CLIENT = process.env.NEXT_PUBLIC_X_CLIENT;

export function habFetch(
  method: 'post' | 'get',
  endpoint: string,
  credentials?: { habId: string; apiKey: string },
  body?: any
) {
  const credentialHeaders:
    | {}
    | {
        'x-api-user': string;
        'x-api-key': string;
      } = credentials ? { 'x-api-user': credentials.habId, 'x-api-key': credentials.apiKey } : {};

  return fetch(`https://habitica.com/api/v3/${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-client': X_CLIENT || '',
      ...credentialHeaders,
    },
  });
}

export async function checkStatus() {
  const res = await habFetch('get', 'status');
  const body = await res.json();
  return body?.data?.status === 'up';
}
