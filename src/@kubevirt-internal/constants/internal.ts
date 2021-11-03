export enum BadgeType {
  DEV = 'Dev Preview',
  TECH = 'Tech Preview',
}

export const LAST_LANGUAGE_LOCAL_STORAGE_KEY = 'bridge/last-language';

type AccessMode = 'ReadWriteOnce' | 'ReadWriteMany' | 'ReadOnlyMany';
export const initialAccessModes: AccessMode[] = ['ReadWriteOnce', 'ReadWriteMany', 'ReadOnlyMany'];

export enum InventoryStatusGroup {
  WARN = 'WARN',
  ERROR = 'ERROR',
  PROGRESS = 'PROGRESS',
  NOT_MAPPED = 'NOT_MAPPED',
  UNKNOWN = 'UNKNOWN',
}
