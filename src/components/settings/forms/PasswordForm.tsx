import { useState } from 'react';
import type { FormEvent } from 'react';
import { Eye, EyeOff, Lock, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { PasswordChange } from '@/types/user';
import {
  calculatePasswordStrength,
  passwordRequirements,
  getPasswordStrengthColor,
  getPasswordStrengthProgress,
  isPasswordValid,
} from '@/utils/password';
import toast from 'react-hot-toast';

/**
 * Password change form with strength indicator and validation
 */
export function PasswordForm() {
  const [formData, setFormData] = useState<PasswordChange>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const passwordStrength = calculatePasswordStrength(formData.newPassword);

  // Handle input changes
  const handleChange = (field: keyof PasswordChange, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (!isPasswordValid(formData.newPassword)) {
      newErrors.newPassword = 'Password does not meet all requirements';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.currentPassword && formData.newPassword && formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate async password change
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, this would call an API endpoint
      // For now, just show success and reset form
      toast.success('Password changed successfully');

      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setErrors({});
    } catch (error) {
      toast.error('Failed to change password');
      console.error('Password change error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setErrors({});
  };

  const hasData = formData.currentPassword || formData.newPassword || formData.confirmPassword;

  return (
    <Card>
      <CardHeader className="pb-6">
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Change Password</CardTitle>
        </div>
        <CardDescription>
          Update your password to keep your account secure
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword">
              Current Password <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPasswords.current ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={(e) => handleChange('currentPassword', e.target.value)}
                placeholder="Enter current password"
                className={errors.currentPassword ? 'border-destructive pr-10' : 'pr-10'}
                aria-invalid={!!errors.currentPassword}
                aria-describedby={errors.currentPassword ? 'current-password-error' : undefined}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPasswords.current ? 'Hide password' : 'Show password'}
              >
                {showPasswords.current ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p id="current-password-error" className="text-sm text-destructive">
                {errors.currentPassword}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">
              New Password <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPasswords.new ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => handleChange('newPassword', e.target.value)}
                placeholder="Enter new password"
                className={errors.newPassword ? 'border-destructive pr-10' : 'pr-10'}
                aria-invalid={!!errors.newPassword}
                aria-describedby={errors.newPassword ? 'new-password-error' : undefined}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPasswords.new ? 'Hide password' : 'Show password'}
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p id="new-password-error" className="text-sm text-destructive">
                {errors.newPassword}
              </p>
            )}

            {/* Password Strength Indicator */}
            {formData.newPassword && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Password strength:</span>
                  <span className={`font-medium capitalize ${getPasswordStrengthColor(passwordStrength)}`}>
                    {passwordStrength}
                  </span>
                </div>
                <Progress value={getPasswordStrengthProgress(passwordStrength)} className="h-2" />
              </div>
            )}

            {/* Password Requirements */}
            <div className="space-y-2 pt-2">
              <p className="text-sm font-medium text-muted-foreground">
                Password requirements:
              </p>
              <ul className="space-y-1">
                {passwordRequirements.map((requirement, index) => {
                  const isMet = requirement.test(formData.newPassword);
                  return (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      {isMet ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className={isMet ? 'text-foreground' : 'text-muted-foreground'}>
                        {requirement.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              Confirm New Password <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPasswords.confirm ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                placeholder="Confirm new password"
                className={errors.confirmPassword ? 'border-destructive pr-10' : 'pr-10'}
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPasswords.confirm ? 'Hide password' : 'Show password'}
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p id="confirm-password-error" className="text-sm text-destructive">
                {errors.confirmPassword}
              </p>
            )}
            {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
              <p className="text-sm text-green-500 flex items-center gap-1">
                <Check className="h-4 w-4" />
                Passwords match
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting || !hasData}>
              {isSubmitting ? 'Changing Password...' : 'Change Password'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting || !hasData}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
