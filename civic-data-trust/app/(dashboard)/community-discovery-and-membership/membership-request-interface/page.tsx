"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { MoreHorizontal, MapPin } from "lucide-react"

// Define a type for the agent object
interface Agent {
  id: string
  name: string
  status: string
  location: string
  lastSeen: string
  missions: number
  risk: string
}

const MembershipRequestInterface = () => {
  const [searchTerm, setSearchTerm] = useState("")
  // Explicitly type the state to be Agent or null
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)

  const agents: Agent[] = [ // Use the Agent type for the array
    {
      id: "G-078W",
      name: "VENGEFUL SPIRIT",
      status: "active",
      location: "Berlin",
      lastSeen: "2 min ago",
      missions: 47,
      risk: "high",
    },
    {
      id: "G-079X",
      name: "OBSIDIAN SENTINEL",
      status: "standby",
      location: "Tokyo",
      lastSeen: "15 min ago",
      missions: 32,
      risk: "medium",
    },
    {
      id: "G-080Y",
      name: "GHOSTLY FURY",
      status: "active",
      location: "Cairo",
      lastSeen: "1 min ago",
      missions: 63,
      risk: "high",
    },
    {
      id: "G-081Z",
      name: "CURSED REVENANT",
      status: "compromised",
      location: "Moscow",
      lastSeen: "3 hours ago",
      missions: 28,
      risk: "critical",
    },
    {
      id: "G-082A",
      name: "VENOMOUS SHADE",
      status: "active",
      location: "London",
      lastSeen: "5 min ago",
      missions: 41,
      risk: "medium",
    },
    {
      id: "G-083B",
      name: "MYSTIC ENIGMA",
      status: "training",
      location: "Base Alpha",
      lastSeen: "1 day ago",
      missions: 12,
      risk: "low",
    },
    {
      id: "G-084C",
      name: "WRAITH AVENGER",
      status: "active",
      location: "Paris",
      lastSeen: "8 min ago",
      missions: 55,
      risk: "high",
    },
    {
      id: "G-085D",
      name: "SPECTRAL FURY",
      status: "standby",
      location: "Sydney",
      lastSeen: "22 min ago",
      missions: 38,
      risk: "medium",
    },
  ]

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-wider">Membership requests</h1>
            <p className="text-sm text-muted-foreground">Manage and monitor field operatives</p>
          </div>
        </div>

        {/* Agent List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium tracking-wider">Before accept any request view the detail</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-xs uppercase font-medium tracking-wider">Request ID</th>
                    <th className="text-left py-3 px-4 text-xs uppercase font-medium tracking-wider">Name</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">LOCATION</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAgents.map((agent, index) => (
                    <tr
                      key={agent.id}
                      className="border-b hover:bg-accent transition-colors cursor-pointer"
                      onClick={() => setSelectedAgent(agent)}
                    >
                      <td className="py-3 px-4 text-sm font-mono">{agent.id}</td>
                      <td className="py-3 px-4 text-sm">{agent.name}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{agent.location}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="icon" className="hover:text-primary">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Agent Detail Modal */}
        {selectedAgent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold tracking-wider">{selectedAgent.name}</CardTitle>
                  <p className="text-sm text-muted-foreground font-mono">{selectedAgent.id}</p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedAgent(null)}
                  className="hover:text-foreground"
                >
                  ✕
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground tracking-wider mb-1">STATUS</p>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          selectedAgent.status === "active"
                            ? "bg-green-500"
                            : selectedAgent.status === "standby"
                              ? "bg-yellow-500"
                              : selectedAgent.status === "training"
                                ? "bg-blue-500"
                                : "bg-red-500"
                        }`}
                      ></div>
                      <span className="text-sm uppercase tracking-wider">{selectedAgent.status}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground tracking-wider mb-1">LOCATION</p>
                    <p className="text-sm">{selectedAgent.location}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground tracking-wider mb-1">MISSIONS COMPLETED</p>
                    <p className="text-sm font-mono">{selectedAgent.missions}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground tracking-wider mb-1">RISK LEVEL</p>
                    <span
                      className={`text-xs px-2 py-1 rounded uppercase tracking-wider ${
                        selectedAgent.risk === "critical"
                          ? "bg-red-500/20 text-red-500"
                          : selectedAgent.risk === "high"
                            ? "bg-orange-500/20 text-orange-500"
                            : selectedAgent.risk === "medium"
                              ? "bg-yellow-500/20 text-yellow-600"
                              : "bg-green-500/20 text-green-600"
                      }`}
                    >
                      {selectedAgent.risk}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Accept Request</Button>
                  <Button variant="outline">Cancel Request</Button>
                  <Button variant="outline">Send Message</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default MembershipRequestInterface