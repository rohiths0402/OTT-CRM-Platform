
import { api } from '../../../services/api/apiClient';
import { mockStore } from '../../../services/mock/mockStore';

const MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false';
const STORAGE_KEY = 'loop-crm-preferences';

export const DEFAULT_PREFERENCES = {
  profile: {
    displayName: '',
    email: '',
    timezone: 'Asia/Kolkata',
  },
  notifications: {
    email: true,
    push: true,
    securityAlerts: true,
    dailySummary: false,
  },
  appearance: {
    theme: 'midnight',
    density: 'comfortable',
  },
};

function normalize(data) {
  const result = data?.data ?? data ?? {};

  return {
    profile: {
      ...DEFAULT_PREFERENCES.profile,
      ...(result.profile || {}),
    },
    notifications: {
      ...DEFAULT_PREFERENCES.notifications,
      ...(result.notifications || {}),
    },
    appearance: {
      theme: 'midnight',
      density:
        result.appearance?.density === 'compact'
          ? 'compact'
          : 'comfortable',
    },
  };
}

export const preferencesService = {
  async get() {
    if (MOCK) {
      let mockData = {};
      let storedData = {};

      try {
        mockData = await mockStore.getPreferences();
      } catch (error) {
        console.warn('Mock preferences unavailable:', error);
      }

      try {
        storedData = JSON.parse(
          localStorage.getItem(STORAGE_KEY) || '{}'
        );
      } catch {
        storedData = {};
      }

      return normalize({
        ...mockData,
        ...storedData,
        profile: {
          ...mockData?.profile,
          ...storedData?.profile,
        },
        notifications: {
          ...mockData?.notifications,
          ...storedData?.notifications,
        },
        appearance: {
          ...mockData?.appearance,
          ...storedData?.appearance,
        },
      });
    }

    const response = await api.get('/users/me/preferences');
    return normalize(response);
  },

  async save(data) {
    const preferences = normalize(data);

    if (MOCK) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(preferences)
      );

      try {
        await mockStore.savePreferences(preferences);
      } catch (error) {
        console.warn('Mock store save failed:', error);
      }

      return preferences;
    }

    const response = await api.put(
      '/users/me/preferences',
      preferences
    );

    return normalize(response);
  },
};
