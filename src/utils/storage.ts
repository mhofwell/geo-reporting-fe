import type { UserProfile } from '@/types/user';
import type { UserPreferences } from '@/types/preferences';
import { defaultPreferences } from '@/types/preferences';

const USER_PROFILE_KEY = 'geo-user-profile';
const USER_PREFERENCES_KEY = 'geo-user-preferences';

/**
 * Save user profile to localStorage
 */
export const saveUserProfile = (profile: UserProfile): void => {
  try {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Failed to save user profile:', error);
    throw new Error('Failed to save profile to storage');
  }
};

/**
 * Load user profile from localStorage
 */
export const loadUserProfile = (): UserProfile | null => {
  try {
    const saved = localStorage.getItem(USER_PROFILE_KEY);
    if (!saved) {
      return null;
    }
    return JSON.parse(saved) as UserProfile;
  } catch (error) {
    console.error('Failed to load user profile:', error);
    return null;
  }
};

/**
 * Clear user profile from localStorage
 */
export const clearUserProfile = (): void => {
  try {
    localStorage.removeItem(USER_PROFILE_KEY);
  } catch (error) {
    console.error('Failed to clear user profile:', error);
    throw new Error('Failed to clear profile from storage');
  }
};

/**
 * Get default user profile
 */
export const getDefaultUserProfile = (): UserProfile => {
  return {
    name: 'GEO User',
    email: 'user@example.com',
    createdAt: new Date().toISOString(),
  };
};

/**
 * Initialize user profile if not exists
 */
export const initializeUserProfile = (): UserProfile => {
  const existing = loadUserProfile();
  if (existing) {
    return existing;
  }

  const defaultProfile = getDefaultUserProfile();
  saveUserProfile(defaultProfile);
  return defaultProfile;
};

// ==================== User Preferences Functions ====================

/**
 * Save user preferences to localStorage
 */
export const savePreferences = (preferences: UserPreferences): void => {
  try {
    localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Failed to save user preferences:', error);
    throw new Error('Failed to save preferences to storage');
  }
};

/**
 * Load user preferences from localStorage
 */
export const loadPreferences = (): UserPreferences => {
  try {
    const saved = localStorage.getItem(USER_PREFERENCES_KEY);
    return saved ? JSON.parse(saved) : defaultPreferences;
  } catch (error) {
    console.error('Failed to load user preferences:', error);
    return defaultPreferences;
  }
};

/**
 * Reset user preferences to defaults
 */
export const resetPreferences = (): UserPreferences => {
  try {
    localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(defaultPreferences));
    return defaultPreferences;
  } catch (error) {
    console.error('Failed to reset preferences:', error);
    throw new Error('Failed to reset preferences');
  }
};

/**
 * Export all user data as JSON file
 */
export const exportUserData = (): void => {
  try {
    const profile = loadUserProfile();
    const preferences = loadPreferences();
    const data = {
      profile,
      preferences,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `geo-user-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export user data:', error);
    throw new Error('Failed to export user data');
  }
};

/**
 * Clear all data from localStorage
 */
export const clearAllData = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Failed to clear all data:', error);
    throw new Error('Failed to clear all data');
  }
};

/**
 * Clear cache while preserving user data
 */
export const clearCache = (): void => {
  try {
    // Clear specific cache items while preserving user data
    const keysToPreserve = [USER_PROFILE_KEY, USER_PREFERENCES_KEY];
    const allKeys = Object.keys(localStorage);

    allKeys.forEach(key => {
      if (!keysToPreserve.includes(key)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Failed to clear cache:', error);
    throw new Error('Failed to clear cache');
  }
};
