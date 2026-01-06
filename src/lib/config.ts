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
  
  /**
   * Supported file formats for file uploads
   * Used in file input accept attributes
   */
  ACCEPTED_FILE_TYPES: [
    '.art', '.bat', '.brf', '.c', '.cls', '.css', '.diff', '.eml', '.es', 
    '.h', '.hs', '.htm', '.html', '.ics', '.ifb', '.java', '.js', '.json', 
    '.ksh', '.ltx', '.mail', '.markdown', '.md', '.mht', '.mhtml', '.mjs', 
    '.nws', '.patch', '.pdf', '.pl', '.pm', '.pot', '.py', '.rst', '.scala', 
    '.sh', '.shtml', '.srt', '.sty', '.tex', '.text', '.txt', '.vcf', '.vtt', 
    '.xml', '.yaml', '.yml'
  ].join(','),
} as const;
