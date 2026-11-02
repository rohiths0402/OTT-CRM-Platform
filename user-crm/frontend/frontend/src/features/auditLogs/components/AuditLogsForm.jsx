import './AuditLogsForm.css';
import {useState} from 'react'
const fields=[{key:'actor',label:'Actor',type:'text'},{key:'action',label:'Action',type:'text'},{key:'target',label:'Target',type:'text'},{key:'timestamp',label:'Timestamp',type:'text'},{key:'ipAddress',label:'IP address',type:'text'},{key:'result',label:'Result',type:'select',options:['Success', 'Failed']}]
export default function AuditLogsForm({onClose,onSave}){
 const [form,setForm]=useState({}),[busy,setBusy]=useState(false)
 const submit=async e=>{e.preventDefault();setBusy(true);try{await onSave(form);onClose()}finally{setBusy(false)}}
 return <div className="crm-modal-bg" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><form className="crm-modal" onSubmit={submit}><h2>Add Audit Logs record</h2><div className="crm-form">{fields.map(f=><label key={f.key}>{f.label}{f.type==='select'?<select required value={form[f.key]||''} onChange={e=>setForm({...form,[f.key]:e.target.value})}><option value="">Select…</option>{f.options.map(o=><option key={o}>{o}</option>)}</select>:<input required type={f.type} value={form[f.key]||''} onChange={e=>setForm({...form,[f.key]:e.target.value})} placeholder={f.label}/>}</label>)}</div><div className="crm-modal-actions"><button type="button" className="crm-btn secondary" onClick={onClose}>Cancel</button><button className="crm-btn" disabled={busy}>{busy?'Saving…':'Save record'}</button></div></form></div>
}
