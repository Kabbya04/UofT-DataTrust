// app/(auth)/sign-up/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-border bg-card/50 dark:bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-violet-500/70 focus-within:bg-violet-500/10">
    {children}
  </div>
);

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="h-[100dvh] flex flex-col md:flex-row w-full">
      <section className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-5">
            <h1 className="animate-element animate-delay-100 text-4xl md:text-5xl font-semibold leading-tight tracking-tighter">
              Create an account
            </h1>
            <p className="animate-element animate-delay-200 text-muted-foreground">
              Enter your details to begin your journey with us.
            </p>

            <form className="space-y-4">
              <div className="animate-element animate-delay-300">
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <GlassInputWrapper>
                  <input name="name" type="text" placeholder="Enter your name" className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none" />
                </GlassInputWrapper>
              </div>
              
              <div className="animate-element animate-delay-400">
                <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                <GlassInputWrapper>
                  <input name="email" type="email" placeholder="Enter your email address" className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none" />
                </GlassInputWrapper>
              </div>

              <div className="animate-element animate-delay-500">
                <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                <GlassInputWrapper>
                  <input name="phone" type="tel" placeholder="Enter your phone number" className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none" />
                </GlassInputWrapper>
              </div>
              
              {/* --- ROLE DROPDOWN IS NOW UPDATED --- */}
              <div className="animate-element animate-delay-600">
                <label className="text-sm font-medium text-muted-foreground">Your Role</label>
                <GlassInputWrapper>
                  <select
                    name="role"
                    defaultValue=""
                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none appearance-none"
                  >
                    <option value="" disabled>Select your role</option>
                    <option className="text-background">Researcher / Student</option>
                    <option className="text-background">Tenant / Community Member</option>
                    <option className="text-background">Project Admin</option>
                  </select>
                </GlassInputWrapper>
              </div>

              <div className="animate-element animate-delay-700">
                <label className="text-sm font-medium text-muted-foreground">Password</label>
                <GlassInputWrapper>
                  <div className="relative">
                    <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Create a strong password" className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center">
                      {showPassword ? <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground" /> : <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground" />}
                    </button>
                  </div>
                </GlassInputWrapper>
              </div>

              <div className="animate-element animate-delay-800">
                <label className="text-sm font-medium text-muted-foreground">Confirm Password</label>
                <GlassInputWrapper>
                  <div className="relative">
                    <input name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm your password" className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-3 flex items-center">
                      {showConfirmPassword ? <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground" /> : <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground" />}
                    </button>
                  </div>
                </GlassInputWrapper>
              </div>

              <button
                type="submit"
                className="animate-element animate-delay-900 w-full rounded-2xl bg-card border border-border py-3 font-medium text-foreground/90 transition-transform !mt-6 active:scale-95"
              >
                Create Account
              </button>
            </form>

            <p className="animate-element animate-delay-1000 text-center text-sm text-muted-foreground !mt-4">
              Already have an account? <Link href="/sign-in" className="text-violet-500 dark:text-violet-400 hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </section>

      <section className="hidden md:block flex-1 relative p-4">
        <div className="animate-slide-right animate-delay-300 relative h-full w-full overflow-hidden rounded-3xl">
          <Image 
            src="/images/auth.jpg"
            alt="Abstract background art"
            fill
            className="object-cover"
          />
        </div>
      </section>
    </div>
  );
};