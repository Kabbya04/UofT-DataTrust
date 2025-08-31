"use client"

import { Card } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"

export default function MembershipRequestsPage() {
  const requests = [
    {
      id: 1,
      communityName: "Toronto Health Community",
      status: "pending",
      requestedDate: "1 Jan 2025",
      type: "membership",
    },
    {
      id: 2,
      communityName: "Bangladesh Education Initiative",
      status: "approved",
      joinedDate: "1 Jan 2025",
      type: "membership",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Membership Requests</h1>

        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="p-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{request.communityName}</h3>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge
                    variant={request.status === "approved" ? "default" : "secondary"}
                    className={
                      request.status === "approved"
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-yellow-500 hover:bg-yellow-600 text-black"
                    }
                  >
                    {request.status === "approved" ? "Approved" : "Pending Approval"}
                  </Badge>
                </div>

                <div className="text-sm text-muted-foreground">
                  {request.status === "approved"
                    ? `Joined: ${request.joinedDate}`
                    : `Requested: ${request.requestedDate}`}
                </div>

                {request.status === "approved" && (
                  <Button variant="outline" size="sm">
                    View Community
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
