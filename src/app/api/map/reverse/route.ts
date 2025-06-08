import { NextRequest, NextResponse } from 'next/server';
import { mapService } from '../../../../lib/map-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Both lat and lng parameters are required' },
        { status: 400 }
      );
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json(
        { error: 'Invalid latitude or longitude values' },
        { status: 400 }
      );
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return NextResponse.json(
        { error: 'Latitude must be between -90 and 90, longitude between -180 and 180' },
        { status: 400 }
      );
    }

    const result = await mapService.reverseGeocode(latitude, longitude);

    if (!result) {
      return NextResponse.json({
        success: true,
        result: null,
        message: 'No address found for the given coordinates',
      });
    }

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('Reverse geocoding API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to reverse geocode coordinates',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { coordinates } = body;

    if (!coordinates || !Array.isArray(coordinates)) {
      return NextResponse.json(
        { error: 'Coordinates array is required' },
        { status: 400 }
      );
    }

    if (coordinates.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 coordinate pairs allowed per request' },
        { status: 400 }
      );
    }

    const results = [];
    
    // Process coordinates sequentially to respect rate limits
    for (const coord of coordinates) {
      if (!coord.lat || !coord.lng) {
        results.push({
          coordinates: coord,
          success: false,
          error: 'Invalid coordinate format. Expected {lat: number, lng: number}',
          result: null,
        });
        continue;
      }

      const latitude = parseFloat(coord.lat);
      const longitude = parseFloat(coord.lng);

      if (isNaN(latitude) || isNaN(longitude)) {
        results.push({
          coordinates: coord,
          success: false,
          error: 'Invalid latitude or longitude values',
          result: null,
        });
        continue;
      }

      if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        results.push({
          coordinates: coord,
          success: false,
          error: 'Latitude must be between -90 and 90, longitude between -180 and 180',
          result: null,
        });
        continue;
      }

      try {
        const result = await mapService.reverseGeocode(latitude, longitude);
        
        results.push({
          coordinates: coord,
          success: true,
          result,
        });
      } catch (error) {
        results.push({
          coordinates: coord,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          result: null,
        });
      }
    }

    return NextResponse.json({
      success: true,
      results,
      total: results.length,
    });
  } catch (error) {
    console.error('Batch reverse geocoding API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process batch reverse geocoding request',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 