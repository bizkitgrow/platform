import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Configure rate limit (10 requests per minute per IP or globally if IP is unavailable)
const resellportalRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1m'),
  prefix: 'resellportal_api',
});

const API_KEY = process.env.RESELLPORTAL_API_KEY;

export const resellportalAPI = {
  order: async (data: any, ip = 'global') => {
    const { success } = await resellportalRatelimit.limit(`order_${ip}`);
    if (!success) throw new Error('Rate limit exceeded');

    return fetch('https://panel.resellportal.com/api/orders', {
      method: 'POST',
      headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  provision: async (sku: string, data: any, ip = 'global') => {
    const { success } = await resellportalRatelimit.limit(`provision_${ip}`);
    if (!success) throw new Error('Rate limit exceeded');

    return fetch(`https://panel.resellportal.com/api/provision/${sku}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  balance: async (ip = 'global') => {
    const { success } = await resellportalRatelimit.limit(`balance_${ip}`);
    if (!success) throw new Error('Rate limit exceeded');

    return fetch('https://panel.resellportal.com/api/balance', {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
  },
};
