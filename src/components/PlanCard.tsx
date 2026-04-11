'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlanCardProps {
  name: string;
  displayPrice: string;
  billingFrequency: string;
  features: string[];
  badge?: string;
  savingsNote?: string;
  ctaLabel: string;
  isCurrentPlan?: boolean;
  isLoading?: boolean;
  onSelect?: () => void;
  isSelectable?: boolean;
}

/**
 * Reusable plan card component for displaying subscription plan options.
 *
 * Features:
 * - Current plan badge
 * - Recommended/best value badge
 * - Feature list with checkmarks
 * - Disabled state for free plan
 * - Loading state for checkout
 * - Responsive styling
 */
export function PlanCard({
  name,
  displayPrice,
  billingFrequency,
  features,
  badge,
  savingsNote,
  ctaLabel,
  isCurrentPlan = false,
  isLoading = false,
  onSelect,
  isSelectable = true,
}: PlanCardProps) {
  const isRecommended = badge === 'Best Value';

  return (
    <Card
      className={cn(
        'relative flex flex-col transition-all duration-200 min-h-[600px]',
        isCurrentPlan && 'ring-2 ring-primary',
        !isSelectable && 'opacity-75',
        isRecommended && 'bg-gradient-to-br from-primary/15 via-primary/8 to-background',
      )}
    >
      {/* Badge */}
      {(badge || isCurrentPlan) && (
        <div className="absolute -top-3 left-4 flex gap-2">
          {isCurrentPlan && (
            <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
              Current plan
            </span>
          )}
          {badge && !isCurrentPlan && (
            <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              {badge}
            </span>
          )}
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-xl">{name}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 space-y-4">
        {/* Price Section */}
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold">{displayPrice}</span>
            <span className="text-sm text-muted-foreground">{billingFrequency}</span>
          </div>
          {savingsNote && <p className="mt-2 text-sm text-green-600 dark:text-green-400">{savingsNote}</p>}
        </div>

        {/* CTA Button */}
        <Button
          onClick={onSelect}
          disabled={!isSelectable || isLoading}
          className="w-full cursor-pointer"
          variant={isCurrentPlan ? 'outline' : 'default'}
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Loading...
            </>
          ) : (
            ctaLabel
          )}
        </Button>

        {/* Features */}
        <div className="space-y-3">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
