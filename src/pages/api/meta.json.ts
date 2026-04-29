import type { APIRoute } from 'astro';
import { getMeta } from '../../lib/data';

export const GET: APIRoute = () => {
  const meta = getMeta();
  return new Response(JSON.stringify(meta, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
