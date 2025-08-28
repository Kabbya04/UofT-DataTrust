"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../../components/ui/tooltip"
import { Database, Calendar, HardDrive, Lock, FileX } from "lucide-react"

const mockDatasets = [
  {
    id: 1,
    title: "Sample Dataset A",
    description: "Dataset about climate change trends",
    uploadDate: "Jan 5, 2025",
    fileSize: "2.3 MB",
    accessLevel: "Read-only",
    hasPermission: false,
  },
  {
    id: 2,
    title: "Research Data B",
    description: "AI ethics survey responses and analysis",
    uploadDate: "Jan 3, 2025",
    fileSize: "5.7 MB",
    accessLevel: "Read-only",
    hasPermission: true,
  },
  {
    id: 3,
    title: "Community Survey Results",
    description: "Member feedback and engagement metrics",
    uploadDate: "Dec 28, 2024",
    fileSize: "1.8 MB",
    accessLevel: "Read-only",
    hasPermission: false,
  },
  {
    id: 4,
    title: "Training Dataset C",
    description: "Machine learning model training data",
    uploadDate: "Dec 25, 2024",
    fileSize: "12.4 MB",
    accessLevel: "Read-only",
    hasPermission: true,
  },
]

const CommunitySpecificDataAccess = () => {
  return (
    <div className="min-h-screen  ">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Community Specific Data Access</h1>
          <p className="text-lg text-gray-600 ">
            Community: <span className="font-semibold text-blue-600 ">AI Ethics Research Group</span>
          </p>
        </div>

        {/* Datasets Grid */}
        {mockDatasets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockDatasets.map((dataset) => (
              <Card key={dataset.id} className="hover:shadow-lg hover:shadow-gray-600  border border-primary transition-shadow duration-200 cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <Database className="h-8 w-8 text-blue-600  mb-2" />
                    <Badge variant={dataset.hasPermission ? "default" : "secondary"} className={` ${dataset.hasPermission ? "bg-neutral-900  text-neutral-100 " : "bg-neutral-500 text-neutral-100"} `}>{dataset.accessLevel}</Badge>
                  </div>
                  <CardTitle className="text-lg font-semibold ">{dataset.title}</CardTitle>
                  <CardDescription className="text-sm text-gray-600 ">
                    {dataset.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm ">
                      <Calendar className="h-4 w-4 mr-2" />
                      Uploaded on {dataset.uploadDate}
                    </div>
                    <div className="flex items-center text-sm ">
                      <HardDrive className="h-4 w-4 mr-2" />
                      {dataset.fileSize}
                    </div>
                    <div className="pt-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Button
                                variant={dataset.hasPermission ? "default" : "secondary"}
                                size="sm"
                                disabled={!dataset.hasPermission}
                                className={`w-full hover:primary hover:text-neutral-50 hover:border-2 border-primary ${dataset.hasPermission ? " bg-primary  text-neutral-100 " : "bg-neutral-600"} `}
                              >
                                {dataset.hasPermission ? (
                                  <>
                                    <Database className="h-4 w-4 mr-2" />
                                    Access Dataset
                                  </>
                                ) : (
                                  <>
                                    <Lock className="h-4 w-4 mr-2 " />
                                    Access Restricted
                                  </>
                                )}
                              </Button>
                            </div>
                          </TooltipTrigger>
                          {!dataset.hasPermission && (
                            <TooltipContent>
                              <p>Permission required</p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileX className="h-16 w-16  mb-4" />
            <h3 className="text-xl font-semibold text-gray-900  mb-2">No datasets available</h3>
            <p className="text-gray-600  max-w-md">
              No datasets available for this community. Check back later or contact your administrator.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CommunitySpecificDataAccess