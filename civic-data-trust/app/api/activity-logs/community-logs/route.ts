import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://civic-data-trust-backend.onrender.com/api/v1';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const authHeader = request.headers.get('authorization');

    // Get pagination parameters with defaults
    const pageNumber = searchParams.get('pageNumber') || '1';
    const limit = searchParams.get('limit') || '10';

    // Build query string
    const queryString = `pageNumber=${pageNumber}&limit=${limit}`;
    const backendUrl = `${API_BASE_URL}/activity-logs/community-logs/?${queryString}`;

    console.log('=== Activity Logs Proxy Request ===');
    console.log('Auth header:', authHeader ? 'Present' : 'Missing');
    console.log('Query params:', queryString);
    console.log('Backend URL:', backendUrl);

    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers,
    });

    console.log('Backend response status:', response.status, response.statusText);

    let data;
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      data = await response.json();
      console.log('Activity logs response data:', data);
    } else {
      const text = await response.text();
      console.log('Backend response text:', text);
      data = { message: text };
    }

    if (!response.ok) {
      console.log('Backend error response:', data);

      // Enhanced error handling for activity logs
      let errorMessage = data.detail || data.message || 'Failed to fetch activity logs';

      if (response.status === 401) {
        errorMessage = 'Authentication failed. Please sign in again.';
      } else if (response.status === 403) {
        errorMessage = 'Access denied. You may not have permission to view activity logs.';
      } else if (response.status === 404) {
        errorMessage = 'Activity logs endpoint not found.';
      }

      return NextResponse.json(
        {
          error: errorMessage,
          backendStatus: response.status,
          backendError: data
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('=== Activity Logs Proxy Error ===');
    console.error('Error:', error);

    return NextResponse.json(
      { error: `Proxy error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}