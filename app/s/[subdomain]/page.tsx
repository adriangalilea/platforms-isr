import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSubdomainData } from '@/lib/subdomains';
import { protocol, rootDomain } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2 } from 'lucide-react';

// Enable ISR with 24 hour cache
export const revalidate = 86400;
export const dynamic = 'force-static';

// Enable dynamic params for ISR
export async function generateStaticParams() {
  return []; // Return empty array to enable ISR for all paths
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ subdomain: string }>;
}): Promise<Metadata> {
  const { subdomain } = await params;
  const subdomainData = await getSubdomainData(subdomain);

  if (!subdomainData) {
    return {
      title: rootDomain
    };
  }

  return {
    title: `${subdomain}.${rootDomain}`,
    description: `Subdomain page for ${subdomain}.${rootDomain}`
  };
}

export default async function SubdomainPage({
  params
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  const subdomainData = await getSubdomainData(subdomain);

  if (!subdomainData) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Subdomain Active</AlertTitle>
        <AlertDescription className="text-green-700">
          The <span className="font-semibold">{subdomain}</span> subdomain is successfully loaded and cached.
        </AlertDescription>
      </Alert>
      
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Welcome to {subdomain}.{rootDomain}
        </h1>
        <p className="mt-3 text-lg text-gray-600">
          This is your custom subdomain page
        </p>
      </div>
    </div>
  );
}
