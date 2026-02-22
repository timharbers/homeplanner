import { palette, font } from '../theme'
import { Section } from '../components/Section'
import { Badge } from '../components/Badge'
import {
  IconRooms,
  IconDependency,
  IconAi,
  IconPeople,
  IconViews,
  IconTasks,
  IconCheck,
} from '../components/Icons'

const features = [
  {
    icon: <IconRooms />,
    title: 'Room-Based Organization',
    desc: "Organize every task by room — living room, kitchen, bedroom, and beyond. Color-coded rooms give you instant visual clarity on what's happening where. Switch between rooms in a tap to focus your energy.",
    details: [
      'Pre-built room templates',
      'Custom rooms and color coding',
      'Room progress indicators',
      'Multi-room task support',
    ],
  },
  {
    icon: <IconDependency />,
    title: 'Dependency Tracking',
    desc: "Real life has order: you can't mount the TV before buying a wall bracket. Define dependencies between tasks and the app automatically marks blocked items, unlocking them as prerequisites are completed.",
    details: [
      'Visual dependency graph',
      'Auto-blocking of dependent tasks',
      'Cascade completion',
      'Circular dependency detection',
    ],
  },
  {
    icon: <IconAi />,
    title: 'Smart Suggestion Engine',
    desc: 'The core intelligence of the app. Our algorithm considers priority, difficulty, dependency status, room preference, and assignee to surface the single best task to tackle next. Quick wins or high-impact — your call.',
    details: [
      'Weighted scoring algorithm',
      '"Quick wins" and "Big wins" filters',
      'Time-based suggestions',
      'Personalized per household member',
    ],
  },
  {
    icon: <IconPeople />,
    title: 'Household Collaboration',
    desc: 'Moving is a team sport. Add your partner, family members, or roommates. Assign tasks, see who\'s doing what, and keep everyone aligned without the nagging.',
    details: [
      'Shared household workspace',
      'Per-person task views',
      'Assignment notifications',
      'Skill-based auto-assignment (AI)',
    ],
  },
  {
    icon: <IconViews />,
    title: 'Flexible Task Views',
    desc: 'Everyone thinks differently. View your tasks by room, person, priority, difficulty, or status. Find quick wins with a single filter. Plan big projects in the overview.',
    details: [
      'Grid, list, and board layouts',
      'Advanced filter chips',
      'Quick win / big win views',
      'Blocked tasks overview',
    ],
  },
  {
    icon: <IconTasks />,
    title: 'Task Status Workflow',
    desc: 'Life isn\'t binary. Tasks can be not started, in progress, paused, or done. Track partial progress — because "half-built wardrobe missing one screw" is a real status.',
    details: [
      'Four-stage workflow',
      'Pause with reason',
      'Time tracking (optional)',
      'Completion history',
    ],
  },
]

const aiFeatures = [
  {
    title: 'Auto-categorize',
    desc: 'Type a task in plain language. AI assigns room, difficulty, and priority.',
  },
  {
    title: 'Break it down',
    desc: 'Enter "Renovate kitchen" and get a full subtask plan instantly.',
  },
  {
    title: 'Time estimates',
    desc: '"What can I finish in 30 minutes?" — answered intelligently.',
  },
  {
    title: 'Explain why',
    desc: 'Understand the reasoning behind every suggestion the engine makes.',
  },
]

export function FeaturesPage() {
  return (
    <main>
      <Section>
        <div
          style={{
            textAlign: 'center',
            maxWidth: 680,
            margin: '0 auto 80px',
          }}
        >
          <Badge>Features</Badge>
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
            Built for the way
            <br />
            moving actually works
          </h1>
          <p
            style={{
              fontSize: 18,
              color: palette.textMuted,
              lineHeight: 1.65,
            }}
          >
            Every feature is designed around the specific challenges of setting
            up a new home — not generic project management.
          </p>
        </div>

        {features.map((f, i) => (
          <div
            key={i}
            className="feature-row"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              direction: i % 2 === 0 ? 'ltr' : 'rtl',
              gap: 64,
              alignItems: 'center',
              marginBottom: i < features.length - 1 ? 80 : 0,
              paddingBottom: i < features.length - 1 ? 80 : 0,
              borderBottom:
                i < features.length - 1
                  ? `1px solid ${palette.border}`
                  : 'none',
            }}
          >
            <div style={{ direction: 'ltr' }}>
              <div style={{ color: palette.accent, marginBottom: 16 }}>
                {f.icon}
              </div>
              <h2
                style={{
                  fontFamily: font.display,
                  fontSize: 30,
                  fontWeight: 400,
                  color: palette.text,
                  margin: '0 0 14px',
                }}
              >
                {f.title}
              </h2>
              <p
                style={{
                  fontSize: 16,
                  color: palette.textMuted,
                  lineHeight: 1.7,
                  margin: '0 0 24px',
                }}
              >
                {f.desc}
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 8,
                }}
              >
                {f.details.map((d, j) => (
                  <div
                    key={j}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 14,
                      color: palette.text,
                    }}
                  >
                    <span style={{ color: palette.accent }}>
                      <IconCheck />
                    </span>
                    {d}
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                direction: 'ltr',
                background: palette.surfaceAlt,
                borderRadius: 16,
                height: 280,
                border: `1px solid ${palette.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: palette.textLight,
                fontSize: 14,
                fontStyle: 'italic',
              }}
            >
              Feature illustration / screenshot placeholder
            </div>
          </div>
        ))}
      </Section>

      <Section bg={palette.text} style={{ color: 'white' }}>
        <div
          style={{
            textAlign: 'center',
            maxWidth: 640,
            margin: '0 auto',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              background: 'rgba(216,243,220,0.15)',
              color: palette.accentLight,
              fontSize: 12,
              fontWeight: 600,
              padding: '5px 14px',
              borderRadius: 50,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: 20,
            }}
          >
            AI-Powered
          </span>
          <h2
            style={{
              fontFamily: font.display,
              fontSize: 40,
              fontWeight: 400,
              margin: '0 0 18px',
            }}
          >
            Intelligence that learns your home
          </h2>
          <p
            style={{
              fontSize: 17,
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.7,
            }}
          >
            Beyond the core suggestion engine, AI capabilities help you work
            smarter — auto-categorizing tasks, breaking big projects into
            subtasks, and explaining why each recommendation matters.
          </p>
        </div>
        <div
          className="ai-cards"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            gap: 20,
            marginTop: 56,
          }}
        >
          {aiFeatures.map((a, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(255,255,255,0.06)',
                borderRadius: 14,
                padding: 24,
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <h4
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  margin: '0 0 8px',
                }}
              >
                {a.title}
              </h4>
              <p
                style={{
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.55)',
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {a.desc}
              </p>
            </div>
          ))}
        </div>
      </Section>
    </main>
  )
}
