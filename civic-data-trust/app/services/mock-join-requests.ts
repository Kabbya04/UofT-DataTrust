// Mock join request service for testing purposes
// This simulates the backend behavior when the actual backend isn't persisting data

interface MockJoinRequest {
  id: string
  user_id: string
  community_id: string
  message?: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  user: {
    id: string
    name: string
    email: string
  }
}

class MockJoinRequestService {
  private requests: MockJoinRequest[] = []
  private idCounter = 1

  // Mock user data
  private mockUsers = [
    { id: "USR-734-B", name: "Alex Ryder", email: "alex.ryder@example.com" },
    { id: "USR-123-A", name: "Sarah Johnson", email: "sarah.johnson@example.com" },
    { id: "USR-456-C", name: "Michael Chen", email: "michael.chen@example.com" },
    { id: "USR-789-D", name: "Emily Davis", email: "emily.davis@example.com" },
  ]

  constructor() {
    // Add some mock data for testing
    this.addMockRequests()
  }

  private addMockRequests() {
    // Add some mock requests for testing
    const mockRequests = [
      {
        user_id: "USR-123-A",
        community_id: "1f44746f-e0c8-462d-bf49-3d27c2b94632",
        message: "I'm very interested in contributing to this data science community. I have experience with machine learning and would love to share my datasets.",
        status: 'pending' as const
      },
      {
        user_id: "USR-456-C",
        community_id: "1f44746f-e0c8-462d-bf49-3d27c2b94632",
        message: "Hello! I'm a researcher working on educational data analysis and think this community would be perfect for collaboration.",
        status: 'pending' as const
      }
    ]

    mockRequests.forEach(req => {
      this.submitJoinRequest(req.community_id, req.user_id, req.message)
    })
  }

  submitJoinRequest(communityId: string, userId: string, message?: string): { success: boolean; message?: string } {
    const user = this.mockUsers.find(u => u.id === userId) || {
      id: userId,
      name: `User ${userId}`,
      email: `${userId.toLowerCase()}@example.com`
    }

    const request: MockJoinRequest = {
      id: `req-${this.idCounter++}`,
      user_id: userId,
      community_id: communityId,
      message: message || '',
      status: 'pending',
      created_at: new Date().toISOString(),
      user
    }

    this.requests.push(request)
    console.log('Mock: Join request submitted', request)
    
    return { success: true, message: 'Join request submitted successfully!' }
  }

  getJoinRequestsForCommunity(communityId: string): MockJoinRequest[] {
    const communityRequests = this.requests.filter(r => r.community_id === communityId)
    console.log(`Mock: Found ${communityRequests.length} requests for community ${communityId}`)
    return communityRequests
  }

  approveRequest(requestId: string): { success: boolean; message?: string } {
    const request = this.requests.find(r => r.id === requestId)
    if (request) {
      request.status = 'approved'
      console.log('Mock: Approved request', requestId)
      return { success: true, message: 'Request approved successfully!' }
    }
    return { success: false, message: 'Request not found' }
  }

  rejectRequest(requestId: string, reason?: string, adminMessage?: string): { success: boolean; message?: string } {
    const request = this.requests.find(r => r.id === requestId)
    if (request) {
      request.status = 'rejected'
      console.log('Mock: Rejected request', requestId, 'Reason:', reason, 'Message:', adminMessage)
      return { success: true, message: 'Request rejected successfully!' }
    }
    return { success: false, message: 'Request not found' }
  }

  getAllRequests(): MockJoinRequest[] {
    return this.requests
  }

  clearAllRequests(): void {
    this.requests = []
    this.idCounter = 1
    this.addMockRequests() // Re-add some test data
  }
}

// Singleton instance
export const mockJoinRequestService = new MockJoinRequestService()
