import { NextResponse } from 'next/server';

const API_KEY = 'cee377fb57c04699966622967181814a';
const DOMAIN = 'www.fllawnnetwork.com';

/**
 * Submits a URL to IndexNow to notify search engines of content changes
 * 
 * Example usage: 
 * fetch('/api/indexnow', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ urls: ['https://www.fllawnnetwork.com/lawn-care/orlando'] })
 * });
 */
export async function POST(request: Request) {
  try {
    const { urls } = await request.json();
    
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: 'No URLs provided' }, { status: 400 });
    }

    // Filter URLs to ensure they're from our domain
    const validUrls = urls.filter(url => 
      url.startsWith(`https://${DOMAIN}/`) || 
      url.startsWith(`http://${DOMAIN}/`)
    );

    if (validUrls.length === 0) {
      return NextResponse.json({ error: 'No valid URLs provided' }, { status: 400 });
    }

    // Submit URLs to IndexNow
    const response = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host: DOMAIN,
        key: API_KEY,
        keyLocation: `https://${DOMAIN}/${API_KEY}.txt`,
        urlList: validUrls
      })
    });

    if (response.ok) {
      return NextResponse.json({ 
        success: true, 
        message: 'URLs submitted successfully',
        urls: validUrls
      });
    } else {
      const errorData = await response.text();
      return NextResponse.json({ 
        error: `IndexNow API error: ${response.status}`, 
        details: errorData 
      }, { status: response.status });
    }
  } catch (error) {
    console.error('Error submitting URLs to IndexNow:', error);
    return NextResponse.json({ 
      error: 'Failed to submit URLs' 
    }, { status: 500 });
  }
} 