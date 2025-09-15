"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Checkbox } from "@/app/components/ui/checkbox";
import { ArrowLeft, Send, Users, UserCheck, Shield, Crown } from "lucide-react";

export default function SendAnnouncementPage() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [sendTo, setSendTo] = useState<string[]>([]);

  const recipientOptions = [
    { id: "all", label: "All", icon: Users },
    { id: "community-members", label: "Community members", icon: UserCheck },
    { id: "researchers", label: "Researchers", icon: UserCheck },
    { id: "project-admins", label: "Project Admins", icon: Shield },
    { id: "admins", label: "Admins", icon: Crown }
  ];

  const handleRecipientChange = (recipientId: string, checked: boolean) => {
    if (checked) {
      setSendTo(prev => [...prev, recipientId]);
    } else {
      setSendTo(prev => prev.filter(id => id !== recipientId));
    }
  };

  const handleSend = () => {
    if (!subject.trim()) {
      alert("Please enter a subject");
      return;
    }
    if (!description.trim()) {
      alert("Please enter a description");
      return;
    }
    if (sendTo.length === 0) {
      alert("Please select at least one recipient group");
      return;
    }

    // Handle send logic here
    console.log("Sending announcement:", { subject, description, sendTo });
    alert("Announcement sent successfully!");
    router.back();
  };

  return (
    <div className="w-full mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Send Announcement</h1>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm font-medium">
              SUBJECT
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter announcement subject"
              className="w-full"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter announcement description"
              className="w-full min-h-[120px] resize-none"
            />
          </div>

          {/* Send To */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">SEND TO</Label>
            <div className="space-y-3 mt-2">
              {recipientOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={option.id}
                    checked={sendTo.includes(option.id)}
                    onCheckedChange={(checked) => 
                      handleRecipientChange(option.id, checked as boolean)
                    }
                    className="h-4 w-4"
                    style={{ borderColor: '#03A9F4' }}
                  />
                  <Label 
                    htmlFor={option.id} 
                    className="text-sm font-normal cursor-pointer flex items-center gap-2"
                  >
                    <option.icon className="h-4 w-4 text-muted-foreground" />
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Send Button */}
          <div className="pt-4">
            <Button 
              onClick={handleSend}
              className="bg-black hover:bg-black/90 text-white px-8"
              style={{ backgroundColor: '#03A9F4' }}
            >
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}