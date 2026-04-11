import { useState, useCallback } from 'react';

/**
 * Custom hook for managing pricing modal state.
 * 
 * Can be used by multiple components (UserMenu, SettingsDialog, etc.)
 * to share the same pricing modal open/close state.
 */
export function usePricingModal() {
  const [open, setOpen] = useState(false);

  const openModal = useCallback(() => {
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
  }, []);

  const toggleModal = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  return {
    open,
    openModal,
    closeModal,
    toggleModal,
    setOpen,
  };
}
