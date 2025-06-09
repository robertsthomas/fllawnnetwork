import { Resend } from 'resend';

// Initialize Resend with a fallback for build time
const apiKey = process.env.RESEND_API_KEY || process.env.NEXT_PUBLIC_RESEND_API_KEY || 'dummy-key-for-build';

// Validate API key format (Resend keys start with 're_')
const isValidKey = apiKey.startsWith('re_') || apiKey === 'dummy-key-for-build';
const finalKey = isValidKey ? apiKey : 'dummy-key-for-build';

export const resend = new Resend(finalKey);
