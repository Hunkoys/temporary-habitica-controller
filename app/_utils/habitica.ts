const X_CLIENT = process.env.NEXT_PUBLIC_X_CLIENT;

type Credentials = { habId: string; apiKey: string };

export function habFetch(
  method: 'post' | 'get',
  endpoint: string,
  credentials?: Credentials,
  body?: any,
  fetchOptions: {
    revalidate?: number;
  } = { revalidate: Infinity }
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
    body: body ? JSON.stringify(body) : undefined,
    next: {
      revalidate: fetchOptions.revalidate,
    },
  });
}

export async function checkStatus() {
  const res = await habFetch('get', 'status');
  const body = await res.json();
  return body?.data?.status === 'up';
}

export async function getUserData(credentials: Credentials, filter?: string) {
  const res = await habFetch(
    'get',
    'user' + (filter ? '?' + new URLSearchParams({ userFields: filter }) : ''),
    credentials
  );
  const body = await res.json();
  return body.data;
}
