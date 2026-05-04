import React, { useState } from 'react'

const SOURCES = ['Meta Ads', 'Indeed', 'OnlineJobs.ph']
const SOURCE_COLORS = { 'Meta Ads': '#d4af37', 'Indeed': '#b89228', 'OnlineJobs.ph': '#856010' }
const ACCENT = ['#d4af37','#c8a430','#b89228','#a07818']
const DEFAULT_SPEND = { 'Meta Ads': 150, 'Indeed': 80, 'OnlineJobs.ph': 40 }

function Card({ title, children, style = {} }) {
  return (
    <div style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '18px', ...style }}>
      <div style={{ fontSize: '9px', fontWeight: 500, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid rgba(212,175,55,0.07)' }}>{title}</div>
      {children}
    </div>
  )
}

export default function AdSpend({ data }) {
  const [spend, setSpend] = useState(DEFAULT_SPEND)
  const sourceTotals = data?.sourceTotals || {}
  const stages = data?.stages || []
  const stageCounts = data?.stageCounts || {}
  const qualCounts = {}; const liveCounts = {}
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

  return (
    <div>
      <div style={{ marginBottom: '4px', fontSize: '16px', fontWeight: 300, letterSpacing: '-0.01em', color: 'var(--text)' }}>Ad Spend Tracker</div>
      <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '18px', letterSpacing: '0.03em' }}>Enter daily spend per source to calculate cost-per-lead metrics</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px', marginBottom: '14px' }}>
        {[
          { label: 'Total Spend', val: '$' + totalSpend.toFixed(0), sub: 'all sources' },
          { label: 'Blended CPL', val: '$' + blendedCPL, sub: 'cost per lead' },
          { label: 'Cost per Live', val: '$' + costPerLive, sub: 'per conversion' },
          { label: 'Best Source', val: bestSource.split(' ')[0], sub: 'lowest CPL' },
        ].map((k, i) => (
          <div key={k.label} style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '14px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 12, right: 12, height: '1px', background: ACCENT[i] }} />
            <div style={{ fontSize: '9px', fontWeight: 500, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{k.label}</div>
            <div style={{ fontSize: '22px', fontWeight: 300, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1 }}>{k.val}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '5px' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <Card title="Daily Spend Input" style={{ marginBottom: '10px' }}>
        {SOURCES.map(src => {
          const leads = sourceTotals[src] || 0
          const s = parseFloat(spend[src]) || 0
          const cpl = leads > 0 ? '$' + (s / leads).toFixed(2) : '—'
          return (
            <div key={src} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(212,175,55,0.07)', background: '#060606', marginBottom: '8px' }}>
              <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: SOURCE_COLORS[src], flexShrink: 0 }} />
              <div style={{ fontSize: '11px', fontWeight: 400, color: 'var(--text)', width: '110px', letterSpacing: '0.02em' }}>{src}</div>
              <div style={{ flex: 1, position: 'relative' }}>
                <span style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: 'var(--text-3)' }}>$</span>
                <input type="number" min="0" step="1" value={spend[src]}
                  onChange={e => setSpend(prev => ({ ...prev, [src]: e.target.value }))}
                  style={{ width: '100%', background: '#0a0a0a', border: '1px solid rgba(212,175,55,0.1)', borderRadius: '5px', padding: '6px 10px 6px 20px', fontSize: '11px', color: 'var(--text)', fontFamily: 'var(--font-body)', outline: 'none', fontWeight: 300 }} />
              </div>
              <div style={{ textAlign: 'center', minWidth: '56px' }}>
                <div style={{ fontSize: '13px', fontWeight: 400, color: '#d4af37', letterSpacing: '-0.01em' }}>{cpl}</div>
                <div style={{ fontSize: '9px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>CPL</div>
              </div>
              <div style={{ textAlign: 'center', minWidth: '36px' }}>
                <div style={{ fontSize: '13px', fontWeight: 400, color: 'var(--text)' }}>{leads}</div>
                <div style={{ fontSize: '9px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>Leads</div>
              </div>
            </div>
          )
        })}
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(212,175,55,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-3)', letterSpacing: '0.04em' }}>Total daily spend</span>
          <span style={{ fontSize: '18px', fontWeight: 300, color: '#d4af37', letterSpacing: '-0.02em' }}>${totalSpend.toFixed(2)}</span>
        </div>
      </Card>

      <Card title="Cost per Lead by Source">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
          <thead>
            <tr>{['Source','Spend','Leads','Cost / Lead','Cost / Qualified','Cost / Live'].map(h => (
              <th key={h} style={{ fontSize: '9px', fontWeight: 500, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '6px 10px', borderBottom: '1px solid rgba(212,175,55,0.08)', textAlign: h === 'Source' ? 'left' : 'center' }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {SOURCES.map(src => {
              const s = parseFloat(spend[src]) || 0
              const l = sourceTotals[src] || 0; const q = qualCounts[src] || 0; const lv = liveCounts[src] || 0
              return (
                <tr key={src} style={{ borderBottom: '1px solid rgba(212,175,55,0.04)' }}>
                  <td style={{ padding: '10px', color: 'var(--text)', fontWeight: 400 }}>{src}</td>
                  <td style={{ padding: '10px', textAlign: 'center', color: 'var(--text-2)', fontWeight: 300 }}>${s.toFixed(2)}</td>
                  <td style={{ padding: '10px', textAlign: 'center', color: 'var(--text-2)', fontWeight: 300 }}>{l}</td>
                  <td style={{ padding: '10px', textAlign: 'center', fontWeight: 400, color: '#d4af37' }}>{l > 0 ? '$' + (s / l).toFixed(2) : '—'}</td>
                  <td style={{ padding: '10px', textAlign: 'center', color: 'var(--text-2)', fontWeight: 300 }}>{q > 0 ? '$' + (s / q).toFixed(2) : '—'}</td>
                  <td style={{ padding: '10px', textAlign: 'center', color: 'var(--text-2)', fontWeight: 300 }}>{lv > 0 ? '$' + (s / lv).toFixed(2) : '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
