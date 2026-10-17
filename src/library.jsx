import { createContext, useContext } from 'react'
import { useAuth } from './auth.jsx'
import { useUserState } from './storage.js'
import { useToast } from './toast.jsx'
import { byId } from './catalog.js'

const LibCtx = createContext(null)

export function LibraryProvider({ children }) {
  const { user } = useAuth()
  const notify = useToast()
  const demo = user?.id === 'demo'
  const [watchlist, setWatchlist] = useUserState(user, 'watchlist', demo ? ['m1', 'm3', 'm9', 'm18'] : [])
  const [watched, setWatched] = useUserState(user, 'watched', demo ? ['m5', 'm11', 'm19', 'm2'] : [])
  const [favs, setFavs] = useUserState(user, 'favs', demo ? ['m11'] : [])
  const [ratings, setRatings] = useUserState(user, 'ratings', demo ? { m5: 5, m11: 4, m19: 4, m2: 3 } : {})
  const [reviews, setReviews] = useUserState(user, 'reviews', demo ? { m11: { text: 'Smart, tense and beautifully shot. The final act is a blast!', at: Date.now() - 86400000 } } : {})

  const toggle = (list, set, id, on, off) => {
    const has = list.includes(id)
    set(has ? list.filter((x) => x !== id) : [id, ...list])
    notify(`${byId(id).title} ${has ? off : on}`, has ? 'info' : 'success')
  }

  const value = {
    watchlist, watched, favs, ratings, reviews,
    toggleWatchlist: (id) => toggle(watchlist, setWatchlist, id, 'added to watchlist', 'removed from watchlist'),
    toggleFav: (id) => toggle(favs, setFavs, id, 'added to favourites ❤️', 'removed from favourites'),
    markWatched: (id) => {
      if (!watched.includes(id)) setWatched([id, ...watched])
      setWatchlist(watchlist.filter((x) => x !== id))
      notify(`Marked “${byId(id).title}” as watched`, 'success')
    },
    unwatch: (id) => setWatched(watched.filter((x) => x !== id)),
    rate: (id, r) => { setRatings({ ...ratings, [id]: r }); if (!watched.includes(id)) setWatched([id, ...watched]) },
    review: (id, text) => { setReviews({ ...reviews, [id]: { text, at: Date.now() } }); notify('Review saved', 'success') },
    deleteReview: (id) => { const n = { ...reviews }; delete n[id]; setReviews(n) },
    reorder: (from, to) => { const l = [...watchlist]; const [x] = l.splice(from, 1); l.splice(to, 0, x); setWatchlist(l) },
  }
  return <LibCtx.Provider value={value}>{children}</LibCtx.Provider>
}

export const useLibrary = () => useContext(LibCtx)
