import { useState } from 'react'
import { Dices } from 'lucide-react'
import { MOVIES, GENRES } from '../catalog.js'
import { Poster, MovieModal } from '../components/Movie.jsx'

const COLORS = ['#f97316', '#06b6d4', '#a855f7', '#ef4444', '#10b981', '#eab308', '#ec4899', '#3b82f6']

export default function Roulette() {
  const [genre, setGenre] = useState('Any')
  const [maxTime, setMaxTime] = useState(180)
  const [angle, setAngle] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState(null)
  const [open, setOpen] = useState(null)
  const pool = MOVIES.filter((m) => (genre === 'Any' || m.genres.includes(genre)) && m.runtime <= maxTime)
  const seg = 360 / COLORS.length

  const spin = () => {
    if (!pool.length) return
    setSpinning(true); setResult(null)
    const next = angle + 1440 + Math.random() * 360
    setAngle(next)
    setTimeout(() => { setResult(pool[Math.floor(Math.random() * pool.length)]); setSpinning(false) }, 4100)
  }

  return (
    <div className="grid grid-2">
      <div className="card col fade-up" style={{ alignItems: 'center', gap: 18 }}>
        <div className="section-title"><Dices size={18} /> Can’t decide? Spin it!</div>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', fontSize: 28, zIndex: 2 }}>▼</div>
          <div className="wheel" style={{ transform: `rotate(${angle}deg)`, background: `conic-gradient(${COLORS.map((c, i) => `${c} ${i * seg}deg ${(i + 1) * seg}deg`).join(',')})` }} />
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 40 }}>🎬</div>
        </div>
        <div className="field" style={{ width: '100%' }}><label>Genre</label><select className="input" value={genre} onChange={(e) => setGenre(e.target.value)}><option>Any</option>{GENRES.map((g) => <option key={g}>{g}</option>)}</select></div>
        <div className="field" style={{ width: '100%' }}><label>Max runtime: {maxTime} min</label><input type="range" min="90" max="180" step="5" value={maxTime} onChange={(e) => setMaxTime(+e.target.value)} style={{ accentColor: 'var(--accent)' }} /></div>
        <button className="btn block" onClick={spin} disabled={spinning || !pool.length}><Dices size={17} /> {spinning ? 'Spinning…' : `Spin (${pool.length} movies)`}</button>
      </div>
      <div className="card col" style={{ alignItems: 'center', justifyContent: 'center', minHeight: 420 }}>
        {result ? (
          <div className="col fade-up" style={{ alignItems: 'center', gap: 12, width: '100%', maxWidth: 280, animation: 'popIn .5s cubic-bezier(.2,1.4,.4,1)' }}>
            <div className="badge green">🎉 Tonight you’re watching</div>
            <div style={{ width: '100%', cursor: 'pointer' }} onClick={() => setOpen(result.id)}><Poster m={result} height={340} big /></div>
            <button className="btn" onClick={() => setOpen(result.id)}>View details</button>
          </div>
        ) : <div className="muted" style={{ textAlign: 'center' }}><div style={{ fontSize: 60 }}>{spinning ? '🌀' : '🍿'}</div>{spinning ? 'Picking something great…' : 'Your pick will appear here'}</div>}
      </div>
      {open && <MovieModal id={open} onClose={() => setOpen(null)} onOpen={setOpen} />}
    </div>
  )
}
