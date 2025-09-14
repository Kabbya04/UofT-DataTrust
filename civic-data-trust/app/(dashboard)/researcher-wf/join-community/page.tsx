"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import { Textarea } from "@/app/components/ui/textarea"
import { useCommunity } from "@/app/components/contexts/community-context"

function ResearcherJoinCommunityRequestContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { communities, submitJoinRequest } = useCommunity()
  const [message, setMessage] = useState("")
  const [agreed, setAgreed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const targetCommunityId = searchParams.get('communityId')
  const community = communities.find(c => c.id.toString() === targetCommunityId)

  if (!community) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Card className="border border-border max-w-md">
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Research Community Not Found</h3>
            <p className="text-sm text-muted-foreground mb-4">The research community you&apos;re trying to join could not be found.</p>
            <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleSubmitRequest = async () => {
    if (!agreed) {
      alert("Please agree to abide by research community guidelines and ethical standards")
      return
    }
    setIsSubmitting(true)
    try {
      console.log(`Submitting research community join request for community ${community.id} with message: ${message}`);
      await submitJoinRequest(community.id, message)
      alert("Research community join request submitted successfully!")
      router.push(`/researcher-wf/community-details/${community.id}?joined=pending`)
    } catch (error) {
      console.error("Failed to submit research community join request:", error)
      alert("Failed to submit research community request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex-1">
      <div className="mb-6"><h1 className="text-2xl font-bold">Request to Join Research Community</h1></div>
      <div className="mb-6">
        <div className="text-sm text-muted-foreground mb-2">Research Community Name</div>
        <div className="text-lg font-semibold">{community.name}</div>
        <div className="text-sm text-muted-foreground mt-2">{community.description}</div>
      </div>
      <div className="max-w-2xl">
        <Card className="border border-border">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">Research Intent & Message to Community Admin (Optional)</label>
                <Textarea
                  placeholder="Describe your research interests, intended use of community datasets, and any relevant academic background or institutional affiliation..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[120px] resize-none"
                  maxLength={500}
                />
                <div className="text-xs text-muted-foreground mt-2">{message.length}/500 characters</div>
              </div>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 h-4 w-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                />
                <label htmlFor="agree" className="text-sm text-foreground">
                  I agree to abide by research community guidelines, data usage policies, and ethical research standards.
                  I understand that datasets may be used only for legitimate research purposes and proper attribution will be provided.
                </label>
              </div>
              <div>
                <Button
                  onClick={handleSubmitRequest}
                  disabled={!agreed || isSubmitting}
                  className="bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting Research Request..." : "Send Research Request"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ResearcherJoinCommunityPage() {
    return (
        <Suspense fallback={<div>Loading research community...</div>}>
            <ResearcherJoinCommunityRequestContent />
        </Suspense>
    )
}