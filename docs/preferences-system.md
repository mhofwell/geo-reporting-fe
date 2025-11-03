# Preferences Implementation Guide

## Overview

This document provides an overview of the Preferences view implementation for the GEO reporting tool. The Preferences view allows users to customize their application experience through a comprehensive settings interface.

## Files Created

### 1. UI Components (shadcn/ui)

#### `/src/components/ui/switch.tsx`
- Toggle switch component using Radix UI
- Used for boolean preference settings (on/off toggles)
- Fully accessible with keyboard support and focus indicators

#### `/src/components/ui/radio-group.tsx`
- Radio button group component using Radix UI
- Used for mutually exclusive options (theme selection, font size, etc.)
- Includes RadioGroup and RadioGroupItem exports

### 2. TypeScript Types

#### `/src/types/preferences.ts`
Defines the complete preferences data structure:
- `Theme`: 'light' | 'dark' | 'system'
- `FontSize`: 'small' | 'medium' | 'large'
- `DefaultView`: 'dashboard' | 'reports' | 'new-report'
- `ReportsPerPage`: 10 | 25 | 50 | 100
- `AutoRefreshInterval`: '30s' | '1min' | '5min'
- `DataRetention`: 30 | 60 | 90
- `UserPreferences`: Complete interface for all preference settings
- `defaultPreferences`: Default values for all settings

### 3. Storage Utilities

#### `/src/utils/storage.ts` (updated)
Added preferences-related functions:
- `savePreferences()`: Save preferences to localStorage
- `loadPreferences()`: Load preferences from localStorage (returns defaults if none exist)
- `resetPreferences()`: Reset to default values
- `exportUserData()`: Export user profile and preferences as JSON file
- `clearAllData()`: Clear all localStorage data
- `clearCache()`: Clear cache while preserving user data

### 4. Main Components

#### `/src/components/settings/Preferences.tsx`
Main preferences view component:
- Header with back navigation
- Icon and title section
- Integrates PreferencesForm component
- Optional navigation to account settings
- Props:
  - `onBack: () => void` - Handle back navigation
  - `onNavigateToAccountSettings?: () => void` - Navigate to account settings

#### `/src/components/settings/forms/PreferencesForm.tsx`
Comprehensive form component with four main sections:

**Appearance Section:**
- Theme selection (Light/Dark/System)
- Font size selection (Small/Medium/Large)
- Compact mode toggle

**Dashboard Defaults Section:**
- Default view on login dropdown
- Reports per page selection
- Auto-refresh toggle
- Auto-refresh interval (conditional - only shown when auto-refresh is enabled)

**Notifications Section:**
- Desktop notifications toggle
- Analysis complete notifications toggle
- Analysis failed notifications toggle
- Weekly summary email toggle

**Data & Privacy Section:**
- Data retention period dropdown
- Export data button
- Clear cache button

**Action Buttons:**
- Save Preferences (primary action)
- Reset to Defaults (with confirmation dialog)

**Features:**
- Real-time state management
- Toast notifications for all actions
- Confirmation dialogs for destructive actions
- Loading states during save operations
- Proper error handling with try-catch blocks

#### `/src/components/settings/index.ts`
Barrel export file for easier imports:
```typescript
export { Preferences } from './Preferences';
export { PreferencesForm } from './forms/PreferencesForm';
```

#### `/src/components/settings/PreferencesExample.tsx`
Example usage and integration guide showing:
- Basic component integration
- Event handler implementation
- React Router integration example

## Component Hierarchy

```
Preferences (main view)
├── Header
│   ├── Back button
│   ├── Icon + Title
│   └── Description
├── PreferencesForm
│   ├── Appearance Card
│   │   ├── Theme RadioGroup
│   │   ├── Font Size RadioGroup
│   │   └── Compact Mode Switch
│   ├── Dashboard Defaults Card
│   │   ├── Default View Select
│   │   ├── Reports Per Page Select
│   │   ├── Auto-refresh Switch
│   │   └── Auto-refresh Interval Select (conditional)
│   ├── Notifications Card
│   │   ├── Desktop Notifications Switch
│   │   ├── Analysis Complete Switch
│   │   ├── Analysis Failed Switch
│   │   └── Weekly Summary Switch
│   ├── Data & Privacy Card
│   │   ├── Data Retention Select
│   │   ├── Export Data Button
│   │   └── Clear Cache Button
│   ├── Action Buttons
│   │   ├── Save Preferences Button
│   │   └── Reset to Defaults Button
│   ├── Reset Confirmation Dialog
│   └── Clear Cache Confirmation Dialog
└── Optional Account Settings Link
```

## Usage Example

### Basic Integration

```typescript
import { Preferences } from '@/components/settings';

function SettingsPage() {
  const handleBack = () => {
    // Navigate back logic
    console.log('Going back to settings overview');
  };

  const handleNavigateToAccount = () => {
    // Navigate to account settings
    console.log('Going to account settings');
  };

  return (
    <Preferences
      onBack={handleBack}
      onNavigateToAccountSettings={handleNavigateToAccount}
    />
  );
}
```

### With React Router

```typescript
import { useNavigate } from 'react-router-dom';
import { Preferences } from '@/components/settings';

function SettingsPreferencesPage() {
  const navigate = useNavigate();

  return (
    <Preferences
      onBack={() => navigate('/settings')}
      onNavigateToAccountSettings={() => navigate('/settings/account')}
    />
  );
}
```

### Reading User Preferences

```typescript
import { loadPreferences } from '@/utils/storage';

function MyComponent() {
  const preferences = loadPreferences();

  // Access specific preferences
  const theme = preferences.appearance.theme;
  const reportsPerPage = preferences.dashboard.reportsPerPage;
  const autoRefresh = preferences.dashboard.autoRefresh;

  // Use preferences in your component logic
  return <div>{/* Your component */}</div>;
}
```

## Data Flow

1. **Load**: Component mounts → `loadPreferences()` → Loads from localStorage or returns defaults
2. **Edit**: User changes settings → Updates local state
3. **Save**: User clicks "Save" → `savePreferences()` → Saves to localStorage → Toast notification
4. **Reset**: User clicks "Reset" → Confirmation dialog → `resetPreferences()` → Updates state → Toast
5. **Export**: User clicks "Export" → `exportUserData()` → Downloads JSON file
6. **Clear Cache**: User clicks "Clear Cache" → Confirmation dialog → `clearCache()` → Toast

## localStorage Keys

- `geo-user-profile`: User profile data
- `geo-user-preferences`: User preferences data

## Styling & Theming

All components use:
- Tailwind CSS utility classes
- shadcn/ui design tokens
- CSS variables for colors (defined in your theme)
- Responsive design with proper spacing
- Dark mode support (when implemented)

## Accessibility Features

- Proper ARIA labels on all form controls
- Keyboard navigation support
- Focus indicators on interactive elements
- Semantic HTML structure
- Screen reader friendly labels and descriptions
- Confirmation dialogs for destructive actions

## Future Enhancements

1. **Theme Implementation**: Actually apply theme changes to the application
2. **Font Size Implementation**: Apply font size classes to the root element
3. **Compact Mode**: Apply compact mode classes throughout the app
4. **Notifications**: Integrate browser notification API
5. **Data Retention**: Implement automatic data cleanup based on retention period
6. **Auto-refresh**: Implement actual auto-refresh logic in dashboard

## Dependencies Added

- `@radix-ui/react-switch`: ^1.1.3 (or latest)
- `@radix-ui/react-radio-group`: ^1.2.2 (or latest)

Existing dependencies used:
- `react-hot-toast`: For toast notifications
- `lucide-react`: For icons
- `@radix-ui/react-select`: For dropdowns
- `@radix-ui/react-dialog`: For confirmation dialogs

## Testing Checklist

- [ ] All form fields update state correctly
- [ ] Save button persists preferences to localStorage
- [ ] Reset button shows confirmation and resets to defaults
- [ ] Export button downloads JSON file with correct data
- [ ] Clear cache button shows confirmation and clears data
- [ ] Toast notifications appear for all actions
- [ ] Conditional rendering (auto-refresh interval) works correctly
- [ ] All TypeScript types are correct
- [ ] Component is responsive on mobile/tablet/desktop
- [ ] Keyboard navigation works throughout
- [ ] Focus indicators are visible

## Notes

- All type imports use `import type` syntax for compatibility with `verbatimModuleSyntax`
- Error handling is implemented for all storage operations
- Confirmation dialogs prevent accidental data loss
- The component follows existing patterns from the codebase
- All code is fully typed with TypeScript strict mode
