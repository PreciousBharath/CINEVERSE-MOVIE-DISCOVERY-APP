import { useState } from 'react'
import { MessageSquare, Trash2, Pencil } from 'lucide-react'
import { byId } from '../catalog.js'
import { Poster, Stars, MovieModal } from '../components/Movie.jsx'
import Empty from '../components/Empty.jsx'
import { useLibrary } from '../library.jsx'
import { useAuth } from '../auth.jsx'

export default function Reviews() {
  const lib = useLibrary()
  const { user } = useAuth()
  const [open, setOpen] = useState(null)
  const entries = Object.entries(lib.reviews).sort((a, b) => b[1].at - a[1].at)
  return (
    <div className="col" style={{ gap: 16 }}>
      {!entries.length ? <Empty icon={MessageSquare} title="No reviews yet" text="Open any movie and share what you thought." /> : (
        <div className="grid grid-2 stagger">{entries.map(([id, r]) => { const m = byId(id); return (
          <div key={id} className="card row" style={{ alignItems: 'flex-start' }}>
            <div style={{ width: 90, flexShrink: 0 }}><Poster m={m} height={125} /></div>
            <div className="col" style={{ flex: 1, gap: 6 }}>
              <div className="row between"><b>{m.title}</b><Stars value={lib.ratings[id] || 0} size={15} /></div>
              <p className="small">“{r.text}”</p>
              <div className="row between xs muted"><span>— {user.name}, {new Date(r.at).toLocaleDateString()}</span>
                <span className="row"><button className="btn ghost icon sm" onClick={() => setOpen(id)}><Pencil size={13} /></button><button className="btn ghost icon sm" onClick={() => lib.deleteReview(id)}><Trash2 size={13} /></button></span></div>
            </div>
          </div>) })}</div>
      )}
      {open && <MovieModal id={open} onClose={() => setOpen(null)} onOpen={setOpen} />}
    </div>
  )
}
