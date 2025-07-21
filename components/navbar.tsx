'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Home } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const [subdomain, setSubdomain] = useState('');
  const [rootDomain, setRootDomain] = useState('/');
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const host = window.location.host;
      const protocol = window.location.protocol;
      
      // Extract subdomain if present
      if (host.includes('.localhost')) {
        const sub = host.split('.')[0];
        setSubdomain(sub);
      }
      
      // Calculate root domain
      let root = host;
      if (host.includes('.localhost')) {
        // Remove subdomain from x.localhost:3000 -> localhost:3000
        root = host.substring(host.indexOf('.') + 1);
      } else if (host.split('.').length >= 3) {
        // For production domains like sub.example.com -> example.com
        const parts = host.split('.');
        root = parts.slice(-2).join('.');
      }
      
      setRootDomain(`${protocol}//${root}`);
    }
  }, [pathname]);
  
  const handleSubdomainNavigation = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && subdomain) {
      const baseHost = rootDomain.replace(/^https?:\/\//, '');
      const protocol = window.location.protocol;
      
      if (subdomain.toLowerCase() === 'home' || subdomain === '') {
        window.location.href = rootDomain;
      } else {
        window.location.href = `${protocol}//${subdomain}.${baseHost}`;
      }
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between h-16">
          <h1 className="text-xl font-bold">revalidatePath Bug Demo</h1>
          
          <div className="flex items-center gap-4">
            <Input
              type="text"
              placeholder="Enter subdomain..."
              value={subdomain}
              onChange={(e) => setSubdomain(e.target.value)}
              onKeyDown={handleSubdomainNavigation}
              className="w-48"
            />
            
            <Button asChild variant="outline" size="icon">
              <Link href={rootDomain}>
                <Home className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}