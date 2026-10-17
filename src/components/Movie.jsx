import { useState } from 'react'
import { Star, Bookmark, BookmarkCheck, Heart, Play, Eye, Clock, Globe, X } from 'lucide-react'
import Modal from './Modal.jsx'
import { useLibrary } from '../library.jsx'
import { MOVIES } from '../catalog.js'

export function Poster({ m, height = 270, big = false }) {
  return (
    <div className="poster" style={{ height, background: `radial-gradient(circle at 30% 20%, ${m.palette[0]}, ${m.palette[1]} 75%)` }}>
      <div className="poster-emoji" style={{ fontSize: big ? 90 : 56 }}>{m.emoji}</div>
      <div className="poster-title" style={{ fontSize: big ? '1.6rem' : '1.05rem' }}>{m.title}</div>
      <div className="poster-meta">{m.year} · {m.genres.join(' / ')}</div>
    </div>
  )
}

export function Stars({ value = 0, onChange, size = 20 }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="row" style={{ gap: 3 }} onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} style={{ cursor: onChange ? 'pointer' : 'default', transition: 'transform .15s', transform: hover === i ? 'scale(1.25)' : 'none' }}
          fill={(hover || value) >= i ? '#fbbf24' : 'none'} color={(hover || value) >= i ? '#fbbf24' : 'var(--muted)'}
          onMouseEnter={() => onChange && setHover(i)} onClick={() => onChange?.(i)} />
      ))}
    </div>
  )
}

export function MovieCard({ m, onOpen, extra }) {
  const { watchlist, toggleWatchlist, favs, toggleFav } = useLibrary()
  const inList = watchlist.includes(m.id)
  return (
    <div className="movie-card" onClick={() => onOpen(m.id)}>
      <Poster m={m} />
      <div className="movie-overlay">
        <div className="row between">
          <span className="badge" style={{ background: 'rgba(0,0,0,.55)', color: '#fbbf24' }}>★ {m.rating}</span>
          <div className="row" style={{ gap: 6 }}>
            <button className="btn icon sm" title="Favourite" onClick={(e) => { e.stopPropagation(); toggleFav(m.id) }}><Heart size={15} fill={favs.includes(m.id) ? '#fff' : 'none'} /></button>
            <button className="btn icon sm" title="Watchlist" onClick={(e) => { e.stopPropagation(); toggleWatchlist(m.id) }}>{inList ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}</button>
          </div>
        </div>
        <div>
          <div className="bold">{m.title}</div>
          <div className="xs" style={{ opacity: 0.85 }}>{m.runtime} min · {m.lang}</div>
          {extra && <div className="xs bold" style={{ marginTop: 4, color: '#fde68a' }}>{extra}</div>}
        </div>
      </div>
    </div>
  )
}

export function MovieModal({ id, onClose, onOpen }) {
  const lib = useLibrary()
  const m = MOVIES.find((x) => x.id === id)
  const [text, setText] = useState(lib.reviews[id]?.text || '')
  const [playing, setPlaying] = useState(false)
  const similar = MOVIES.filter((x) => x.id !== id && x.genres.some((g) => m.genres.includes(g))).sort((a, b) => b.rating - a.rating).slice(0, 4)

  return (
    <Modal title="" onClose={onClose} width={860}>
      <div className="movie-detail" style={{ marginTop: -36 }}>
        <div style={{ position: 'relative' }}>
          <Poster m={m} height={380} big />
          {playing && (
            <div className="trailer" onClick={() => setPlaying(false)}>
              <div className="eq">{Array.from({ length: 12 }).map((_, i) => <span key={i} style={{ animationDelay: `${i * 0.08}s` }} />)}</div>
              <div className="bold">Playing preview…</div>
              <div className="progress" style={{ width: '70%' }}><div className="trailer-bar" /></div>
              <span className="xs"><X size={12} /> click to close</span>
            </div>
          )}
        </div>
        <div className="col" style={{ gap: 12 }}>
          <div>
            <h2 style={{ fontSize: '1.7rem', fontWeight: 800 }}>{m.title}</h2>
            <div className="row wrap small muted"><span className="badge">{m.certificate}</span>{m.year}<span className="row" style={{ gap: 4 }}><Clock size={14} />{Math.floor(m.runtime / 60)}h {m.runtime % 60}m</span><span className="row" style={{ gap: 4 }}><Globe size={14} />{m.lang}</span></div>
          </div>
          <div className="row wrap">{m.genres.map((g) => <span key={g} className="chip" style={{ cursor: 'default' }}>{g}</span>)}</div>
          <div className="row"><span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24' }}>★ {m.rating}</span><span className="muted small">/10 · {m.votes.toLocaleString()} votes</span></div>
          <p className="muted">{m.plot}</p>
          <div className="small"><b>Director:</b> {m.director}<br /><b>Cast:</b> {m.cast.join(', ')}</div>
          <div className="row wrap">
            <button className="btn" onClick={() => setPlaying(true)}><Play size={16} /> Preview</button>
            <button className="btn ghost" onClick={() => lib.toggleWatchlist(id)}>{lib.watchlist.includes(id) ? <BookmarkCheck size={16} /> : <Bookmark size={16} />} {lib.watchlist.includes(id) ? 'In watchlist' : 'Watchlist'}</button>
            <button className="btn ghost" onClick={() => lib.markWatched(id)}><Eye size={16} /> {lib.watched.includes(id) ? 'Watched ✓' : 'Mark watched'}</button>
            <button className="btn ghost icon" onClick={() => lib.toggleFav(id)}><Heart size={16} fill={lib.favs.includes(id) ? 'var(--danger)' : 'none'} color={lib.favs.includes(id) ? 'var(--danger)' : 'currentColor'} /></button>
          </div>
        </div>
      </div>
      <div className="card mt col">
        <div className="row between wrap"><b>Your rating</b><Stars value={lib.ratings[id] || 0} onChange={(r) => lib.rate(id, r)} size={24} /></div>
        <textarea className="input" rows="3" placeholder="Write a review…" value={text} onChange={(e) => setText(e.target.value)} maxLength={600} />
        <div className="row between"><span className="xs muted">{text.length}/600</span><button className="btn sm" disabled={!text.trim()} onClick={() => lib.review(id, text.trim())}>Save review</button></div>
      </div>
      <div className="mt"><div className="section-title">More like this</div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}>{similar.map((s) => <MovieCard key={s.id} m={s} onOpen={onOpen} />)}</div>
      </div>
    </Modal>
  )
}

export function Row({ title, icon: Icon, movies, onOpen, extra }) {
  const id = `row-${title.replace(/\W/g, '')}`
  const scroll = (d) => document.getElementById(id).scrollBy({ left: d * 600, behavior: 'smooth' })
  return (
    <section className="fade-up">
      <div className="row between"><div className="section-title">{Icon && <Icon size={19} />} {title}</div>
        <div className="row"><button className="btn ghost icon sm" onClick={() => scroll(-1)}>‹</button><button className="btn ghost icon sm" onClick={() => scroll(1)}>›</button></div></div>
      <div id={id} className="h-scroll">{movies.map((m) => <div key={m.id} style={{ width: 185, flexShrink: 0 }}><MovieCard m={m} onOpen={onOpen} extra={extra?.(m)} /></div>)}</div>
    </section>
  )
}
