import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a backend datetime string into a human-readable format
 * @param datetime - ISO datetime string from backend (e.g., "2025-12-14T04:10:26.425846")
 * @param options - Intl.DateTimeFormatOptions for customizing the output
 * @returns Formatted date string
 *
 * @example
 * formatDateTime("2025-12-14T04:10:26.425846") // "Dec 14, 2025"
 * formatDateTime("2025-12-14T04:10:26.425846", { dateStyle: 'full' }) // "Saturday, December 14, 2025"
 */
export function formatDateTime(
  datetime: string | undefined | null,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!datetime) return "";

  try {
    const date = new Date(datetime);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return datetime; // Return original string if invalid
    }

    // Default options: medium date format
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options,
    };

    return date.toLocaleDateString(undefined, defaultOptions);
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return datetime; // Fallback to original string
  }
}

/**
 * Formats a backend datetime string with time included
 * @param datetime - ISO datetime string from backend
 * @returns Formatted date and time string
 *
 * @example
 * formatDateTimeWithTime("2025-12-14T04:10:26.425846") // "Dec 14, 2025, 4:10 AM"
 */
export function formatDateTimeWithTime(
  datetime: string | undefined | null
): string {
  if (!datetime) return "";

  return formatDateTime(datetime, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
