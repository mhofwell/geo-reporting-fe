export type Theme = 'light' | 'dark' | 'system';
export type FontSize = 'small' | 'medium' | 'large';
export type DefaultView = 'dashboard' | 'reports' | 'new-report';
export type ReportsPerPage = 10 | 25 | 50 | 100;
export type AutoRefreshInterval = '30s' | '1min' | '5min';
export type DataRetention = 30 | 60 | 90;

export interface UserPreferences {
  appearance: {
    theme: Theme;
    fontSize: FontSize;
    compactMode: boolean;
  };
  dashboard: {
    defaultView: DefaultView;
    reportsPerPage: ReportsPerPage;
    autoRefresh: boolean;
    autoRefreshInterval: AutoRefreshInterval;
  };
  notifications: {
    desktopNotifications: boolean;
    analysisComplete: boolean;
    analysisFailed: boolean;
    weeklySummary: boolean;
  };
  privacy: {
    dataRetention: DataRetention;
  };
}

export const defaultPreferences: UserPreferences = {
  appearance: {
    theme: 'system',
    fontSize: 'medium',
    compactMode: false,
  },
  dashboard: {
    defaultView: 'dashboard',
    reportsPerPage: 25,
    autoRefresh: true,
    autoRefreshInterval: '1min',
  },
  notifications: {
    desktopNotifications: true,
    analysisComplete: true,
    analysisFailed: true,
    weeklySummary: false,
  },
  privacy: {
    dataRetention: 60,
  },
};
