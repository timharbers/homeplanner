import { palette, font } from '../theme'
import { Section } from '../components/Section'
import { Badge } from '../components/Badge'

const values = [
  {
    title: 'Simplicity over features',
    desc: "Every feature earns its place. We'd rather do five things perfectly than fifty things poorly.",
  },
  {
    title: 'Intelligence without complexity',
    desc: 'AI should feel like a helpful housemate, not a confusing interface. Smart defaults, not settings.',
  },
  {
    title: 'Built for real life',
    desc: 'Moving is chaotic, unpredictable, and human. Our tool adapts to that reality instead of forcing rigid workflows.',
  },
]

const timeline = [
  { date: 'Jan 2026', event: 'Idea sparked after a chaotic apartment move' },
  { date: 'Mar 2026', event: 'First prototype built — task lists with room assignment' },
  { date: 'May 2026', event: 'Dependency engine and smart suggestions added' },
  { date: 'Jul 2026', event: 'Closed beta with 50 early users' },
  { date: 'Sep 2026', event: 'Public launch & waitlist opens', current: true },
]

export function AboutPage() {
  return (
    <main>
      <Section>
        <div
          style={{
            textAlign: 'center',
            maxWidth: 640,
            margin: '0 auto 64px',
          }}
        >
          <Badge>Our Story</Badge>
          <h1
            style={{
              fontFamily: font.display,
              fontSize: 48,
              fontWeight: 400,
              color: palette.text,
              margin: '0 0 18px',
              letterSpacing: '-0.02em',
            }}
          >
            Born from a messy move
          </h1>
          <p
            style={{
              fontSize: 18,
              color: palette.textMuted,
              lineHeight: 1.7,
            }}
          >
            SettleGuide started when our founder moved into a new apartment and
            realized that no tool existed for the specific chaos of post-move
            organization. Spreadsheets were too rigid, to-do apps too shallow,
            and project tools too complex.
          </p>
        </div>

        <div
          className="section-grid-2"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 64,
            marginBottom: 80,
            alignItems: 'center',
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: font.display,
                fontSize: 30,
                fontWeight: 400,
                color: palette.text,
                margin: '0 0 16px',
              }}
            >
              Our mission
            </h2>
            <p
              style={{
                fontSize: 16,
                color: palette.textMuted,
                lineHeight: 1.7,
                margin: '0 0 16px',
              }}
            >
              We believe the first weeks in a new home should be exciting, not
              stressful. Our mission is to build the most intuitive, intelligent
              tool for turning a new house into a home — one task at a time.
            </p>
            <p
              style={{
                fontSize: 16,
                color: palette.textMuted,
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              We're a small, focused team that cares deeply about design, user
              experience, and solving real problems. No bloat. No enterprise
              features nobody asked for. Just a tool that works beautifully for
              the job at hand.
            </p>
          </div>
          <div
            style={{
              background: palette.surfaceAlt,
              borderRadius: 16,
              height: 300,
              border: `1px solid ${palette.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: palette.textLight,
              fontSize: 14,
              fontStyle: 'italic',
            }}
          >
            Team photo placeholder
          </div>
        </div>

        <div style={{ marginBottom: 80 }}>
          <h2
            style={{
              fontFamily: font.display,
              fontSize: 30,
              fontWeight: 400,
              textAlign: 'center',
              marginBottom: 40,
              color: palette.text,
            }}
          >
            What we believe
          </h2>
          <div
            className="section-grid-3"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 24,
            }}
          >
            {values.map((v, i) => (
              <div
                key={i}
                style={{
                  background: palette.surfaceAlt,
                  borderRadius: 14,
                  padding: 28,
                  border: `1px solid ${palette.border}`,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: palette.accentLight,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: palette.accent,
                    fontFamily: font.display,
                    fontSize: 20,
                    marginBottom: 16,
                  }}
                >
                  {i + 1}
                </div>
                <h3
                  style={{
                    fontFamily: font.display,
                    fontSize: 20,
                    fontWeight: 400,
                    margin: '0 0 8px',
                    color: palette.text,
                  }}
                >
                  {v.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: palette.textMuted,
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: 560, margin: '0 auto 80px' }}>
          <h2
            style={{
              fontFamily: font.display,
              fontSize: 30,
              fontWeight: 400,
              textAlign: 'center',
              marginBottom: 40,
              color: palette.text,
            }}
          >
            Our journey
          </h2>
          {timeline.map((t, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 20,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: t.current ? palette.accent : palette.border,
                    border: t.current
                      ? `3px solid ${palette.accentLight}`
                      : 'none',
                    flexShrink: 0,
                  }}
                />
                {i < timeline.length - 1 && (
                  <div
                    style={{
                      width: 2,
                      flex: 1,
                      background: palette.border,
                      marginTop: 4,
                    }}
                  />
                )}
              </div>
              <div style={{ paddingBottom: 8 }}>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: t.current ? palette.accent : palette.textLight,
                    margin: '0 0 4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  {t.date}
                </p>
                <p
                  style={{
                    fontSize: 15,
                    color: palette.text,
                    margin: 0,
                  }}
                >
                  {t.event}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: palette.surfaceAlt,
            borderRadius: 20,
            padding: 48,
            border: `1px solid ${palette.border}`,
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontFamily: font.display,
              fontSize: 28,
              fontWeight: 400,
              margin: '0 0 12px',
              color: palette.text,
            }}
          >
            Get in touch
          </h2>
          <p
            style={{
              fontSize: 16,
              color: palette.textMuted,
              margin: '0 0 28px',
            }}
          >
            Have questions, feedback, or partnership ideas? We'd love to hear
            from you.
          </p>
          <div
            style={{
              display: 'flex',
              gap: 16,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <a
              href="mailto:hello@settleguide.app"
              style={{
                background: palette.accent,
                color: 'white',
                border: 'none',
                padding: '13px 28px',
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: font.body,
                textDecoration: 'none',
              }}
            >
              Email Us
            </a>
            <a
              href="#"
              style={{
                background: 'transparent',
                color: palette.text,
                border: `1.5px solid ${palette.border}`,
                padding: '13px 28px',
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: font.body,
                textDecoration: 'none',
              }}
            >
              Twitter / X
            </a>
          </div>
        </div>
      </Section>
    </main>
  )
}
