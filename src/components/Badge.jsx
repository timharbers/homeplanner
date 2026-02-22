import { palette, font } from '../theme'

export function Badge({ children }) {
  return (
    <span
      style={{
        display: 'inline-block',
        background: palette.accentLight,
        color: palette.accent,
        fontSize: 12,
        fontWeight: 600,
        padding: '5px 14px',
        borderRadius: 50,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        marginBottom: 20,
      }}
    >
      {children}
    </span>
  )
}
