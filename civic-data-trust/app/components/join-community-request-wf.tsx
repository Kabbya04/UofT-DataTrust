"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Textarea } from "./ui/textarea"
import { useCommunity } from "./contexts/community-context"

interface JoinCommunityRequestWFProps {
  communityId?: string
}

export function JoinCommunityRequestWF({ communityId }: JoinCommunityRequestWFProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { communities, submitJoinRequest } = useCommunity()
  const [message, setMessage] = useState("")
  const [agreed, setAgreed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get community ID from props or URL params
  const targetCommunityId = communityId || searchParams.get('communityId')
  
  // Find the community
  const community = communities.find(c => c.id.toString() === targetCommunityId)
  
  if (!community) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Card className="border border-border max-w-md">
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Community Not Found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              The community you're trying to join could not be found.
            </p>
            <Button 
              variant="outline" 
              onClick={() => router.back()}
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleSubmitRequest = async () => {
    if (!agreed) {
      alert("Please agree to abide by community guidelines")
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Submit join request through community context
      if (submitJoinRequest) {
        submitJoinRequest(community.id, message)
      }
      
      // Redirect back to community page with success message
      router.push(`/community-member-wf/community-discovery-and-membership/community-details-wf/${community.id}?joined=pending`)
    } catch (error) {
      console.error("Failed to submit join request:", error)
      alert("Failed to submit request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex-1">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Request to Join Community</h1>
      </div>

      {/* Community Info */}
      <div className="mb-6">
        <div className="text-sm text-muted-foreground mb-2">Community Name</div>
        <div className="text-lg font-semibold">{community.name}</div>
      </div>

      {/* Main Form */}
      <div className="max-w-2xl">
        <Card className="border border-border">
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Message to Admin */}
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">
                  Message to Admin (Optional)
                </label>
                <Textarea
                  placeholder="Lorem ipsum dolor sit amet consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[120px] resize-none"
                  maxLength={500}
                />
                <div className="text-xs text-muted-foreground mt-2">
                  {message.length}/500 characters
                </div>
              </div>

              {/* Agreement Checkbox */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 h-4 w-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                />
                <label htmlFor="agree" className="text-sm text-foreground">
                  I agree to abide by community guidelines
                </label>
              </div>

              {/* Submit Button */}
              <div>
                <Button 
                  onClick={handleSubmitRequest}
                  disabled={!agreed || isSubmitting}
                  className="bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50"
                >
                  {isSubmitting ? "Sending Request..." : "Send Request"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}