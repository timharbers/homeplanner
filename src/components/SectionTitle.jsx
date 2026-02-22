import { palette, font } from '../theme'
import { Badge } from './Badge'

export function SectionTitle({ badge, title, subtitle }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 64 }}>
      {badge && <Badge>{badge}</Badge>}
      <h2
        style={{
          fontFamily: font.display,
          fontSize: 42,
          fontWeight: 400,
          color: palette.text,
          margin: '0 0 16px',
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            fontSize: 18,
            color: palette.textMuted,
            maxWidth: 560,
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
