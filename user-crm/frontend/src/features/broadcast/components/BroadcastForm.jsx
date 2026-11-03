import './BroadcastForm.css';
import { useState } from 'react';

export default function BroadcastForm({ onClose, onSave }) {
  const [form, setForm] = useState({ title: '', body: '', channel: 'in_app' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submit = async (event) => {
    event.preventDefault();
    setBusy(true); setError('');
    try { await onSave(form); onClose(); }
    catch (e) { setError(e.message || 'Unable to send broadcast.'); }
    finally { setBusy(false); }
  };
  return <div className="crm-modal-bg" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <form className="crm-modal" onSubmit={submit}>
      <h2>Send subscriber broadcast</h2>
      <div className="crm-form">
        <label>Notification title<input required maxLength={160} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
        <label>Message<textarea required rows={4} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></label>
        <label>Delivery channel<select value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })}><option value="in_app">In-app</option><option value="push">Push</option><option value="email">Email</option><option value="sms">SMS</option></select></label>
      </div>
      <p className="crm-foot">This sends immediately to all subscribers. Scheduled delivery and audience segmentation are not implemented.</p>
      {error && <p className="crm-error" role="alert">{error}</p>}
      <div className="crm-modal-actions"><button type="button" className="crm-btn secondary" onClick={onClose}>Cancel</button><button className="crm-btn" disabled={busy}>{busy ? 'Sending…' : 'Send broadcast'}</button></div>
    </form>
  </div>;
}
