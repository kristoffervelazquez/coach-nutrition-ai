"use client";

import { useLanguage, Language } from '@/app/contexts/LanguageContext';
import { useMemo } from 'react';

// Import translation files
import enTranslations from '@/app/locales/en.json';
import esTranslations from '@/app/locales/es.json';

type TranslationKey = string;
type Translations = typeof enTranslations;

const translations: Record<Language, Translations> = {
  en: enTranslations,
  es: esTranslations,
};

/**
 * Get nested value from object using dot notation
 * e.g. getNestedValue(obj, 'chat.greeting') returns obj.chat.greeting
 */
function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
}

/**
 * Custom hook for translations
 * Usage: 
 * const t = useTranslation();
 * t('chat.greeting') // Returns translated text
 * t('chat.placeholder', { name: 'John' }) // With interpolation (future feature)
 */
export function useTranslation() {
  const { language, isLoading } = useLanguage();

  const t = useMemo(() => {
    return (key: TranslationKey, params?: Record<string, string | number>): string => {
      if (isLoading) return key; // Return key while loading
      
      const translation = getNestedValue(translations[language], key);
      
      if (!translation) {
        console.warn(`Translation missing for key: ${key} in language: ${language}`);
        return key; // Return the key if translation is missing
      }

      // Simple interpolation (replace {{param}} with values)
      if (params) {
        return Object.keys(params).reduce((text, paramKey) => {
          const pattern = new RegExp(`{{${paramKey}}}`, 'g');
          return text.replace(pattern, String(params[paramKey]));
        }, translation);
      }

      return translation;
    };
  }, [language, isLoading]);

  return t;
}

/**
 * Hook to get current language info
 */
export function useLanguageInfo() {
  const { language, setLanguage, isLoading } = useLanguage();
  
  return {
    currentLanguage: language,
    changeLanguage: setLanguage,
    isLoading,
    availableLanguages: [
      { code: 'es' as Language, name: 'Español', flag: '🇲🇽' },
      { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
    ]
  };
}