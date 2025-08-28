"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import React from 'react'
import { useState } from "react"
import { Checkbox } from "../../../../components/ui/checkbox"
import {  CheckCircle, Shield } from "lucide-react"
import { Badge } from "../../../../components/ui/badge"
import { Button } from "../../../../components/ui/button"
const AgreementConfirmation = () => {

    const [selectedTerms, setSelectedTerms] = useState<string[]>([])
    const [agreementStatus, setAgreementStatus] = useState<Record<string, boolean>>({})

    const termsDocuments = [
        {
            id: "data-usage-policy",
            title: "Data Usage Policy",
            version: "v2.1",
            lastUpdated: "2024-01-15",
            status: "pending",
            description: "Guidelines for ethical data collection and usage in research projects.",
            mandatory: true,
        },
        {
            id: "privacy-agreement",
            title: "Privacy Agreement",
            version: "v1.8",
            lastUpdated: "2024-01-10",
            status: "agreed",
            description: "Privacy protection measures and user data handling procedures.",
            mandatory: true,
        },
        {
            id: "research-ethics",
            title: "Research Ethics Guidelines",
            version: "v3.0",
            lastUpdated: "2024-01-20",
            status: "review",
            description: "Ethical standards and best practices for research activities.",
            mandatory: true,
        },
        {
            id: "community-guidelines",
            title: "Community Guidelines",
            version: "v1.5",
            lastUpdated: "2024-01-05",
            status: "agreed",
            description: "Rules and expectations for community participation.",
            mandatory: false,
        },
    ]


    const handleAgreement = (documentId: string) => {
        setAgreementStatus((prev) => ({
            ...prev,
            [documentId]: true,
        }))
    }
    return (
        <div>
            <Card className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Agreement Confirmation
                        </CardTitle>
                        <CardDescription>Confirm your agreement to the terms and conditions below</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {termsDocuments
                            .filter((doc) => doc.status !== "agreed")
                            .map((doc) => (
                                <div key={doc.id} className="border rounded-lg p-4 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold">
                                                {doc.title} {doc.version}
                                            </h3>
                                            <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                                        </div>
                                        <Badge variant={doc.mandatory ? "destructive" : "secondary"}>
                                            {doc.mandatory ? "Mandatory" : "Optional"}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`agree-${doc.id}`}
                                            checked={agreementStatus[doc.id] || false}
                                            onCheckedChange={(checked) => {
                                                setAgreementStatus((prev) => ({
                                                    ...prev,
                                                    [doc.id]: checked as boolean,
                                                }))
                                            }}
                                        />
                                        <label
                                            htmlFor={`agree-${doc.id}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            I have read and agree to the {doc.title}
                                        </label>
                                    </div>

                                    <Button
                                        onClick={() => handleAgreement(doc.id)}
                                        disabled={!agreementStatus[doc.id]}
                                        className="w-full"
                                    >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Confirm Agreement
                                    </Button>
                                </div>
                            ))}
                    </CardContent>
                </Card>
            </Card>
        </div>
    )
}

export default AgreementConfirmation