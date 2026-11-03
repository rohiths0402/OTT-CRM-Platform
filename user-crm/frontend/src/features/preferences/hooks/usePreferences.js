
import { useCallback, useState } from 'react';
import { usePreferencesContext } from '../context/PreferencesContext';

export function usePreferences() {
  const {
    data,
    update,
    save: savePreferences,
    loading,
    error: loadError,
  } = usePreferencesContext();

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleUpdate = useCallback((section, key, value) => {
    update(section, key, value);
    setMessage('');
    setError('');
  }, [update]);

  const save = useCallback(async () => {
    try {
      setSaving(true);
      setMessage('');
      setError('');

      await savePreferences();

      setMessage('Preferences saved successfully');
    } catch (err) {
      setError(
        err?.message || 'Unable to save preferences'
      );
    } finally {
      setSaving(false);
    }
  }, [savePreferences]);

  return {
    data,
    message,
    error: error || loadError,
    loading,
    saving,
    update: handleUpdate,
    save,
  };
}
