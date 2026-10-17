import { useState } from 'react'
import { Bookmark, Eye, Heart, GripVertical, Trash2, CheckCircle2 } from 'lucide-react'
import { byId } from '../catalog.js'
import { Poster, Stars, MovieModal } from '../components/Movie.jsx'
import Empty from '../components/Empty.jsx'
import { useLibrary } from '../library.jsx'

export default function Watchlist() {
  const lib = useLibrary()
  const [tab, setTab] = useState('watchlist')
  const [open, setOpen] = useState(null)
  const [drag, setDrag] = useState(null)
  const lists = { watchlist: lib.watchlist, watched: lib.watched, favourites: lib.favs }
  const ids = lists[tab]
  const totalMin = lib.watchlist.reduce((s, id) => s + byId(id).runtime, 0)

  return (
    <div className="col" style={{ gap: 18 }}>
      <div className="row between wrap">
        <div className="tabs">
          <button className={tab === 'watchlist' ? 'active' : ''} onClick={() => setTab('watchlist')}><Bookmark size={14} /> Watchlist ({lib.watchlist.length})</button>
          <button className={tab === 'watched' ? 'active' : ''} onClick={() => setTab('watched')}><Eye size={14} /> Watched ({lib.watched.length})</button>
          <button className={tab === 'favourites' ? 'active' : ''} onClick={() => setTab('favourites')}><Heart size={14} /> Favourites ({lib.favs.length})</button>
        </div>
        {tab === 'watchlist' && <span className="badge">⏱ {Math.floor(totalMin / 60)}h {totalMin % 60}m to watch · drag to reorder</span>}
      </div>
      {!ids.length ? <Empty icon={Bookmark} title="Nothing here yet" text="Browse movies and add them to your lists." /> : (
        <div className="col stagger">
          {ids.map((id, i) => { const m = byId(id); return (
            <div key={id} className="card row" draggable={tab === 'watchlist'} style={{ padding: 12, opacity: drag === i ? 0.4 : 1 }}
              onDragStart={() => setDrag(i)} onDragOver={(e) => e.preventDefault()} onDrop={() => { if (drag !== null) lib.reorder(drag, i); setDrag(null) }} onDragEnd={() => setDrag(null)}>
              {tab === 'watchlist' && <GripVertical size={18} className="muted" style={{ cursor: 'grab' }} />}
              <div style={{ width: 70, flexShrink: 0, cursor: 'pointer' }} onClick={() => setOpen(id)}><Poster m={m} height={95} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="bold" style={{ cursor: 'pointer' }} onClick={() => setOpen(id)}>{tab === 'watchlist' && <span className="gradient-text">#{i + 1} </span>}{m.title}</div>
                <div className="small muted">{m.year} · {m.genres.join(', ')} · {m.runtime} min · ★ {m.rating}</div>
                {tab === 'watched' && <div className="mt" style={{ marginTop: 6 }}><Stars value={lib.ratings[id] || 0} onChange={(r) => lib.rate(id, r)} size={17} /></div>}
              </div>
              <div className="row">
                {tab === 'watchlist' && <button className="btn sm" onClick={() => lib.markWatched(id)}><CheckCircle2 size={14} /> Watched</button>}
                <button className="btn ghost icon" onClick={() => (tab === 'watchlist' ? lib.toggleWatchlist(id) : tab === 'watched' ? lib.unwatch(id) : lib.toggleFav(id))}><Trash2 size={15} /></button>
              </div>
            </div>) })}
        </div>
      )}
      {open && <MovieModal id={open} onClose={() => setOpen(null)} onOpen={setOpen} />}
    </div>
  )
}
