import { palette, font } from '../theme'
import { Section } from '../components/Section'
import { Badge } from '../components/Badge'
import { IconCheck, IconGift, IconInfo } from '../components/Icons'

const planFeatures = [
  'Task creation with rooms, priority & difficulty',
  'Dependency tracking',
  'Smart suggestion engine',
  'Multiple task views',
  'Household collaboration',
  'Full status workflow',
]

const faqs = [
  {
    q: 'Will it really stay free?',
    a: "Right now, yes — 100% free. If we introduce paid plans in the future, we'll communicate clearly and reward early adopters.",
  },
  {
    q: 'Are there any limits?',
    a: "Some usage limits may apply to keep the service running smoothly for everyone. We'll be transparent about any limits as they're defined.",
  },
  {
    q: "What happens after I'm settled?",
    a: 'Keep using SettleGuide for home maintenance, seasonal tasks, or your next renovation project. It\'s not just for moving day.',
  },
  {
    q: 'Can I use it for a renovation, not just moving?',
    a: 'Absolutely. The dependency and room system works perfectly for renovations, remodeling, or any home project.',
  },
]

export function PricingPage() {
  return (
    <main>
      <Section>
        <div
          style={{
            textAlign: 'center',
            maxWidth: 600,
            margin: '0 auto 56px',
          }}
        >
          <Badge>Pricing</Badge>
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
            Free to use. Seriously.
          </h1>
          <p
            style={{
              fontSize: 18,
              color: palette.textMuted,
              lineHeight: 1.65,
            }}
          >
            SettleGuide just launched and we want everyone to try it. Use the
            full app for free — no credit card, no catch.
          </p>
        </div>

        <div style={{ maxWidth: 480, margin: '0 auto 64px' }}>
          <div
            style={{
              background: palette.surface,
              borderRadius: 20,
              padding: 44,
              border: `1px solid ${palette.border}`,
              boxShadow: palette.shadowLg,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 56,
                height: 56,
                borderRadius: 16,
                background: palette.accentLight,
                color: palette.accent,
                marginBottom: 20,
              }}
            >
              <IconGift />
            </div>
            <h3
              style={{
                fontFamily: font.display,
                fontSize: 28,
                fontWeight: 400,
                margin: '0 0 6px',
                color: palette.text,
              }}
            >
              Launch Plan
            </h3>
            <p
              style={{
                fontSize: 15,
                color: palette.textMuted,
                margin: '0 0 28px',
              }}
            >
              Everything included, on us
            </p>
            <div style={{ marginBottom: 28 }}>
              <span
                style={{
                  fontFamily: font.display,
                  fontSize: 56,
                  color: palette.text,
                }}
              >
                Free
              </span>
            </div>
            <a
              href="#"
              style={{
                display: 'block',
                width: '100%',
                padding: '15px 0',
                borderRadius: 10,
                border: 'none',
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: font.body,
                background: palette.accent,
                color: 'white',
                marginBottom: 32,
                boxShadow: '0 2px 8px rgba(45,106,79,0.25)',
                textDecoration: 'none',
                textAlign: 'center',
              }}
            >
              Get Started — It's Free
            </a>
            <div style={{ textAlign: 'left' }}>
              {planFeatures.map((f, j) => (
                <div
                  key={j}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 0',
                    fontSize: 15,
                    color: palette.text,
                    borderBottom:
                      j < planFeatures.length - 1
                        ? `1px solid ${palette.borderLight}`
                        : 'none',
                  }}
                >
                  <span style={{ color: palette.accent, flexShrink: 0 }}>
                    <IconCheck />
                  </span>
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            maxWidth: 640,
            margin: '0 auto 80px',
            background: palette.surfaceAlt,
            borderRadius: 16,
            padding: '36px 40px',
            border: `1px solid ${palette.border}`,
            display: 'flex',
            gap: 20,
            alignItems: 'flex-start',
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
              flexShrink: 0,
              marginTop: 2,
            }}
          >
            <IconInfo />
          </div>
          <div>
            <h4
              style={{
                fontSize: 16,
                fontWeight: 600,
                margin: '0 0 6px',
                color: palette.text,
              }}
            >
              What about the future?
            </h4>
            <p
              style={{
                fontSize: 15,
                color: palette.textMuted,
                margin: 0,
                lineHeight: 1.65,
              }}
            >
              As SettleGuide grows, we may introduce paid tiers with advanced
              features and higher limits. But early users will always be
              rewarded — and we'll give you plenty of notice before anything
              changes. For now, enjoy the full experience on us.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 640, margin: '0 auto 0' }}>
          <h3
            style={{
              fontFamily: font.display,
              fontSize: 28,
              fontWeight: 400,
              textAlign: 'center',
              marginBottom: 32,
              color: palette.text,
            }}
          >
            Frequently asked questions
          </h3>
          {faqs.map((f, i) => (
            <div
              key={i}
              style={{
                padding: '20px 0',
                borderBottom:
                  i < faqs.length - 1 ? `1px solid ${palette.border}` : 'none',
              }}
            >
              <h4
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  margin: '0 0 6px',
                  color: palette.text,
                }}
              >
                {f.q}
              </h4>
              <p
                style={{
                  fontSize: 15,
                  color: palette.textMuted,
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </Section>
    </main>
  )
}
