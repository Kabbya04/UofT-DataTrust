import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://civic-data-trust-backend.onrender.com/api/v1';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const body = await request.json();
    const { userId } = await params;
    
    // Get authorization header from the request
    const authHeader = request.headers.get('authorization');
    
    console.log('=== User Update Proxy Request ===');
    console.log('User ID:', userId);
    console.log('Update data:', body);
    console.log('Auth header present:', !!authHeader);
    console.log('Backend URL:', `${API_BASE_URL}/users/${userId}`);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    // Add authorization header if present
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
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
        { error: data.detail || data.message || 'Update failed' },
        { status: response.status }
      );
    }

    // Extract the user data from the nested response if needed
    const responseData = data.data || data;
    console.log('Extracted update data:', responseData);
    
    return NextResponse.json(responseData, { status: response.status });
  } catch (error) {
    console.error('=== User Update Proxy Error ===');
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    
    return NextResponse.json(
      { error: `Proxy error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}