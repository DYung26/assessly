'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useCanUseFeature } from '@/hooks/useEntitlements';
import type { ComponentProps } from 'react';

interface FeatureLockedButtonProps
  extends ComponentProps<typeof Button> {
  featureName: 'audio_to_text' | 'realtime_voice_agent';
  lockedTooltip?: string;
}

/**
 * A button that is disabled when a feature is not available on the user's plan.
 *
 * When disabled, shows a tooltip explaining the feature is unavailable and suggests upgrading.
 * For Pro users (feature enabled), button works normally.
 *
 * Usage:
 *   <FeatureLockedButton
 *     featureName="audio_to_text"
 *     onClick={handleAudioClick}
 *     lockedTooltip="Audio-to-text is available on Pro."
 *   >
 *     Record Audio
 *   </FeatureLockedButton>
 */
export function FeatureLockedButton({
  featureName,
  children,
  lockedTooltip,
  disabled,
  ...props
}: FeatureLockedButtonProps) {
  const isFeatureEnabled = useCanUseFeature(featureName);
  const isDisabled = !isFeatureEnabled || disabled;

  const defaultTooltips: Record<string, string> = {
    audio_to_text:
      'Audio-to-text is available on Pro. Upgrade to use this feature.',
    realtime_voice_agent:
      'Realtime voice agent is available on Pro. Upgrade to use this feature.',
  };

  const tooltip = lockedTooltip || defaultTooltips[featureName];

  // If feature is enabled, render button normally without tooltip
  if (isFeatureEnabled) {
    return (
      <Button disabled={disabled} {...props}>
        {children}
      </Button>
    );
  }

  // Feature is locked - show disabled button with tooltip
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button disabled={isDisabled} {...props}>
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
