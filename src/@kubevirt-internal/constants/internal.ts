export enum BadgeType {
  DEV = 'Dev Preview',
  TECH = 'Tech Preview',
}

export const LAST_LANGUAGE_LOCAL_STORAGE_KEY = 'bridge/last-language';

type AccessMode = 'ReadWriteOnce' | 'ReadWriteMany' | 'ReadOnlyMany';
export const initialAccessModes: AccessMode[] = ['ReadWriteOnce', 'ReadWriteMany', 'ReadOnlyMany'];
