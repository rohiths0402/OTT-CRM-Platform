
import './PreferencesPage.css';

import {
  Save,
  User,
  Bell,
  Palette,
  ShieldCheck,
} from 'lucide-react';

import { usePreferences } from '../hooks/usePreferences';

export default function PreferencesPage() {
  const {
    data,
    message,
    error,
    loading,
    saving,
    update,
    save,
  } = usePreferences();

  if (loading) {
    return <div className="crm-page">Loading preferences...</div>;
  }

  return (
    <div className="crm-page preferences-page">
      <header className="crm-head">
        <div>
          <p className="crm-eyebrow">WORKSPACE SETTINGS</p>
          <h1>Preferences</h1>
          <p>Manage your profile, notifications and appearance.</p>
        </div>
      </header>

      {error && <div className="crm-error">{error}</div>}

      {message && (
        <div className="crm-success">{message}</div>
      )}

      <div className="crm-pref-grid">

        <section className="crm-pref-card">
          <h2><User size={16} /> Profile information</h2>
          <p>Workspace identity.</p>

          <label>
            Display name
            <input
              value={data.profile.displayName}
              onChange={(e) =>
                update('profile', 'displayName', e.target.value)
              }
              placeholder="Display name"
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={data.profile.email}
              onChange={(e) =>
                update('profile', 'email', e.target.value)
              }
              placeholder="Email address"
            />
          </label>

          <label>
            Timezone
            <select
              value={data.profile.timezone}
              onChange={(e) =>
                update('profile', 'timezone', e.target.value)
              }
            >
              <option value="Asia/Kolkata">Asia/Kolkata</option>
              <option value="UTC">UTC</option>
              <option value="Asia/Singapore">Asia/Singapore</option>
            </select>
          </label>
        </section>

        <section className="crm-pref-card">
          <h2><Bell size={16} /> Notifications</h2>
          <p>Choose workspace alerts.</p>

          {[
            ['email', 'Email notifications'],
            ['push', 'Push notifications'],
            ['securityAlerts', 'Security alerts'],
            ['dailySummary', 'Daily summary'],
          ].map(([key, label]) => (
            <label className="crm-check" key={key}>
              {label}
              <input
                type="checkbox"
                checked={Boolean(data.notifications[key])}
                onChange={(e) =>
                  update('notifications', key, e.target.checked)
                }
              />
            </label>
          ))}
        </section>

        <section className="crm-pref-card">
          <h2><Palette size={16} /> Appearance</h2>
          <p>Workspace display preferences.</p>

          

          <label>
            Density
            <select
              value={data.appearance.density}
              onChange={(e) =>
                update('appearance', 'density', e.target.value)
              }
            >
              <option value="comfortable">Comfortable</option>
              <option value="compact">Compact</option>
            </select>
          </label>
        </section>

        <section className="crm-pref-card">
          <h2><ShieldCheck size={16} /> Security</h2>
          <p>
            Password and multi-factor settings must be handled
            by your identity provider or backend.
          </p>
          <small>
            This page does not store passwords or security credentials.
          </small>
        </section>

      </div>

      <div className="crm-save">
        <button
          className="crm-btn"
          onClick={save}
          disabled={saving}
        >
          <Save size={14} />
          {saving ? 'Saving...' : 'Save preferences'}
        </button>
      </div>
    </div>
  );
}
