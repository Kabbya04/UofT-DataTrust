"use client"
import { useState } from "react"
import PlaceholderPage from "@/app/components/PlaceholderPage";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Search, Filter, MoreHorizontal, MapPin, Clock, Shield } from "lucide-react"

// Define a type for the agent object
interface Agent {
  id: string;
  name: string;
  status: string;
  location: string;
  lastSeen: string;
  missions: number;
  risk: string;
}

export default function MembershipStatusTracking () {
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white tracking-wider">Membership Status Tracking</h1>
          <p className="text-sm text-neutral-400">Manage and monitor field operatives</p>
        </div>

      </div>


      {/* Agent List */}
      <Card className="dark:bg-neutral-900 border-neutral-700">
        <CardHeader>
          {/* <CardTitle className="text-sm font-medium dark:text-neutral-300 tracking-wider">AGENT ROSTER</CardTitle> */}
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 racking-wider">ID</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 racking-wider">NAME</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 racking-wider">STATUS</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 racking-wider">LOCATION</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 racking-wider">LAST SEEN</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 racking-wider">COMMUNITY</th>
                 
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 racking-wider">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredAgents.map((agent, index) => (
                  <tr
                    key={agent.id}
                    className={`border-b border-neutral-800 hover:bg-neutral-800 transition-colors cursor-pointer ${
                      index % 2 === 0 ? "bg-neutral-600 dark:bg-neutral-900 " : ""
                    }`}
                    onClick={() => setSelectedAgent(agent)}
                  >
                    <td className="py-3 px-4 text-sm dark:text-white font-mono">{agent.id}</td>
                    <td className="py-3 px-4 text-sm dark:text-white">{agent.name}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            agent.status === "active"
                              ? "bg-green-500"
                              : agent.status === "standby"
                                ? "bg-neutral-500"
                                : agent.status === "training"
                                  ? "bg-orange-500"
                                  : "bg-red-500"
                          }`}
                        ></div>
                        <span className="text-xs dark:text-neutral-300 uppercase tracking-wider">{agent.status}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 dark:text-neutral-400" />
                        <span className="text-sm dark:text-neutral-300">{agent.location}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 dark:text-neutral-400" />
                        <span className="text-sm dark:text-neutral-300 font-mono">{agent.lastSeen}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm dark:text-white font-mono">{agent.missions}</td>
                  
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-orange-500">
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
        <div className="fixed inset-0 dark:bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-neutral-800 border-neutral-700 w-full max-w-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-white tracking-wider">{selectedAgent.name}</CardTitle>
                <p className="text-sm text-neutral-400 font-mono">{selectedAgent.id}</p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setSelectedAgent(null)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-neutral-400 tracking-wider mb-1">STATUS</p>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        selectedAgent.status === "active"
                          ? "bg-white"
                          : selectedAgent.status === "standby"
                            ? "bg-neutral-500"
                            : selectedAgent.status === "training"
                              ? "bg-orange-500"
                              : "bg-red-500"
                      }`}
                    ></div>
                    <span className="text-sm text-white uppercase tracking-wider">{selectedAgent.status}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 tracking-wider mb-1">LOCATION</p>
                  <p className="text-sm text-white">{selectedAgent.location}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 tracking-wider mb-1">MISSIONS COMPLETED</p>
                  <p className="text-sm text-white font-mono">{selectedAgent.missions}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 tracking-wider mb-1">RISK LEVEL</p>
                  <span
                    className={`text-xs px-2 py-1 rounded uppercase tracking-wider ${
                      selectedAgent.risk === "critical"
                        ? "bg-red-500/20 text-red-500"
                        : selectedAgent.risk === "high"
                          ? "bg-orange-500/20 text-orange-500"
                          : selectedAgent.risk === "medium"
                            ? "bg-neutral-500/20 text-neutral-300"
                            : "bg-white/20 text-white"
                    }`}
                  >
                    {selectedAgent.risk}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">Assign Mission</Button>
                <Button
                  variant="outline"
                  className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                >
                  View History
                </Button>
                <Button
                  variant="outline"
                  className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                >
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}