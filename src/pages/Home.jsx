import { useEffect, useState } from 'react'
import { Flame, Trophy, CalendarClock, Play, Info, Bookmark } from 'lucide-react'
import { MOVIES, GENRES } from '../catalog.js'
import { Row, MovieModal } from '../components/Movie.jsx'
import { useLibrary } from '../library.jsx'

export default function Home() {
  const [open, setOpen] = useState(null)
  const [slide, setSlide] = useState(0)
  const { toggleWatchlist } = useLibrary()
  const featured = MOVIES.filter((m) => m.trending).slice(0, 5)
  const f = featured[slide]

  useEffect(() => { const t = setInterval(() => setSlide((s) => (s + 1) % featured.length), 6000); return () => clearInterval(t) }, [featured.length])

  return (
    <div className="col" style={{ gap: 26 }}>
      <div className="hero-banner fade-up" style={{ background: `radial-gradient(circle at 75% 40%, ${f.palette[0]}, ${f.palette[1]} 70%)` }}>
        <div className="col" key={f.id} style={{ gap: 14, animation: 'fadeUp .7s' }}>
          <span className="badge" style={{ background: 'rgba(255,255,255,.2)', color: '#fff', width: 'fit-content' }}>🔥 Trending #{slide + 1}</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 800, lineHeight: 1.05 }}>{f.title}</h2>
          <div className="row small" style={{ opacity: 0.9 }}>★ {f.rating} · {f.year} · {f.runtime} min · {f.genres.join(', ')}</div>
          <p style={{ opacity: 0.9, maxWidth: 520 }}>{f.plot}</p>
          <div className="row wrap">
            <button className="btn" style={{ background: '#fff', color: '#111' }} onClick={() => setOpen(f.id)}><Play size={16} /> Watch preview</button>
            <button className="btn ghost" style={{ background: 'rgba(255,255,255,.18)', color: '#fff' }} onClick={() => setOpen(f.id)}><Info size={16} /> Details</button>
            <button className="btn ghost icon" style={{ background: 'rgba(255,255,255,.18)', color: '#fff' }} onClick={() => toggleWatchlist(f.id)}><Bookmark size={16} /></button>
          </div>
          <div className="hero-dots">{featured.map((_, i) => <button key={i} className={i === slide ? 'active' : ''} onClick={() => setSlide(i)} />)}</div>
        </div>
        <div className="hero-art" style={{ textAlign: 'center', fontSize: 160, animation: 'bob 4s ease-in-out infinite', filter: 'drop-shadow(0 30px 40px rgba(0,0,0,.4))' }}>{f.emoji}</div>
      </div>
      <Row title="Trending now" icon={Flame} movies={MOVIES.filter((m) => m.trending)} onOpen={setOpen} />
      <Row title="Top rated" icon={Trophy} movies={[...MOVIES].sort((a, b) => b.rating - a.rating).slice(0, 14)} onOpen={setOpen} />
      <Row title="New releases" icon={CalendarClock} movies={[...MOVIES].sort((a, b) => b.year - a.year).slice(0, 14)} onOpen={setOpen} />
      {GENRES.slice(0, 4).map((g) => <Row key={g} title={`${g} picks`} movies={MOVIES.filter((m) => m.genres.includes(g))} onOpen={setOpen} />)}
      {open && <MovieModal id={open} onClose={() => setOpen(null)} onOpen={setOpen} />}
    </div>
  )
}
