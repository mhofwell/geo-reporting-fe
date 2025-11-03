import { useState, useEffect } from 'react';
import { AlertTriangle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ProfileForm } from './forms/ProfileForm';
import { PasswordForm } from './forms/PasswordForm';
import type { UserProfile } from '@/types/user';
import { loadUserProfile, saveUserProfile, clearUserProfile, initializeUserProfile } from '@/utils/storage';
import toast from 'react-hot-toast';

interface AccountSettingsProps {
  onBack: () => void;
}

/**
 * Account Settings main component
 * Contains profile information, security settings, and danger zone
 */
export function AccountSettings({ onBack }: AccountSettingsProps) {
  const [userProfile, setUserProfile] = useState<UserProfile>(initializeUserProfile());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load user profile on mount
  useEffect(() => {
    const profile = loadUserProfile();
    if (profile) {
      setUserProfile(profile);
    }
  }, []);

  // Handle profile save
  const handleProfileSave = (updatedProfile: UserProfile) => {
    try {
      saveUserProfile(updatedProfile);
      setUserProfile(updatedProfile);
    } catch (error) {
      toast.error('Failed to save profile');
      console.error('Profile save error:', error);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    setIsDeleting(true);

    try {
      // Simulate async deletion
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Clear all user data
      clearUserProfile();

      // Show success message
      toast.success('Account deleted successfully');

      // Close dialog
      setShowDeleteDialog(false);

      // In a real app, this would redirect to login or home page
      // For now, just go back to dashboard
      setTimeout(() => {
        onBack();
      }, 1000);
    } catch (error) {
      toast.error('Failed to delete account');
      console.error('Account deletion error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Account</h1>
            <p className="text-muted-foreground">
              Manage your profile, security settings, and account preferences
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Profile Information Section */}
        <ProfileForm profile={userProfile} onSave={handleProfileSave} />

      {/* Security Section */}
      <PasswordForm />

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
          </div>
          <CardDescription>
            Irreversible actions that affect your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive" className="bg-destructive/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Deleting your account is permanent and cannot be undone. All your data,
              analyses, and reports will be permanently removed.
            </AlertDescription>
          </Alert>

          <div className="flex items-center justify-between pt-2">
            <div className="space-y-1">
              <p className="font-medium">Delete Account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              className="ml-4"
            >
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Account?
            </DialogTitle>
            <DialogDescription className="space-y-2 pt-2">
              <p>
                This action <strong>cannot be undone</strong>. This will permanently delete
                your account and remove all your data from our servers.
              </p>
              <p className="text-sm">
                The following data will be permanently deleted:
              </p>
              <ul className="text-sm list-disc list-inside space-y-1 text-muted-foreground">
                <li>Your profile information</li>
                <li>All analysis reports and queries</li>
                <li>Your preferences and settings</li>
                <li>Historical data and insights</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting Account...' : 'Yes, Delete My Account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
