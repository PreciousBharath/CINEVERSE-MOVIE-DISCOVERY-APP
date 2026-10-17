import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import { Protected, GuestOnly } from './guard.jsx'
import { LibraryProvider } from './library.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Home from './pages/Home.jsx'
import Browse from './pages/Browse.jsx'
import ForYou from './pages/ForYou.jsx'
import Watchlist from './pages/Watchlist.jsx'
import Reviews from './pages/Reviews.jsx'
import Roulette from './pages/Roulette.jsx'
import Stats from './pages/Stats.jsx'
import Profile from './pages/Profile.jsx'
import Settings from './pages/Settings.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
      <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />
      <Route element={<Protected><LibraryProvider><Layout /></LibraryProvider></Protected>}>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/for-you" element={<ForYou />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/roulette" element={<Roulette />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
