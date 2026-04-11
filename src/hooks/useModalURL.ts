import { useEffect, useState, useCallback } from 'react';

/**
 * Hook to manage modal state via URL hash.
 *
 * Usage:
 *   const { isOpen, open, close } = useModalURL('pricing');
 *   // Modal opens when URL contains #pricing
 *   // Call open() to navigate to #pricing
 *   // Call close() to remove the hash
 *
 * @param modalId - Unique identifier for this modal (e.g., 'pricing', 'confirm')
 * @returns { isOpen: boolean, open: () => void, close: () => void }
 */
export function useModalURL(modalId: string) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  // On mount, check if the modal should be open based on current hash
  useEffect(() => {
    setHasMounted(true);
    // Only run client-side to avoid hydration mismatch
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.slice(1); // Remove #
      setIsOpen(hash === modalId);
    }
  }, [modalId]);

  // Listen for hash changes (e.g., back/forward button)
  useEffect(() => {
    if (!hasMounted) return;

    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      setIsOpen(hash === modalId);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [modalId, hasMounted]);

  // Open modal by updating URL hash
  const open = useCallback(() => {
    // Use replace to avoid adding extra history entries for the initial open
    window.history.replaceState(null, '', `#${modalId}`);
    setIsOpen(true);
    // Dispatch a custom event to ensure state is updated across components
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }, [modalId]);

  // Close modal by removing hash
  const close = useCallback(() => {
    // Use replace to avoid adding extra history entries when closing
    window.history.replaceState(null, '', window.location.pathname);
    setIsOpen(false);
    // Dispatch a custom event to ensure state is updated across components
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }, []);

  // Handle Dialog's onOpenChange callback which passes boolean
  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      close();
    }
  }, [close]);

  return { isOpen, open, close, handleOpenChange };
}
