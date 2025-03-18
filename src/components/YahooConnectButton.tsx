'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/components/ui/use-toast';
import { getYahooAuthUrl } from '@/lib/yahoo/client';

export function YahooConnectButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      const authUrl = await getYahooAuthUrl();
      window.location.href = authUrl;
    } catch (err) {
      console.error('Error connecting to Yahoo:', err);
      toast({
        title: 'Error',
        description:
          err instanceof Error
            ? err.message
            : 'Failed to connect to Yahoo',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleConnect}
      disabled={isLoading}
      className="w-full sm:w-auto"
    >
      {isLoading ? (
        <>
          <LoadingSpinner className="mr-2" />
          Connecting...
        </>
      ) : (
        'Connect to Yahoo'
      )}
    </Button>
  );
}
