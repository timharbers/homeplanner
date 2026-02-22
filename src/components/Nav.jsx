import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { palette, font } from '../theme'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Features', path: '/features' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'About', path: '/about' },
]

export function Nav() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <nav
      className="nav-wrap"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(250,250,249,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${palette.borderLight}`,
        padding: '0 40px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: font.body,
      }}
    >
      <Link
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          textDecoration: 'none',
          color: 'inherit',
        }}
        onClick={() => setMobileOpen(false)}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: palette.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontFamily: font.display,
            fontSize: 18,
            fontWeight: 700,
          }}
        >
          S
        </div>
        <span
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: palette.text,
            letterSpacing: '-0.02em',
          }}
        >
          SettleGuide
        </span>
      </Link>
      <button
        type="button"
        className="nav-toggle"
        aria-label="Toggle menu"
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((o) => !o)}
        style={{
          background: 'transparent',
          border: 'none',
          padding: 8,
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          gap: 5,
        }}
      >
        <span style={{ width: 24, height: 2, background: palette.text, borderRadius: 1 }} />
        <span style={{ width: 24, height: 2, background: palette.text, borderRadius: 1 }} />
        <span style={{ width: 24, height: 2, background: palette.text, borderRadius: 1 }} />
      </button>
      <div className={`nav-links ${mobileOpen ? 'open' : ''}`} style={{ display: 'flex', gap: 36, alignItems: 'center', marginLeft: 'auto' }}>
        {navLinks.map(({ label, path }) => (
          <Link
            key={path}
            to={path}
            onClick={() => setMobileOpen(false)}
            style={{
              fontSize: 14,
              fontWeight: isActive(path) ? 600 : 400,
              color: isActive(path) ? palette.text : palette.textMuted,
              textDecoration: 'none',
              letterSpacing: '0.01em',
              borderBottom:
                isActive(path) ? `2px solid ${palette.accent}` : '2px solid transparent',
              paddingBottom: 2,
              transition: 'all 0.2s',
            }}
          >
            {label}
          </Link>
        ))}
        <a
          href="#"
          onClick={() => setMobileOpen(false)}
          style={{
            background: palette.accent,
            color: 'white',
            border: 'none',
            padding: '9px 22px',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            letterSpacing: '0.01em',
            transition: 'background 0.2s',
            fontFamily: font.body,
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => (e.target.style.background = palette.accentHover)}
          onMouseLeave={(e) => (e.target.style.background = palette.accent)}
        >
          Get Started — Free
        </a>
      </div>
    </nav>
  )
}
