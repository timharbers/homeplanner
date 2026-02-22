import { Link } from 'react-router-dom'
import { palette, font } from '../theme'
import { Section } from '../components/Section'
import { Badge } from '../components/Badge'
import { SectionTitle } from '../components/SectionTitle'
import { AppMockup } from '../components/AppMockup'
import {
  IconRooms,
  IconDependency,
  IconAi,
  IconPeople,
  IconViews,
  IconTasks,
  IconArrow,
  IconQuote,
} from '../components/Icons'

export function HomePage() {
  const problemStats = [
    { n: '68%', desc: 'of movers feel overwhelmed the first month' },
    { n: '3.5×', desc: 'more tasks than people expect after moving' },
    { n: '12hrs', desc: 'average time wasted on disorganized setup' },
    { n: '42%', desc: 'of household conflicts stem from move‑in chaos' },
  ]

  const steps = [
    {
      step: '01',
      title: 'Add your tasks',
      desc: 'List what needs doing — from hanging shelves to setting up internet. Assign rooms, priority, and effort.',
      color: '#2D6A4F',
    },
    {
      step: '02',
      title: 'Map dependencies',
      desc: 'Tell the app what depends on what. It automatically blocks tasks that aren\'t ready yet.',
      color: '#457B9D',
    },
    {
      step: '03',
      title: 'Follow smart suggestions',
      desc: 'The engine analyzes everything and tells you the best next move. Quick wins, big impact — your choice.',
      color: '#E76F51',
    },
  ]

  const features = [
    {
      icon: <IconRooms />,
      title: 'Room-based organization',
      desc: 'See all tasks for each room at a glance. Color-coded for instant orientation.',
    },
    {
      icon: <IconDependency />,
      title: 'Dependency tracking',
      desc: 'The app knows that painting comes before mounting the TV. Tasks unlock automatically.',
    },
    {
      icon: <IconAi />,
      title: 'Smart suggestions',
      desc: '"What should I do next?" answered by an algorithm that weighs priority, effort, and readiness.',
    },
    {
      icon: <IconPeople />,
      title: 'Household collaboration',
      desc: 'Assign tasks to family members or roommates. Everyone knows their next move.',
    },
    {
      icon: <IconViews />,
      title: 'Flexible views',
      desc: 'See tasks by room, person, priority, or status. Find quick wins or plan big projects.',
    },
    {
      icon: <IconTasks />,
      title: 'Status workflow',
      desc: 'Not started, in progress, paused, done. Track partial progress on complex tasks.',
    },
  ]

  return (
    <main>
      <Section style={{ paddingTop: 80, paddingBottom: 40 }}>
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
          <Badge>Free — Just Launched</Badge>
          <h1
            style={{
              fontFamily: font.display,
              fontSize: 56,
              fontWeight: 400,
              lineHeight: 1.1,
              color: palette.text,
              margin: '0 0 20px',
              letterSpacing: '-0.03em',
            }}
          >
            Turn moving chaos
            <br />
            into a clear plan
          </h1>
          <p
            style={{
              fontSize: 19,
              color: palette.textMuted,
              lineHeight: 1.65,
              maxWidth: 520,
              margin: '0 auto 36px',
            }}
          >
            The smart task planner that organizes your post-move to‑dos by room,
            priority, and dependencies — so you always know what to tackle next.
          </p>
          <div
            style={{
              display: 'flex',
              gap: 14,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <a
              href="#"
              style={{
                background: palette.accent,
                color: 'white',
                border: 'none',
                padding: '14px 32px',
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: font.body,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(45,106,79,0.25)',
                textDecoration: 'none',
              }}
            >
              Get Started — Free <IconArrow />
            </a>
            <a
              href="#"
              style={{
                background: 'transparent',
                color: palette.text,
                border: `1.5px solid ${palette.border}`,
                padding: '14px 28px',
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: font.body,
                transition: 'all 0.2s',
                textDecoration: 'none',
              }}
            >
              See How It Works
            </a>
          </div>
        </div>
      </Section>

      <Section style={{ paddingTop: 0, paddingBottom: 100 }}>
        <AppMockup />
      </Section>

      <Section bg={palette.surfaceAlt}>
        <div
          className="section-grid-2"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 80,
            alignItems: 'center',
          }}
        >
          <div>
            <Badge>The Problem</Badge>
            <h2
              style={{
                fontFamily: font.display,
                fontSize: 36,
                fontWeight: 400,
                color: palette.text,
                margin: '0 0 20px',
                lineHeight: 1.2,
              }}
            >
              You just moved.
              <br />
              Now what?
            </h2>
            <p
              style={{
                fontSize: 16,
                color: palette.textMuted,
                lineHeight: 1.7,
                margin: '0 0 24px',
              }}
            >
              Generic to‑do apps can't handle the complexity of setting up a
              home. Tasks depend on each other, some need tools you don't have
              yet, and everything feels urgent at once.
            </p>
            <p
              style={{
                fontSize: 16,
                color: palette.textMuted,
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              Project management tools are overkill. You need something
              purpose-built — something that understands rooms, priorities, and
              the natural order of getting settled.
            </p>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
            }}
          >
            {problemStats.map((s, i) => (
              <div
                key={i}
                style={{
                  background: palette.surface,
                  borderRadius: 12,
                  padding: 24,
                  border: `1px solid ${palette.border}`,
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontFamily: font.display,
                    fontSize: 32,
                    color: palette.accent,
                    marginBottom: 6,
                  }}
                >
                  {s.n}
                </div>
                <p
                  style={{
                    fontSize: 13,
                    color: palette.textMuted,
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <SectionTitle
          badge="How It Works"
          title="Three steps to a settled home"
          subtitle="No complex setup. No learning curve. Just add your tasks and let the smart engine guide you."
        />
        <div
          className="section-grid-3"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 32,
          }}
        >
          {steps.map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: `${s.color}12`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontFamily: font.display,
                  fontSize: 22,
                  color: s.color,
                }}
              >
                {s.step}
              </div>
              <h3
                style={{
                  fontFamily: font.display,
                  fontSize: 22,
                  fontWeight: 400,
                  margin: '0 0 10px',
                  color: palette.text,
                }}
              >
                {s.title}
              </h3>
              <p
                style={{
                  fontSize: 15,
                  color: palette.textMuted,
                  lineHeight: 1.65,
                  margin: 0,
                  maxWidth: 280,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              >
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section bg={palette.surfaceAlt}>
        <SectionTitle
          badge="Features"
          title="Everything you need, nothing you don't"
          subtitle="Purpose-built for the unique chaos of moving into a new home."
        />
        <div
          className="section-grid-3"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 20,
          }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              className="feature-card"
              style={{
                background: palette.surface,
                borderRadius: 14,
                padding: 28,
                border: `1px solid ${palette.border}`,
                transition: 'box-shadow 0.2s, transform 0.2s',
                cursor: 'default',
              }}
            >
              <div style={{ color: palette.accent, marginBottom: 16 }}>
                {f.icon}
              </div>
              <h3
                style={{
                  fontFamily: font.display,
                  fontSize: 19,
                  fontWeight: 400,
                  margin: '0 0 8px',
                  color: palette.text,
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: palette.textMuted,
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Link
            to="/features"
            style={{
              fontSize: 15,
              color: palette.accent,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              textDecoration: 'none',
            }}
          >
            Explore all features <IconArrow />
          </Link>
        </div>
      </Section>

      <Section>
        <div
          style={{
            maxWidth: 640,
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <IconQuote />
          <p
            style={{
              fontFamily: font.display,
              fontSize: 26,
              lineHeight: 1.5,
              color: palette.text,
              margin: '16px 0 24px',
              fontWeight: 400,
              fontStyle: 'italic',
            }}
          >
            "We moved into our first house and felt completely overwhelmed.
            SettleGuide broke everything down into manageable steps. Within two
            weeks, it felt like home."
          </p>
          <div>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: palette.accentLight,
                margin: '0 auto 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: palette.accent,
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              S
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color: palette.text, margin: '0 0 2px' }}>
              Sarah & Tom
            </p>
            <p style={{ fontSize: 13, color: palette.textLight, margin: 0 }}>
              First-time homeowners, Amsterdam
            </p>
          </div>
        </div>
      </Section>

      <Section bg={palette.accent} style={{ textAlign: 'center' }}>
        <h2
          style={{
            fontFamily: font.display,
            fontSize: 40,
            fontWeight: 400,
            color: 'white',
            margin: '0 0 16px',
          }}
        >
          Ready to get settled?
        </h2>
        <p
          style={{
            fontSize: 17,
            color: 'rgba(255,255,255,0.75)',
            maxWidth: 440,
            margin: '0 auto 32px',
            lineHeight: 1.6,
          }}
        >
          SettleGuide is completely free right now. Start organizing your new
          home today.
        </p>
        <a
          href="#"
          style={{
            background: 'white',
            color: palette.accent,
            border: 'none',
            padding: '16px 36px',
            borderRadius: 10,
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: font.body,
            textDecoration: 'none',
          }}
        >
          Get Started — It's Free
        </a>
      </Section>
    </main>
  )
}
