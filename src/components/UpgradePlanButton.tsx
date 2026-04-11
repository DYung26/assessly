'use client';

import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';

interface UpgradePlanButtonProps extends React.ComponentProps<'button'> {
  label?: string;
  showIcon?: boolean;
  onClick?: () => void;
}

/**
 * Upgrade button for opening the pricing modal.
 * 
 * This is a presentational component that just triggers
 * the parent's onClick handler. The parent (UserMenu, SettingsDialog)
 * is responsible for managing the pricing modal state.
 */
export function UpgradePlanButton({ 
  label = 'Upgrade Plan',
  showIcon = false,
  onClick,
  className,
  ...props 
}: UpgradePlanButtonProps) {
  return (
    <Button 
      onClick={onClick}
      variant="ghost"
      className={className || "gap-2 cursor-pointer"}
      {...props}
    >
      {showIcon && <Rocket size={16} />}
      {label}
    </Button>
  );
}

