import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://civic-data-trust-backend.onrender.com/api/v1';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    console.log('=== Dataset Upload Proxy ===');
    console.log('Auth header:', authHeader ? 'Present' : 'Missing');
    console.log('Content-Type:', request.headers.get('content-type'));

    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '');
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token payload:', {
          user_id: payload.sub,
          exp: new Date(payload.exp * 1000).toISOString(),
          type: payload.type
        });
      } catch (e) {
        console.error('Failed to decode token:', e);
      }
    }

    // Get the FormData from the request
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log('File details:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    // Validate file size (5GB limit)
    const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5GB in bytes
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum file size is 5GB.' },
        { status: 413 }
      );
    }

    // Create new FormData for backend request
    const backendFormData = new FormData();
    backendFormData.append('file', file);

    // Debug: Log FormData contents
    console.log('FormData entries:');
    for (const [key, value] of backendFormData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File(name="${value.name}", size=${value.size}, type="${value.type}")`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }

    const headers: Record<string, string> = {};

    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const backendUrl = `${API_BASE_URL}/datasets/create`;
    console.log('Sending to backend URL:', backendUrl);

    // Try the exact path from the OpenAPI spec
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers,
      body: backendFormData,
    });

    console.log('Request details:');
    console.log('- Method:', 'POST');
    console.log('- URL:', backendUrl);
    console.log('- Headers:', headers);
    console.log('- Body type:', backendFormData.constructor.name);

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
      console.log('=== BACKEND ERROR DETAILS ===');
      console.log('Status:', response.status, response.statusText);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      console.log('Backend error response:', JSON.stringify(data, null, 2));

      // Enhanced error handling
      let errorMessage = data.detail || data.message || 'Failed to upload dataset';

      if (response.status === 400) {
        // Try to extract more specific error information
        if (data.detail && Array.isArray(data.detail)) {
          const validationErrors = data.detail.map((err: any) => `${err.loc?.join('.')}: ${err.msg}`).join(', ');
          errorMessage = `Validation error: ${validationErrors}`;
        } else {
          errorMessage = 'Bad request. Please check your file format and try again.';
        }
      } else if (response.status === 413) {
        errorMessage = 'File too large. Maximum file size is 5GB.';
      } else if (response.status === 415) {
        errorMessage = 'Unsupported file type. Please check the file format.';
      } else if (response.status === 401) {
        errorMessage = 'Authentication failed. Please sign in again.';
      } else if (response.status === 403) {
        errorMessage = 'Access denied. You may not have permission to upload datasets.';
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
    console.error('=== Dataset Upload Proxy Error ===');
    console.error('Error:', error);

    return NextResponse.json(
      { error: `Proxy error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}