import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Clock, Eye, Star, Bookmark } from 'lucide-react'
import StatCard from '../components/StatCard.jsx'
import Empty from '../components/Empty.jsx'
import { byId } from '../catalog.js'
import { useLibrary } from '../library.jsx'

const COLORS = ['#f97316', '#06b6d4', '#a855f7', '#ef4444', '#10b981', '#eab308', '#ec4899', '#3b82f6']
const tip = { background: 'var(--card-solid)', border: '1px solid var(--border)', borderRadius: 12 }

export default function Stats() {
  const lib = useLibrary()
  const watched = lib.watched.map(byId)
  const minutes = watched.reduce((s, m) => s + m.runtime, 0)
  const rs = Object.values(lib.ratings)
  const genre = {}
  watched.forEach((m) => m.genres.forEach((g) => (genre[g] = (genre[g] || 0) + 1)))
  const pie = Object.entries(genre).map(([name, value]) => ({ name, value }))
  const dist = [1, 2, 3, 4, 5].map((s) => ({ stars: `${s}★`, count: rs.filter((r) => r === s).length }))
  const decades = {}
  watched.forEach((m) => { const d = `${Math.floor(m.year / 5) * 5}s`; decades[d] = (decades[d] || 0) + 1 })

  return (
    <div className="col" style={{ gap: 20 }}>
      <div className="grid grid-4 stagger">
        <StatCard icon={Eye} label="Movies watched" value={watched.length} />
        <StatCard icon={Clock} label="Hours watched" value={minutes / 60} decimals={1} />
        <StatCard icon={Star} label="Average rating" value={rs.length ? rs.reduce((a, b) => a + b, 0) / rs.length : 0} decimals={1} suffix=" ★" />
        <StatCard icon={Bookmark} label="In watchlist" value={lib.watchlist.length} />
      </div>
      {!watched.length ? <Empty icon={Eye} title="No viewing history yet" text="Mark movies as watched to unlock insights." /> : (
        <div className="grid grid-2">
          <div className="card fade-up"><div className="section-title">Genres you watch</div>
            <div style={{ height: 280 }}><ResponsiveContainer><PieChart><Pie data={pie} dataKey="value" nameKey="name" innerRadius={60} outerRadius={105} paddingAngle={3} label={({ name }) => name}>{pie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip contentStyle={tip} /></PieChart></ResponsiveContainer></div></div>
          <div className="card fade-up"><div className="section-title">How you rate</div>
            <div style={{ height: 280 }}><ResponsiveContainer><BarChart data={dist}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} /><XAxis dataKey="stars" stroke="var(--muted)" /><YAxis allowDecimals={false} stroke="var(--muted)" /><Tooltip contentStyle={tip} cursor={{ fill: 'var(--bg-2)' }} /><Bar dataKey="count" fill="var(--accent)" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
          <div className="card fade-up"><div className="section-title">Release eras</div>
            <div className="col">{Object.entries(decades).sort().map(([d, c]) => <div key={d} className="row small"><span style={{ width: 60 }}>{d}</span><div className="progress" style={{ flex: 1 }}><div style={{ width: `${(c / watched.length) * 100}%` }} /></div><b>{c}</b></div>)}</div></div>
        </div>
      )}
    </div>
  )
}
