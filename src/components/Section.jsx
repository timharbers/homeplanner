import { palette, font } from '../theme'

export function Section({ children, bg, style: s = {} }) {
  return (
    <section
      style={{
        background: bg || palette.bg,
        padding: '100px 40px',
        fontFamily: font.body,
        ...s,
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>{children}</div>
    </section>
  )
}
