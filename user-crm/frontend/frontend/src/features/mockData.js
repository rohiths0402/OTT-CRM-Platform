export const seedData = {
 subscribers:[
  {id:'LP-1001',name:'Aarav Sharma',email:'aarav@email.com',plan:'Premium',region:'Maharashtra',joined:'2026-10-21',status:'Active'},
  {id:'LP-1002',name:'Diya Iyer',email:'diya@email.com',plan:'Standard',region:'Tamil Nadu',joined:'2026-10-20',status:'Active'},
  {id:'LP-1003',name:'Kabir Reddy',email:'kabir@email.com',plan:'Premium',region:'Telangana',joined:'2026-10-19',status:'Pending'},
  {id:'LP-1004',name:'Ananya Nair',email:'ananya@email.com',plan:'Basic',region:'Kerala',joined:'2026-10-18',status:'Suspended'}
 ],
 identityVault:[
  {id:'KYC-2041',name:'Kabir Reddy',documentType:'Aadhaar',submittedAt:'2026-11-01',region:'Telangana',status:'Pending'},
  {id:'KYC-2040',name:'Sara Khan',documentType:'PAN Card',submittedAt:'2026-10-31',region:'Delhi',status:'Pending'},
  {id:'KYC-2039',name:'Rohan Das',documentType:'Driving Licence',submittedAt:'2026-10-30',region:'West Bengal',status:'Approved'}
 ],
 wallet:[
  {id:'TXN-8401',subscriber:'Aarav Sharma',transactionType:'Credit',amount:'₹500',balance:'₹1,850',createdAt:'2026-11-01',status:'Completed'},
  {id:'TXN-8402',subscriber:'Diya Iyer',transactionType:'Debit',amount:'₹120',balance:'₹740',createdAt:'2026-11-01',status:'Completed'},
  {id:'TXN-8403',subscriber:'Kabir Reddy',transactionType:'Credit',amount:'₹250',balance:'₹950',createdAt:'2026-10-31',status:'Pending'}
 ],
 rewards:[
  {id:'RWD-301',name:'Weekend Watch Bonus',category:'Watch milestone',points:250,redemptions:1840,startDate:'2026-10-01',endDate:'2026-12-31',status:'Active'},
  {id:'RWD-302',name:'Refer a Friend',category:'Referral',points:500,redemptions:920,startDate:'2026-10-10',endDate:'2026-12-31',status:'Active'}
 ],
 engagement:[
  {id:'LP-1001',subscriber:'Aarav Sharma',sessions:18,watchTime:'24h 12m',lastActive:'2 min ago',segment:'Power viewer',score:94},
  {id:'LP-1002',subscriber:'Diya Iyer',sessions:12,watchTime:'16h 40m',lastActive:'8 min ago',segment:'Regular',score:78},
  {id:'LP-1003',subscriber:'Kabir Reddy',sessions:4,watchTime:'3h 20m',lastActive:'1 hour ago',segment:'New viewer',score:42}
 ],
 viewingInsights:[
  {id:'VW-501',subscriber:'Aarav Sharma',title:'The Last Monsoon',contentType:'Series',duration:'42 min',viewedAt:'2026-11-01 10:24',completion:'96%',device:'Smart TV'},
  {id:'VW-502',subscriber:'Diya Iyer',title:'Beyond the Coast',contentType:'Movie',duration:'1h 48m',viewedAt:'2026-11-01 09:15',completion:'100%',device:'Mobile'}
 ],
 broadcast:[
  {id:'NTF-701',title:'New releases this weekend',audience:'Premium subscribers',channel:'In-app + Email',scheduledAt:'2026-11-01 18:00',sent:12480,delivered:12210,status:'Sent'},
  {id:'NTF-702',title:'Complete your KYC',audience:'Pending KYC users',channel:'In-app',scheduledAt:'2026-11-02 10:00',sent:0,delivered:0,status:'Scheduled'}
 ],
 roles:[
  {id:'ROL-01',name:'Super Admin',members:2,description:'Full platform access',permissions:'All modules',status:'Active'},
  {id:'ROL-02',name:'Admin',members:8,description:'User CRM operations',permissions:'Subscribers, KYC, Wallet, Rewards',status:'Active'},
  {id:'ROL-03',name:'Support Agent',members:24,description:'Subscriber support',permissions:'Subscribers, Viewing insights',status:'Active'}
 ],
 auditLogs:[
  {id:'AUD-9901',actor:'Vijay Kumar',action:'Approved KYC',target:'KYC-2039',timestamp:'2026-11-01 10:42:18',ipAddress:'10.10.2.14',result:'Success'},
  {id:'AUD-9902',actor:'Priya Nair',action:'Wallet adjustment',target:'LP-1001',timestamp:'2026-11-01 10:18:03',ipAddress:'10.10.2.18',result:'Success'}
 ]
}
export const defaultPreferences = {
 profile:{displayName:'Loop Admin',email:'admin@loop.com',timezone:'Asia/Kolkata'},
 notifications:{email:true,push:true,securityAlerts:true,dailySummary:false},
 appearance:{theme:'midnight',density:'comfortable'}
}
