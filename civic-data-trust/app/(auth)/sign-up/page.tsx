// app/(auth)/sign-up/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../components/contexts/auth-context';
import { getUserRoles } from '../../lib/api';
import { getDefaultRouteForRole, getRoleFromId } from '../../lib/routing';

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-border bg-card/50 dark:bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-violet-500/70 focus-within:bg-violet-500/10">
    {children}
  </div>
);

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableRoles, setAvailableRoles] = useState<Array<{id: string, name: string}>>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  
  const { signup } = useAuth();
  const router = useRouter();

  // Set predefined roles on component mount
  useEffect(() => {
    // Use the actual role IDs from the backend (API endpoint for getting roles returns 405)
    setAvailableRoles([
      { id: '2f3d04ee-8fb3-4013-8028-fbf03b85b485', name: 'Community Member' },
      { id: '85ebfe4c-9078-433c-a3b9-5bc1bc0a1a83', name: 'Researcher' },
      { id: '53331ba5-7ff9-4923-81a4-d44161f6a5d7', name: 'Admin' }
    ]);
    setRolesLoading(false);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.role || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!/[A-Z]/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('Signing up with role:', formData.role);
      const result = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      
      if (result.success) {
        // Get the selected role and redirect to appropriate dashboard
        const selectedRole = getRoleFromId(formData.role);
        if (selectedRole) {
          const roleRoute = getDefaultRouteForRole(selectedRole);
          console.log('Redirecting new user to role-based route:', roleRoute, 'for role:', selectedRole);
          router.push(roleRoute);
        } else {
          // Fallback to community member wireframe
          router.push('/community-member-wf/dashboard');
        }
      } else {
        console.error('Signup failed:', result.error);
        setError(result.error || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
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
              <div className="animate-element animate-delay-250 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-2xl text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="animate-element animate-delay-300">
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <GlassInputWrapper>
                  <input 
                    name="name" 
                    type="text" 
                    placeholder="Enter your name" 
                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </GlassInputWrapper>
              </div>
              
              <div className="animate-element animate-delay-400">
                <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                <GlassInputWrapper>
                  <input 
                    name="email" 
                    type="email" 
                    placeholder="Enter your email address" 
                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </GlassInputWrapper>
              </div>

              <div className="animate-element animate-delay-500">
                <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                <GlassInputWrapper>
                  <input 
                    name="phone" 
                    type="tel" 
                    placeholder="Enter your phone number" 
                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </GlassInputWrapper>
              </div>
              
              {/* --- ROLE DROPDOWN IS NOW UPDATED --- */}
              <div className="animate-element animate-delay-600">
                <label className="text-sm font-medium text-muted-foreground">Your Role</label>
                <GlassInputWrapper>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none appearance-none"
                    disabled={isLoading || rolesLoading}
                  >
                    <option value="" disabled>
                      {rolesLoading ? 'Loading roles...' : 'Select your role'}
                    </option>
                    {availableRoles.map((role) => (
                      <option key={role.id} className="text-background" value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </GlassInputWrapper>
              </div>

              <div className="animate-element animate-delay-700">
                <label className="text-sm font-medium text-muted-foreground">Password</label>
                <GlassInputWrapper>
                  <div className="relative">
                    <input 
                      name="password" 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="At least 8 characters with uppercase" 
                      className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="absolute inset-y-0 right-3 flex items-center"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground" /> : <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground" />}
                    </button>
                  </div>
                </GlassInputWrapper>
              </div>

              <div className="animate-element animate-delay-800">
                <label className="text-sm font-medium text-muted-foreground">Confirm Password</label>
                <GlassInputWrapper>
                  <div className="relative">
                    <input 
                      name="confirmPassword" 
                      type={showConfirmPassword ? 'text' : 'password'} 
                      placeholder="Confirm your password" 
                      className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                      className="absolute inset-y-0 right-3 flex items-center"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground" /> : <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground" />}
                    </button>
                  </div>
                </GlassInputWrapper>
              </div>

              <button
                type="submit"
                className="animate-element animate-delay-900 w-full rounded-2xl bg-card border border-border py-3 font-medium text-foreground/90 transition-transform !mt-6 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
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