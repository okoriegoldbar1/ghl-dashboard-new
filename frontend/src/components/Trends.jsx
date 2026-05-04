import React, { useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

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
const TT = { background: '#0a0a0a', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '6px', fontSize: '11px', color: '#e8dcc8' }

function Card({ title, children }) {
  return (
    <div style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '18px' }}>
      <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid rgba(212,175,55,0.07)' }}>{title}</div>
      {children}
    </div>
  )
}

export default function Trends({ range }) {
  const data = range === 'daily' || range === 'weekly' || range === 'biweekly' ? WEEK_DATA : MONTH_DATA
  return (
    <div>
      <div style={{ marginBottom: '4px', fontSize: '16px', fontWeight: 300, letterSpacing: '-0.01em', color: 'var(--text)' }}>Trends & History</div>
      <div style={{ fontSize: '12px', color: 'var(--text-2)', marginBottom: '18px', letterSpacing: '0.03em' }}>Lead volume by source and stage — filtered by your selected period</div>

      <Card title="Lead Volume">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.05)" />
            <XAxis dataKey="day" tick={{ fill: '#3a3020', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#3a3020', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TT} />
            <Line type="monotone" dataKey="leads" stroke="#d4af37" strokeWidth={1.5} dot={{ fill: '#d4af37', r: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
        <Card title="By Source">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.05)" />
              <XAxis dataKey="day" tick={{ fill: '#3a3020', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#3a3020', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TT} />
              <Bar dataKey="meta" name="Meta Ads" stackId="a" fill="#d4af37" />
              <Bar dataKey="indeed" name="Indeed" stackId="a" fill="#b89228" />
              <Bar dataKey="ojph" name="OJ.ph" stackId="a" fill="#856010" radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            {[['Meta Ads','#d4af37'],['Indeed','#b89228'],['OJ.ph','#856010']].map(([n,c]) => (
              <span key={n} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: 'var(--text-3)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: c }} />{n}
              </span>
            ))}
          </div>
        </Card>
        <Card title="Stage Progression">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={STAGE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.05)" />
              <XAxis dataKey="week" tick={{ fill: '#3a3020', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#3a3020', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TT} />
              <Line type="monotone" dataKey="screening" name="Screening" stroke="#d4af37" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="booked" name="Booked" stroke="#b89228" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="live" name="Live" stroke="#856010" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            {[['Screening','#d4af37'],['Booked','#b89228'],['Live','#856010']].map(([n,c]) => (
              <span key={n} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: 'var(--text-3)' }}>
                <span style={{ width: '16px', height: '1.5px', background: c }} />{n}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
