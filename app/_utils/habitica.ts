const X_CLIENT = process.env.NEXT_PUBLIC_X_CLIENT;

export type PlayerClass = 'warrior' | 'wizard' | 'healer' | 'rogue';
export const GEAR_TYPES = ['weapon', 'shield', 'head', 'armor', 'body', 'back', 'headAccessory', 'eyewear'] as const;
export type GearType = (typeof GEAR_TYPES)[number];
export type GearClass = 'base' | 'mystery' | 'armoire' | PlayerClass;

export const STATS = ['str', 'int', 'per', 'con'] as const;
export type Stats = {
  [key in (typeof STATS)[number]]: number;
};

type GearBase = Stats & {
  key: string;
};

export type Gear =
  | (GearBase & {
      type: Exclude<GearType, 'weapon'>;
      klass: GearClass;
    })
  | (GearBase & {
      type: 'weapon';
      klass: GearClass;
      twoHanded?: boolean;
    })
  | (GearBase & {
      type: Exclude<GearType, 'weapon'>;
      klass: 'special';
      specialClass?: GearClass;
    })
  | (GearBase & {
      type: 'weapon';
      klass: 'special';
      specialClass?: GearClass;
      twoHanded?: boolean;
    });

export type Content = {
  data: {
    gear: {
      flat: {
        [key: string]: Gear;
      };
    };
  };
};

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
