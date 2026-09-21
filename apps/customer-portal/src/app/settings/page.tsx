'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/components/providers/auth-provider';
import { apiClient, ApiError } from '@/lib/api-client';
import { ShieldAlert, KeyRound, Check } from 'lucide-react';

interface SettingsPageProps {
  searchParams?: Promise<{ reason?: string }>;
}

export default function SettingsPage({ searchParams }: SettingsPageProps) {
  const { user, refreshUser } = useAuth();
  const unwrappedParams = searchParams ? React.use(searchParams) : {};
  const forcedReset = unwrappedParams?.reason === 'must_change_password' || (user.mustChangePassword ?? false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const canViewSettings = user.roles.includes('EnterpriseAdmin') || user.roles.includes('CompanyAdmin');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }
    if (newPassword === currentPassword) {
      setError('New password must be different from your current password.');
      return;
    }

    setSubmitting(true);
    try {
      await apiClient('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      // Clears mustChangePassword locally so the forced-redirect in
      // AuthProvider stops sending the user back here.
      await refreshUser();
    } catch (err: any) {
      setError(err instanceof ApiError ? err.message : 'Failed to change password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <PageHeader title="Settings" description="Manage your account security" />

      {forcedReset && (
        <div className="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">You must set a new password to continue</p>
            <p className="text-sm text-amber-700 mt-0.5">
              Your account was created with a temporary system-generated password. Choose a permanent password
              below before using the rest of the portal.
            </p>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <KeyRound className="h-4 w-4 text-slate-400" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md border border-red-200">{error}</div>
            )}
            {success && (
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 text-sm p-3 rounded-md border border-emerald-200">
                <Check className="h-4 w-4 shrink-0" />
                Password updated successfully.
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="current-password">Current password</Label>
              <Input
                id="current-password"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={submitting}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={submitting}
              />
              <p className="text-xs text-slate-400">At least 8 characters.</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm-password">Confirm new password</Label>
              <Input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={submitting}
              />
            </div>

            <Button id="btn-reset-password" type="submit" disabled={submitting}>
              {submitting ? 'Updating...' : 'Reset Password'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {canViewSettings && (
        <div className="mt-6">
          <EmptyState
            title="More Settings Coming Later"
            description="Organization and security policy configuration is not yet supported by the backend."
          />
        </div>
      )}
    </div>
  );
}
