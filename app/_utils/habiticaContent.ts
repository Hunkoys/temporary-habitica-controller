'use server';

import { habFetch } from '@/app/_utils/habitica';
import { Content } from '@/app/_utils/habiticaTypes';
import fs from 'fs/promises';
import path from 'path';

type Cache = {
  date: number;
  content: Content;
};

const location = path.join(process.cwd(), 'cache/content.json');

export async function getContent(cacheSeconds: number = 1): Promise<Content | null> {
  try {
    const file = await fs.readFile(location, 'utf-8');

    const cache: Cache = file ? JSON.parse(file) : { date: 0, content: null };

    if (cache.date + cacheSeconds * 1000 > Date.now() && cache.content !== null) {
      console.log('Using cached content');
      return cache.content;
    } else {
      const res = await habFetch('get', 'content', undefined, undefined, { revalidate: 0 });
      console.log('Fetching new content', res.status);
      const content = await res.json();
      if (!content) return null;
      fs.writeFile(
        location,
        JSON.stringify({
          date: Date.now(),
          content: content.data,
        }),
        'utf-8'
      );

      return content.data;
    }
  } catch (err) {
    console.error(err);
  }

  return null;
}
