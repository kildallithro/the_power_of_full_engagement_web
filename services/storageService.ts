import { EnergyLog } from '../types';

const STORAGE_KEY = 'full_engagement_logs_v1';

export const getLogs = (): EnergyLog[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load logs", error);
    return [];
  }
};

export const saveLog = (log: EnergyLog): EnergyLog[] => {
  const currentLogs = getLogs();
  const updatedLogs = [log, ...currentLogs];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
  return updatedLogs;
};

export const clearLogs = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const exportData = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  const blob = new Blob([data || '[]'], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `energy-logs-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
