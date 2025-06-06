/**
 * Utility for submitting URLs to IndexNow
 * This notifies search engines when content is added, updated, or deleted
 */

/**
 * Submit a single URL to IndexNow
 * @param url The URL to submit (must be absolute and include domain)
 * @returns Promise resolving to the response from the API
 */
export async function submitUrlToIndexNow(url: string): Promise<Response> {
  return submitUrlsToIndexNow([url]);
}

/**
 * Submit multiple URLs to IndexNow
 * @param urls Array of URLs to submit (must be absolute and include domain)
 * @returns Promise resolving to the response from the API
 */
export async function submitUrlsToIndexNow(urls: string[]): Promise<Response> {
  if (!urls || urls.length === 0) {
    throw new Error('No URLs provided');
  }

  try {
    // Call our internal API that handles the actual submission
    const response = await fetch('/api/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ urls }),
    });

    return response;
  } catch (error) {
    console.error('Error submitting URLs to IndexNow:', error);
    throw error;
  }
}

/**
 * Submit city page URL to IndexNow
 * Helper function specific to your city pages
 * @param citySlug The slug of the city
 * @returns Promise resolving to the response from the API
 */
export async function submitCityToIndexNow(citySlug: string): Promise<Response> {
  const url = `https://www.fllawnnetwork.com/lawn-care/${citySlug}`;
  return submitUrlToIndexNow(url);
} 