// app/(auth)/sign-up/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../components/contexts/auth-context';
import { authService, UserRole } from '../../services/auth';

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-border bg-card/50 dark:bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-violet-500/70 focus-within:bg-violet-500/10">
    {children}
  </div>
);

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  
  const { signup, isLoading, error, clearError } = useAuth();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setRolesLoading(true);
        const roles = await authService.getUserRoles();
        // Ensure we always set an array
        if (Array.isArray(roles)) {
          setUserRoles(roles);
        } else {
          console.error('Roles response is not an array:', roles);
          setUserRoles([]);
        }
      } catch (error) {
        console.error('Failed to fetch roles:', error);
        // Set empty array on error - the auth service should have returned defaults
        setUserRoles([]);
      } finally {
        setRolesLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) clearError();
  };

  const validatePassword = (password: string) => {
    const errors = [];
    if (password.length < 8) errors.push('at least 8 characters');
    if (!/\d/.test(password)) errors.push('at least one digit');
    if (!/[A-Z]/.test(password)) errors.push('at least one uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('at least one lowercase letter');
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return;
    }

    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      return;
    }

    // Validate password requirements
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      // Let the backend validation handle this for consistency
    }

    await signup({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    });
  };

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

            {error && (
              <div className="animate-element animate-delay-250 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="animate-element animate-delay-300">
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <GlassInputWrapper>
                  <input name="name" type="text" placeholder="Enter your name" value={formData.name} onChange={handleInputChange} className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none" required />
                </GlassInputWrapper>
              </div>
              
              <div className="animate-element animate-delay-400">
                <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                <GlassInputWrapper>
                  <input name="email" type="email" placeholder="Enter your email address" value={formData.email} onChange={handleInputChange} className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none" required />
                </GlassInputWrapper>
              </div>

              
              <div className="animate-element animate-delay-500">
                <label className="text-sm font-medium text-muted-foreground">Your Role</label>
                <GlassInputWrapper>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none appearance-none"
                    required
                    disabled={rolesLoading}
                  >
                    <option value="" disabled>
                      {rolesLoading ? 'Loading roles...' : 'Select your role'}
                    </option>
                    {Array.isArray(userRoles) && userRoles.map((role) => (
                      <option key={role.id} className="text-background" value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </GlassInputWrapper>
              </div>

              <div className="animate-element animate-delay-600">
                <label className="text-sm font-medium text-muted-foreground">Password</label>
                <GlassInputWrapper>
                  <div className="relative">
                    <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Create a strong password" value={formData.password} onChange={handleInputChange} className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center">
                      {showPassword ? <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground" /> : <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground" />}
                    </button>
                  </div>
                </GlassInputWrapper>
                <p className="text-xs text-muted-foreground mt-1">
                  Password must contain at least 8 characters, one digit, one uppercase and one lowercase letter
                </p>
              </div>

              <div className="animate-element animate-delay-700">
                <label className="text-sm font-medium text-muted-foreground">Confirm Password</label>
                <GlassInputWrapper>
                  <div className="relative">
                    <input name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleInputChange} className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none" required />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-3 flex items-center">
                      {showConfirmPassword ? <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground" /> : <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground" />}
                    </button>
                  </div>
                </GlassInputWrapper>
                {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || formData.password !== formData.confirmPassword}
                className="animate-element animate-delay-800 w-full rounded-2xl bg-card border border-border py-3 font-medium text-foreground/90 transition-transform !mt-6 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
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