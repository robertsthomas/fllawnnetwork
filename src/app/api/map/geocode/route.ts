import { NextRequest, NextResponse } from 'next/server';
import { mapService } from '../../../../lib/map-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const florida = searchParams.get('florida') === 'true';

    if (!address) {
      return NextResponse.json(
        { error: 'Address parameter is required' },
        { status: 400 }
      );
    }

    let results;
    if (florida) {
      results = await mapService.geocodeInFlorida(address);
    } else {
      results = await mapService.geocode(address);
    }

    return NextResponse.json({
      success: true,
      results,
      count: results.length,
    });
  } catch (error) {
    console.error('Geocoding API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to geocode address',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { addresses, florida = false } = body;

    if (!addresses || !Array.isArray(addresses)) {
      return NextResponse.json(
        { error: 'Addresses array is required' },
        { status: 400 }
      );
    }

    if (addresses.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 addresses allowed per request' },
        { status: 400 }
      );
    }

    const results = [];
    
    // Process addresses sequentially to respect rate limits
    for (const address of addresses) {
      try {
        let geocodeResults;
        if (florida) {
          geocodeResults = await mapService.geocodeInFlorida(address);
        } else {
          geocodeResults = await mapService.geocode(address);
        }
        
        results.push({
          address,
          success: true,
          results: geocodeResults,
          count: geocodeResults.length,
        });
      } catch (error) {
        results.push({
          address,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          results: [],
          count: 0,
        });
      }
    }

    return NextResponse.json({
      success: true,
      results,
      total: results.length,
    });
  } catch (error) {
    console.error('Batch geocoding API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process batch geocoding request',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 