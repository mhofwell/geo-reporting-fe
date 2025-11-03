/**
 * Example usage of the Preferences component
 *
 * This file demonstrates how to integrate the Preferences component
 * into your application's settings flow.
 */

import { useState } from 'react';
import { Preferences } from './Preferences';

export function PreferencesExample() {
  const [showPreferences, setShowPreferences] = useState(true);

  const handleBack = () => {
    // Navigate back to settings overview or previous page
    setShowPreferences(false);
    console.log('Navigating back from preferences');
  };

  const handleNavigateToAccountSettings = () => {
    // Navigate to account settings page
    console.log('Navigating to account settings');
  };

  if (!showPreferences) {
    return (
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <h1 className="text-2xl font-bold">Settings Overview</h1>
        <p className="text-muted-foreground mt-2">
          Click below to view preferences
        </p>
        <button
          onClick={() => setShowPreferences(true)}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Open Preferences
        </button>
      </div>
    );
  }

  return (
    <Preferences
      onBack={handleBack}
      onNavigateToAccountSettings={handleNavigateToAccountSettings}
    />
  );
}

/**
 * Integration with React Router example:
 *
 * import { useNavigate } from 'react-router-dom';
 *
 * function SettingsPage() {
 *   const navigate = useNavigate();
 *
 *   return (
 *     <Preferences
 *       onBack={() => navigate('/settings')}
 *       onNavigateToAccountSettings={() => navigate('/settings/account')}
 *     />
 *   );
 * }
 */
