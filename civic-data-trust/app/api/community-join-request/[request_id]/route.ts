import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://civic-data-trust-backend.onrender.com/api/v1';

interface RouteContext {
  params: Promise<{
    request_id: string;
  }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const params = await context.params;
    const { request_id } = params;
    const authHeader = request.headers.get('authorization');
    
    console.log('=== Get Join Request By ID Proxy ===');
    console.log('Request ID:', request_id);
    console.log('Auth header:', authHeader ? 'Present' : 'Missing');
    
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    const response = await fetch(`${API_BASE_URL}/community-join-request/${request_id}`, {
      method: 'GET',
      headers,
    });

    console.log('Backend response status:', response.status, response.statusText);

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
        { error: data.detail || data.message || 'Failed to get join request' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('=== Get Join Request By ID Proxy Error ===');
    console.error('Error:', error);
    
    return NextResponse.json(
      { error: `Proxy error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}