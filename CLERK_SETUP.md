# Clerk + Convex Setup Guide (Google OAuth Only)

This project has been migrated from Convex Auth to Clerk for authentication following the [official Convex + Clerk documentation](https://docs.convex.dev/auth/clerk#nextjs).

**This setup is configured for Google OAuth only** - users can only sign in/up with their Google accounts.

## 1. Clerk Dashboard Setup

### Step 1: Create Clerk Application
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application or use an existing one
3. **IMPORTANT**: Configure for Google OAuth only (see Step 1.5)

### Step 1.5: Configure Google OAuth Only
1. Navigate to **"User & Authentication" → "Social Connections"**
2. **Enable Google OAuth** and configure it with your Google OAuth credentials
3. **Disable all other authentication methods** (email/password, phone, other social providers)
4. Navigate to **"User & Authentication" → "Email, Phone, Username"**
5. **Disable email/password authentication** completely
6. **Disable phone authentication** if enabled
7. This ensures users can ONLY sign in with Google

### Step 2: Create JWT Template (CRITICAL)
1. In the Clerk Dashboard, navigate to **JWT Templates** page
2. Select **New template** and choose **Convex** from the template list
3. **IMPORTANT**: Do NOT rename the JWT token. It must be called `convex`
4. Copy and save the **Issuer** URL (your Clerk Frontend API URL)
   - Development format: `https://verb-noun-00.clerk.accounts.dev`
   - Production format: `https://clerk.<your-domain>.com`

### Step 3: Get API Keys
1. Navigate to **API Keys** page in Clerk Dashboard
2. Copy your **Publishable Key**
3. Copy your **Secret Key**

## 2. Environment Variables

Create a `.env.local` file in your project root with the following:

```bash
# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# Clerk Frontend API URL (from JWT Template issuer)
NEXT_PUBLIC_CLERK_FRONTEND_API_URL=https://verb-noun-00.clerk.accounts.dev

# Convex Configuration
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url_here

# Clerk Redirect URLs (Important for custom pages)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/admin/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/admin/setup
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL=/
```

**Important**: The redirect URL environment variables are crucial for proper logout behavior. Without them, Clerk may redirect to its hosted pages instead of your custom pages.

## 3. Convex Configuration

The project includes `convex/auth.config.ts` which configures Convex to validate Clerk JWTs:

```typescript
export default {
  providers: [
    {
      domain: process.env.NEXT_PUBLIC_CLERK_FRONTEND_API_URL,
      applicationID: "convex",
    },
  ],
};
```

Deploy this configuration:
```bash
npx convex dev
```

## 4. Key Implementation Details

### Authentication Components
Following the [official docs](https://docs.convex.dev/auth/clerk#nextjs), this project uses:

- **ConvexProviderWithClerk**: Connects Clerk auth with Convex
- **Convex Auth Components**: `<Authenticated>`, `<Unauthenticated>`, `<AuthLoading>` from `convex/react`
- **useConvexAuth()**: Instead of Clerk's `useAuth()` for checking auth state

### Authentication Flow (Google Only)
1. User clicks "Sign in with Google" on any auth page
2. Clerk redirects to Google OAuth
3. User authorizes with Google
4. Clerk creates/signs in user and returns to app
5. `ConvexProviderWithClerk` fetches auth token from Clerk
6. Convex backend validates the JWT using the configured domain
7. `useConvexAuth()` returns `isAuthenticated: true`

### Logout Flow
- When users logout from admin dashboard, they are redirected to `/admin/login`
- This is configured using Clerk's `signOut({ redirectUrl: '/admin/login' })` option
- Prevents redirect to Clerk's hosted sign-in page

### User Management (Google Only)
- **Admin Setup**: `/admin/setup` - Google OAuth signup + admin record creation
- **Admin Login**: `/admin/login` - Google OAuth signin only
- **Provider Login**: `/providers/login` - Google OAuth signin only
- **Provider Signup**: `/providers/signup` - Google OAuth signup only

### Database Schema
- Removed Convex Auth tables
- Updated `userId` fields to use Clerk user IDs (strings)
- Admin and provider records link to `identity.subject` from Clerk JWTs
- User emails come from Google OAuth profile

## 5. Testing the Setup

1. Ensure environment variables are set in `.env.local`
2. Deploy Convex config: `npx convex dev`
3. Start development server: `pnpm dev`
4. Visit `/admin/setup` and click "Sign up with Google"
5. Complete Google OAuth flow
6. Create admin account with your name
7. Test authentication flows

## 6. Production Configuration

### Development vs Production

**Development:**
- Clerk keys: `pk_test_...`, `sk_test_...`
- Frontend API URL: `https://verb-noun-00.clerk.accounts.dev`

**Production:**
- Clerk keys: `pk_live_...`, `sk_live_...`
- Frontend API URL: `https://clerk.<your-domain>.com`

Update environment variables in your hosting platform (Vercel, Netlify, etc.)

## 7. Troubleshooting

### Common Issues

**`useConvexAuth()` returns `isAuthenticated: false` after Google login:**
- Check that `auth.config.ts` domain matches your Clerk Frontend API URL
- Ensure you ran `npx convex dev` after creating the config
- Verify the JWT template is named exactly `convex`

**Google OAuth not working:**
- Confirm Google OAuth is enabled in Clerk Dashboard
- Verify all other auth methods are disabled
- Check that your Google OAuth credentials are correctly configured

**Authentication errors:**
- Confirm environment variables are set correctly in `.env.local`
- Check Clerk Dashboard → JWT Templates → Convex template configuration
- Verify your domain is allowed in Clerk settings

## 8. Key Differences from Standard Clerk Integration

1. **Use ConvexProviderWithClerk** instead of regular ConvexProvider
2. **Use Convex auth components** (`<Authenticated>`) instead of Clerk's (`<SignedIn>`)
3. **Use useConvexAuth()** instead of Clerk's `useAuth()`
4. **JWT Template must be named "convex"** exactly
5. **Google OAuth only** - no email/password or other social providers

## 9. Google OAuth Configuration

### In Google Cloud Console:
1. Create a new project or use existing
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add authorized redirect URIs:
   - Development: `https://verb-noun-00.clerk.accounts.dev/v1/oauth_callback`
   - Production: `https://clerk.<your-domain>.com/v1/oauth_callback`

### In Clerk Dashboard:
1. Go to "Social Connections" → "Google"
2. Enter your Google OAuth Client ID and Client Secret
3. Save configuration

## References

- [Convex + Clerk Documentation](https://docs.convex.dev/auth/clerk#nextjs)
- [Clerk Next.js Quickstart](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk Google OAuth Setup](https://clerk.com/docs/authentication/social-connections/google)
- [Example Repository](https://github.com/get-convex/template-nextjs-clerk) 