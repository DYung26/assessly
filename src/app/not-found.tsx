'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-8">
        {/* 404 Number */}
        <div className="space-y-2">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            404
          </h1>
          <p className="text-lg text-muted-foreground">Page not found</p>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <p className="text-foreground">
            We couldn&apos;t find the page you&apos;re looking for.
          </p>
          <p className="text-sm text-muted-foreground">
            It might have been moved or deleted. No worries, let&apos;s get you back on track.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-4">
          <Button
            onClick={() => router.push('/')}
            className="w-full"
            size="lg"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="w-full cursor-pointer"
            size="lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2 cursor-pointer" />
            Go Back
          </Button>
        </div>

        {/* Help text */}
        <p className="text-xs text-muted-foreground">
          If you think this is a mistake, please contact support.
        </p>
      </div>
    </div>
  );
}
