import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://civic-data-trust-backend.onrender.com/api/v1';

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const body = await request.json();

    console.log('=== Request Change Post Request Proxy ===');
    console.log('Auth header:', authHeader ? 'Present' : 'Missing');
    console.log('Request body:', body);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const backendUrl = `${API_BASE_URL}/community-post-request/request-change`;
    console.log('Sending to backend URL:', backendUrl);

    const response = await fetch(backendUrl, {
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

      let errorMessage = data.detail || data.message || 'Failed to request changes to post';

      if (response.status === 401) {
        errorMessage = 'Authentication failed. Please sign in again.';
      } else if (response.status === 403) {
        errorMessage = 'Access denied. You may not have permission to request changes to posts.';
      } else if (response.status === 404) {
        errorMessage = 'Post request not found.';
      } else if (response.status === 422) {
        // Handle FastAPI validation errors
        if (data.detail && Array.isArray(data.detail)) {
          const validationErrors = data.detail.map((err: any) => `${err.loc?.join('.')}: ${err.msg}`).join(', ');
          errorMessage = `Validation error: ${validationErrors}`;
        }
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
    console.error('=== Request Change Post Request Proxy Error ===');
    console.error('Error:', error);

    return NextResponse.json(
      { error: `Proxy error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}