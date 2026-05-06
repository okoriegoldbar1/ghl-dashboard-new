import React, { useState } from 'react'
import { RefreshCw } from 'lucide-react'
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
import StageDrawer from './components/StageDrawer'

// ── Constants ─────────────────────────────────────────────────────────────────
const SOURCE_FILTERS = [
  { id: 'all', label: 'All Sources' },
  { id: 'Meta Ads', label: 'Meta Ads' },
  { id: 'Indeed', label: 'Indeed' },
  { id: 'OnlineJobs.ph', label: 'OnlineJobs.ph' },
]

const DATE_RANGES = [
  { id: 'daily',    label: 'Today' },
  { id: 'weekly',   label: 'This Week' },
  { id: 'biweekly', label: '14 Days' },
  { id: 'monthly',  label: 'This Month' },
  { id: 'all',      label: 'All Time' },
]

const NAV_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'adspend',  label: 'Ad Spend' },
  { id: 'trends',   label: 'Trends' },
  { id: 'dropoff',  label: 'Drop-off' },
  { id: 'team',     label: 'Team' },
]

const STAGE_LABELS = [
  'App. Review',
  'Group Interview Ready',
  'Interview Booked',
  'Show – Interview',
  'Academy Approved',
  'Website Live',
  'Offer Accepted',
]

const ACCENT_COLORS = ['#d4af37','#c8a430','#b89228','#a07818','#6a4c0a','#856010','#d4af37']

const SOURCE_COLORS = { 'Meta Ads': '#d4af37', 'Indeed': '#b89228', 'OnlineJobs.ph': '#856010' }
const DEFAULT_SPEND = { 'Meta Ads': 150, 'Indeed': 80, 'OnlineJobs.ph': 40 }

// ── Shared UI ─────────────────────────────────────────────────────────────────
function Card({ children, style = {} }) {
  return (
    <div style={{ background: '#141414', border: '1px solid rgba(212,175,55,0.1)', borderRadius: '8px', padding: '18px', ...style }}>
      {children}
    </div>
  )
}

function CardTitle({ children }) {
  return (
    <div style={{ fontSize: '10px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      {children}
    </div>
  )
}

function RangeLabel({ range }) {
  const labels = { daily: 'Today', weekly: 'This Week', biweekly: 'Last 14 Days', monthly: 'This Month', all: 'All Time' }
  return (
    <div style={{ fontSize: '11px', color: '#888', marginBottom: '14px', padding: '7px 14px', borderLeft: '2px solid #d4af37', background: 'rgba(212,175,55,0.05)', borderRadius: '0 4px 4px 0' }}>
      Showing: <strong style={{ color: '#d4af37', fontWeight: 600 }}>{labels[range] || 'All Time'}</strong>
    </div>
  )
}

function SourceFilter({ source, setSource }) {
  return (
    <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
      {SOURCE_FILTERS.map(f => (
        <button key={f.id} onClick={() => setSource(f.id)} style={{
          padding: '4px 12px', borderRadius: '4px', fontSize: '10px', fontWeight: 600,
          border: '1px solid', cursor: 'pointer', fontFamily: "'Inter',system-ui,sans-serif",
          transition: 'all .15s', textTransform: 'uppercase', letterSpacing: '0.07em',
          borderColor: source === f.id ? 'rgba(212,175,55,0.5)' : 'rgba(212,175,55,0.1)',
          background: source === f.id ? 'rgba(212,175,55,0.1)' : 'transparent',
          color: source === f.id ? '#d4af37' : '#666',
        }}>{f.label}</button>
      ))}
    </div>
  )
}

function CplRow({ sourceTotals, stageCounts }) {
  // Always use TODAY's logged spend — fall back to most recent entry if no entry for today
  let savedSpend = { 'Meta Ads': 0, 'Indeed': 0, 'OnlineJobs.ph': 0 }
  let spendDate = null
  let isToday = false
  try {
    const logs = JSON.parse(localStorage.getItem('adspend_logs') || '[]')
    const todayKey = new Date().toISOString().split('T')[0]
    const todayEntry = logs.find(l => l.date === todayKey)
    const useEntry = todayEntry || logs[0]
    if (useEntry) {
      savedSpend = useEntry.spend
      spendDate = useEntry.date
      isToday = useEntry.date === todayKey
    }
  } catch {}

  const totalSpend = Object.values(savedSpend || {}).reduce((a, b) => a + (parseFloat(b) || 0), 0)
  const totalMatched = stageCounts?.['Offer Accepted']?.total || 0
  const costPerMatched = totalMatched > 0 && totalSpend > 0 ? '$' + (totalSpend / totalMatched).toFixed(2) : '—'

  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '8px' }}>
        {['Meta Ads','Indeed','OnlineJobs.ph'].map(src => {
          const leads = sourceTotals?.[src] || 0
          const s = parseFloat(savedSpend?.[src]) || 0
          const cpl = leads > 0 && s > 0 ? '$' + (s / leads).toFixed(2) : '—'
          return (
            <div key={src} style={{ background: '#141414', border: '1px solid rgba(212,175,55,0.08)', borderRadius: '8px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: SOURCE_COLORS[src], flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '9px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{src}</div>
                <div style={{ fontSize: '10px', color: '#444', marginTop: '1px' }}>
                  {leads} leads · ${s} spend{spendDate ? ` (${isToday ? 'today' : spendDate})` : ' (no spend logged)'}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', fontWeight: 300, color: cpl === '—' ? '#333' : '#d4af37' }}>{cpl}</div>
                <div style={{ fontSize: '9px', color: '#444', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>per lead</div>
              </div>
            </div>
          )
        })}
      </div>
      <div style={{ background: '#141414', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '8px', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#d4af37', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '9px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Cost per Matched Candidate</div>
          <div style={{ fontSize: '10px', color: '#555', marginTop: '1px' }}>Total spend ÷ Offer Accepted · {totalMatched} matched · ${totalSpend.toFixed(0)} spend{spendDate ? ` · based on ${isToday ? "today's" : spendDate} spend` : ''}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '22px', fontWeight: 300, color: costPerMatched === '—' ? '#333' : '#d4af37' }}>{costPerMatched}</div>
          <div style={{ fontSize: '9px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>per match</div>
        </div>
      </div>
    </div>
  )
}

// ── Overview ──────────────────────────────────────────────────────────────────
function Overview({ source, setSource, range, data, error }) {
  const [drawerStage, setDrawerStage] = useState(null)

  const stages = data?.stages || []
  const stageCounts = data?.stageCounts || {}
  const totals = stages.map(s => stageCounts[s]?.total || 0)
  const totalApplicants = data?.totalLeads || 0
  const overallConv = totalApplicants > 0 ? Math.round(((totals[5] || 0) / totalApplicants) * 100) : 0

  const SUBS = [
    'total applicants',
    totalApplicants > 0 ? `${Math.round((totals[0]||0)/totalApplicants*100)}% of total` : '—',
    totalApplicants > 0 ? `${Math.round((totals[1]||0)/totalApplicants*100)}% of total` : '—',
    totalApplicants > 0 ? `${Math.round((totals[2]||0)/totalApplicants*100)}% of total` : '—',
    totalApplicants > 0 ? `${Math.round((totals[3]||0)/totalApplicants*100)}% of total` : '—',
    totalApplicants > 0 ? `${Math.round((totals[4]||0)/totalApplicants*100)}% of total` : '—',
    totalApplicants > 0 ? `${Math.round((totals[5]||0)/totalApplicants*100)}% of total` : '—',
    totalApplicants > 0 ? `${Math.round((totals[6]||0)/totalApplicants*100)}% matched` : '—',
  ]

  return (
    <div>
      <DailySummary data={data} range={range} />
      {error && (
        <div style={{ background: 'rgba(214,48,49,0.08)', border: '1px solid rgba(214,48,49,0.2)', borderRadius: '6px', padding: '10px 14px', marginBottom: '14px', color: '#ff7675', fontSize: '11px' }}>
          Could not reach backend: {error}
        </div>
      )}
      <RangeLabel range={range} />
      <SourceFilter source={source} setSource={setSource} />

      {/* Stage metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gap: '8px', marginBottom: '14px' }}>
        <MetricCard label="Total Applicants" value={totalApplicants} sub="all in period" accent="#d4af37" onClick={() => setDrawerStage('__all__')} />
        {STAGE_LABELS.map((label, i) => (
          <MetricCard key={label} label={label} value={totals[i] ?? 0} sub={SUBS[i+1]} accent={ACCENT_COLORS[i]} onClick={() => setDrawerStage(label)} />
        ))}
      </div>

      {drawerStage && (
        <StageDrawer stage={drawerStage} leads={data?.recentLeads || []} onClose={() => setDrawerStage(null)} />
      )}

      <CplRow sourceTotals={data?.sourceTotals} stageCounts={stageCounts} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: '10px', marginBottom: '10px' }}>
        <Card><CardTitle>Pipeline Funnel</CardTitle><FunnelChart stageCounts={stageCounts} stages={stages} /></Card>
        <Card><CardTitle>Source Breakdown</CardTitle><SourceBreakdown sourceTotals={data?.sourceTotals} /></Card>
      </div>
      <Card>
        <CardTitle>Recent Activity — leads created {range === 'daily' ? 'today' : range === 'weekly' ? 'this week' : 'in selected period'}</CardTitle>
        <RecentLeads leads={data?.recentLeads} />
      </Card>
    </div>
  )
}

// ── Pipeline ──────────────────────────────────────────────────────────────────
function Pipeline({ range }) {
  const [source, setSource] = useState('all')
  const [pipeDrawer, setPipeDrawer] = useState(null)
  const { data } = useStats(source, range)

  const stages = data?.stages || []
  const stageCounts = data?.stageCounts || {}
  const totals = stages.map(s => stageCounts[s]?.total || 0)
  const totalApplicants = data?.totalLeads || 0

  const convs = [
    { label: 'App Review → Interview Ready', from: totals[0], to: totals[1] },
    { label: 'Interview Ready → Booked',     from: totals[1], to: totals[2] },
    { label: 'Booked → Show',                from: totals[2], to: totals[3] },
    { label: 'Show → Academy Approved',      from: totals[3], to: totals[4] },
    { label: 'Approved → Website Live',      from: totals[4], to: totals[5] },
    { label: 'Website Live → Offer Accepted',from: totals[5], to: totals[6] },
  ]

  return (
    <div>
      <div style={{ marginBottom: '4px', fontSize: '16px', fontWeight: 300, color: '#fff' }}>Pipeline Breakdown</div>
      <div style={{ fontSize: '12px', color: '#555', marginBottom: '14px' }}>Only leads created in the selected period</div>
      <RangeLabel range={range} />
      <SourceFilter source={source} setSource={setSource} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gap: '8px', marginBottom: '14px' }}>
        <MetricCard label="Total Applicants" value={totalApplicants} sub="all in period" accent="#d4af37" onClick={() => setPipeDrawer('__all__')} />
        {STAGE_LABELS.map((label, i) => (
          <MetricCard key={label} label={label} value={totals[i] ?? 0} accent={ACCENT_COLORS[i]} onClick={() => setPipeDrawer(label)} />
        ))}
      </div>

      {pipeDrawer && (
        <StageDrawer stage={pipeDrawer} leads={data?.recentLeads || []} onClose={() => setPipeDrawer(null)} />
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
        <Card><CardTitle>Stage Funnel</CardTitle><FunnelChart stageCounts={stageCounts} stages={stages} /></Card>
        <Card>
          <CardTitle>Conversion Rates</CardTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {convs.map(({ label, from, to }) => {
              const p = from > 0 ? Math.round(to / from * 100) : 0
              const c = p >= 60 ? '#d4af37' : p >= 40 ? '#b89228' : '#555'
              return (
                <div key={label} style={{ background: '#0a0a0a', border: '1px solid rgba(212,175,55,0.08)', borderRadius: '6px', padding: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: 300, color: c }}>{p}%</div>
                  <div style={{ fontSize: '9px', color: '#444', marginTop: '3px', lineHeight: 1.4 }}>{label}</div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
      <Card><CardTitle>Full Breakdown Table</CardTitle><StageTable stageCounts={stageCounts} stages={stages} sources={data?.sources || []} /></Card>
    </div>
  )
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [source, setSource] = useState('all')
  const [range, setRange] = useState('weekly')
  const { data, loading, error, refetch, lastFetch } = useStats(source, range)
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/New_York' })

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', flexDirection: 'column', fontFamily: "'Inter',system-ui,sans-serif" }}>

      {/* Top bar */}
      <div style={{ background: '#0f0f0f', borderBottom: '1px solid rgba(212,175,55,0.1)', padding: '0 28px', height: '54px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '28px', height: '28px', border: '1.5px solid #d4af37', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1L11 3.5V8.5L6 11L1 8.5V3.5L6 1Z" stroke="#d4af37" strokeWidth="1" fill="none"/></svg>
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff' }}>GHL Pipeline</div>
            <div style={{ fontSize: '9px', color: '#555', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500 }}>Reporting Dashboard</div>
          </div>
          <div style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#d4af37', border: '1px solid rgba(212,175,55,0.3)', padding: '3px 9px', borderRadius: '3px', fontWeight: 500 }}>Live</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontSize: '11px', color: '#444', fontWeight: 300 }}>{today}</span>
          {lastFetch && <span style={{ fontSize: '10px', color: '#333' }}>Updated {lastFetch.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
          <button onClick={refetch} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '5px', padding: '5px 12px', color: '#666', fontSize: '10px', fontWeight: 500, cursor: 'pointer', fontFamily: "'Inter',system-ui,sans-serif", letterSpacing: '0.07em', textTransform: 'uppercase' }}>
            <RefreshCw size={10} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1.5px solid rgba(212,175,55,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 600, color: '#d4af37' }}>AO</div>
            <span style={{ fontSize: '11px', color: '#555', fontWeight: 300 }}>Admin</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(212,175,55,0.08)', padding: '0 28px', display: 'flex', alignItems: 'center' }}>
        {NAV_TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '13px 16px',
            border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: "'Inter',system-ui,sans-serif",
            fontWeight: 500, transition: 'all .2s', borderBottom: '1.5px solid',
            borderBottomColor: activeTab === tab.id ? '#d4af37' : 'transparent',
            color: activeTab === tab.id ? '#d4af37' : '#555',
          }}>{tab.label}</button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
          {DATE_RANGES.map(r => (
            <button key={r.id} onClick={() => setRange(r.id)} style={{
              fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '5px 10px',
              borderRadius: '3px', border: '1px solid', cursor: 'pointer', fontFamily: "'Inter',system-ui,sans-serif",
              fontWeight: 500, transition: 'all .15s',
              borderColor: range === r.id ? '#d4af37' : 'rgba(212,175,55,0.1)',
              background: range === r.id ? 'rgba(212,175,55,0.08)' : 'transparent',
              color: range === r.id ? '#d4af37' : '#555',
            }}>{r.label}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '20px 28px', maxWidth: '1600px', width: '100%', margin: '0 auto' }}>
        {activeTab === 'overview' && <Overview source={source} setSource={setSource} range={range} data={data} error={error} />}
        {activeTab === 'pipeline' && <Pipeline range={range} />}
        {activeTab === 'adspend'  && <AdSpend data={data} isReadOnly={false} />}
        {activeTab === 'trends'   && <Trends data={data} range={range} />}
        {activeTab === 'dropoff'  && <Dropoff data={data} />}
        {activeTab === 'team'     && <Team />}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
