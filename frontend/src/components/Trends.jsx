import React, { useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const WEEK_DATA = [
  { day: 'Apr 28', leads: 18, meta: 8, indeed: 6, ojph: 4 },
  { day: 'Apr 29', leads: 22, meta: 10, indeed: 8, ojph: 4 },
  { day: 'Apr 30', leads: 15, meta: 7, indeed: 5, ojph: 3 },
  { day: 'May 1',  leads: 31, meta: 14, indeed: 11, ojph: 6 },
  { day: 'May 2',  leads: 27, meta: 12, indeed: 9, ojph: 6 },
  { day: 'May 3',  leads: 24, meta: 11, indeed: 8, ojph: 5 },
  { day: 'May 4',  leads: 27, meta: 13, indeed: 9, ojph: 5 },
]

const MONTH_DATA = [
  { day: 'W1', leads: 90, meta: 42, indeed: 30, ojph: 18 },
  { day: 'W2', leads: 102, meta: 48, indeed: 34, ojph: 20 },
  { day: 'W3', leads: 80, meta: 38, indeed: 28, ojph: 14 },
  { day: 'W4', leads: 94, meta: 44, indeed: 32, ojph: 18 },
]

const STAGE_DATA = [
  { week: 'W1', screening: 60, booked: 24, live: 6 },
  { week: 'W2', screening: 65, booked: 26, live: 8 },
  { week: 'W3', screening: 58, booked: 20, live: 5 },
  { week: 'W4', screening: 65, booked: 19, live: 8 },
]

const TOOLTIP_STYLE = {
  background: '#0f0f0f',
  border: '1px solid rgba(212,175,55,0.2)',
  borderRadius: '8px',
  fontSize: '11px',
  color: '#f0e6c8',
}

const RANGES = [
  { id: '7d', label: '7 days' },
  { id: '30d', label: '30 days' },
  { id: '90d', label: '90 days' },
]

function Card({ title, children }) {
  return (
    <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px' }}>
      <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>{title}</div>
      {children}
    </div>
  )
}

export default function Trends() {
  const [range, setRange] = useState('7d')
  const data = range === '7d' ? WEEK_DATA : MONTH_DATA

  return (
    <div>
      <div style={{ marginBottom: '4px', fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>Trends & History</div>
      <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '14px' }}>Lead volume by source and stage over time</div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
        {RANGES.map(r => (
          <button key={r.id} onClick={() => setRange(r.id)} style={{
            fontSize: '11px', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'var(--font-body)',
            border: '1px solid', transition: 'all .15s',
            borderColor: range === r.id ? 'rgba(212,175,55,0.4)' : 'rgba(212,175,55,0.12)',
            background: range === r.id ? 'rgba(212,175,55,0.1)' : 'transparent',
            color: range === r.id ? '#d4af37' : 'var(--text-3)',
          }}>{r.label}</button>
        ))}
      </div>

      <Card title="Daily Lead Volume">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.06)" />
            <XAxis dataKey="day" tick={{ fill: '#5a5040', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#5a5040', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Line type="monotone" dataKey="leads" stroke="#d4af37" strokeWidth={2} dot={{ fill: '#d4af37', r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
        <Card title="Volume by Source">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.06)" />
              <XAxis dataKey="day" tick={{ fill: '#5a5040', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#5a5040', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="meta" name="Meta Ads" stackId="a" fill="#d4af37" />
              <Bar dataKey="indeed" name="Indeed" stackId="a" fill="#c9a227" />
              <Bar dataKey="ojph" name="OJ.ph" stackId="a" fill="#8a6e1a" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
            {[['Meta Ads','#d4af37'],['Indeed','#c9a227'],['OJ.ph','#8a6e1a']].map(([n,c]) => (
              <span key={n} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-3)' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: c, flexShrink: 0 }} />{n}
              </span>
            ))}
          </div>
        </Card>

        <Card title="Stage Progression">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={STAGE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.06)" />
              <XAxis dataKey="week" tick={{ fill: '#5a5040', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#5a5040', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Line type="monotone" dataKey="screening" name="Screening" stroke="#d4af37" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="booked" name="Booked" stroke="#c9a227" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="live" name="Live" stroke="#8a6e1a" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            {[['Screening','#d4af37'],['Booked','#c9a227'],['Live','#8a6e1a']].map(([n,c]) => (
              <span key={n} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-3)' }}>
                <span style={{ width: '10px', height: '2px', background: c }} />{n}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
