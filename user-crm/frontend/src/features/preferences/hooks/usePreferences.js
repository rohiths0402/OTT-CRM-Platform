import { useEffect, useState } from 'react';
import { preferencesService } from '../services/preferencesService';

export function usePreferences() {
  const [data, setData] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  useEffect(() => { preferencesService.get().then(setData).catch((e) => setError(e?.message || 'Unable to load preferences')); }, []);
  const update = (section, key, value) => setData((current) => ({ ...current, [section]: { ...current[section], [key]: value } }));
  const save = async () => { try { await preferencesService.save(data); setMessage('Preferences saved'); setError(''); } catch (e) { setError(e?.message || 'Save failed'); } };
  return { data, setData, message, error, update, save };
}
