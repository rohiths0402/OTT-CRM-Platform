export const overviewMetrics = [
  { label: 'Total subscribers', value: '2.4M', change: '+8.2%', note: 'vs previous 30 days', icon: 'users' },
  { label: 'Monthly active viewers', value: '840K', change: '+5.7%', note: 'unique active viewers', icon: 'play' },
  { label: 'Watch hours', value: '1.8M', change: '+12.4%', note: 'hours streamed', icon: 'clock' },
  { label: 'Concurrent viewers', value: '125K', change: '+3.1%', note: 'current peak sample', icon: 'signal' },
  { label: 'Ad impressions', value: '18.6M', change: '+9.8%', note: 'served impressions', icon: 'megaphone' },
  { label: 'Platform revenue', value: '₹4.82Cr', change: '+7.3%', note: 'subscription + ads', icon: 'wallet' },
]

export const dashboardSections = [
  { id: 'audience', title: 'India Audience Intelligence', description: 'Regional audience distribution and viewing patterns.' },
  { id: 'content', title: 'Content Intelligence', description: 'What viewers are watching across the platform.' },
  { id: 'advertising', title: 'Advertising Intelligence', description: 'Ad delivery, completion and monetization.' },
  { id: 'revenue', title: 'Revenue Intelligence', description: 'Platform revenue mix and monthly trend.' },
  { id: 'infrastructure', title: 'Streaming Infrastructure', description: 'Playback quality and delivery health.' },
  { id: 'engagement', title: 'Viewer Engagement', description: 'Audience activity, retention and device mix.' },
]

export const stateAudience = [
  { state: 'Maharashtra', viewers: '142K', share: 82, hours: '286K hrs' },
  { state: 'Tamil Nadu', viewers: '118K', share: 70, hours: '241K hrs' },
  { state: 'Karnataka', viewers: '96K', share: 58, hours: '192K hrs' },
  { state: 'Uttar Pradesh', viewers: '88K', share: 53, hours: '176K hrs' },
  { state: 'Delhi', viewers: '76K', share: 46, hours: '151K hrs' },
]

export const topTitles = [
  { title: 'The Last Monsoon', genre: 'Drama', language: 'Tamil', hours: '284K', completion: '78%' },
  { title: 'City of Shadows', genre: 'Thriller', language: 'Hindi', hours: '251K', completion: '72%' },
  { title: 'Beyond the Coast', genre: 'Adventure', language: 'Malayalam', hours: '198K', completion: '81%' },
  { title: 'Code Red', genre: 'Crime', language: 'Telugu', hours: '176K', completion: '69%' },
]

export const revenueTrend = [
  { month: 'Jun', value: 58 }, { month: 'Jul', value: 64 }, { month: 'Aug', value: 61 },
  { month: 'Sep', value: 73 }, { month: 'Oct', value: 79 }, { month: 'Nov', value: 88 },
]

export const alerts = [
  { level: 'warning', title: 'CDN cache hit ratio below target', detail: 'West region · 84.2% cache hit ratio', time: '8 min ago' },
  { level: 'critical', title: 'Elevated playback startup latency', detail: 'Average startup time reached 3.8 seconds', time: '14 min ago' },
  { level: 'info', title: 'New content ingestion completed', detail: '12 episodes passed processing and validation', time: '32 min ago' },
]
