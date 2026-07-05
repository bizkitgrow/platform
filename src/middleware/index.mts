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

export const authMiddleware = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  
  if (url.pathname.startsWith('/admin')) {
    const basicAuth = context.request.headers.get('authorization');
    
    // We cannot use import.meta.env reliably in all Astro middleware edge cases without the Env mapping, 
    // but process.env is usually injected by Vercel for Node/Edge endpoints if properly configured. 
    // Fallback securely.
    const adminUser = process.env.ADMIN_USERNAME || import.meta.env.ADMIN_USERNAME;
    const adminPass = process.env.ADMIN_PASSWORD || import.meta.env.ADMIN_PASSWORD;

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');

      if (user === adminUser && pwd === adminPass) {
        return next();
      }
    }

    return new Response('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Bizkitgrow Admin"',
      },
    });
  }

  return next();
});

export const onRequest = sequence(errorHandlerMiddleware, authMiddleware, cacheMiddleware);
