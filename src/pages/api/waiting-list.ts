import type { APIRoute } from 'astro';

// This endpoint is deprecated due to Golden Middle Schema restructuring
export const POST: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      error: 'Deprecated by Golden Schema. Waiting list is no longer managed via this database.',
    }),
    {
      status: 501,
      headers: { 'Content-Type': 'application/json' },
    },
  );
};
