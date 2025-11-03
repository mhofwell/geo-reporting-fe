import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type {
  UserPreferences,
  Theme,
  FontSize,
  DefaultView,
  ReportsPerPage,
  AutoRefreshInterval,
  DataRetention,
} from '@/types/preferences';
import {
  loadPreferences,
  savePreferences,
  resetPreferences,
  exportUserData,
  clearCache,
} from '@/utils/storage';
import toast from 'react-hot-toast';
import { Download, RotateCcw, Trash2 } from 'lucide-react';

interface PreferencesFormProps {
  onSave?: () => void;
}

export function PreferencesForm({ onSave }: PreferencesFormProps) {
  const [preferences, setPreferences] = useState<UserPreferences>(loadPreferences());
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showClearCacheDialog, setShowClearCacheDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load preferences on mount
  useEffect(() => {
    const loaded = loadPreferences();
    setPreferences(loaded);
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      savePreferences(preferences);
      toast.success('Preferences saved successfully');
      onSave?.();
    } catch (error) {
      toast.error('Failed to save preferences');
      console.error('Error saving preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    try {
      const defaults = resetPreferences();
      setPreferences(defaults);
      setShowResetDialog(false);
      toast.success('Preferences reset to defaults');
    } catch (error) {
      toast.error('Failed to reset preferences');
      console.error('Error resetting preferences:', error);
    }
  };

  const handleExportData = () => {
    try {
      exportUserData();
      toast.success('User data exported successfully');
    } catch (error) {
      toast.error('Failed to export user data');
      console.error('Error exporting data:', error);
    }
  };

  const handleClearCache = () => {
    try {
      clearCache();
      setShowClearCacheDialog(false);
      toast.success('Cache cleared successfully');
    } catch (error) {
      toast.error('Failed to clear cache');
      console.error('Error clearing cache:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Appearance Card */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how the application looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme */}
          <div className="space-y-3">
            <Label>Theme</Label>
            <RadioGroup
              value={preferences.appearance.theme}
              onValueChange={(value: Theme) =>
                setPreferences({
                  ...preferences,
                  appearance: { ...preferences.appearance, theme: value },
                })
              }
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="theme-light" />
                <Label htmlFor="theme-light" className="font-normal cursor-pointer">
                  Light
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="theme-dark" />
                <Label htmlFor="theme-dark" className="font-normal cursor-pointer">
                  Dark
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="theme-system" />
                <Label htmlFor="theme-system" className="font-normal cursor-pointer">
                  System
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Font Size */}
          <div className="space-y-3">
            <Label>Font Size</Label>
            <RadioGroup
              value={preferences.appearance.fontSize}
              onValueChange={(value: FontSize) =>
                setPreferences({
                  ...preferences,
                  appearance: { ...preferences.appearance, fontSize: value },
                })
              }
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="small" id="font-small" />
                <Label htmlFor="font-small" className="font-normal cursor-pointer">
                  Small
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="font-medium" />
                <Label htmlFor="font-medium" className="font-normal cursor-pointer">
                  Medium
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="large" id="font-large" />
                <Label htmlFor="font-large" className="font-normal cursor-pointer">
                  Large
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Compact Mode */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="compact-mode">Compact Mode</Label>
              <p className="text-sm text-muted-foreground">
                Reduce spacing and padding throughout the app
              </p>
            </div>
            <Switch
              id="compact-mode"
              checked={preferences.appearance.compactMode}
              onCheckedChange={(checked) =>
                setPreferences({
                  ...preferences,
                  appearance: { ...preferences.appearance, compactMode: checked },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Defaults Card */}
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Defaults</CardTitle>
          <CardDescription>Configure default dashboard behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Default View */}
          <div className="space-y-3">
            <Label htmlFor="default-view">Default View on Login</Label>
            <Select
              value={preferences.dashboard.defaultView}
              onValueChange={(value: DefaultView) =>
                setPreferences({
                  ...preferences,
                  dashboard: { ...preferences.dashboard, defaultView: value },
                })
              }
            >
              <SelectTrigger id="default-view">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dashboard">Dashboard</SelectItem>
                <SelectItem value="reports">Reports</SelectItem>
                <SelectItem value="new-report">New Report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Reports Per Page */}
          <div className="space-y-3">
            <Label htmlFor="reports-per-page">Reports Per Page</Label>
            <Select
              value={preferences.dashboard.reportsPerPage.toString()}
              onValueChange={(value) =>
                setPreferences({
                  ...preferences,
                  dashboard: {
                    ...preferences.dashboard,
                    reportsPerPage: parseInt(value) as ReportsPerPage,
                  },
                })
              }
            >
              <SelectTrigger id="reports-per-page">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Auto-refresh Reports */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-refresh">Auto-refresh Reports</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically refresh reports list
                </p>
              </div>
              <Switch
                id="auto-refresh"
                checked={preferences.dashboard.autoRefresh}
                onCheckedChange={(checked) =>
                  setPreferences({
                    ...preferences,
                    dashboard: { ...preferences.dashboard, autoRefresh: checked },
                  })
                }
              />
            </div>

            {/* Auto-refresh Interval - Only show if auto-refresh is enabled */}
            {preferences.dashboard.autoRefresh && (
              <div className="space-y-3 pl-4">
                <Label htmlFor="refresh-interval">Auto-refresh Interval</Label>
                <Select
                  value={preferences.dashboard.autoRefreshInterval}
                  onValueChange={(value: AutoRefreshInterval) =>
                    setPreferences({
                      ...preferences,
                      dashboard: { ...preferences.dashboard, autoRefreshInterval: value },
                    })
                  }
                >
                  <SelectTrigger id="refresh-interval">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30s">30 seconds</SelectItem>
                    <SelectItem value="1min">1 minute</SelectItem>
                    <SelectItem value="5min">5 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notifications Card */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Desktop Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="desktop-notifications">Desktop Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Show browser notifications for updates
              </p>
            </div>
            <Switch
              id="desktop-notifications"
              checked={preferences.notifications.desktopNotifications}
              onCheckedChange={(checked) =>
                setPreferences({
                  ...preferences,
                  notifications: { ...preferences.notifications, desktopNotifications: checked },
                })
              }
            />
          </div>

          <Separator />

          {/* Analysis Complete */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="analysis-complete">Analysis Complete</Label>
              <p className="text-sm text-muted-foreground">
                Notify when analysis finishes successfully
              </p>
            </div>
            <Switch
              id="analysis-complete"
              checked={preferences.notifications.analysisComplete}
              onCheckedChange={(checked) =>
                setPreferences({
                  ...preferences,
                  notifications: { ...preferences.notifications, analysisComplete: checked },
                })
              }
            />
          </div>

          <Separator />

          {/* Analysis Failed */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="analysis-failed">Analysis Failed</Label>
              <p className="text-sm text-muted-foreground">Notify when analysis fails</p>
            </div>
            <Switch
              id="analysis-failed"
              checked={preferences.notifications.analysisFailed}
              onCheckedChange={(checked) =>
                setPreferences({
                  ...preferences,
                  notifications: { ...preferences.notifications, analysisFailed: checked },
                })
              }
            />
          </div>

          <Separator />

          {/* Weekly Summary Email */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="weekly-summary">Weekly Summary Email</Label>
              <p className="text-sm text-muted-foreground">
                Receive weekly report summaries via email
              </p>
            </div>
            <Switch
              id="weekly-summary"
              checked={preferences.notifications.weeklySummary}
              onCheckedChange={(checked) =>
                setPreferences({
                  ...preferences,
                  notifications: { ...preferences.notifications, weeklySummary: checked },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Data & Privacy Card */}
      <Card>
        <CardHeader>
          <CardTitle>Data & Privacy</CardTitle>
          <CardDescription>Manage your data and privacy settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Data Retention Period */}
          <div className="space-y-3">
            <Label htmlFor="data-retention">Data Retention Period</Label>
            <p className="text-sm text-muted-foreground mb-2">
              How long to keep your analysis data
            </p>
            <Select
              value={preferences.privacy.dataRetention.toString()}
              onValueChange={(value) =>
                setPreferences({
                  ...preferences,
                  privacy: {
                    ...preferences.privacy,
                    dataRetention: parseInt(value) as DataRetention,
                  },
                })
              }
            >
              <SelectTrigger id="data-retention">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="60">60 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Export Data */}
          <div className="space-y-3">
            <Label>Export Data</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Download your profile and preferences as JSON
            </p>
            <Button variant="outline" onClick={handleExportData} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Export User Data
            </Button>
          </div>

          <Separator />

          {/* Clear Cache */}
          <div className="space-y-3">
            <Label>Clear Cache</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Clear cached data while preserving your settings
            </p>
            <Button
              variant="outline"
              onClick={() => setShowClearCacheDialog(true)}
              className="w-full"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Cache
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={isSaving} className="flex-1">
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </Button>
        <Button variant="outline" onClick={() => setShowResetDialog(true)}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset to Defaults
        </Button>
      </div>

      {/* Reset Confirmation Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset to Defaults?</DialogTitle>
            <DialogDescription>
              This will reset all preferences to their default values. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleReset} variant="destructive">
              Reset Preferences
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear Cache Confirmation Dialog */}
      <Dialog open={showClearCacheDialog} onOpenChange={setShowClearCacheDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear Cache?</DialogTitle>
            <DialogDescription>
              This will clear all cached data while preserving your profile and preferences. This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearCacheDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleClearCache} variant="destructive">
              Clear Cache
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
