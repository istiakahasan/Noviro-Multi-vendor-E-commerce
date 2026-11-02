/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from "react"
import { useState, useEffect } from 'react';
import { useSearchParams } from "next/navigation";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useSetSpecialistPasswordMutation } from "@/redux/api/authApi";
import PageLoading from "@/components/shared/PageLoading";


export function SetSpecialistPasswordPage() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Try different parameter names
    const tokenFromUrl = searchParams.get("token") || 
                        searchParams.get("Token") || 
                        searchParams.get("t");
    console.log('Token retrieved:', tokenFromUrl);
    setToken(tokenFromUrl);
  }, [searchParams]);

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [setStaffPasswordApi] = useSetSpecialistPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate token exists
    if (!token) {
      const errorMsg = 'Invalid or missing token. Please use the link provided in your email.';
      setError(errorMsg);
      return;
    }

 
    if (!password.trim()) {
      const errorMsg = 'Password cannot be empty';
      setError(errorMsg);
      return;
    }

    if (password.length < 8) {
      const errorMsg = 'Password must be at least 8 characters';
      setError(errorMsg);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await setStaffPasswordApi({
        password,
        token
      }).unwrap();

      setSuccess(true);
      setPassword('');
    } catch (err: any) {
      const errorMsg =
        err?.data?.message ||
        err?.message ||
        'Failed to set password. The link may have expired.';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking token
  if (!isClient) {
    return (
      <Card className="w-full max-w-md mx-auto p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
          <PageLoading />
        </div>
      </Card>
    );
  }

  if (success) {
    return (
      <Card className="w-full max-w-2xl mx-auto p-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="rounded-full bg-green-50 p-3">
            <CheckCircle2 className="h-20 w-20 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Success!</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Your password has been set successfully. You can now log in with your new password.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary">
            Set Your Password
          </h2>
          <p className="text-base text-muted-foreground mt-2">
            Set a strong password to secure your account
          </p>
        </div>

        <div className="space-y-3">
          <Label htmlFor="password" className="text-base font-medium">
            New Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              disabled={isLoading}
              className="pr-10 h-11 mt-2"
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {password && password.length < 8 && (
            <p className="text-sm text-amber-600">
              Password must be at least 8 characters
            </p>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading || !password || !token}
          className="w-full h-11 text-base font-medium"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Setting Password...
            </>
          ) : (
            'Set Password'
          )}
        </Button>

        {!token && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-sm text-amber-700">
              <AlertCircle className="inline h-4 w-4 mr-1" />
              No token found in URL. Please use the exact link from your email.
            </p>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center">
          Keep your password secure and never share it with anyone
        </p>
      </form>
    </Card>
  );
}