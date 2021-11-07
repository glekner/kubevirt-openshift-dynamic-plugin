export enum BadgeType {
  DEV = 'Dev Preview',
  TECH = 'Tech Preview',
}

export const LAST_LANGUAGE_LOCAL_STORAGE_KEY = 'bridge/last-language';

export enum InventoryStatusGroup {
  WARN = 'WARN',
  ERROR = 'ERROR',
  PROGRESS = 'PROGRESS',
  NOT_MAPPED = 'NOT_MAPPED',
  UNKNOWN = 'UNKNOWN',
}

export const USERSETTINGS_PREFIX = 'console';
export const ALL_APPLICATIONS_KEY = '#ALL_APPS#';
export const APPLICATION_LOCAL_STORAGE_KEY = 'dropdown-storage-applications';
export const APPLICATION_USERSETTINGS_PREFIX = `${USERSETTINGS_PREFIX}.applications`;
export const UNASSIGNED_APPLICATIONS_KEY = '#UNASSIGNED_APP#';
