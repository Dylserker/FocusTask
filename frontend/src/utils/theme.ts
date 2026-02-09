export type Theme = 'light' | 'dark' | 'auto';

const STORAGE_KEY = 'theme';

const resolveTheme = (theme: Theme): 'light' | 'dark' => {
  if (theme === 'auto') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
};

export const applyTheme = (theme: Theme) => {
  const resolved = resolveTheme(theme);
  document.documentElement.setAttribute('data-theme', resolved);
  document.documentElement.style.colorScheme = resolved;
};

export const setStoredTheme = (theme: Theme) => {
  localStorage.setItem(STORAGE_KEY, theme);
};

export const getStoredTheme = (): Theme | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'auto') {
    return stored;
  }
  return null;
};
