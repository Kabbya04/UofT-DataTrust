// app/(auth)/reset-password/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// We reuse the same consistent input wrapper
const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-border bg-card/50 dark:bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-violet-500/70 focus-within:bg-violet-500/10">
    {children}
  </div>
);

export default function ResetPasswordPage() {
  return (
    <div className="h-[100dvh] flex flex-col md:flex-row w-full">
      {/* Left Side: The Form */}
      <section className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            <div className="text-left">
              <h1 className="animate-element animate-delay-100 text-4xl md:text-5xl font-semibold leading-tight tracking-tighter">
                Recover Password
              </h1>
              <p className="animate-element animate-delay-200 text-muted-foreground mt-2">
                Enter your email to receive a reset link.
              </p>
            </div>

            <form className="space-y-5">
              <div className="animate-element animate-delay-300">
                <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                <GlassInputWrapper>
                  <input
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                  />
                </GlassInputWrapper>
              </div>

              {/* --- THIS BUTTON IS NOW STYLED IDENTICALLY TO THE SIGN-IN BUTTON --- */}
              <button
                type="submit"
                className="animate-element animate-delay-400 w-full rounded-2xl bg-card border border-border py-3 font-medium text-foreground/90 transition-transform active:scale-95"
              >
                Send Reset Link
              </button>
            </form>

            <div className="animate-element animate-delay-500 text-center">
              <p className="text-sm text-muted-foreground">
                Remembered your password?{' '}
                <Link href="/sign-in" className="font-semibold text-violet-500 dark:text-violet-400 hover:underline transition-colors">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Right Side: The Image (consistent with other pages) */}
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
}