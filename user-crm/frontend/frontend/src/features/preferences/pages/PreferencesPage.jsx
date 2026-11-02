import './PreferencesPage.css';
import {Save,User,Bell,Palette,ShieldCheck} from 'lucide-react'
import {preferencesService} from '../services/preferencesService'
import { usePreferences } from '../hooks/usePreferences'
export default function PreferencesPage(){
 const { data, message, error, update, save } = usePreferences();
 if(!data)return <div className="crm-page">{error||'Loading preferences…'}</div>
 return <div className="crm-page"><header className="crm-head"><div><p className="crm-eyebrow">WORKSPACE SETTINGS</p><h1>Preferences</h1><p>Manage your profile, notifications and appearance.</p></div></header>
 {error&&<div className="crm-error">{error}</div>}{message&&<div className="crm-error" style={{background:'#1b2b22',color:'#91b99a'}}>{message}</div>}
 <div className="crm-pref-grid">
 <section className="crm-pref-card"><h2><User size={16}/> Profile information</h2><p>Workspace identity.</p><label>Display name<input value={data.profile.displayName} onChange={e=>update('profile','displayName',e.target.value)}/></label><label>Email<input type="email" value={data.profile.email} onChange={e=>update('profile','email',e.target.value)}/></label><label>Timezone<select value={data.profile.timezone} onChange={e=>update('profile','timezone',e.target.value)}><option>Asia/Kolkata</option><option>UTC</option><option>Asia/Singapore</option></select></label></section>
 <section className="crm-pref-card"><h2><Bell size={16}/> Notifications</h2><p>Choose workspace alerts.</p>{Object.entries({email:'Email notifications',push:'Push notifications',securityAlerts:'Security alerts',dailySummary:'Daily summary'}).map(([k,label])=><label className="crm-check" key={k}>{label}<input type="checkbox" checked={!!data.notifications[k]} onChange={e=>update('notifications',k,e.target.checked)}/></label>)}</section>
 <section className="crm-pref-card"><h2><Palette size={16}/> Appearance</h2><p>Workspace display preferences.</p><label>Theme<select value={data.appearance.theme} onChange={e=>update('appearance','theme',e.target.value)}><option value="midnight">Midnight</option><option value="light">Light</option></select></label><label>Density<select value={data.appearance.density} onChange={e=>update('appearance','density',e.target.value)}><option value="comfortable">Comfortable</option><option value="compact">Compact</option></select></label></section>
 <section className="crm-pref-card"><h2><ShieldCheck size={16}/> Security</h2><p>Password and multi-factor settings must be handled by your identity provider or backend.</p><small style={{fontSize:10,color:'#a69c88'}}>This page does not store passwords or security credentials.</small></section>
 </div><div className="crm-save"><button className="crm-btn" onClick={save}><Save size={14}/> Save preferences</button></div></div>
}
