import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal, Film } from 'lucide-react'
import { MOVIES, GENRES, LANGS } from '../catalog.js'
import { MovieCard, MovieModal } from '../components/Movie.jsx'
import Empty from '../components/Empty.jsx'

export default function Browse() {
  const [q, setQ] = useState('')
  const [genres, setGenres] = useState([])
  const [lang, setLang] = useState('All')
  const [minRating, setMinRating] = useState(0)
  const [years, setYears] = useState([2008, 2026])
  const [sort, setSort] = useState('popular')
  const [open, setOpen] = useState(null)
  const [show, setShow] = useState(true)

  const list = useMemo(() => MOVIES
    .filter((m) => `${m.title} ${m.director} ${m.cast.join(' ')}`.toLowerCase().includes(q.toLowerCase()))
    .filter((m) => !genres.length || genres.every((g) => m.genres.includes(g)))
    .filter((m) => lang === 'All' || m.lang === lang)
    .filter((m) => m.rating >= minRating && m.year >= years[0] && m.year <= years[1])
    .sort((a, b) => ({ popular: b.votes - a.votes, rating: b.rating - a.rating, newest: b.year - a.year, az: a.title.localeCompare(b.title), runtime: a.runtime - b.runtime }[sort])), [q, genres, lang, minRating, years, sort])

  return (
    <div className="col" style={{ gap: 18 }}>
      <div className="row wrap between">
        <div className="input-icon" style={{ flex: 1, minWidth: 240, maxWidth: 480 }}><Search size={17} /><input className="input" placeholder="Search titles, directors, cast…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <div className="row">
          <select className="input" style={{ width: 170 }} value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="popular">Most popular</option><option value="rating">Highest rated</option><option value="newest">Newest</option><option value="az">A → Z</option><option value="runtime">Shortest</option>
          </select>
          <button className="btn ghost" onClick={() => setShow(!show)}><SlidersHorizontal size={16} /> Filters</button>
        </div>
      </div>
      {show && (
        <div className="card col fade-up">
          <div className="row wrap">{GENRES.map((g) => <button key={g} className={`chip ${genres.includes(g) ? 'active' : ''}`} onClick={() => setGenres(genres.includes(g) ? genres.filter((x) => x !== g) : [...genres, g])}>{g}</button>)}</div>
          <div className="grid grid-3">
            <div className="field"><label>Language</label><select className="input" value={lang} onChange={(e) => setLang(e.target.value)}><option>All</option>{LANGS.map((l) => <option key={l}>{l}</option>)}</select></div>
            <div className="field"><label>Minimum rating: ★ {minRating}</label><input type="range" min="0" max="9" step="0.5" value={minRating} onChange={(e) => setMinRating(+e.target.value)} style={{ accentColor: 'var(--accent)' }} /></div>
            <div className="field"><label>Year: {years[0]} – {years[1]}</label>
              <div className="row"><input type="range" min="2008" max="2026" value={years[0]} onChange={(e) => setYears([Math.min(+e.target.value, years[1]), years[1]])} style={{ accentColor: 'var(--accent)', flex: 1 }} /><input type="range" min="2008" max="2026" value={years[1]} onChange={(e) => setYears([years[0], Math.max(+e.target.value, years[0])])} style={{ accentColor: 'var(--accent)', flex: 1 }} /></div></div>
          </div>
          <div className="row between small"><span className="muted">{list.length} of {MOVIES.length} titles</span><button className="btn ghost sm" onClick={() => { setGenres([]); setLang('All'); setMinRating(0); setYears([2008, 2026]); setQ('') }}>Reset filters</button></div>
        </div>
      )}
      {!list.length ? <Empty icon={Film} title="No movies match" text="Try removing a filter." /> : (
        <div className="grid stagger" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))' }}>{list.map((m) => <MovieCard key={m.id} m={m} onOpen={setOpen} />)}</div>
      )}
      {open && <MovieModal id={open} onClose={() => setOpen(null)} onOpen={setOpen} />}
    </div>
  )
}
