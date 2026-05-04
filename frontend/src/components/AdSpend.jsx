import React, { useState, useEffect } from 'react'

const SOURCES = ['Meta Ads', 'Indeed', 'OnlineJobs.ph']
const SOURCE_COLORS = { 'Meta Ads': '#d4af37', 'Indeed': '#c9a227', 'OnlineJobs.ph': '#8a6e1a' }
const ACCENT_COLORS = ['#d4af37', '#c9a227', '#b8952a', '#a07818']

const DEFAULT_SPEND = { 'Meta Ads': 150, 'Indeed': 80, 'OnlineJobs.ph': 40 }

export default function AdSpend({ data }) {
  const [spend, setSpend] = useState(DEFAULT_SPEND)

  const sourceTotals = data?.sourceTotals || { 'Meta Ads': 0, 'Indeed': 0, 'OnlineJobs.ph': 0 }
  const stageCounts = data?.stageCounts || {}
  const stages = data?.stages || []

  // qualified = stage index 1, live = stage index 4
  const qualCounts = {}
  const liveCounts = {}
  SOURCES.forEach(src => {
    qualCounts[src] = stages[1] ? (stageCounts[stages[1]]?.[src] || 0) : 0
    liveCounts[src] = stages[4] ? (stageCounts[stages[4]]?.[src] || 0) : 0
  })

  const totalSpend = Object.values(spend).reduce((a, b) => a + (parseFloat(b) || 0), 0)
  const totalLeads = Object.values(sourceTotals).reduce((a, b) => a + b, 0)
  const totalLive = Object.values(liveCounts).reduce((a, b) => a + b, 0)

  const blendedCPL = totalLeads > 0 ? (totalSpend / totalLeads).toFixed(2) : '—'
  const costPerLive = totalLive > 0 ? (totalSpend / totalLive).toFixed(2) : '—'

  const bestSource = SOURCES.reduce((best, src) => {
    const cpl = sourceTotals[src] > 0 ? spend[src] / sourceTotals[src] : Infinity
    const bestCpl = sourceTotals[best] > 0 ? spend[best] / sourceTotals[best] : Infinity
    return cpl < bestCpl ? src : best
  }, SOURCES[0])

  const kpis = [
    { label: 'Total Spend', val: '$' + totalSpend.toFixed(0), sub: 'all sources combined' },
    { label: 'Blended CPL', val: '$' + blendedCPL, sub: 'cost per lead' },
    { label: 'Cost per Live', val: '$' + costPerLive, sub: 'cost per conversion' },
    { label: 'Best Source', val: bestSource.split(' ')[0], sub: 'lowest cost per lead' },
  ]

  return (
    <div>
      <div style={{ marginBottom: '4px', fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>Ad Spend Tracker</div>
      <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '16px' }}>Enter your daily spend per source to calculate cost-per-lead metrics</div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '14px' }}>
        {kpis.map((k, i) => (
          <div key={k.label} style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: ACCENT_COLORS[i] }} />
            <div style={{ fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '7px', fontFamily: 'var(--font-display)', fontWeight: 600 }}>{k.label}</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>{k.val}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '5px' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Spend inputs */}
      <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px', marginBottom: '10px' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>Daily Spend Input</div>
        {SOURCES.map(src => {
          const leads = sourceTotals[src] || 0
          const s = parseFloat(spend[src]) || 0
          const cpl = leads > 0 ? '$' + (s / leads).toFixed(2) : '—'
          return (
            <div key={src} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: '#0a0a0a', marginBottom: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: SOURCE_COLORS[src], flexShrink: 0 }} />
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', width: '110px' }}>{src}</div>
              <div style={{ flex: 1, position: 'relative' }}>
                <span style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: 'var(--text-3)' }}>$</span>
                <input
                  type="number" min="0" step="1"
                  value={spend[src]}
                  onChange={e => setSpend(prev => ({ ...prev, [src]: e.target.value }))}
                  style={{ width: '100%', background: '#141414', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '7px', padding: '6px 10px 6px 22px', fontSize: '12px', color: 'var(--text)', fontFamily: 'var(--font-body)', outline: 'none' }}
                />
              </div>
              <div style={{ textAlign: 'center', minWidth: '60px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#d4af37' }}>{cpl}</div>
                <div style={{ fontSize: '9px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>CPL</div>
              </div>
              <div style={{ textAlign: 'center', minWidth: '44px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>{leads}</div>
                <div style={{ fontSize: '9px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Leads</div>
              </div>
            </div>
          )
        })}
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>Total daily spend</span>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#d4af37', fontFamily: 'var(--font-display)' }}>${totalSpend.toFixed(2)}</span>
        </div>
      </div>

      {/* CPL Table */}
      <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>Cost per Lead by Source</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr>
              {['Source', 'Spend', 'Leads', 'Cost / Lead', 'Cost / Qualified', 'Cost / Live'].map(h => (
                <th key={h} style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '6px 10px', borderBottom: '1px solid var(--border)', textAlign: h === 'Source' ? 'left' : 'center' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SOURCES.map(src => {
              const s = parseFloat(spend[src]) || 0
              const l = sourceTotals[src] || 0
              const q = qualCounts[src] || 0
              const lv = liveCounts[src] || 0
              return (
                <tr key={src} style={{ borderBottom: '1px solid rgba(212,175,55,0.06)' }}>
                  <td style={{ padding: '10px', color: 'var(--text)', fontWeight: 500 }}>{src}</td>
                  <td style={{ padding: '10px', textAlign: 'center', color: 'var(--text-2)' }}>${s.toFixed(2)}</td>
                  <td style={{ padding: '10px', textAlign: 'center', color: 'var(--text-2)' }}>{l}</td>
                  <td style={{ padding: '10px', textAlign: 'center', fontWeight: 700, color: '#d4af37' }}>{l > 0 ? '$' + (s / l).toFixed(2) : '—'}</td>
                  <td style={{ padding: '10px', textAlign: 'center', color: 'var(--text-2)' }}>{q > 0 ? '$' + (s / q).toFixed(2) : '—'}</td>
                  <td style={{ padding: '10px', textAlign: 'center', color: 'var(--text-2)' }}>{lv > 0 ? '$' + (s / lv).toFixed(2) : '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
