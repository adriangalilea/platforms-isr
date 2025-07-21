'use server';

import { redis } from '@/lib/redis';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { rootDomain, protocol } from '@/lib/utils';

export async function createSubdomainAction(
  prevState: any,
  formData: FormData
) {
  const subdomain = formData.get('subdomain') as string;

  if (!subdomain) {
    return { success: false, error: 'Subdomain is required' };
  }

  const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');

  if (sanitizedSubdomain !== subdomain) {
    return {
      subdomain,
      success: false,
      error:
        'Subdomain can only have lowercase letters, numbers, and hyphens. Please try again.'
    };
  }

  const subdomainAlreadyExists = await redis.get(
    `subdomain:${sanitizedSubdomain}`
  );
  if (subdomainAlreadyExists) {
    return {
      subdomain,
      success: false,
      error: 'This subdomain is already taken'
    };
  }

  await redis.set(`subdomain:${sanitizedSubdomain}`, true);

  redirect(`${protocol}://${sanitizedSubdomain}.${rootDomain}`);
}

export async function deleteSubdomainAction(
  prevState: any,
  formData: FormData
) {
  const subdomain = formData.get('subdomain');
  await redis.del(`subdomain:${subdomain}`);
  revalidatePath('/admin');
  return { success: 'Domain deleted successfully' };
}

export async function createSubdomainWithAppRouterAction(
  prevState: any,
  formData: FormData
) {
  const subdomain = formData.get('subdomain') as string;

  if (!subdomain) {
    return { success: false, error: 'Subdomain is required' };
  }

  const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');

  await redis.set(`subdomain:${sanitizedSubdomain}`, true);

  // This is the BROKEN approach - revalidatePath doesn't work for specific dynamic routes
  revalidatePath(`/s/${sanitizedSubdomain}`);
  
  return { 
    success: true, 
    redirectUrl: `${protocol}://${sanitizedSubdomain}.${rootDomain}` 
  };
}

export async function createSubdomainWithPagesRouterAction(
  prevState: any,
  formData: FormData
) {
  const subdomain = formData.get('subdomain') as string;

  if (!subdomain) {
    return { success: false, error: 'Subdomain is required' };
  }

  const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');

  await redis.set(`subdomain:${sanitizedSubdomain}`, true);

  // This is the WORKING approach - use Pages Router API
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_DOMAIN?.includes('localhost') 
    ? `http://${rootDomain}` 
    : `${protocol}://${rootDomain}`;
    
  await fetch(`${baseUrl}/api/revalidate-pages?subdomain=${sanitizedSubdomain}`, {
    method: 'GET'
  });
  
  return { 
    success: true, 
    redirectUrl: `${protocol}://${sanitizedSubdomain}.${rootDomain}` 
  };
}
