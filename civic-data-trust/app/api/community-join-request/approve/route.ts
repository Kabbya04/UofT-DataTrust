import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://civic-data-trust-backend.onrender.com/api/v1';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');
    
    console.log('=== Approve Join Request Proxy ===');
    console.log('Request body:', body);
    console.log('Auth header:', authHeader ? 'Present' : 'Missing');
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    const response = await fetch(`${API_BASE_URL}/community-join-request/approve`, {
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
        { error: data.detail || data.message || 'Failed to approve join request' },
        { status: response.status }
      );
    }

    console.log('Join request approved successfully, now adding user to community');
    
    // Now we need to add the user to the community
    // First, get the join request details to find the user_id and community_id
    try {
      // Get the request details to find user_id and community_id
      const requestResponse = await fetch(`${API_BASE_URL}/community-join-request/${body.request_id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': authHeader || '',
        },
      });

      if (requestResponse.ok) {
        const requestData = await requestResponse.json();
        console.log('Join request details:', requestData);
        
        if (requestData && requestData.user_id && requestData.community_id) {
          // Add user to community
          const addUserResponse = await fetch(`${API_BASE_URL}/community/add-user`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': authHeader || '',
            },
            body: JSON.stringify({
              community_id: requestData.community_id,
              user_id: requestData.user_id
            }),
          });

          console.log('Add user to community response:', addUserResponse.status);
          
          if (addUserResponse.ok) {
            const addUserData = await addUserResponse.json();
            console.log('User added to community successfully:', addUserData);
          } else {
            console.error('Failed to add user to community:', await addUserResponse.text());
          }
        }
      }
    } catch (addUserError) {
      console.error('Error adding user to community:', addUserError);
      // Don't fail the approval if adding to community fails - just log it
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('=== Approve Join Request Proxy Error ===');
    console.error('Error:', error);
    
    return NextResponse.json(
      { error: `Proxy error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}