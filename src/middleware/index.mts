import { sequence } from 'astro:middleware';
import { defineMiddleware } from 'astro:middleware';
import { onRequest as cacheMiddleware } from './cache.mts';

export const errorHandlerMiddleware = defineMiddleware(async (context, next) => {
  const requestId = crypto.randomUUID();
  try {
    const response = await next();
    return response;
  } catch (error: any) {
    console.error(`[GLOBAL_ERROR] RequestId: ${requestId} - ${error.stack || error.message}`);

    // Specific error mapping for ResellPortal API failures
    if (error.message === 'Rate limit exceeded') {
      return new Response(JSON.stringify({ error: 'Too Many Requests', requestId }), {
        status: 429,
        headers: { 'Content-Type': 'application/json', 'Retry-After': '60' },
      });
    }

    if (error.message === 'Invalid signature') {
      return new Response(JSON.stringify({ error: 'Unauthorized', requestId }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Internal Server Error', requestId }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

export const onRequest = sequence(errorHandlerMiddleware, cacheMiddleware);
