import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const API_KEY = 'cee377fb57c04699966622967181814a';
const DOMAIN = 'www.fllawnnetwork.com';
const BATCH_SIZE = 10; // Process URLs in batches to avoid rate limits

async function submitUrlsToIndexNow() {
  try {
    // Read the URLs file
    const filePath = path.join(process.cwd(), 'bing-urls.txt');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Split into lines and filter out empty lines
    const urls = fileContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    console.log(`Found ${urls.length} URLs to submit`);
    
    // Process in batches
    for (let i = 0; i < urls.length; i += BATCH_SIZE) {
      const batch = urls.slice(i, i + BATCH_SIZE);
      console.log(`Processing batch ${i/BATCH_SIZE + 1}/${Math.ceil(urls.length/BATCH_SIZE)}`);
      
      // Submit batch to IndexNow
      const response = await fetch('https://api.indexnow.org/IndexNow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: DOMAIN,
          key: API_KEY,
          keyLocation: `https://${DOMAIN}/${API_KEY}.txt`,
          urlList: batch
        })
      });
      
      if (response.ok) {
        console.log(`Batch ${i/BATCH_SIZE + 1} submitted successfully`);
      } else {
        const errorText = await response.text();
        console.error(`Error submitting batch ${i/BATCH_SIZE + 1}: ${response.status} ${errorText}`);
      }
      
      // Add a small delay between batches
      if (i + BATCH_SIZE < urls.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log('All URLs have been submitted to IndexNow');
  } catch (error) {
    console.error('Error submitting URLs to IndexNow:', error);
    process.exit(1);
  }
}

// Run the script
submitUrlsToIndexNow(); 