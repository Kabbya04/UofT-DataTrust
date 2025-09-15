import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://civic-data-trust-backend.onrender.com/api/v1';

// TypeScript interfaces for community post views
interface CommunityPostView {
  id: string;
  community_post_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const { searchParams } = new URL(request.url);

    const postId = searchParams.get('postId');

    console.log('=== Add Community Post View Proxy ===');
    console.log('Auth header:', authHeader ? 'Present' : 'Missing');
    console.log('Post ID:', postId);

    if (!postId) {
      return NextResponse.json(
        { error: 'Missing required parameter: postId' },
        { status: 400 }
      );
    }

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const backendUrl = `${API_BASE_URL}/community-post-views/?postId=${encodeURIComponent(postId)}`;
    console.log('Sending to backend URL:', backendUrl);

    const response = await fetch(backendUrl, {
      method: 'POST',
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

      let errorMessage = data.detail || data.message || 'Failed to add view';

      if (response.status === 401) {
        errorMessage = 'Authentication failed. Please sign in again.';
      } else if (response.status === 403) {
        errorMessage = 'Access denied. You may not have permission to add views.';
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
    console.error('=== Add Community Post View Proxy Error ===');
    console.error('Error:', error);

    return NextResponse.json(
      { 
        error: `Proxy error: ${error instanceof Error ? error.message : 'Unknown error'}`
      },
      { status: 500 }
    );
  }
}