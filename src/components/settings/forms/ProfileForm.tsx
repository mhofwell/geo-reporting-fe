import { useState, useRef } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { User, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { UserProfile } from '@/types/user';
import toast from 'react-hot-toast';

interface ProfileFormProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

/**
 * Profile information form with avatar upload
 * Handles validation and displays success/error notifications
 */
export function ProfileForm({ profile, onSave }: ProfileFormProps) {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle input changes
  const handleChange = (field: keyof UserProfile, value: string) => {
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

  // Handle avatar upload
  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData((prev) => ({ ...prev, avatar: base64String }));
      toast.success('Avatar updated');
    };
    reader.onerror = () => {
      toast.error('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  // Trigger file input click
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email || !isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Email validation
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate async save
      await new Promise((resolve) => setTimeout(resolve, 500));
      onSave(formData);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to save profile');
      console.error('Profile save error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData(profile);
    setErrors({});
    toast('Changes discarded', { icon: '↩️' });
  };

  // Get user initials for avatar fallback
  const getInitials = () => {
    return formData.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(profile);

  return (
    <Card>
      <CardHeader className="pb-6">
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your personal information and profile picture
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={formData.avatar} alt={formData.name} />
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                {getInitials() || <User className="h-12 w-12" />}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAvatarClick}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload Avatar
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                aria-label="Upload avatar image"
              />
              <p className="text-xs text-muted-foreground">
                JPG, PNG or GIF. Max size 2MB.
              </p>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="John Doe"
              className={errors.name ? 'border-destructive' : ''}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <p id="name-error" className="text-sm text-destructive">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="john@example.com"
              className={errors.email ? 'border-destructive' : ''}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-destructive">
                {errors.email}
              </p>
            )}
          </div>

          {/* Company */}
          <div className="space-y-2">
            <Label htmlFor="company">Company/Organization (Optional)</Label>
            <Input
              id="company"
              type="text"
              value={formData.company || ''}
              onChange={(e) => handleChange('company', e.target.value)}
              placeholder="Acme Inc."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting || !hasChanges}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting || !hasChanges}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
