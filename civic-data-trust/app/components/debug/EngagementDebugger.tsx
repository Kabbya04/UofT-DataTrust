"use client"

import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

export default function EngagementDebugger() {
  const [postId, setPostId] = useState('')
  const [results, setResults] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)

  const testAPI = async (endpoint: string, method: 'GET' | 'POST' | 'DELETE' = 'GET') => {
    setLoading(true)
    try {
      const token = localStorage.getItem('access_token')
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }

      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const url = endpoint.includes('?') 
        ? endpoint 
        : endpoint.includes('postId') 
          ? endpoint 
          : `${endpoint}${postId}`

      console.log(`🧪 Testing ${method} ${url}`)
      
      const response = await fetch(url, {
        method,
        headers
      })

      let data
      try {
        data = await response.json()
      } catch {
        data = await response.text()
      }
      
      setResults((prev: Record<string, any>) => ({
        ...prev,
        [endpoint]: {
          status: response.status,
          ok: response.ok,
          data,
          // Parse API response structure
          apiStatus: data?.status,
          apiMessage: data?.message,
          apiData: data?.data,
          // For like endpoints, show if it's a "like already exists" response
          likeExists: data?.status === false && data?.message === "Like already exists",
          // For count endpoints, show the actual count
          count: data?.data?.count
        }
      }))

      console.log(`📊 ${endpoint} result:`, { status: response.status, data })
    } catch (error) {
      console.error(`❌ ${endpoint} error:`, error)
      setResults((prev: Record<string, any>) => ({
        ...prev,
        [endpoint]: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }))
    } finally {
      setLoading(false)
    }
  }

  const testTokenParsing = () => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      setResults((prev: Record<string, any>) => ({
        ...prev,
        'token-test': { error: 'No access_token found in localStorage' }
      }))
      return
    }

    try {
      const cleanToken = token.replace(/^Bearer\s+/i, '')
      const parts = cleanToken.split('.')
      const payload = JSON.parse(atob(parts[1]))
      
      setResults((prev: Record<string, any>) => ({
        ...prev,
        'token-test': {
          status: 'success',
          payload,
          possibleUserIds: {
            sub: payload.sub,
            user_id: payload.user_id,
            id: payload.id,
            userId: payload.userId,
            uid: payload.uid,
            'user.id': payload.user?.id,
            'user.user_id': payload.user?.user_id
          }
        }
      }))
    } catch (error) {
      setResults((prev: Record<string, any>) => ({
        ...prev,
        'token-test': { 
          error: error instanceof Error ? error.message : 'Unknown token parsing error' 
        }
      }))
    }
  }

  if (!postId) {
    return (
      <Card className="m-4">
        <CardHeader>
          <CardTitle>🧪 Engagement API Debugger</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Post ID:</label>
              <input
                type="text"
                value={postId}
                onChange={(e) => setPostId(e.target.value)}
                placeholder="Enter a post ID to test"
                className="w-full p-2 border rounded"
              />
            </div>
            <Button 
              onClick={() => postId && setPostId(postId)} 
              disabled={!postId}
            >
              Start Testing
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>🧪 Testing Post ID: {postId}</CardTitle>
        <Button variant="outline" onClick={() => setPostId('')}>
          Change Post ID
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={() => testAPI(`/api/community-post-likes/count/${postId}`)}
              disabled={loading}
            >
              Get Likes Count
            </Button>
            <Button 
              onClick={() => testAPI(`/api/community-post-views/count/${postId}`)}
              disabled={loading}
            >
              Get Views Count
            </Button>
            <Button 
              onClick={() => testAPI(`/api/community-post-likes/${postId}`)}
              disabled={loading}
            >
              Get Likes List
            </Button>
            <Button 
              onClick={() => testAPI(`/api/community-post-views/${postId}`)}
              disabled={loading}
            >
              Get Views List
            </Button>
            <Button 
              onClick={testTokenParsing}
              disabled={loading}
            >
              Test Token Parsing
            </Button>
            <Button 
              onClick={() => testAPI(`/api/community-post-likes?postId=${postId}`, 'POST')}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600"
            >
              Add Like (POST)
            </Button>
            <Button 
              onClick={() => testAPI(`/api/community-post-likes?postId=${postId}`, 'DELETE')}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600"
            >
              Remove Like (DELETE)
            </Button>
            <Button 
              onClick={() => testAPI(`/api/community-post-views?postId=${postId}`, 'POST')}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Add View (POST)
            </Button>
            <Button 
              onClick={() => setResults({})}
              variant="outline"
              disabled={loading}
            >
              Clear Results
            </Button>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Results:</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
