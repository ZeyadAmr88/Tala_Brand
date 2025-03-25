// This file defines environment variables for the application
// In JavaScript, we can't declare types like in TypeScript,
// but we can document the expected environment variables

/**
 * Environment variables for the application
 *
 * Expected variables:
 * - VITE_API_URL: The base URL for API requests
 *
 * Usage example:
 * import.meta.env.VITE_API_URL
 */

// Export a dummy object for documentation purposes
export const ENV_DOCUMENTATION = {
  VITE_API_URL: "https://tala-store.vercel.app",
}

// Note: The actual environment variables are accessed via import.meta.env
// This file serves as documentation only and doesn't affect runtime behavior

