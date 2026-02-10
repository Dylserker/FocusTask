import type { SupportedLanguage } from './translations';

const localeMap: Record<SupportedLanguage, string> = {
  fr: 'fr-FR',
  en: 'en-US',
  es: 'es-ES',
  de: 'de-DE',
};

export const getLocaleForLanguage = (language: string): string => {
  const base = language.split('-')[0] as SupportedLanguage;
  return localeMap[base] ?? 'fr-FR';
};
