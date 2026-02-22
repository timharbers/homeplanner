import { Link } from 'react-router-dom'
import { palette, font } from '../theme'

const footerColumns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', to: '/features' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'Roadmap', to: '#' },
      { label: 'Changelog', to: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Blog', to: '#' },
      { label: 'Careers', to: '#' },
      { label: 'Contact', to: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', to: '#' },
      { label: 'Terms', to: '#' },
      { label: 'Cookies', to: '#' },
    ],
  },
]

export function Footer() {
  return (
    <footer
      style={{
        background: palette.text,
        color: 'rgba(255,255,255,0.5)',
        padding: '60px 40px 40px',
        fontFamily: font.body,
        fontSize: 14,
      }}
    >
      <div
        className="footer-grid"
        style={{
          maxWidth: 1100,
          margin: '0 auto',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                background: palette.accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontFamily: font.display,
                fontSize: 15,
              }}
            >
              S
            </div>
            <span style={{ color: 'white', fontWeight: 600, fontSize: 16 }}>
              SettleGuide
            </span>
          </div>
          <p style={{ lineHeight: 1.7, maxWidth: 280, margin: 0 }}>
            The smart post-move task planner that helps you turn your new house
            into a home.
          </p>
        </div>
        {footerColumns.map((col) => (
          <div key={col.title}>
            <h4
              style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 16,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {col.title}
            </h4>
            {col.links.map(({ label, to }) => (
              <p
                key={label}
                style={{
                  margin: '0 0 10px',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) =>
                  (e.target.style.color = 'rgba(255,255,255,0.85)')
                }
                onMouseLeave={(e) =>
                  (e.target.style.color = 'rgba(255,255,255,0.5)')
                }
              >
                {to.startsWith('/') ? (
                  <Link to={to} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {label}
                  </Link>
                ) : (
                  <a href={to} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {label}
                  </a>
                )}
              </p>
            ))}
          </div>
        ))}
      </div>
      <div
        className="footer-bottom"
        style={{
          maxWidth: 1100,
          margin: '40px auto 0',
          paddingTop: 24,
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>© 2026 SettleGuide. All rights reserved.</span>
        <span>Designed with care for new homeowners.</span>
      </div>
    </footer>
  )
}
