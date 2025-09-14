import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://civic-data-trust-backend.onrender.com/api/v1';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    console.log('=== Engagement Count Proxy ===');
    console.log('Auth header:', authHeader ? 'Present' : 'Missing');

    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const response = await fetch(`${API_BASE_URL}/community/dashboard/engagement/`, {
      method: 'GET',
      headers,
    });

    console.log('Backend response status:', response.status, response.statusText);

    let data;
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      data = await response.json();
      console.log('Engagement count response:', data);
    } else {
      const text = await response.text();
      console.log('Backend response text:', text);
      data = { message: text };
    }

    if (!response.ok) {
      console.log('Backend error response:', data);
      return NextResponse.json(
        {
          error: data.detail || data.message || 'Failed to fetch engagement count',
          backendStatus: response.status,
          backendError: data
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('=== Engagement Count Proxy Error ===');
    console.error('Error:', error);

    return NextResponse.json(
      { error: `Proxy error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}