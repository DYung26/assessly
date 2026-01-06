/**
 * Application configuration constants
 * Sources values from environment variables with fallback defaults
 */

export const APP_CONFIG = {
  /**
   * The name of the AI assistant
   * Can be customized via NEXT_PUBLIC_ASSISTANT_NAME environment variable
   */
  ASSISTANT_NAME: process.env.NEXT_PUBLIC_ASSISTANT_NAME || 'Aslyn',
} as const;
