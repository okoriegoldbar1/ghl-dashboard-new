import React, { useState, useEffect } from 'react'

const SOURCES = ['Meta Ads', 'Indeed', 'OnlineJobs.ph']
const SOURCE_COLORS = { 'Meta Ads': '#d4af37', 'Indeed': '#b89228', 'OnlineJobs.ph': '#856010' }
const ACCENT = ['#d4af37','#c8a430','#b89228','#a07818']

function today() {
  return new Date().toISOString().split('T')[0]
}

function formatDate(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function Card({ title, children, style = {} }) {
  return (
    <div style={{ background: '#141414', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '8px', padding: '20px', ...style }}>
      {title && <div style={{ fontSize: '10px', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>{title}</div>}
      {children}
    </div>
  )
}

export default function AdSpend({ data, isReadOnly = false }) {
  const [logs, setLogs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('adspend_logs') || '[]') } catch { return [] }
  })
  const [form, setForm] = useState({ date: today(), meta: '', indeed: '', ojph: '' })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try { localStorage.setItem('adspend_logs', JSON.stringify(logs)) } catch {}
  }, [logs])

  const sourceTotals = data?.sourceTotals || {}
  const totalLeads = Object.values(sourceTotals).reduce((a, b) => a + b, 0)

  function handleSave() {
    if (!form.meta && !form.indeed && !form.ojph) return
    const entry = {
      date: form.date,
      spend: {
        'Meta Ads': parseFloat(form.meta) || 0,
        'Indeed': parseFloat(form.indeed) || 0,
        'OnlineJobs.ph': parseFloat(form.ojph) || 0,
      },
      savedAt: new Date().toISOString(),
    }
    // Replace if same date exists
    setLogs(prev => {
      const filtered = prev.filter(l => l.date !== form.date)
      return [entry, ...filtered].sort((a, b) => b.date.localeCompare(a.date))
    })
    setForm(f => ({ ...f, meta: '', indeed: '', ojph: '' }))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleDelete(date) {
    setLogs(prev => prev.filter(l => l.date !== date))
  }

  // Stats from most recent log entry
  const latestLog = logs[0]
  const latestSpend = latestLog?.spend || {}
  const totalSpend = Object.values(latestSpend).reduce((a, b) => a + b, 0)
  const blendedCPL = totalLeads > 0 && totalSpend > 0 ? (totalSpend / totalLeads).toFixed(2) : '—'

  const inputStyle = {
    width: '100%', background: '#0a0a0a',
    border: '1px solid rgba(212,175,55,0.15)',
    borderRadius: '6px', padding: '10px 10px 10px 28px',
    fontSize: '14px', color: '#fff',
    fontFamily: "'Inter', system-ui, sans-serif",
    outline: 'none', fontWeight: 300,
  }

  return (
    <div>
      <div style={{ marginBottom: '4px', fontSize: '16px', fontWeight: 300, letterSpacing: '-0.01em', color: '#fff' }}>Ad Spend Tracker</div>
      <div style={{ fontSize: '12px', color: '#666', marginBottom: '20px' }}>Log your daily ad spend per source</div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px', marginBottom: '20px' }}>
        {[
          { label: 'Latest Daily Spend', val: totalSpend > 0 ? '$' + totalSpend.toFixed(0) : '—', sub: latestLog ? formatDate(latestLog.date) : 'No entries yet', accent: '#d4af37' },
          { label: 'Blended CPL', val: blendedCPL !== '—' ? '$' + blendedCPL : '—', sub: 'cost per lead', accent: '#c8a430' },
          { label: 'Total Leads', val: totalLeads, sub: 'in selected period', accent: '#b89228' },
          { label: 'Days Logged', val: logs.length, sub: 'spend entries', accent: '#a07818' },
        ].map(k => (
          <div key={k.label} style={{ background: '#141414', border: '1px solid rgba(212,175,55,0.1)', borderRadius: '8px', padding: '16px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 12, right: 12, height: '1px', background: k.accent }} />
            <div style={{ fontSize: '9px', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{k.label}</div>
            <div style={{ fontSize: '24px', fontWeight: 300, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>{k.val}</div>
            <div style={{ fontSize: '11px', color: '#555', marginTop: '5px' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Entry form */}
      {!isReadOnly && (
        <Card title="Log Today's Spend" style={{ marginBottom: '14px' }}>
          {/* Date picker */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '7px' }}>Date</div>
            <input type="date" value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))}
              style={{ background: '#0a0a0a', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '6px', padding: '9px 12px', fontSize: '13px', color: '#fff', fontFamily: "'Inter', system-ui, sans-serif", outline: 'none', colorScheme: 'dark' }} />
          </div>

          {/* Spend inputs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '16px' }}>
            {[
              { key: 'meta', label: 'Meta Ads', val: form.meta },
              { key: 'indeed', label: 'Indeed', val: form.indeed },
              { key: 'ojph', label: 'OnlineJobs.ph', val: form.ojph },
            ].map(({ key, label, val }) => (
              <div key={key}>
                <div style={{ fontSize: '10px', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '7px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: SOURCE_COLORS[label], display: 'inline-block' }} />
                  {label}
                </div>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', color: '#555' }}>$</span>
                  <input type="number" min="0" step="1" placeholder="0"
                    value={val}
                    onChange={e => setForm(f => ({...f, [key]: e.target.value}))}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.4)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(212,175,55,0.15)'}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={handleSave} style={{
              padding: '10px 24px', background: '#d4af37', border: 'none', borderRadius: '6px',
              color: '#0a0a0a', fontWeight: 600, fontSize: '12px', cursor: 'pointer',
              fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: '0.06em', textTransform: 'uppercase',
              transition: 'opacity .15s',
            }}
            onMouseEnter={e => e.target.style.opacity = '0.85'}
            onMouseLeave={e => e.target.style.opacity = '1'}
            >Save Entry</button>
            {saved && <span style={{ fontSize: '12px', color: '#d4af37', fontWeight: 500 }}>✓ Saved</span>}
            <span style={{ fontSize: '11px', color: '#444', marginLeft: 'auto' }}>
              Total: <strong style={{ color: '#fff', fontWeight: 400 }}>
                ${((parseFloat(form.meta)||0) + (parseFloat(form.indeed)||0) + (parseFloat(form.ojph)||0)).toFixed(2)}
              </strong>
            </span>
          </div>
        </Card>
      )}

      {/* Log history */}
      <Card title="Spend History">
        {logs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '28px', color: '#444', fontSize: '13px' }}>
            No entries yet — log your first day above
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr>
                {['Date', 'Meta Ads', 'Indeed', 'OnlineJobs.ph', 'Total', ''].map(h => (
                  <th key={h} style={{ fontSize: '9px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '7px 10px', borderBottom: '1px solid rgba(255,255,255,0.07)', textAlign: h === 'Date' ? 'left' : 'center' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map(entry => {
                const total = Object.values(entry.spend).reduce((a, b) => a + b, 0)
                return (
                  <tr key={entry.date} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '10px', color: '#fff', fontWeight: 400 }}>{formatDate(entry.date)}</td>
                    <td style={{ padding: '10px', color: '#b0b0b0', textAlign: 'center' }}>${entry.spend['Meta Ads']?.toFixed(2) || '—'}</td>
                    <td style={{ padding: '10px', color: '#b0b0b0', textAlign: 'center' }}>${entry.spend['Indeed']?.toFixed(2) || '—'}</td>
                    <td style={{ padding: '10px', color: '#b0b0b0', textAlign: 'center' }}>${entry.spend['OnlineJobs.ph']?.toFixed(2) || '—'}</td>
                    <td style={{ padding: '10px', color: '#d4af37', textAlign: 'center', fontWeight: 500 }}>${total.toFixed(2)}</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      {!isReadOnly && (
                        <button onClick={() => handleDelete(entry.date)} style={{ fontSize: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', color: '#555', padding: '2px 8px', cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif" }}>Delete</button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  )
}
