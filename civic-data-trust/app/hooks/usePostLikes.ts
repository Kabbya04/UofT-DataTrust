"use client"

import { useState, useEffect, useCallback } from 'react'

interface PostLikes {
  likesCount: number
  isLiked: boolean
}

export function usePostLikes(postId: string) {
  const [likes, setLikes] = useState<PostLikes>({
    likesCount: 0,
    isLiked: false
  })
  const [loading, setLoading] = useState(false)

  const fetchLikesData = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token')
      console.log('📊 Fetching likes data for post:', postId)
      console.log('🔑 Token available:', !!token)
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }

      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const [likesResponse, userLikesResponse] = await Promise.all([
        fetch(`/api/community-post-likes/count/${postId}`, { headers }),
        fetch(`/api/community-post-likes/${postId}`, { headers })
      ])

      console.log('📈 Likes response status:', likesResponse.status)
      console.log('👤 User likes response status:', userLikesResponse.status)

      if (likesResponse.ok) {
        const likesData = await likesResponse.json()
        console.log('📈 Likes data received:', likesData)
        // API returns: { status: true, message: "...", data: { count: number } }
        const count = likesData.data?.count || 0
        console.log('📈 Parsed likes count:', count)
        setLikes(prev => ({
          ...prev,
          likesCount: count
        }))
      } else {
        console.error('❌ Failed to fetch likes count:', await likesResponse.text())
      }

      // Check if current user has liked this post
      if (userLikesResponse.ok && token) {
        const userLikesData = await userLikesResponse.json()
        console.log('👤 User likes data received:', userLikesData)
        const currentUserId = getUserIdFromToken(token)
        console.log('👤 Current user ID:', currentUserId)
        
        // API returns: { status: true, message: "...", data: [...] }
        if (currentUserId && userLikesData.status && userLikesData.data && Array.isArray(userLikesData.data)) {
          const hasLiked = userLikesData.data.some((like: any) => {
            console.log('🔍 Comparing like.user_id:', like.user_id, 'with currentUserId:', currentUserId)
            return like.user_id === currentUserId
          })
          console.log('❤️ User has liked this post:', hasLiked)
          setLikes(prev => ({
            ...prev,
            isLiked: hasLiked
          }))
        } else {
          console.log('⚠️ Could not determine like status - missing user ID or data')
        }
      } else {
        console.error('❌ Failed to fetch user likes:', userLikesResponse.status)
      }
    } catch (error) {
      console.error('💥 Error fetching likes data:', error)
    }
  }, [postId])

  // Helper function to extract user ID from token
  const getUserIdFromToken = (token: string): string | null => {
    try {
      // Remove Bearer prefix if present
      const cleanToken = token.replace(/^Bearer\s+/i, '')
      
      // Split the JWT and decode the payload
      const parts = cleanToken.split('.')
      if (parts.length !== 3) {
        console.error('❌ Invalid JWT format')
        return null
      }
      
      const payload = JSON.parse(atob(parts[1]))
      console.log('🔍 Full token payload:', payload)
      
      // Try different common user ID fields
      const possibleUserIds = [
        payload.sub,
        payload.user_id, 
        payload.id, 
        payload.userId,
        payload.uid,
        payload.user?.id,
        payload.user?.user_id
      ]
      
      for (const id of possibleUserIds) {
        if (id) {
          console.log('👤 Found user ID:', id, 'from token')
          return String(id) // Convert to string to ensure type consistency
        }
      }
      
      console.error('❌ No user ID found in token payload')
      return null
    } catch (error) {
      console.error('💥 Error parsing token:', error)
      return null
    }
  }

  const addLike = async () => {
    if (loading) return

    console.log('❤️ Adding like for post:', postId)
    setLoading(true)
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        console.error('❌ No access token found')
        return
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }

      console.log('🚀 Making POST request to add like...')
      const response = await fetch(`/api/community-post-likes?postId=${postId}`, {
        method: 'POST',
        headers
      })

      console.log('📡 Add like response status:', response.status)
      
      if (response.ok) {
        const responseData = await response.json()
        console.log('📡 Add like response body:', responseData)
        
        // API returns: { status: true, message: "Like added successfully", data: {...} } on success
        // API returns: { status: false, message: "Like already exists" } when like exists
        if (responseData.status === true) {
          console.log('✅ Like added successfully')
          setLikes(prev => ({
            ...prev,
            isLiked: true,
            likesCount: prev.likesCount + 1
          }))
        } else if (responseData.status === false && responseData.message === "Like already exists") {
          console.log('ℹ️ Like already exists, setting state to liked')
          setLikes(prev => ({
            ...prev,
            isLiked: true
          }))
        } else {
          console.log('⚠️ Unexpected response format:', responseData)
        }
        // Refresh data to ensure consistency
        setTimeout(fetchLikesData, 500)
      } else {
        console.error('❌ Failed to add like:', response.status)
      }
    } catch (error) {
      console.error('💥 Error adding like:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeLike = async () => {
    if (loading) return

    console.log('💔 Removing like for post:', postId)
    setLoading(true)
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        console.error('❌ No access token found')
        return
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }

      console.log('🚀 Making DELETE request to remove like...')
      const response = await fetch(`/api/community-post-likes?postId=${postId}`, {
        method: 'DELETE',
        headers
      })

      console.log('📡 Remove like response status:', response.status)
      
      if (response.ok) {
        const responseData = await response.json()
        console.log('📡 Remove like response body:', responseData)
        
        // API returns: { status: true, message: "Like removed successfully", data: {} }
        if (responseData.status === true && responseData.message === "Like removed successfully") {
          console.log('✅ Like removed successfully')
          setLikes(prev => ({
            ...prev,
            isLiked: false,
            likesCount: Math.max(0, prev.likesCount - 1)
          }))
        } else {
          console.log('⚠️ Unexpected remove like response:', responseData)
        }
        // Refresh data to ensure consistency
        setTimeout(fetchLikesData, 500)
      } else {
        console.error('❌ Failed to remove like:', response.status)
      }
    } catch (error) {
      console.error('💥 Error removing like:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleLike = () => {
    console.log('🔄 Toggling like. Current state:', likes.isLiked)
    console.log('🔄 Current likes count:', likes.likesCount)
    if (likes.isLiked) {
      removeLike()
    } else {
      addLike()
    }
  }

  // Force refresh likes data (useful for debugging)
  const refreshLikesData = () => {
    console.log('🔄 Manually refreshing likes data...')
    fetchLikesData()
  }

  useEffect(() => {
    if (postId) {
      fetchLikesData()
    }
  }, [postId, fetchLikesData])

  return {
    ...likes,
    loading,
    toggleLike,
    refreshLikesData
  }
}
