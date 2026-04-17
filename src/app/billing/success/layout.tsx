import { Suspense } from 'react';

export default function BillingSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      {children}
    </Suspense>
  );
}
