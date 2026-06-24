# UI/UX Design — Tennis Matchmaker v2.0

## Design Philosophy
Sporty modern — Nike/Strava energy. Bold black canvas with neon green and amber accents. Athletic, confident, mobile-first. Every interaction feels fast and decisive. No decoration for decoration's sake — every element drives action.

## Aesthetic Anchor References
- Nike app: black surface + neon accents, bold sans, confident minimalism
- Strava: data-dense summaries, athletic energy, clean dark surfaces
- Linear: precision spacing, sharp borders, premium feel translated to sport context

## Color System
```css
:root {
  /* Surfaces */
  --background: #0a0a0a;         /* Deep black canvas */
  --surface: #141414;            /* Elevated card surface */
  --surface-hover: #1a1a1a;      /* Hover state */
  --border: rgba(255,255,255,0.06);  /* Subtle border */
  --border-strong: rgba(255,255,255,0.12);  /* Active/focus border */

  /* Primary — Neon Green */
  --primary: #22c55e;            /* Bright neon green */
  --primary-foreground: #000000; /* Black on green for contrast */
  --primary-muted: rgba(34,197,94,0.15); /* Glow background */
  --primary-glow: rgba(34,197,94,0.25);  /* Ring/border glow */

  /* Accent — Amber */
  --accent: #f59e0b;             /* Warm amber for highlights */
  --accent-foreground: #000000;
  --accent-muted: rgba(245,158,11,0.15);

  /* Text */
  --foreground: #ffffff;         /* Pure white */
  --foreground-muted: #888888;   /* Muted secondary */
  --foreground-dim: #555555;     /* Tertiary/dim */

  /* Semantic */
  --success: #22c55e;            /* Green = win/success */
  --warning: #f59e0b;            /* Amber = pending/alert */
  --destructive: #ef4444;        /* Red = loss/ended */
}
```

### Color Usage Rules
- **Black canvas always** — no white backgrounds anywhere
- **Neon green** = active state, your matches, your row, primary CTA, in-progress
- **Amber** = alerts, attention-draws, trophies/achievements, momentum indicators
- **Muted gray (#888)** = labels, descriptions, inactive states
- **Dim (#555)** = very subtle info, timestamps

## Typography
- **Font family:** Inter (system fallibold) — no substitution needed
- **Display/Headings:** `font-black` (900) or `font-extrabold` (800), `tracking-tight` (0.025em negative), uppercase for labels
- **Body:** `font-medium` (500), `text-sm`, `leading-snug`
- **Scores/Numbers:** `font-black`, `text-2xl`+, `tabular-nums` (font-variant-numeric)
- **Labels/Captions:** `text-xs`, `uppercase`, `tracking-widest`, `font-semibold`, color `--foreground-muted`

### Type Scale
| Use | Size | Weight | Tracking | Color |
|-----|------|--------|----------|-------|
| Hero number (score) | 2.5rem | black (900) | tight | --foreground |
| Section heading | 1.25rem | extrabold (800) | tight | --foreground |
| Card title | 0.95rem | semibold (600) | normal | --foreground |
| Body | 0.875rem | medium (500) | normal | --foreground-muted |
| Label/caption | 0.7rem | semibold (600) | widest (0.1em) | --foreground-dim |
| Micro (badges) | 0.6rem | bold (700) | wide | --foreground-muted |

## Spacing & Radius
- **Card radius:** `rounded-xl` (16px) — generous, modern
- **Button radius:** `rounded-full` (pill) — sporty, tactile
- **Badge radius:** `rounded-full` (pill)
- **Card padding:** `p-4` to `p-5`
- **Grid gap:** `gap-3` (compact sport feel)
- **Section gap:** `space-y-6`
- **Container padding:** `px-4`

## Depth & Elevation (Dark Theme)
No box shadows on dark. Use:
- **Level 0:** No border, flush with background (divider lines)
- **Level 1:** `border border-[rgba(255,255,255,0.06)]` subtle card separation
- **Level 2:** `border border-[rgba(255,255,255,0.12)]` + `--surface` bg = active/elevated
- **Glow:** `0 0 0 1px var(--primary-glow)` = interactive focus/active ring
- **Active match glow:** `0 0 12px rgba(34,197,94,0.15)` = your match highlight

## Page Designs

### `/` Landing Screen (Entry)
- Full black canvas, centered vertically
- App name "MATCHMAKER" in large extrabold uppercase, letter-spaced
- Subtitle "Tennis open play, simplified" in muted
- Name input: full-width dark input with green focus ring
- CTA: neon green pill button "ENTER" — bold, full-width
- No session setup — entering name auto-joins active queue
- Optional: session code input below (collapsed by default) for private sessions
- Bottom: "Joining as {name}" confirmation toast on submit

### `/bracket` Bracket View (Tab 1 — Default after entry)
- Full tournament bracket display
- Each match = dark surface card with:
  - Player names stacked vertically
  - Score displayed large (e.g. "6 - 4") when completed
  - Status indicator: dot (green = live, amber = pending, dim = upcoming)
- Current player's match has green border glow
- Round headers as uppercase labels
- Empty state: "Waiting for players..." with pulsing green dot
- Pull to refresh
- Players queue listed horizontally at top (scrollable row of pills)

### `/score` Score View (Tab 2)
- List of active/completed matches involving current player
- Each match card shows:
  - Opponent name
  - Match status
  - "SCORE" button (if active) → expands inline
- Inline score entry expansion:
  - Quick-score buttons: 6-0, 6-1, 6-2, 6-3, 6-4, 7-5, 7-6
  - Or "Custom" → set-by-set input rows
  - Submit → collapses with confirmation
- Completed matches show final score in amber

### `/standings` Leaderboard (Tab 3)
- Ranked table (full-width on mobile)
- Columns: # | Player | W | L | Win%
- Current player's row highlighted with green left border + subtle green bg
- Numbers in tabular-nums, bold for W column
- Empty state: "Play your first match to appear on the leaderboard"
- Pull to refresh

### Global Components

#### Bottom Navigation
- 3 tabs in a sticky bottom bar: `Bracket` | `Score` | `Standings`
- Dark surface with top border
- Active tab: neon green icon + label
- Inactive: muted gray
- Icons: simple SVG stroke icons (trophy, stopwatch, list)
- Height: safe-area-inset bottom on iOS

#### Top Bar
- Minimal: "MATCHMAKER" small uppercase label on left
- Session indicator badge on right (format + player count)
- Optional: settings/reset action (hidden menu)

#### Match Card Component
- Shared across Bracket and Score views
- Base: `bg-[#141414] border border-[rgba(255,255,255,0.06)] rounded-xl p-4`
- Active/Your match: border-green-500/30 + `shadow-[0_0_12px_rgba(34,197,94,0.12)]`
- Layout: Row with player info (left) + status/score (right)
- Expanded state: full score entry inline

#### Status Badges
- Live: `bg-green-500/15 text-green-400 border border-green-500/20 rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide`
- Pending: `bg-amber-500/15 text-amber-400 border border-amber-500/20 rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide`
- Completed: `bg-white/5 text-white/50 border border-white/10 rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide`

#### Buttons
- Primary CTA: `bg-[#22c55e] text-black font-bold rounded-full h-11 px-6 uppercase tracking-wide text-sm hover:bg-[#16a34a] transition-all active:scale-[0.97]`
- Secondary: `bg-white/5 text-white font-semibold rounded-full h-10 px-5 border border-white/10 hover:bg-white/10 transition-all`
- Destructive: `bg-red-500/10 text-red-400 font-semibold rounded-full border border-red-500/20 hover:bg-red-500/20`

#### Input (Dark)
- Base: `h-11 rounded-xl bg-white/5 border border-white/10 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-green-500/50 focus:[box-shadow:0_0_0_2px_rgba(34,197,94,0.15)] transition-all`

## Interactions & Motion
- **Tab switch:** Cross-fade (150ms ease)
- **Pull to refresh:** Standard, with green tint on indicator
- **Match card tap:** Scale down 0.97 on press, spring back
- **Score submit:** Green flash confirmation + collapse
- **Leaderboard entry:** Slide-in from left on first appearance
- **Empty states:** Subtle pulse animation on indicators (2s ease-in-out infinite)
- **All transitions:** `transition-all duration-150 ease-out` default
- **Respect prefers-reduced-motion:** disable all non-essential animation

## Mobile Considerations
- All content max-w-md, centered (no stretched desktop)
- Full-width buttons and inputs on mobile
- Bottom nav safe area: `pb-[env(safe-area-inset-bottom)]`
- Score entry: full-scrim modal on mobile (not inline expand) for space
- Touch targets: all interactive ≥ 44px
- Horizontal queue scroll: no scrollbar visible (overflow-x-auto, scrollbar-none)

## State Management
Same 2 Zustand stores, updated for new flow:
- `useSessionStore`: active session, current player, queue of waiting players
- `useMatchStore`: bracket matches, player scores, leaderboard computation

## Architecture Changes from v1
- REMOVE: `/setup` route (auto-create session on first entry)
- REMOVE: `/checkin` route (merged into `/` landing)
- REMOVE: `/score/[matchId]` route (inline expand scoring)
- ADD: `/bracket` route (replaces `/score` as default landing after entry)
- ADD: `/standings` route (replaces `/summary`)
- MODIFY: `/` route (standalone entry screen, no nav until player creates session)
- Bottom nav: only visible after session starts (not on entry screen)
