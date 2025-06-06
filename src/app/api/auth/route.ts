import { NextResponse } from 'next/server';

// Forward API requests to the Convex auth endpoint
export async function GET(request: Request) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return NextResponse.json({ error: "Convex URL not configured" }, { status: 500 });
  }
  
  try {
    // Forward the request to Convex
    const url = new URL(request.url);
    const authUrl = `${convexUrl}/api/auth${url.search}`;
    
    const response = await fetch(authUrl, {
      method: 'GET',
      headers: request.headers,
    });
    
    // Get the response data
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } else {
      const text = await response.text();
      return new NextResponse(text, { 
        status: response.status,
        headers: {
          'Content-Type': contentType || 'text/plain'
        }
      });
    }
  } catch (error) {
    console.error('Auth GET error:', error);
    return NextResponse.json({ error: "Authentication request failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return NextResponse.json({ error: "Convex URL not configured" }, { status: 500 });
  }
  
  try {
    // Clone the request body before reading it
    const clonedRequest = request.clone();
    const body = await clonedRequest.text();
    
    // Forward the request to Convex
    const authUrl = `${convexUrl}/api/auth`;
    
    const response = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...Object.fromEntries(request.headers)
      },
      body: body
    });
    
    // Get the response data
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } else {
      const text = await response.text();
      return new NextResponse(text, { 
        status: response.status,
        headers: {
          'Content-Type': contentType || 'text/plain'
        }
      });
    }
  } catch (error) {
    console.error('Auth POST error:', error);
    return NextResponse.json({ error: "Authentication request failed" }, { status: 500 });
  }
} 