import { PreferencesForm } from './forms/PreferencesForm';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';

interface PreferencesProps {
  onBack: () => void;
  onNavigateToAccountSettings?: () => void;
}

export function Preferences({ onNavigateToAccountSettings }: PreferencesProps) {
  const handleSave = () => {
    // Optional callback after successful save
    // Could navigate back or show additional feedback
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <SlidersHorizontal className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Preferences</h1>
            <p className="text-muted-foreground">
              Customize your experience and configure application settings
            </p>
          </div>
        </div>
      </div>

      {/* Preferences Form */}
      <PreferencesForm onSave={handleSave} />

      {/* Additional Navigation (Optional) */}
      {onNavigateToAccountSettings && (
        <div className="mt-8 pt-6 border-t">
          <p className="text-sm text-muted-foreground mb-3">
            Looking for account settings?
          </p>
          <Button variant="link" onClick={onNavigateToAccountSettings} className="px-0">
            Go to Account Settings
          </Button>
        </div>
      )}
    </div>
  );
}
