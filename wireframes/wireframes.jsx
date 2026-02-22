import { useState } from "react";

// --- Design System ---
const palette = {
  bg: "#FAFAF9",
  surface: "#FFFFFF",
  surfaceAlt: "#F5F4F0",
  text: "#1A1A1A",
  textMuted: "#6B6B6B",
  textLight: "#9A9A9A",
  accent: "#2D6A4F",
  accentLight: "#D8F3DC",
  accentHover: "#1B4332",
  border: "#E8E6E1",
  borderLight: "#F0EEED",
  shadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
  shadowLg: "0 4px 6px rgba(0,0,0,0.04), 0 12px 40px rgba(0,0,0,0.06)",
};

const font = {
  display: "'DM Serif Display', Georgia, serif",
  body: "'DM Sans', -apple-system, sans-serif",
};

// --- Icons (inline SVG) ---
const icons = {
  tasks: (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  rooms: (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  ai: (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  people: (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  dependency: (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  views: (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  arrow: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  check: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  quote: (
    <svg width="32" height="32" fill="currentColor" opacity="0.1" viewBox="0 0 24 24">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z"/>
    </svg>
  ),
};

// --- Shared Components ---
function Nav({ page, setPage }) {
  const links = ["Home", "Features", "Pricing", "About"];
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(250,250,249,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      borderBottom: `1px solid ${palette.borderLight}`,
      padding: "0 40px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between",
      fontFamily: font.body,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => setPage("Home")}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: palette.accent, display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontFamily: font.display, fontSize: 18, fontWeight: 700,
        }}>S</div>
        <span style={{ fontSize: 18, fontWeight: 600, color: palette.text, letterSpacing: "-0.02em" }}>SettleGuide</span>
      </div>
      <div style={{ display: "flex", gap: 36, alignItems: "center", marginLeft: "auto" }}>
        {links.map(l => (
          <span key={l} onClick={() => setPage(l)} style={{
            fontSize: 14, fontWeight: page === l ? 600 : 400,
            color: page === l ? palette.text : palette.textMuted,
            cursor: "pointer", letterSpacing: "0.01em",
            borderBottom: page === l ? `2px solid ${palette.accent}` : "2px solid transparent",
            paddingBottom: 2, transition: "all 0.2s",
          }}>{l}</span>
        ))}
        <button style={{
          background: palette.accent, color: "white", border: "none",
          padding: "9px 22px", borderRadius: 8, fontSize: 14, fontWeight: 600,
          cursor: "pointer", letterSpacing: "0.01em", transition: "background 0.2s",
          fontFamily: font.body,
        }}
          onMouseEnter={e => e.target.style.background = palette.accentHover}
          onMouseLeave={e => e.target.style.background = palette.accent}
        >Get Started — Free</button>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer style={{
      background: palette.text, color: "rgba(255,255,255,0.5)",
      padding: "60px 40px 40px", fontFamily: font.body, fontSize: 14,
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 60 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: palette.accent, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: font.display, fontSize: 15 }}>S</div>
            <span style={{ color: "white", fontWeight: 600, fontSize: 16 }}>SettleGuide</span>
          </div>
          <p style={{ lineHeight: 1.7, maxWidth: 280, margin: 0 }}>The smart post-move task planner that helps you turn your new house into a home.</p>
        </div>
        {[
          { title: "Product", links: ["Features", "Pricing", "Roadmap", "Changelog"] },
          { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
          { title: "Legal", links: ["Privacy", "Terms", "Cookies"] },
        ].map(col => (
          <div key={col.title}>
            <h4 style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 600, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>{col.title}</h4>
            {col.links.map(l => <p key={l} style={{ margin: "0 0 10px", cursor: "pointer", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.85)"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.5)"}
            >{l}</p>)}
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 1100, margin: "40px auto 0", paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between" }}>
        <span>© 2026 SettleGuide. All rights reserved.</span>
        <span>Designed with care for new homeowners.</span>
      </div>
    </footer>
  );
}

function Section({ children, bg, style: s }) {
  return (
    <section style={{ background: bg || palette.bg, padding: "100px 40px", fontFamily: font.body, ...s }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

function Badge({ children }) {
  return (
    <span style={{
      display: "inline-block", background: palette.accentLight, color: palette.accent,
      fontSize: 12, fontWeight: 600, padding: "5px 14px", borderRadius: 50,
      letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 20,
    }}>{children}</span>
  );
}

function SectionTitle({ badge, title, subtitle }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 64 }}>
      {badge && <Badge>{badge}</Badge>}
      <h2 style={{ fontFamily: font.display, fontSize: 42, fontWeight: 400, color: palette.text, margin: "0 0 16px", lineHeight: 1.15, letterSpacing: "-0.02em" }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 18, color: palette.textMuted, maxWidth: 560, margin: "0 auto", lineHeight: 1.6 }}>{subtitle}</p>}
    </div>
  );
}

// --- Wireframe Mockup Component ---
function AppMockup() {
  return (
    <div style={{
      background: palette.surface, borderRadius: 16, boxShadow: palette.shadowLg,
      border: `1px solid ${palette.border}`, overflow: "hidden", maxWidth: 800, margin: "0 auto",
    }}>
      {/* Title bar */}
      <div style={{ background: palette.surfaceAlt, padding: "12px 20px", display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${palette.border}` }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FEBC2E" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28C840" }} />
        <span style={{ marginLeft: 12, fontSize: 12, color: palette.textLight, fontFamily: font.body }}>settleguide.app — My New Home</span>
      </div>
      {/* App body */}
      <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 220px", minHeight: 340 }}>
        {/* Sidebar */}
        <div style={{ borderRight: `1px solid ${palette.border}`, padding: 16 }}>
          <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", color: palette.textLight, letterSpacing: "0.08em", margin: "0 0 12px" }}>Rooms</p>
          {["Living Room", "Kitchen", "Bedroom", "Bathroom", "Office"].map((r, i) => (
            <div key={r} style={{
              padding: "8px 10px", borderRadius: 6, fontSize: 13, cursor: "pointer",
              background: i === 0 ? palette.accentLight : "transparent",
              color: i === 0 ? palette.accent : palette.textMuted, fontWeight: i === 0 ? 600 : 400,
              marginBottom: 2, display: "flex", alignItems: "center", gap: 8,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: ["#2D6A4F", "#E76F51", "#457B9D", "#F4A261", "#6C5B7B"][i] }} />
              {r}
            </div>
          ))}
        </div>
        {/* Main content */}
        <div style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontFamily: font.display, fontSize: 20, margin: 0, color: palette.text }}>Living Room</h3>
            <span style={{ fontSize: 12, color: palette.textLight }}>4 of 12 done</span>
          </div>
          {[
            { name: "Unpack boxes", status: "done", priority: 5, diff: 2 },
            { name: "Mount TV on wall", status: "in progress", priority: 4, diff: 4 },
            { name: "Assemble bookshelf", status: "blocked", priority: 3, diff: 3 },
            { name: "Hang curtains", status: "not started", priority: 3, diff: 2 },
            { name: "Set up WiFi router", status: "not started", priority: 5, diff: 1 },
          ].map((t, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
              borderRadius: 8, marginBottom: 6, background: palette.surfaceAlt,
              opacity: t.status === "done" ? 0.5 : 1,
              border: `1px solid ${palette.borderLight}`,
            }}>
              <div style={{
                width: 16, height: 16, borderRadius: 4,
                border: t.status === "done" ? "none" : `2px solid ${t.status === "blocked" ? "#E76F51" : palette.border}`,
                background: t.status === "done" ? palette.accent : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontSize: 10,
              }}>{t.status === "done" && "✓"}</div>
              <span style={{ fontSize: 13, flex: 1, color: palette.text, textDecoration: t.status === "done" ? "line-through" : "none" }}>{t.name}</span>
              {t.status === "blocked" && <span style={{ fontSize: 10, background: "#FFF0EC", color: "#E76F51", padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>Blocked</span>}
              {t.status === "in progress" && <span style={{ fontSize: 10, background: "#EEF6FF", color: "#457B9D", padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>In Progress</span>}
              <span style={{ fontSize: 11, color: palette.textLight }}>P{t.priority}</span>
            </div>
          ))}
        </div>
        {/* Right sidebar */}
        <div style={{ borderLeft: `1px solid ${palette.border}`, padding: 16, background: palette.surfaceAlt }}>
          <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", color: palette.textLight, letterSpacing: "0.08em", margin: "0 0 12px" }}>Suggested Next</p>
          <div style={{ background: palette.surface, borderRadius: 10, padding: 14, border: `1px solid ${palette.border}`, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: palette.accent }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: palette.text }}>Set up WiFi router</span>
            </div>
            <p style={{ fontSize: 11, color: palette.textMuted, margin: "0 0 10px", lineHeight: 1.5 }}>High priority, low effort — quick win that unlocks other tasks.</p>
            <div style={{ background: palette.accentLight, color: palette.accent, fontSize: 11, padding: "6px 10px", borderRadius: 6, textAlign: "center", fontWeight: 600, cursor: "pointer" }}>Start Task →</div>
          </div>
          <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", color: palette.textLight, letterSpacing: "0.08em", margin: "0 0 10px" }}>Progress</p>
          <div style={{ background: palette.surface, borderRadius: 10, padding: 14, border: `1px solid ${palette.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 8 }}>
              <span style={{ color: palette.textMuted }}>Overall</span>
              <span style={{ color: palette.accent, fontWeight: 600 }}>33%</span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: palette.borderLight }}>
              <div style={{ width: "33%", height: "100%", borderRadius: 3, background: palette.accent }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// PAGE: HOME / LANDING
// ============================================
function HomePage({ setPage }) {
  return (
    <div>
      {/* Hero */}
      <Section style={{ paddingTop: 80, paddingBottom: 40 }}>
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
          <Badge>Free — Just Launched</Badge>
          <h1 style={{
            fontFamily: font.display, fontSize: 56, fontWeight: 400, lineHeight: 1.1,
            color: palette.text, margin: "0 0 20px", letterSpacing: "-0.03em",
          }}>
            Turn moving chaos<br />into a clear plan
          </h1>
          <p style={{ fontSize: 19, color: palette.textMuted, lineHeight: 1.65, maxWidth: 520, margin: "0 auto 36px" }}>
            The smart task planner that organizes your post-move to‑dos by room, priority, and dependencies — so you always know what to tackle next.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
            <button style={{
              background: palette.accent, color: "white", border: "none",
              padding: "14px 32px", borderRadius: 10, fontSize: 16, fontWeight: 600,
              cursor: "pointer", fontFamily: font.body, display: "flex", alignItems: "center", gap: 8,
              transition: "all 0.2s", boxShadow: "0 2px 8px rgba(45,106,79,0.25)",
            }}
              onMouseEnter={e => e.target.style.background = palette.accentHover}
              onMouseLeave={e => e.target.style.background = palette.accent}
            >Get Started — Free {icons.arrow}</button>
            <button style={{
              background: "transparent", color: palette.text, border: `1.5px solid ${palette.border}`,
              padding: "14px 28px", borderRadius: 10, fontSize: 16, fontWeight: 500,
              cursor: "pointer", fontFamily: font.body, transition: "all 0.2s",
            }}>See How It Works</button>
          </div>
        </div>
      </Section>

      {/* App Preview */}
      <Section style={{ paddingTop: 0, paddingBottom: 100 }}>
        <AppMockup />
      </Section>

      {/* Problem / Value Prop */}
      <Section bg={palette.surfaceAlt}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <Badge>The Problem</Badge>
            <h2 style={{ fontFamily: font.display, fontSize: 36, fontWeight: 400, color: palette.text, margin: "0 0 20px", lineHeight: 1.2 }}>
              You just moved.<br />Now what?
            </h2>
            <p style={{ fontSize: 16, color: palette.textMuted, lineHeight: 1.7, margin: "0 0 24px" }}>
              Generic to‑do apps can't handle the complexity of setting up a home. Tasks depend on each other, some need tools you don't have yet, and everything feels urgent at once.
            </p>
            <p style={{ fontSize: 16, color: palette.textMuted, lineHeight: 1.7, margin: 0 }}>
              Project management tools are overkill. You need something purpose-built — something that understands rooms, priorities, and the natural order of getting settled.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { n: "68%", desc: "of movers feel overwhelmed the first month" },
              { n: "3.5×", desc: "more tasks than people expect after moving" },
              { n: "12hrs", desc: "average time wasted on disorganized setup" },
              { n: "42%", desc: "of household conflicts stem from move‑in chaos" },
            ].map((s, i) => (
              <div key={i} style={{
                background: palette.surface, borderRadius: 12, padding: 24,
                border: `1px solid ${palette.border}`, textAlign: "center",
              }}>
                <div style={{ fontFamily: font.display, fontSize: 32, color: palette.accent, marginBottom: 6 }}>{s.n}</div>
                <p style={{ fontSize: 13, color: palette.textMuted, margin: 0, lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* How It Works */}
      <Section>
        <SectionTitle badge="How It Works" title="Three steps to a settled home" subtitle="No complex setup. No learning curve. Just add your tasks and let the smart engine guide you." />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32 }}>
          {[
            { step: "01", title: "Add your tasks", desc: "List what needs doing — from hanging shelves to setting up internet. Assign rooms, priority, and effort.", color: "#2D6A4F" },
            { step: "02", title: "Map dependencies", desc: "Tell the app what depends on what. It automatically blocks tasks that aren't ready yet.", color: "#457B9D" },
            { step: "03", title: "Follow smart suggestions", desc: "The engine analyzes everything and tells you the best next move. Quick wins, big impact — your choice.", color: "#E76F51" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16, background: `${s.color}12`,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px", fontFamily: font.display, fontSize: 22, color: s.color,
              }}>{s.step}</div>
              <h3 style={{ fontFamily: font.display, fontSize: 22, fontWeight: 400, margin: "0 0 10px", color: palette.text }}>{s.title}</h3>
              <p style={{ fontSize: 15, color: palette.textMuted, lineHeight: 1.65, margin: 0, maxWidth: 280, marginLeft: "auto", marginRight: "auto" }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Feature Highlight Cards */}
      <Section bg={palette.surfaceAlt}>
        <SectionTitle badge="Features" title="Everything you need, nothing you don't" subtitle="Purpose-built for the unique chaos of moving into a new home." />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
          {[
            { icon: icons.rooms, title: "Room-based organization", desc: "See all tasks for each room at a glance. Color-coded for instant orientation." },
            { icon: icons.dependency, title: "Dependency tracking", desc: "The app knows that painting comes before mounting the TV. Tasks unlock automatically." },
            { icon: icons.ai, title: "Smart suggestions", desc: "\"What should I do next?\" answered by an algorithm that weighs priority, effort, and readiness." },
            { icon: icons.people, title: "Household collaboration", desc: "Assign tasks to family members or roommates. Everyone knows their next move." },
            { icon: icons.views, title: "Flexible views", desc: "See tasks by room, person, priority, or status. Find quick wins or plan big projects." },
            { icon: icons.tasks, title: "Status workflow", desc: "Not started, in progress, paused, done. Track partial progress on complex tasks." },
          ].map((f, i) => (
            <div key={i} style={{
              background: palette.surface, borderRadius: 14, padding: 28,
              border: `1px solid ${palette.border}`, transition: "box-shadow 0.2s, transform 0.2s",
              cursor: "default",
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = palette.shadowLg; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ color: palette.accent, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontFamily: font.display, fontSize: 19, fontWeight: 400, margin: "0 0 8px", color: palette.text }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: palette.textMuted, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <span onClick={() => setPage("Features")} style={{ fontSize: 15, color: palette.accent, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
            Explore all features {icons.arrow}
          </span>
        </div>
      </Section>

      {/* Testimonial */}
      <Section>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          {icons.quote}
          <p style={{ fontFamily: font.display, fontSize: 26, lineHeight: 1.5, color: palette.text, margin: "16px 0 24px", fontWeight: 400, fontStyle: "italic" }}>
            "We moved into our first house and felt completely overwhelmed. SettleGuide broke everything down into manageable steps. Within two weeks, it felt like home."
          </p>
          <div>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: palette.accentLight, margin: "0 auto 8px", display: "flex", alignItems: "center", justifyContent: "center", color: palette.accent, fontWeight: 700, fontSize: 16 }}>S</div>
            <p style={{ fontSize: 14, fontWeight: 600, color: palette.text, margin: "0 0 2px" }}>Sarah & Tom</p>
            <p style={{ fontSize: 13, color: palette.textLight, margin: 0 }}>First-time homeowners, Amsterdam</p>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section bg={palette.accent} style={{ textAlign: "center" }}>
        <h2 style={{ fontFamily: font.display, fontSize: 40, fontWeight: 400, color: "white", margin: "0 0 16px" }}>Ready to get settled?</h2>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,0.75)", maxWidth: 440, margin: "0 auto 32px", lineHeight: 1.6 }}>SettleGuide is completely free right now. Start organizing your new home today.</p>
        <button style={{
          background: "white", color: palette.accent, border: "none",
          padding: "16px 36px", borderRadius: 10, fontSize: 16, fontWeight: 700,
          cursor: "pointer", fontFamily: font.body,
        }}>Get Started — It's Free</button>
      </Section>
    </div>
  );
}

// ============================================
// PAGE: FEATURES
// ============================================
function FeaturesPage() {
  const features = [
    {
      icon: icons.rooms, title: "Room-Based Organization",
      desc: "Organize every task by room — living room, kitchen, bedroom, and beyond. Color-coded rooms give you instant visual clarity on what's happening where. Switch between rooms in a tap to focus your energy.",
      details: ["Pre-built room templates", "Custom rooms and color coding", "Room progress indicators", "Multi-room task support"],
    },
    {
      icon: icons.dependency, title: "Dependency Tracking",
      desc: "Real life has order: you can't mount the TV before buying a wall bracket. Define dependencies between tasks and the app automatically marks blocked items, unlocking them as prerequisites are completed.",
      details: ["Visual dependency graph", "Auto-blocking of dependent tasks", "Cascade completion", "Circular dependency detection"],
    },
    {
      icon: icons.ai, title: "Smart Suggestion Engine",
      desc: "The core intelligence of the app. Our algorithm considers priority, difficulty, dependency status, room preference, and assignee to surface the single best task to tackle next. Quick wins or high-impact — your call.",
      details: ["Weighted scoring algorithm", "\"Quick wins\" and \"Big wins\" filters", "Time-based suggestions", "Personalized per household member"],
    },
    {
      icon: icons.people, title: "Household Collaboration",
      desc: "Moving is a team sport. Add your partner, family members, or roommates. Assign tasks, see who's doing what, and keep everyone aligned without the nagging.",
      details: ["Shared household workspace", "Per-person task views", "Assignment notifications", "Skill-based auto-assignment (AI)"],
    },
    {
      icon: icons.views, title: "Flexible Task Views",
      desc: "Everyone thinks differently. View your tasks by room, person, priority, difficulty, or status. Find quick wins with a single filter. Plan big projects in the overview.",
      details: ["Grid, list, and board layouts", "Advanced filter chips", "Quick win / big win views", "Blocked tasks overview"],
    },
    {
      icon: icons.tasks, title: "Task Status Workflow",
      desc: "Life isn't binary. Tasks can be not started, in progress, paused, or done. Track partial progress — because \"half-built wardrobe missing one screw\" is a real status.",
      details: ["Four-stage workflow", "Pause with reason", "Time tracking (optional)", "Completion history"],
    },
  ];

  return (
    <div>
      <Section>
        <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto 80px" }}>
          <Badge>Features</Badge>
          <h1 style={{ fontFamily: font.display, fontSize: 48, fontWeight: 400, color: palette.text, margin: "0 0 18px", letterSpacing: "-0.02em" }}>
            Built for the way<br />moving actually works
          </h1>
          <p style={{ fontSize: 18, color: palette.textMuted, lineHeight: 1.65 }}>
            Every feature is designed around the specific challenges of setting up a new home — not generic project management.
          </p>
        </div>

        {features.map((f, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: i % 2 === 0 ? "1fr 1fr" : "1fr 1fr",
            direction: i % 2 === 0 ? "ltr" : "rtl",
            gap: 64, alignItems: "center", marginBottom: i < features.length - 1 ? 80 : 0,
            paddingBottom: i < features.length - 1 ? 80 : 0,
            borderBottom: i < features.length - 1 ? `1px solid ${palette.border}` : "none",
          }}>
            <div style={{ direction: "ltr" }}>
              <div style={{ color: palette.accent, marginBottom: 16 }}>{f.icon}</div>
              <h2 style={{ fontFamily: font.display, fontSize: 30, fontWeight: 400, color: palette.text, margin: "0 0 14px" }}>{f.title}</h2>
              <p style={{ fontSize: 16, color: palette.textMuted, lineHeight: 1.7, margin: "0 0 24px" }}>{f.desc}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {f.details.map((d, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: palette.text }}>
                    <span style={{ color: palette.accent }}>{icons.check}</span>{d}
                  </div>
                ))}
              </div>
            </div>
            <div style={{
              direction: "ltr",
              background: palette.surfaceAlt, borderRadius: 16, height: 280,
              border: `1px solid ${palette.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: palette.textLight, fontSize: 14, fontStyle: "italic",
            }}>
              Feature illustration / screenshot placeholder
            </div>
          </div>
        ))}
      </Section>

      {/* AI Section */}
      <Section bg={palette.text} style={{ color: "white" }}>
        <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
          <span style={{
            display: "inline-block", background: "rgba(216,243,220,0.15)", color: palette.accentLight,
            fontSize: 12, fontWeight: 600, padding: "5px 14px", borderRadius: 50,
            letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 20,
          }}>AI-Powered</span>
          <h2 style={{ fontFamily: font.display, fontSize: 40, fontWeight: 400, margin: "0 0 18px" }}>Intelligence that learns your home</h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
            Beyond the core suggestion engine, AI capabilities help you work smarter — auto-categorizing tasks, breaking big projects into subtasks, and explaining why each recommendation matters.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 20, marginTop: 56 }}>
          {[
            { title: "Auto-categorize", desc: "Type a task in plain language. AI assigns room, difficulty, and priority." },
            { title: "Break it down", desc: "Enter \"Renovate kitchen\" and get a full subtask plan instantly." },
            { title: "Time estimates", desc: "\"What can I finish in 30 minutes?\" — answered intelligently." },
            { title: "Explain why", desc: "Understand the reasoning behind every suggestion the engine makes." },
          ].map((a, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: 24,
              border: "1px solid rgba(255,255,255,0.1)",
            }}>
              <h4 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 8px" }}>{a.title}</h4>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.6 }}>{a.desc}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ============================================
// PAGE: PRICING
// ============================================
function PricingPage() {
  return (
    <div>
      <Section>
        <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 56px" }}>
          <Badge>Pricing</Badge>
          <h1 style={{ fontFamily: font.display, fontSize: 48, fontWeight: 400, color: palette.text, margin: "0 0 18px", letterSpacing: "-0.02em" }}>
            Free to use. Seriously.
          </h1>
          <p style={{ fontSize: 18, color: palette.textMuted, lineHeight: 1.65 }}>
            SettleGuide just launched and we want everyone to try it. Use the full app for free — no credit card, no catch.
          </p>
        </div>

        {/* Single free plan card */}
        <div style={{ maxWidth: 480, margin: "0 auto 64px" }}>
          <div style={{
            background: palette.surface, borderRadius: 20, padding: 44,
            border: `1px solid ${palette.border}`, boxShadow: palette.shadowLg,
            textAlign: "center",
          }}>
            <div style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 56, height: 56, borderRadius: 16, background: palette.accentLight,
              color: palette.accent, marginBottom: 20,
            }}>
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 style={{ fontFamily: font.display, fontSize: 28, fontWeight: 400, margin: "0 0 6px", color: palette.text }}>Launch Plan</h3>
            <p style={{ fontSize: 15, color: palette.textMuted, margin: "0 0 28px" }}>Everything included, on us</p>
            <div style={{ marginBottom: 28 }}>
              <span style={{ fontFamily: font.display, fontSize: 56, color: palette.text }}>Free</span>
            </div>
            <button style={{
              width: "100%", padding: "15px 0", borderRadius: 10, border: "none",
              fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: font.body,
              background: palette.accent, color: "white", marginBottom: 32,
              boxShadow: "0 2px 8px rgba(45,106,79,0.25)",
            }}>Get Started — It's Free</button>
            <div style={{ textAlign: "left" }}>
              {[
                "Task creation with rooms, priority & difficulty",
                "Dependency tracking",
                "Smart suggestion engine",
                "Multiple task views",
                "Household collaboration",
                "Full status workflow",
              ].map((f, j) => (
                <div key={j} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 0",
                  fontSize: 15, color: palette.text,
                  borderBottom: j < 5 ? `1px solid ${palette.borderLight}` : "none",
                }}>
                  <span style={{ color: palette.accent, flexShrink: 0 }}>{icons.check}</span>{f}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Future plans teaser */}
        <div style={{
          maxWidth: 640, margin: "0 auto 80px", background: palette.surfaceAlt,
          borderRadius: 16, padding: "36px 40px", border: `1px solid ${palette.border}`,
          display: "flex", gap: 20, alignItems: "flex-start",
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, background: palette.accentLight,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: palette.accent, flexShrink: 0, marginTop: 2,
          }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h4 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 6px", color: palette.text }}>What about the future?</h4>
            <p style={{ fontSize: 15, color: palette.textMuted, margin: 0, lineHeight: 1.65 }}>
              As SettleGuide grows, we may introduce paid tiers with advanced features and higher limits. But early users will always be rewarded — and we'll give you plenty of notice before anything changes. For now, enjoy the full experience on us.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: 640, margin: "0 auto 0" }}>
          <h3 style={{ fontFamily: font.display, fontSize: 28, fontWeight: 400, textAlign: "center", marginBottom: 32, color: palette.text }}>Frequently asked questions</h3>
          {[
            { q: "Will it really stay free?", a: "Right now, yes — 100% free. If we introduce paid plans in the future, we'll communicate clearly and reward early adopters." },
            { q: "Are there any limits?", a: "Some usage limits may apply to keep the service running smoothly for everyone. We'll be transparent about any limits as they're defined." },
            { q: "What happens after I'm settled?", a: "Keep using SettleGuide for home maintenance, seasonal tasks, or your next renovation project. It's not just for moving day." },
            { q: "Can I use it for a renovation, not just moving?", a: "Absolutely. The dependency and room system works perfectly for renovations, remodeling, or any home project." },
          ].map((f, i) => (
            <div key={i} style={{
              padding: "20px 0",
              borderBottom: i < 3 ? `1px solid ${palette.border}` : "none",
            }}>
              <h4 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 6px", color: palette.text }}>{f.q}</h4>
              <p style={{ fontSize: 15, color: palette.textMuted, margin: 0, lineHeight: 1.6 }}>{f.a}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ============================================
// PAGE: ABOUT
// ============================================
function AboutPage() {
  return (
    <div>
      <Section>
        <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 64px" }}>
          <Badge>Our Story</Badge>
          <h1 style={{ fontFamily: font.display, fontSize: 48, fontWeight: 400, color: palette.text, margin: "0 0 18px", letterSpacing: "-0.02em" }}>
            Born from a messy move
          </h1>
          <p style={{ fontSize: 18, color: palette.textMuted, lineHeight: 1.7 }}>
            SettleGuide started when our founder moved into a new apartment and realized that no tool existed for the specific chaos of post-move organization. Spreadsheets were too rigid, to-do apps too shallow, and project tools too complex.
          </p>
        </div>

        {/* Mission */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, marginBottom: 80, alignItems: "center" }}>
          <div>
            <h2 style={{ fontFamily: font.display, fontSize: 30, fontWeight: 400, color: palette.text, margin: "0 0 16px" }}>Our mission</h2>
            <p style={{ fontSize: 16, color: palette.textMuted, lineHeight: 1.7, margin: "0 0 16px" }}>
              We believe the first weeks in a new home should be exciting, not stressful. Our mission is to build the most intuitive, intelligent tool for turning a new house into a home — one task at a time.
            </p>
            <p style={{ fontSize: 16, color: palette.textMuted, lineHeight: 1.7, margin: 0 }}>
              We're a small, focused team that cares deeply about design, user experience, and solving real problems. No bloat. No enterprise features nobody asked for. Just a tool that works beautifully for the job at hand.
            </p>
          </div>
          <div style={{
            background: palette.surfaceAlt, borderRadius: 16, height: 300,
            border: `1px solid ${palette.border}`, display: "flex", alignItems: "center",
            justifyContent: "center", color: palette.textLight, fontSize: 14, fontStyle: "italic",
          }}>
            Team photo placeholder
          </div>
        </div>

        {/* Values */}
        <div style={{ marginBottom: 80 }}>
          <h2 style={{ fontFamily: font.display, fontSize: 30, fontWeight: 400, textAlign: "center", marginBottom: 40, color: palette.text }}>What we believe</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
            {[
              { title: "Simplicity over features", desc: "Every feature earns its place. We'd rather do five things perfectly than fifty things poorly." },
              { title: "Intelligence without complexity", desc: "AI should feel like a helpful housemate, not a confusing interface. Smart defaults, not settings." },
              { title: "Built for real life", desc: "Moving is chaotic, unpredictable, and human. Our tool adapts to that reality instead of forcing rigid workflows." },
            ].map((v, i) => (
              <div key={i} style={{
                background: palette.surfaceAlt, borderRadius: 14, padding: 28,
                border: `1px solid ${palette.border}`,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, background: palette.accentLight,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: palette.accent, fontFamily: font.display, fontSize: 20, marginBottom: 16,
                }}>{i + 1}</div>
                <h3 style={{ fontFamily: font.display, fontSize: 20, fontWeight: 400, margin: "0 0 8px", color: palette.text }}>{v.title}</h3>
                <p style={{ fontSize: 14, color: palette.textMuted, lineHeight: 1.6, margin: 0 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div style={{ maxWidth: 560, margin: "0 auto 80px" }}>
          <h2 style={{ fontFamily: font.display, fontSize: 30, fontWeight: 400, textAlign: "center", marginBottom: 40, color: palette.text }}>Our journey</h2>
          {[
            { date: "Jan 2026", event: "Idea sparked after a chaotic apartment move" },
            { date: "Mar 2026", event: "First prototype built — task lists with room assignment" },
            { date: "May 2026", event: "Dependency engine and smart suggestions added" },
            { date: "Jul 2026", event: "Closed beta with 50 early users" },
            { date: "Sep 2026", event: "Public launch & waitlist opens", current: true },
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 20, marginBottom: 24 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{
                  width: 12, height: 12, borderRadius: "50%",
                  background: t.current ? palette.accent : palette.border,
                  border: t.current ? `3px solid ${palette.accentLight}` : "none",
                  flexShrink: 0,
                }} />
                {i < 4 && <div style={{ width: 2, flex: 1, background: palette.border, marginTop: 4 }} />}
              </div>
              <div style={{ paddingBottom: 8 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: t.current ? palette.accent : palette.textLight, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{t.date}</p>
                <p style={{ fontSize: 15, color: palette.text, margin: 0 }}>{t.event}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div style={{
          background: palette.surfaceAlt, borderRadius: 20, padding: 48,
          border: `1px solid ${palette.border}`, textAlign: "center",
        }}>
          <h2 style={{ fontFamily: font.display, fontSize: 28, fontWeight: 400, margin: "0 0 12px", color: palette.text }}>Get in touch</h2>
          <p style={{ fontSize: 16, color: palette.textMuted, margin: "0 0 28px" }}>
            Have questions, feedback, or partnership ideas? We'd love to hear from you.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            <button style={{
              background: palette.accent, color: "white", border: "none",
              padding: "13px 28px", borderRadius: 10, fontSize: 15, fontWeight: 600,
              cursor: "pointer", fontFamily: font.body,
            }}>Email Us</button>
            <button style={{
              background: "transparent", color: palette.text, border: `1.5px solid ${palette.border}`,
              padding: "13px 28px", borderRadius: 10, fontSize: 15, fontWeight: 500,
              cursor: "pointer", fontFamily: font.body,
            }}>Twitter / X</button>
          </div>
        </div>
      </Section>
    </div>
  );
}

// ============================================
// MAIN APP
// ============================================
export default function App() {
  const [page, setPage] = useState("Home");

  return (
    <div style={{ background: palette.bg, minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
      <Nav page={page} setPage={setPage} />
      {page === "Home" && <HomePage setPage={setPage} />}
      {page === "Features" && <FeaturesPage />}
      {page === "Pricing" && <PricingPage />}
      {page === "About" && <AboutPage />}
      <Footer />
    </div>
  );
}
