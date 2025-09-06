"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { ArrowLeft, Mail, Shield, Crown } from "lucide-react";

export default function AddNewAdminPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [inviteAs, setInviteAs] = useState("project-admin");

  const handleInvite = () => {
    if (!email.trim()) {
      alert("Please enter an email address");
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    // Handle invite logic here
    console.log("Inviting admin:", { email, inviteAs });
    alert(`Invitation sent to ${email} as ${inviteAs === "project-admin" ? "Project Admin" : "Super Admin"}!`);
    router.back();
  };

  return (
    <div className="w-full mx-auto p-6 space-y-8 ">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Add New Admin</h1>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              EMAIL
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full pl-10"
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Invite As */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">INVITE AS</Label>
            <RadioGroup 
              value={inviteAs} 
              onValueChange={setInviteAs}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="project-admin" id="project-admin" />
                <Label 
                  htmlFor="project-admin" 
                  className="text-sm font-normal cursor-pointer flex items-center gap-2"
                >
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  Project Admin
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="super-admin" id="super-admin" />
                <Label 
                  htmlFor="super-admin" 
                  className="text-sm font-normal cursor-pointer flex items-center gap-2"
                >
                  <Crown className="h-4 w-4 text-muted-foreground" />
                  Super Admin
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Invite Button */}
          <div className="pt-4">
            <Button 
              onClick={handleInvite}
              className="bg-black hover:bg-black/90 text-white px-8"
            >
              Invite
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}