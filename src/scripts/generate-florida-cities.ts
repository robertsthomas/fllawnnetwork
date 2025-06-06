import { ConvexHttpClient } from 'convex/browser';
import fs from 'fs';
import path from 'path';
import { api } from '../../convex/_generated/api';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
  console.error('\x1b[31mError: NEXT_PUBLIC_CONVEX_URL environment variable is not set.\x1b[0m');
  console.error('Please make sure you have a .env or .env.local file with this variable defined.');
  console.error('Example: NEXT_PUBLIC_CONVEX_URL=https://your-deployment-id.convex.cloud');
  process.exit(1);
}

// Initialize the Convex client
const client = new ConvexHttpClient(CONVEX_URL);

async function generateFloridaCitiesJson() {
  try {
    console.log('Fetching Florida cities from Convex...');
    
    // Fetch cities from Convex API
    const cities = await client.query(api.providers.getFloridaCities);
    
    console.log(`Found ${cities.length} unique Florida cities.`);
    
    // Create the JSON structure
    const jsonData = {
      cities: cities
    };
    
    // Define the output file path
    const outputPath = path.join(process.cwd(), 'src/data/florida-cities.json');
    
    // Write the JSON file
    fs.writeFileSync(
      outputPath,
      JSON.stringify(jsonData, null, 2),
      'utf8'
    );
    
    console.log(`\x1b[32mSuccessfully generated Florida cities JSON at: ${outputPath}\x1b[0m`);
  } catch (error) {
    console.error('\x1b[31mError generating Florida cities JSON:\x1b[0m', error);
    process.exit(1);
  }
}

// Run the script
generateFloridaCitiesJson(); 