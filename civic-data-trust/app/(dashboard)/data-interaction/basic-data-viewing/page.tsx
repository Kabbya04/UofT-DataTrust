"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import { Eye, FileText, Download, RefreshCw } from "lucide-react"

const csvPreviewData = [
  { col1: "Row 1, Col 1", col2: "Row 1, Col 2", col3: "Row 1, Col 3", col4: "Row 1, Col 4" },
  { col1: "Row 2, Col 1", col2: "Row 2, Col 2", col3: "Row 2, Col 3", col4: "Row 2, Col 4" },
  { col1: "Row 3, Col 1", col2: "Row 3, Col 2", col3: "Row 3, Col 3", col4: "Row 3, Col 4" },
  { col1: "Row 4, Col 1", col2: "Row 4, Col 2", col3: "Row 4, Col 3", col4: "Row 4, Col 4" },
  { col1: "Row 5, Col 1", col2: "Row 5, Col 2", col3: "Row 5, Col 3", col4: "Row 5, Col 4" },
]


const BasicDataViewing = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold ">Basic Data Viewing</h1>
          <p className=" mt-2">Preview and explore your dataset contents</p>
        </div>
        <div className="flex items-center gap-2">
          <Eye className="h-8 w-8 text-green-600" />
        </div>
      </div>

      {/* Dataset Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Current Dataset: SampleDataset.csv
          </CardTitle>
          <CardDescription>Static preview of your dataset - showing first 5 rows</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Badge variant="secondary">CSV Format</Badge>
              <Badge variant="outline">5 Rows Shown</Badge>
              <Badge variant="outline">4 Columns</Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Data Preview</CardTitle>
          <CardDescription>This is a static preview of your dataset.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="">
                  <TableHead className="font-semibold">Column 1</TableHead>
                  <TableHead className="font-semibold">Column 2</TableHead>
                  <TableHead className="font-semibold">Column 3</TableHead>
                  <TableHead className="font-semibold">Column 4</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {csvPreviewData.map((row, index) => (
                  <TableRow key={index} className=" cursor-pointer">
                    <TableCell className="font-mono text-sm">{row.col1}</TableCell>
                    <TableCell className="font-mono text-sm">{row.col2}</TableCell>
                    <TableCell className="font-mono text-sm">{row.col3}</TableCell>
                    <TableCell className="font-mono text-sm">{row.col4}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Preview Message */}
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              <p className="text-blue-800 dark:text-blue-200 font-medium">This is a static preview of your dataset.</p>
            </div>
            <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
              Only the first 5 rows are displayed. Use the full data viewer for complete dataset analysis.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Dataset Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold ">1,247</p>
              <p className="text-sm ">Total Rows</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">4</p>
              <p className="text-sm ">Columns</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">CSV</p>
              <p className="text-sm ">File Type</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">2.1 MB</p>
              <p className="text-sm ">File Size</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default BasicDataViewing