import { NextResponse } from 'next/server';
import { submitCityToIndexNow } from '~/lib/indexnow';

/**
 * API route to update city data and submit to IndexNow
 * Call this whenever city content is updated
 */
export async function POST(request: Request) {
  try {
    const { citySlug } = await request.json();
    
    if (!citySlug) {
      return NextResponse.json({ error: 'City slug is required' }, { status: 400 });
    }

    // Notify search engines about the updated content
    const indexNowResponse = await submitCityToIndexNow(citySlug);
    
    if (!indexNowResponse.ok) {
      const errorText = await indexNowResponse.text();
      console.error(`Error submitting to IndexNow: ${errorText}`);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to submit to IndexNow',
        details: errorText
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Successfully submitted ${citySlug} to IndexNow` 
    });
  } catch (error) {
    console.error('Error updating city:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update city'
    }, { status: 500 });
  }
} 