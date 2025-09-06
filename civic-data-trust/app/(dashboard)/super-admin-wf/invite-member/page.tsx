"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { ArrowLeft, Mail, Users, UserCheck, Shield, Crown } from "lucide-react";

export default function InviteMembersPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [inviteAs, setInviteAs] = useState("community-member");

  const roleOptions = [
    { id: "community-member", label: "Community Member", icon: Users },
    { id: "researcher", label: "Researcher", icon: UserCheck },
    { id: "project-admin", label: "Project Admin", icon: Shield },
    { id: "super-admin", label: "Super Admin", icon: Crown }
  ];

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
    const selectedRole = roleOptions.find(role => role.id === inviteAs);
    console.log("Inviting member:", { email, inviteAs, roleName: selectedRole?.label });
    alert(`Invitation sent to ${email} as ${selectedRole?.label}!`);
    
    // Reset form
    setEmail("");
    setInviteAs("community-member");
  };

  return (
    <div className="max-w-2xl mr-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Invite Members</h1>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Email Field */}
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

          {/* Invite As Section */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">INVITE AS</Label>
            <RadioGroup 
              value={inviteAs} 
              onValueChange={setInviteAs}
              className="space-y-3"
            >
              {roleOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-3">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label 
                    htmlFor={option.id} 
                    className="text-sm font-normal cursor-pointer flex items-center gap-2"
                  >
                    <option.icon className="h-4 w-4 text-muted-foreground" />
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Invite Button */}
          <div className="pt-4">
            <Button 
              onClick={handleInvite}
              className="bg-black hover:bg-black/90 text-white px-8"
              disabled={!email.trim()}
            >
              Invite
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}