import { useState } from 'react'
import { Sparkles, Wand2 } from 'lucide-react'
import { recommend, GENRES, byId } from '../catalog.js'
import { MovieCard, MovieModal } from '../components/Movie.jsx'
import { useLibrary } from '../library.jsx'

export default function ForYou() {
  const lib = useLibrary()
  const [open, setOpen] = useState(null)
  const recs = recommend(lib, 16)
  const aff = {}
  Object.entries(lib.ratings).forEach(([id, r]) => byId(id)?.genres.forEach((g) => (aff[g] = (aff[g] || 0) + r)))
  lib.watchlist.forEach((id) => byId(id)?.genres.forEach((g) => (aff[g] = (aff[g] || 0) + 2)))
  const top = Object.entries(aff).sort((a, b) => b[1] - a[1]).slice(0, 5)
  const max = top[0]?.[1] || 1

  return (
    <div className="col" style={{ gap: 20 }}>
      <div className="card fade-up row wrap between" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: '#fff' }}>
        <div className="col" style={{ gap: 6 }}>
          <div className="row bold" style={{ fontSize: '1.3rem' }}><Wand2 /> Your taste profile</div>
          <div className="small" style={{ opacity: 0.9 }}>Built from {Object.keys(lib.ratings).length} ratings and {lib.watchlist.length} watchlist titles. Rate more movies to sharpen it.</div>
        </div>
        <div className="col" style={{ minWidth: 260, gap: 6 }}>
          {top.length ? top.map(([g, v]) => (
            <div key={g} className="row small"><span style={{ width: 90 }}>{g}</span><div className="progress" style={{ flex: 1, background: 'rgba(255,255,255,.25)' }}><div style={{ width: `${(v / max) * 100}%`, background: '#fff' }} /></div></div>
          )) : <span className="small">No signals yet — showing top-rated picks.</span>}
        </div>
      </div>
      <div className="section-title"><Sparkles size={18} /> Recommended for you</div>
      <div className="grid stagger" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))' }}>
        {recs.map((m) => <MovieCard key={m.id} m={m} onOpen={setOpen} extra={m.reason} />)}
      </div>
      <p className="xs muted">Engine: content-based filtering — genre affinity from your ratings (weighted by stars), watchlist and history, blended with each title’s rating and popularity. Considers {GENRES.length} genres.</p>
      {open && <MovieModal id={open} onClose={() => setOpen(null)} onOpen={setOpen} />}
    </div>
  )
}
