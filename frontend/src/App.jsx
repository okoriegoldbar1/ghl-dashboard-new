import React, { useState } from 'react'
import { RefreshCw, Zap } from 'lucide-react'
import { useStats } from './hooks/useStats'
import MetricCard from './components/MetricCard'
import FunnelChart from './components/FunnelChart'
import SourceBreakdown from './components/SourceBreakdown'
import StageTable from './components/StageTable'
import RecentLeads from './components/RecentLeads'
import DailySummary from './components/DailySummary'
import AdSpend from './components/AdSpend'
import Trends from './components/Trends'
import Dropoff from './components/Dropoff'
import Team from './components/Team'

const SOURCE_FILTERS = [
  { id: 'all', label: 'All Sources' },
  { id: 'Meta Ads', label: 'Meta Ads' },
  { id: 'Indeed', label: 'Indeed' },
  { id: 'OnlineJobs.ph', label: 'OnlineJobs.ph' },
]

const NAV_TABS = [
  { id: 'overview',  label: 'Overview' },
  { id: 'pipeline',  label: 'Pipeline' },
  { id: 'adspend',   label: 'Ad Spend' },
  { id: 'trends',    label: 'Trends' },
  { id: 'dropoff',   label: 'Drop-off' },
  { id: 'team',      label: 'Team' },
]

function Card({ children, style = {} }) {
  return (
    <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px', ...style }}>
      {children}
    </div>
  )
}

function CardTitle({ children }) {
  return (
    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '10px', color: 'var(--text-3)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
      {children}
    </div>
  )
}

function Overview({ source, setSource, data, loading, error }) {
  const stages = data?.stages || []
  const stageCounts = data?.stageCounts || {}
  const totals = stages.map(s => stageCounts[s]?.total || 0)
  const overallConv = totals[0] > 0 ? Math.round((totals[4] / totals[0]) * 100) : 0
  const ACCENT = ['#d4af37','#c9a227','#b8952a','#a07818','#8a6e1a']
  const SUBS = [
    'entry point',
    totals[0] > 0 ? `${Math.round(totals[1]/totals[0]*100)}% of screening` : '—',
    totals[1] > 0 ? `${Math.round(totals[2]/totals[1]*100)}% of qualified` : '—',
    totals[2] > 0 ? `${Math.round(totals[3]/totals[2]*100)}% of booked` : '—',
    `${overallConv}% overall conv.`,
  ]
  const LABELS = ['Application Screening','Qualified for Interview','Interview Booked','Approved for Academy','Website Live']

  return (
    <div>
      <DailySummary data={data} />
      {error && (
        <div style={{ background: 'rgba(214,48,49,0.1)', border: '1px solid rgba(214,48,49,0.3)', borderRadius: 'var(--radius)', padding: '12px 16px', marginBottom: '14px', color: '#ff7675', fontSize: '12px' }}>
          Could not reach backend: {error}. Make sure the server is running on port 4000.
        </div>
      )}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
        {SOURCE_FILTERS.map(f => (
          <button key={f.id} onClick={() => setSource(f.id)} style={{ padding: '5px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 500, border: '1px solid', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all .15s', borderColor: source === f.id ? 'rgba(212,175,55,0.45)' : 'var(--border)', background: source === f.id ? 'rgba(212,175,55,0.12)' : 'transparent', color: source === f.id ? '#d4af37' : 'var(--text-3)' }}>
            {f.label}
          </button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '14px' }}>
        {LABELS.map((label, i) => <MetricCard key={label} label={label} value={totals[i]} sub={SUBS[i]} accent={ACCENT[i]} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '12px', marginBottom: '12px' }}>
        <Card><CardTitle>Pipeline Funnel</CardTitle><FunnelChart stageCounts={stageCounts} stages={stages} /></Card>
        <Card><CardTitle>Leads by Source</CardTitle><SourceBreakdown sourceTotals={data?.sourceTotals} /></Card>
      </div>
      <Card><CardTitle>Recent Activity</CardTitle><RecentLeads leads={data?.recentLeads} /></Card>
    </div>
  )
}

function Pipeline({ data }) {
  const [source, setSource] = useState('all')
  const { data: fd } = useStats(source)
  const d = fd || data
  const stages = d?.stages || []
  const stageCounts = d?.stageCounts || {}
  const totals = stages.map(s => stageCounts[s]?.total || 0)
  const ACCENT = ['#d4af37','#c9a227','#b8952a','#a07818','#8a6e1a']
  const convs = [
    { label: 'Screening → Qualified', from: totals[0], to: totals[1] },
    { label: 'Qualified → Booked', from: totals[1], to: totals[2] },
    { label: 'Booked → Approved', from: totals[2], to: totals[3] },
    { label: 'Approved → Live', from: totals[3], to: totals[4] },
  ]

  return (
    <div>
      <div style={{ marginBottom: '4px', fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>Pipeline Breakdown</div>
      <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '14px' }}>Lead counts per stage by source</div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
        {SOURCE_FILTERS.map(f => (
          <button key={f.id} onClick={() => setSource(f.id)} style={{ padding: '5px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 500, border: '1px solid', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all .15s', borderColor: source === f.id ? 'rgba(212,175,55,0.45)' : 'var(--border)', background: source === f.id ? 'rgba(212,175,55,0.12)' : 'transparent', color: source === f.id ? '#d4af37' : 'var(--text-3)' }}>{f.label}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '14px' }}>
        {stages.map((s, i) => <MetricCard key={s} label={s} value={totals[i]} accent={ACCENT[i]} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <Card><CardTitle>Stage Funnel</CardTitle><FunnelChart stageCounts={stageCounts} stages={stages} /></Card>
        <Card>
          <CardTitle>Conversion Rates</CardTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {convs.map(({ label, from, to }) => {
              const p = from > 0 ? Math.round(to / from * 100) : 0
              const c = p >= 60 ? '#d4af37' : p >= 40 ? '#b8952a' : '#7a6a30'
              return (
                <div key={label} style={{ background: '#0a0a0a', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: c, fontFamily: 'var(--font-display)' }}>{p}%</div>
                  <div style={{ fontSize: '9px', color: 'var(--text-3)', marginTop: '3px' }}>{label}</div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
      <Card><CardTitle>Full Breakdown Table</CardTitle><StageTable stageCounts={stageCounts} stages={stages} sources={d?.sources || []} /></Card>
    </div>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [source, setSource] = useState('all')
  const { data, loading, error, refetch, lastFetch } = useStats(source)
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--border)', padding: '0 28px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '24px', height: '24px', background: '#d4af37', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={12} color="#080808" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', color: 'var(--text)' }}>GHL Pipeline</span>
          <span style={{ fontSize: '9px', background: 'rgba(212,175,55,0.12)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.28)', padding: '2px 7px', borderRadius: '20px', fontWeight: 700 }}>● LIVE</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>{today}</span>
          {lastFetch && <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>Updated {lastFetch.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
          <button onClick={refetch} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '7px', padding: '5px 12px', color: 'var(--text-3)', fontSize: '11px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            <RefreshCw size={11} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '20px', padding: '3px 10px 3px 4px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#d4af37', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 800, color: '#080808' }}>A</div>
            <span style={{ fontSize: '11px', color: 'var(--text-2)' }}>Admin</span>
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--border)', padding: '0 28px', display: 'flex', gap: '2px', flexShrink: 0 }}>
        {NAV_TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ fontSize: '12px', padding: '11px 16px', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 500, transition: 'all .15s', borderBottom: '2px solid', borderBottomColor: activeTab === tab.id ? '#d4af37' : 'transparent', color: activeTab === tab.id ? '#d4af37' : 'var(--text-3)' }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, padding: '20px 28px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
        {activeTab === 'overview' && <Overview source={source} setSource={setSource} data={data} loading={loading} error={error} />}
        {activeTab === 'pipeline' && <Pipeline data={data} />}
        {activeTab === 'adspend'  && <AdSpend data={data} />}
        {activeTab === 'trends'   && <Trends />}
        {activeTab === 'dropoff'  && <Dropoff data={data} />}
        {activeTab === 'team'     && <Team />}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
