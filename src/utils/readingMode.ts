import { useState, useEffect } from 'react';

const STORAGE_KEY = 'eilm_reading_dark_mode';
const EVENT_NAME = 'eilm_reading_dark_mode_change';

export const getReadingDarkMode = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

export const setReadingDarkMode = (enabled: boolean): void => {
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false');
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: enabled }));
  } catch {}
};

export const useReadingDarkMode = () => {
  const [isDark, setIsDarkState] = useState<boolean>(getReadingDarkMode);

  useEffect(() => {
    const handler = (e: any) => {
      setIsDarkState(e.detail);
    };
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }, []);

  const toggle = () => {
    const next = !isDark;
    setReadingDarkMode(next);
    setIsDarkState(next);
  };

  return { 
    isDark, 
    toggle, 
    setDark: (val: boolean) => {
      setReadingDarkMode(val);
      setIsDarkState(val);
    }
  };
};

