import { redis } from '@/lib/redis';

export async function getSubdomainData(subdomain: string) {
  const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
  const exists = await redis.get(`subdomain:${sanitizedSubdomain}`);
  return exists;
}

export async function getAllSubdomains() {
  const keys = await redis.keys('subdomain:*');

  if (!keys.length) {
    return [];
  }

  return keys.map((key) => {
    const subdomain = key.replace('subdomain:', '');
    return {
      subdomain
    };
  });
}
