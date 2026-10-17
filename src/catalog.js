/* An original, procedurally-generated film catalogue (fictional titles — no copyrighted artwork). */
export const GENRES = ['Action', 'Sci-Fi', 'Drama', 'Comedy', 'Thriller', 'Romance', 'Animation', 'Horror', 'Fantasy', 'Mystery', 'Adventure', 'Documentary']
export const LANGS = ['English', 'Tamil', 'Hindi', 'Korean', 'Japanese', 'Spanish', 'French']

const TITLES = [
  ['Neon Horizon', ['Sci-Fi', 'Action']], ['The Last Monsoon', ['Drama', 'Romance']], ['Quantum Heist', ['Thriller', 'Sci-Fi']],
  ['Laughing Gas', ['Comedy']], ['Shadows of Madurai', ['Mystery', 'Thriller']], ['Paper Lanterns', ['Animation', 'Fantasy']],
  ['Iron Tide', ['Action', 'Adventure']], ['Whispers Below', ['Horror', 'Mystery']], ['Saffron Skies', ['Romance', 'Drama']],
  ['The Clockmaker’s Daughter', ['Fantasy', 'Drama']], ['Orbit 9', ['Sci-Fi', 'Thriller']], ['Spice Route', ['Adventure', 'Documentary']],
  ['Midnight Express Lane', ['Comedy', 'Action']], ['Echoes of Glass', ['Mystery', 'Drama']], ['Dragonfly Kingdom', ['Animation', 'Adventure']],
  ['Cold Signal', ['Thriller', 'Horror']], ['Monsoon Melody', ['Romance', 'Comedy']], ['Starborn', ['Sci-Fi', 'Fantasy']],
  ['Velocity', ['Action', 'Thriller']], ['The Silent Reef', ['Documentary', 'Adventure']], ['Crimson Court', ['Drama', 'Mystery']],
  ['Pixel Hearts', ['Animation', 'Romance']], ['The Hollow Manor', ['Horror']], ['Kingdom of Sand', ['Adventure', 'Fantasy']],
  ['Overclocked', ['Comedy', 'Sci-Fi']], ['Bluewater Blues', ['Drama']], ['Firewall', ['Thriller', 'Action']],
  ['Lantern Festival', ['Romance', 'Drama']], ['Cosmic Café', ['Comedy', 'Animation']], ['Deep Field', ['Documentary', 'Sci-Fi']],
  ['Ghost Protocol Zero', ['Action', 'Mystery']], ['Seven Rivers', ['Drama', 'Adventure']], ['The Glass Garden', ['Fantasy', 'Mystery']],
  ['Afterglow', ['Romance', 'Sci-Fi']], ['Night Market', ['Thriller', 'Comedy']], ['Wild Frontier', ['Adventure', 'Action']],
  ['Hush Little Town', ['Horror', 'Thriller']], ['The Chess Prodigy', ['Drama', 'Documentary']], ['Skyline Rebels', ['Action', 'Sci-Fi']],
  ['Moonlit Bazaar', ['Fantasy', 'Comedy']],
]
const FIRST = ['Arjun', 'Maya', 'Leo', 'Priya', 'Kenji', 'Sofia', 'Ravi', 'Hana', 'Diego', 'Anika', 'Theo', 'Isha', 'Marco', 'Yuna', 'Kabir', 'Elena']
const LAST = ['Raman', 'Cole', 'Iyer', 'Tanaka', 'Moreau', 'Kapoor', 'Silva', 'Park', 'Nair', 'Hart', 'Sato', 'Menon', 'Rossi', 'Khan']
const HOOKS = {
  Action: 'an unstoppable chase across three continents', 'Sci-Fi': 'a signal from beyond the edge of known space', Drama: 'a family secret that refuses to stay buried',
  Comedy: 'a hilariously botched plan that spirals out of control', Thriller: 'a ticking clock and a conspiracy hiding in plain sight', Romance: 'two strangers whose paths keep crossing',
  Animation: 'a tiny hero with an enormous heart', Horror: 'something that whispers when the lights go out', Fantasy: 'a forgotten realm that wakes after a thousand years',
  Mystery: 'a locked-room puzzle with no obvious answer', Adventure: 'a map that leads somewhere no one has returned from', Documentary: 'the remarkable true story behind an everyday wonder',
}
const PALETTES = [['#f97316', '#7c2d12'], ['#06b6d4', '#1e3a8a'], ['#a855f7', '#312e81'], ['#ef4444', '#450a0a'], ['#10b981', '#064e3b'], ['#eab308', '#713f12'], ['#ec4899', '#500724'], ['#3b82f6', '#0c4a6e'], ['#14b8a6', '#134e4a'], ['#f43f5e', '#1e1b4b']]
const EMOJI = { Action: '💥', 'Sci-Fi': '🚀', Drama: '🎭', Comedy: '😂', Thriller: '🔪', Romance: '💞', Animation: '🦄', Horror: '👻', Fantasy: '🐉', Mystery: '🕵️', Adventure: '🧭', Documentary: '🎥' }

let seed = 42
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
const pick = (a) => a[Math.floor(rnd() * a.length)]

export const MOVIES = TITLES.map(([title, genres], i) => {
  const year = 2008 + Math.floor(rnd() * 18)
  const rating = +(5.6 + rnd() * 3.9).toFixed(1)
  return {
    id: `m${i + 1}`, title, genres, year, rating,
    votes: Math.floor(800 + rnd() * 90000),
    runtime: 84 + Math.floor(rnd() * 80),
    lang: pick(LANGS),
    director: `${pick(FIRST)} ${pick(LAST)}`,
    cast: Array.from({ length: 4 }, () => `${pick(FIRST)} ${pick(LAST)}`),
    plot: `${title} follows ${pick(FIRST)}, who is drawn into ${HOOKS[genres[0]]}. ${genres[1] ? `Blending ${genres[0].toLowerCase()} with ${genres[1].toLowerCase()}, it` : 'It'} is a ${rating >= 8 ? 'critically acclaimed' : rating >= 7 ? 'crowd-pleasing' : 'cult'} ${year} release that audiences can’t stop talking about.`,
    palette: PALETTES[i % PALETTES.length],
    emoji: EMOJI[genres[0]],
    trending: rnd() > 0.6,
    certificate: pick(['U', 'U/A', 'U/A 13+', 'A']),
  }
})

export const byId = (id) => MOVIES.find((m) => m.id === id)

/** Content-based recommender: genre affinity from ratings + watchlist, blended with quality score. */
export function recommend({ ratings = {}, watchlist = [], watched = [] }, n = 12) {
  const affinity = Object.fromEntries(GENRES.map((g) => [g, 0]))
  Object.entries(ratings).forEach(([id, r]) => byId(id)?.genres.forEach((g) => (affinity[g] += (r - 2.5) * 1.2)))
  watchlist.forEach((id) => byId(id)?.genres.forEach((g) => (affinity[g] += 0.8)))
  watched.forEach((id) => byId(id)?.genres.forEach((g) => (affinity[g] += 0.5)))
  const seen = new Set([...Object.keys(ratings), ...watched])
  return MOVIES.filter((m) => !seen.has(m.id))
    .map((m) => {
      const g = m.genres.reduce((s, x) => s + affinity[x], 0)
      const score = g * 0.6 + m.rating * 0.8 + Math.log10(m.votes) * 0.3
      const top = m.genres.filter((x) => affinity[x] > 0)
      return { ...m, score, reason: top.length ? `Because you enjoy ${top.join(' & ')}` : `Highly rated ${m.genres[0]}` }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
}
