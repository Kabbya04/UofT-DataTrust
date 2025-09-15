import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://civic-data-trust-backend.onrender.com/api/v1';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const { searchParams } = new URL(request.url);

    const pageNumber = searchParams.get('pageNumber') || '1';
    const limit = searchParams.get('limit') || '20';

    console.log('=== Get All Community Posts Proxy ===');
    console.log('Auth header:', authHeader ? 'Present' : 'Missing');
    console.log('Query params:', { pageNumber, limit });

    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    // Build URL with query parameters
    const queryString = new URLSearchParams({
      pageNumber,
      limit,
    }).toString();

    const backendUrl = `${API_BASE_URL}/community-post/?${queryString}`;
    console.log('Sending to backend URL:', backendUrl);

    const response = await fetch(backendUrl, {
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

      let errorMessage = data.detail || data.message || 'Failed to fetch community posts';

      if (response.status === 401) {
        errorMessage = 'Authentication failed. Please sign in again.';
      } else if (response.status === 403) {
        errorMessage = 'Access denied. You may not have permission to view community posts.';
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
    console.error('=== Get All Community Posts Proxy Error ===');
    console.error('Error:', error);

    return NextResponse.json(
      { error: `Proxy error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const body = await request.json();

    console.log('=== Create Community Post Proxy ===');
    console.log('Auth header:', authHeader ? 'Present' : 'Missing');
    console.log('Request body:', body);

    // Validate required fields based on new API schema
    const requiredFields = ['community_id', 'user_id', 'file_url', 'title', 'description', 'dataset_id'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Add timestamps if not provided (backend expects them)
    if (!body.created_at) {
      body.created_at = new Date().toISOString();
    }
    if (!body.updated_at) {
      body.updated_at = new Date().toISOString();
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const backendUrl = `${API_BASE_URL}/community-post/`;
    console.log('Sending to backend URL:', backendUrl);

    const response = await fetch(backendUrl, {
      method: 'POST',
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

      let errorMessage = data.detail || data.message || 'Failed to create community post';

      if (response.status === 401) {
        errorMessage = 'Authentication failed. Please sign in again.';
      } else if (response.status === 403) {
        errorMessage = 'Access denied. You may not have permission to create community posts.';
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
    console.error('=== Create Community Post Proxy Error ===');
    console.error('Error:', error);

    return NextResponse.json(
      { error: `Proxy error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}