// app/(auth)/sign-in/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../components/contexts/auth-context';

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.398 12.58C34.823 9.213 29.86 7 24 7C12.955 7 4 15.955 4 27s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="M6.306 14.691L12.74 19.338C14.657 14.593 18.986 11 24 11c3.059 0 5.842 1.154 7.961 3.039L38.398 12.58C34.823 9.213 29.86 7 24 7C16.894 7 10.706 10.158 6.306 14.691z"></path><path fill="#4CAF50" d="M24 47c5.86 0 11.222-2.213 15.099-5.922L32.74 35.662C30.823 37.407 27.671 39 24 39c-5.014 0-9.343-3.593-11.26-8.338L6.306 36.309C10.706 42.842 16.894 47 24 47z"></path><path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.16-4.087 5.571L38.5 41.08C42.223 37.319 44 32.55 44 27c0-1.341-.138-2.65-.389-3.917z"></path></svg>
);

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-border bg-white transition-colors focus-within:border-violet-500/70 focus-within:bg-violet-500/10">
    {children}
  </div>
);

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  
  const { login, isLoading, error, clearError } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      return;
    }

    await login({
      email: formData.email,
      password: formData.password,
    });
  };

  return (
    <div className="h-[100dvh] flex flex-col md:flex-row w-full">
      <section className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            <h1 className="animate-element animate-delay-100 text-4xl md:text-5xl font-semibold leading-tight tracking-tighter">Welcome Back</h1>
            <p className="animate-element animate-delay-200 text-muted-foreground">Access your account and continue your journey with us.</p>
            
            {error && (
              <div className="animate-element animate-delay-250 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-600 text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="animate-element animate-delay-300"><label className="text-sm font-medium text-muted-foreground">Email Address</label><GlassInputWrapper><input name="email" type="email" placeholder="Enter your email address" value={formData.email} onChange={handleInputChange} className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none" required /></GlassInputWrapper></div>
              <div className="animate-element animate-delay-400"><label className="text-sm font-medium text-muted-foreground">Password</label><GlassInputWrapper><div className="relative"><input name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={formData.password} onChange={handleInputChange} className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none" required /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center">{showPassword ? <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" /> : <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />}</button></div></GlassInputWrapper></div>
              
              {/* --- THIS LINK IS NOW FUNCTIONAL --- */}
              <div className="animate-element animate-delay-500 flex items-center justify-between text-sm">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleInputChange} className="custom-checkbox" />
                  <span className="text-foreground/90">Keep me signed in</span>
                </label>
                <Link href="/reset-password" className="hover:underline text-violet-500 dark:text-violet-400 transition-colors">
                  Reset password
                </Link>
              </div>
              
              <button type="submit" disabled={isLoading} className="animate-element animate-delay-600 w-full rounded-2xl bg-card border border-border py-3 font-medium text-foreground/90 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">{isLoading ? 'Signing In...' : 'Sign In'}</button>
            </form>
            <div className="flex items-center my-2 animate-element animate-delay-700"><div className="flex-grow border-t border-border" /><span className="mx-4 flex-shrink text-xs uppercase text-muted-foreground">Or continue with</span><div className="flex-grow border-t border-border" /></div>
            <button type="button" className="animate-element animate-delay-800 w-full flex items-center justify-center gap-3 rounded-2xl bg-card border border-border py-3 font-medium text-foreground/90 transition-transform active:scale-95"><GoogleIcon />Sign in with Google</button>
            <p className="animate-element animate-delay-900 text-center text-sm text-muted-foreground mt-2">New to our platform? <Link href="/sign-up" className="text-violet-500 dark:text-violet-400 hover:underline transition-colors">Create Account</Link></p>
          </div>
        </div>
      </section>
      <section className="hidden md:block flex-1 relative p-4">
        <div className="animate-slide-right animate-delay-300 relative h-full w-full overflow-hidden rounded-3xl"><Image src="/images/auth.jpg" alt="Abstract background art" fill className="object-cover"/></div>
      </section>
    </div>
  );
};