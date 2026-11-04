
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  preferencesService,
  DEFAULT_PREFERENCES,
} from '../services/preferencesService';

const PreferencesContext = createContext(null);

export function PreferencesProvider({ children }) {
  const [data, setData] = useState(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadPreferences() {
      try {
        const preferences = await preferencesService.get();

        if (active) {
          setData(preferences);
        }
      } catch (err) {
        if (active) {
          setError(
            err?.message || 'Unable to load preferences'
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadPreferences();

    return () => {
      active = false;
    };
  }, []);

  // Midnight is the permanent Loop CRM theme.
  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      'midnight'
    );

    document.documentElement.setAttribute(
      'data-density',
      data.appearance.density
    );
  }, [data.appearance.density]);

  const update = useCallback((section, key, value) => {
    setData((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [key]: section === 'appearance' && key === 'theme'
          ? 'midnight'
          : value,
      },
    }));
  }, []);

  const save = useCallback(async () => {
    const saved = await preferencesService.save(data);
    setData(saved);
    return saved;
  }, [data]);

  return (
    <PreferencesContext.Provider
      value={{
        data,
        setData,
        update,
        save,
        loading,
        error,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferencesContext() {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error(
      'usePreferencesContext must be used inside PreferencesProvider'
    );
  }

  return context;
}
