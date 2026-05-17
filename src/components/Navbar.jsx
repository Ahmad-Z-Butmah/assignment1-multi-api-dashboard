import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          🌐 MultiAPI
        </NavLink>
        <ul className="navbar-links">
          <li><NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
          <li><NavLink to="/weather" className={({ isActive }) => isActive ? 'active' : ''}>Weather</NavLink></li>
          <li><NavLink to="/currency" className={({ isActive }) => isActive ? 'active' : ''}>Currency</NavLink></li>
          <li><NavLink to="/country" className={({ isActive }) => isActive ? 'active' : ''}>Country</NavLink></li>
          <li><NavLink to="/meals" className={({ isActive }) => isActive ? 'active' : ''}>Meals</NavLink></li>
          <li><NavLink to="/tvshows" className={({ isActive }) => isActive ? 'active' : ''}>TV Shows</NavLink></li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
