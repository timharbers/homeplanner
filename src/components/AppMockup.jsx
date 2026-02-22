import { palette, font } from '../theme'

const rooms = ['Living Room', 'Kitchen', 'Bedroom', 'Bathroom', 'Office']
const roomColors = ['#2D6A4F', '#E76F51', '#457B9D', '#F4A261', '#6C5B7B']

const tasks = [
  { name: 'Unpack boxes', status: 'done', priority: 5 },
  { name: 'Mount TV on wall', status: 'in progress', priority: 4 },
  { name: 'Assemble bookshelf', status: 'blocked', priority: 3 },
  { name: 'Hang curtains', status: 'not started', priority: 3 },
  { name: 'Set up WiFi router', status: 'not started', priority: 5 },
]

export function AppMockup() {
  return (
    <div
      className="app-mockup"
      style={{
        background: palette.surface,
        borderRadius: 16,
        boxShadow: palette.shadowLg,
        border: `1px solid ${palette.border}`,
        overflow: 'hidden',
        maxWidth: 800,
        margin: '0 auto',
      }}
    >
      <div
        style={{
          background: palette.surfaceAlt,
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          borderBottom: `1px solid ${palette.border}`,
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: '#FF5F57',
          }}
        />
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: '#FEBC2E',
          }}
        />
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: '#28C840',
          }}
        />
        <span
          style={{
            marginLeft: 12,
            fontSize: 12,
            color: palette.textLight,
            fontFamily: font.body,
          }}
        >
          settleguide.app — My New Home
        </span>
      </div>
      <div
        className="app-mockup-body"
        style={{
          display: 'grid',
          gridTemplateColumns: '180px 1fr 220px',
          minHeight: 340,
        }}
      >
        <div
          style={{
            borderRight: `1px solid ${palette.border}`,
            padding: 16,
          }}
        >
          <p
            style={{
              fontSize: 10,
              fontWeight: 600,
              textTransform: 'uppercase',
              color: palette.textLight,
              letterSpacing: '0.08em',
              margin: '0 0 12px',
            }}
          >
            Rooms
          </p>
          {rooms.map((r, i) => (
            <div
              key={r}
              style={{
                padding: '8px 10px',
                borderRadius: 6,
                fontSize: 13,
                cursor: 'pointer',
                background: i === 0 ? palette.accentLight : 'transparent',
                color: i === 0 ? palette.accent : palette.textMuted,
                fontWeight: i === 0 ? 600 : 400,
                marginBottom: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: roomColors[i],
                }}
              />
              {r}
            </div>
          ))}
        </div>
        <div style={{ padding: 20 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <h3
              style={{
                fontFamily: font.display,
                fontSize: 20,
                margin: 0,
                color: palette.text,
              }}
            >
              Living Room
            </h3>
            <span style={{ fontSize: 12, color: palette.textLight }}>
              4 of 12 done
            </span>
          </div>
          {tasks.map((t, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 8,
                marginBottom: 6,
                background: palette.surfaceAlt,
                opacity: t.status === 'done' ? 0.5 : 1,
                border: `1px solid ${palette.borderLight}`,
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  border:
                    t.status === 'done'
                      ? 'none'
                      : `2px solid ${
                          t.status === 'blocked' ? '#E76F51' : palette.border
                        }`,
                  background: t.status === 'done' ? palette.accent : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 10,
                }}
              >
                {t.status === 'done' && '✓'}
              </div>
              <span
                style={{
                  fontSize: 13,
                  flex: 1,
                  color: palette.text,
                  textDecoration: t.status === 'done' ? 'line-through' : 'none',
                }}
              >
                {t.name}
              </span>
              {t.status === 'blocked' && (
                <span
                  style={{
                    fontSize: 10,
                    background: '#FFF0EC',
                    color: '#E76F51',
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontWeight: 600,
                  }}
                >
                  Blocked
                </span>
              )}
              {t.status === 'in progress' && (
                <span
                  style={{
                    fontSize: 10,
                    background: '#EEF6FF',
                    color: '#457B9D',
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontWeight: 600,
                  }}
                >
                  In Progress
                </span>
              )}
              <span style={{ fontSize: 11, color: palette.textLight }}>
                P{t.priority}
              </span>
            </div>
          ))}
        </div>
        <div
          style={{
            borderLeft: `1px solid ${palette.border}`,
            padding: 16,
            background: palette.surfaceAlt,
          }}
        >
          <p
            style={{
              fontSize: 10,
              fontWeight: 600,
              textTransform: 'uppercase',
              color: palette.textLight,
              letterSpacing: '0.08em',
              margin: '0 0 12px',
            }}
          >
            Suggested Next
          </p>
          <div
            style={{
              background: palette.surface,
              borderRadius: 10,
              padding: 14,
              border: `1px solid ${palette.border}`,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: palette.accent,
                }}
              />
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: palette.text,
                }}
              >
                Set up WiFi router
              </span>
            </div>
            <p
              style={{
                fontSize: 11,
                color: palette.textMuted,
                margin: '0 0 10px',
                lineHeight: 1.5,
              }}
            >
              High priority, low effort — quick win that unlocks other tasks.
            </p>
            <div
              style={{
                background: palette.accentLight,
                color: palette.accent,
                fontSize: 11,
                padding: '6px 10px',
                borderRadius: 6,
                textAlign: 'center',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Start Task →
            </div>
          </div>
          <p
            style={{
              fontSize: 10,
              fontWeight: 600,
              textTransform: 'uppercase',
              color: palette.textLight,
              letterSpacing: '0.08em',
              margin: '0 0 10px',
            }}
          >
            Progress
          </p>
          <div
            style={{
              background: palette.surface,
              borderRadius: 10,
              padding: 14,
              border: `1px solid ${palette.border}`,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 12,
                marginBottom: 8,
              }}
            >
              <span style={{ color: palette.textMuted }}>Overall</span>
              <span style={{ color: palette.accent, fontWeight: 600 }}>33%</span>
            </div>
            <div
              style={{
                height: 6,
                borderRadius: 3,
                background: palette.borderLight,
              }}
            >
              <div
                style={{
                  width: '33%',
                  height: '100%',
                  borderRadius: 3,
                  background: palette.accent,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
