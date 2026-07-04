import type { APIRoute } from 'astro';

// This endpoint is deprecated due to Golden Middle Schema restructuring
export const POST: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      success: false,
      message:
        'Deprecated by Golden Schema. Social shares and media assets are no longer managed internally.',
    }),
    {
      status: 501,
      headers: { 'Content-Type': 'application/json' },
    },
  );
};
