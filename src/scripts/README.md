# Florida Cities Generator Script

This script queries your Convex database to extract unique Florida cities from provider data and generates a JSON file for use in the sitemap and routing.

## How It Works

1. The script connects to your Convex database using the `NEXT_PUBLIC_CONVEX_URL` environment variable
2. It calls the `getFloridaCities` query function to get all unique cities in Florida from your providers
3. It formats the data and saves it to `src/data/florida-cities.json`

## Running the Script

Make sure you have the proper environment variables set up in a `.env` or `.env.local` file:

```
NEXT_PUBLIC_CONVEX_URL=https://your-deployment-id.convex.cloud
```

Then run:

```bash
pnpm generate-cities
```

## When to Run

Run this script:
- After adding new providers to your database
- Before building your site for deployment to ensure the sitemap is up-to-date
- Any time you want to update the list of Florida cities based on your actual provider data

This ensures your sitemap and city pages accurately reflect the locations where you have providers. 