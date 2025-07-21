'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { rootDomain, protocol } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useActionState } from 'react';
import { createSubdomainWithAppRouterAction, createSubdomainWithPagesRouterAction } from '@/app/actions';

type ActionState = {
  error?: string;
  success?: boolean;
  redirectUrl?: string;
};

function CreateForm({ 
  subdomain, 
  action, 
  title, 
  description,
  variant = 'default'
}: { 
  subdomain: string;
  action: any;
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
}) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    action,
    {}
  );

  useEffect(() => {
    if (state?.success && state?.redirectUrl) {
      window.location.href = state.redirectUrl;
    }
  }, [state]);

  return (
    <div className={`rounded-lg border p-6 ${
      variant === 'destructive' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'
    }`}>
      <h3 className={`font-semibold mb-2 ${
        variant === 'destructive' ? 'text-red-800' : 'text-green-800'
      }`}>
        {title}
      </h3>
      <p className={`text-sm mb-4 ${
        variant === 'destructive' ? 'text-red-700' : 'text-green-700'
      }`}>
        {description}
      </p>
      <form action={formAction}>
        <input type="hidden" name="subdomain" value={subdomain} />
        <Button 
          type="submit" 
          disabled={isPending}
          variant={variant === 'destructive' ? 'destructive' : 'default'}
          className="w-full"
        >
          {isPending ? 'Creating...' : `Create ${subdomain}`}
        </Button>
      </form>
      {state?.error && (
        <p className="text-sm text-red-600 mt-2">{state.error}</p>
      )}
    </div>
  );
}

export default function NotFound() {
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Extract subdomain from URL if we're on a subdomain page
    if (pathname?.startsWith('/subdomain/')) {
      const extractedSubdomain = pathname.split('/')[2];
      if (extractedSubdomain) {
        setSubdomain(extractedSubdomain);
      }
    } else {
      // Try to extract from hostname for direct subdomain access
      const hostname = window.location.hostname;
      if (hostname.includes(`.${rootDomain.split(':')[0]}`)) {
        const extractedSubdomain = hostname.split('.')[0];
        setSubdomain(extractedSubdomain);
      }
    }
  }, [pathname]);

  if (!subdomain) {
    return (
      <div className="space-y-6">
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">404 - Page Not Found</AlertTitle>
          <AlertDescription className="text-red-700">
            This page could not be found.
          </AlertDescription>
        </Alert>
        
        <div className="text-center">
          <Button asChild>
            <Link href={`${protocol}://${rootDomain}`}>
              Go to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Alert className="border-red-200 bg-red-50">
        <XCircle className="h-4 w-4 text-red-600" />
        <AlertTitle className="text-red-800">404 - Subdomain Not Found</AlertTitle>
        <AlertDescription className="text-red-700">
          The <strong>{subdomain}</strong> subdomain doesn't exist. Choose a method below to create it.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CreateForm
          subdomain={subdomain}
          action={createSubdomainWithAppRouterAction}
          title="❌ App Router (Broken)"
          description="Uses revalidatePath() - This will create the subdomain but show 404 until the server restarts."
          variant="destructive"
        />
        
        <CreateForm
          subdomain={subdomain}
          action={createSubdomainWithPagesRouterAction}
          title="✅ Pages Router (Works)"
          description="Uses res.revalidate() API - This will create the subdomain and work immediately."
          variant="default"
        />
      </div>
    </div>
  );
}