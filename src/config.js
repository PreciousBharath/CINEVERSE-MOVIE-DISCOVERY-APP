import { Clapperboard, Home, Compass, Bookmark, Sparkles, BarChart3, Dices, Star, Heart, ShieldCheck, MessageSquare } from 'lucide-react'

export const APP = {
  key: 'cineverse',
  name: 'CineVerse',
  logo: Clapperboard,
  defaultTheme: 'dark',
  defaultAccent: 2,
  demo: { name: 'Movie Buff', email: 'demo@cineverse.app', password: 'Demo@1234' },
  hero: {
    title: 'Your universe of movies, curated just for you.',
    subtitle: 'Discover films across every genre, build watchlists, rate & review, and let our recommendation engine find your next favourite.',
    features: [
      { icon: Sparkles, text: 'Personalised “For You” recommendations' },
      { icon: Bookmark, text: 'Watchlist & watched history' },
      { icon: Star, text: 'Ratings and written reviews' },
      { icon: ShieldCheck, text: 'Secure accounts with hashed passwords' },
    ],
  },
  nav: [
    { to: '/', label: 'Home', icon: Home },
    { to: '/browse', label: 'Browse', icon: Compass },
    { to: '/for-you', label: 'For You', icon: Sparkles },
    { to: '/watchlist', label: 'My Lists', icon: Bookmark },
    { to: '/reviews', label: 'My Reviews', icon: MessageSquare },
    { to: '/roulette', label: 'Movie Roulette', icon: Dices },
    { to: '/stats', label: 'Insights', icon: BarChart3 },
  ],
  notifications: ['New this week: 6 fresh titles added to Trending', 'Rate movies to sharpen your recommendations', 'Can’t decide? Spin the Movie Roulette'],
}
export { Heart }
