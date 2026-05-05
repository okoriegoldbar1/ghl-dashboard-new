import React from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const TT = { background: '#1a1a1a', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '6px', fontSize: '11px', color: '#fff' }

function Card({ title, children }) {
  return (
    <div style={{ background: '#141414', border: '1px solid rgba(212,175,55,0.1)', borderRadius: '8px', padding: '18px' }}>
      <div style={{ fontSize: '10px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{title}</div>
      {children}
    </div>
  )
}

function buildWeeklyTrend(data) {
  if (!data) return []
  const leads = data.recentLeads || []
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    const dayLeads = leads.filter(l => l.createdAt && l.createdAt.startsWith(key))
    days.push({
      day: label,
      total: dayLeads.length,
      meta: dayLeads.filter(l => l.source === 'Meta Ads').length,
      indeed: dayLeads.filter(l => l.source === 'Indeed').length,
      ojph: dayLeads.filter(l => l.source === 'OnlineJobs.ph').length,
    })
  }
  return days
}

function buildStageProgression(data) {
  if (!data) return []
  const stageCounts = data.stageCounts || {}
  const stages = data.stages || []
  return stages.map(s => ({
    stage: s.length > 14 ? s.slice(0, 14) + '…' : s,
    count: stageCounts[s]?.total || 0,
  }))
}

export default function Trends({ data }) {
  const weekData = buildWeeklyTrend(data)
  const stageData = buildStageProgression(data)
  const hasData = data?.totalLeads > 0

  return (
    <div>
      <div style={{ marginBottom: '4px', fontSize: '16px', fontWeight: 300, letterSpacing: '-0.01em', color: '#fff' }}>Trends</div>
      <div style={{ fontSize: '12px', color: '#555', marginBottom: '18px' }}>Live data from your pipeline — filtered by your selected period</div>

      {!hasData && (
        <div style={{ background: '#141414', border: '1px solid rgba(212,175,55,0.1)', borderRadius: '8px', padding: '32px', textAlign: 'center', marginBottom: '12px' }}>
          <div style={{ fontSize: '13px', color: '#555' }}>No data yet for the selected period</div>
          <div style={{ fontSize: '11px', color: '#333', marginTop: '6px' }}>Move leads through your GHL pipeline and they'll appear here</div>
        </div>
      )}

      {hasData && (
        <>
          <Card title="Daily Lead Volume — Last 7 Days">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.05)" />
                <XAxis dataKey="day" tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={TT} />
                <Line type="monotone" dataKey="total" name="Total" stroke="#d4af37" strokeWidth={1.5} dot={{ fill: '#d4af37', r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
            <Card title="By Source — Last 7 Days">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={weekData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.05)" />
                  <XAxis dataKey="day" tick={{ fill: '#555', fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={TT} />
                  <Bar dataKey="meta" name="Meta Ads" stackId="a" fill="#d4af37" />
                  <Bar dataKey="indeed" name="Indeed" stackId="a" fill="#b89228" />
                  <Bar dataKey="ojph" name="OJ.ph" stackId="a" fill="#856010" radius={[2,2,0,0]} />
                </BarChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                {[['Meta Ads','#d4af37'],['Indeed','#b89228'],['OJ.ph','#856010']].map(([n,c]) => (
                  <span key={n} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: '#555' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: c }} />{n}
                  </span>
                ))}
              </div>
            </Card>

            <Card title="Current Stage Distribution">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={stageData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.05)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="stage" tick={{ fill: '#888', fontSize: 9 }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip contentStyle={TT} />
                  <Bar dataKey="count" name="Leads" fill="#d4af37" radius={[0,3,3,0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
