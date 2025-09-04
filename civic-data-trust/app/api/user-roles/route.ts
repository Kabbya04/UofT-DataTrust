import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://civic-data-trust-backend.onrender.com/api/v1';

export async function GET(request: NextRequest) {
  try {
    console.log('=== User Roles Proxy Request ===');
    console.log('Backend URL:', `${API_BASE_URL}/user-roles/`);
    
    const response = await fetch(`${API_BASE_URL}/user-roles/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log('Backend response status:', response.status, response.statusText);
    console.log('Backend response headers:', Object.fromEntries(response.headers.entries()));

    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      data = await response.json();
      console.log('Backend response data:', data);
    } else {
      const text = await response.text();
      console.log('Backend response text:', text);
      data = { message: text };
    }
    
    if (!response.ok) {
      console.log('Backend error response:', data);
      return NextResponse.json(
        { error: data.detail || data.message || 'Failed to fetch user roles' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('=== User Roles Proxy Error ===');
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Full error:', error);
    
    return NextResponse.json(
      { error: `Proxy error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}