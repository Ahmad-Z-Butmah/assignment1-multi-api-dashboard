import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Home from './pages/Home'
import Weather from './pages/Weather'
import Currency from './pages/Currency'
import Country from './pages/Country'
import Meals from './pages/Meals'
import TVShows from './pages/TVShows'

const appRoutes = [
  { path: '/', page: <Home /> },
  { path: '/weather', page: <Weather /> },
  { path: '/currency', page: <Currency /> },
  { path: '/country', page: <Country /> },
  { path: '/meals', page: <Meals /> },
  { path: '/tvshows', page: <TVShows /> },
]

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main className="main-content">
        <Routes>
          {appRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.page}
            />
          ))}
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App