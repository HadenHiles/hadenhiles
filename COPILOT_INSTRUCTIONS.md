# COPILOT_INSTRUCTIONS.md
>
> Project: Personal Portfolio with TUI → GUI “Morph Handoff”  
> Stack: Next.js (App Router) + Tailwind + Framer Motion + Zustand + JSON content  
> Theme: Monochrome + single purple accent (from Haden logo)  
> Motion: Mechanical (no spring/bounce), small distances, calm orchestration

---

## 0) High-level UX concept

Build a single Next.js site with **two entry experiences**:

1) **TUI Boot Screen (default entry)**  
A terminal-inspired UI that supports:

- Arrow keys + Enter
- Number shortcuts (1–9)
- Optional command input with easter eggs
- A short boot log (“initializing modules”) that feels techy but tasteful

1) **GUI Site (normal portfolio)**  
A polished portfolio site with state-based sections and calm animation.

### Critical UX rules

- The TUI is *never a gate*. It must always show a visible **“Use GUI”** option.
- At any point:
  - typing `exit` → GUI
  - `Ctrl+C` → cheeky message → GUI
- The GUI header includes **“Launch Terminal”** to return to the TUI.

**Core magic:** the TUI → GUI transition should feel like a *handoff*, not a page load:

- The TUI “console card” morphs into the GUI “site shell” container using Framer Motion layout animations.

---

## 1) Routes & entry behavior

Implement these routes:

- `/` → **TUI entry** by default (safe + fun).
- `/site` → **GUI** (normal portfolio).
- `/tui` → **TUI** (same as `/` but explicit).

Optional deep-linking:

- `/site?mode=work|experience|knowledge|about`
- `/site?project=<id>`

**Navigation requirement:** no full-page reload transitions in-app. Treat everything as state changes.

---

## 2) Core state model (Zustand)

Use Zustand as the app-wide state store.

### 2.1 Modes

Define app modes:

- `tui`
- `work`
- `experience`
- `knowledge`
- `about`

### 2.2 GUI state

Track:

- `mode`
- `selectedProjectId: string | null`
- `reducedMotion: boolean`
- `scrollVelocity: number` (smoothed)
- `isExploringSlowly: boolean` (derived from scroll velocity threshold)

### 2.3 TUI state

Track:

- `bootComplete: boolean`
- `menuIndex: number`
- `commandBuffer: string`
- `history: Array<{ type: 'log'|'cmd'|'out'|'err', text: string }>`
- `hiddenOptionsUnlocked: boolean` (set by `ls -a` / easter eggs)

### 2.4 Store actions

Actions should include:

- `setMode(mode)`
- `selectProject(id|null)`
- `setReducedMotion(bool)`
- `updateScrollVelocity(v)`
- TUI actions:
  - `appendHistory(entry)`
  - `setMenuIndex(i)`
  - `setCommandBuffer(str)`
  - `unlockHiddenOptions()`
  - `runTuiCommand(str)` (whitelist parser)
  - `runBootScript()` (timed log output)

---

## 3) Folder structure (Copilot-friendly)

Use this structure:

```bash
/app
  layout.tsx
  page.tsx                   // entry: redirect or render TUI
  (site)/
    page.tsx                 // GUI home
  (tui)/
    page.tsx                 // TUI home
/components
  /shell
    SiteShell.tsx
    TopNav.tsx
    Footer.tsx
    FocusRing.tsx
  /orchestrator
    OrchestratedView.tsx
    ScrollIntent.tsx
    AttentionSignals.ts
  /sections
    hero/Hero.tsx
    work/Work.tsx
    work/ProjectCard.tsx
    work/ProjectDetailPanel.tsx
    knowledge/Knowledge.tsx
    knowledge/KnowledgeMap.tsx
    experience/Experience.tsx
    experience/VersionTimeline.tsx
    about/About.tsx
    about/ValuePillarCard.tsx
  /tui
    TuiHandoff.tsx           // shared container for morph transition
    TuiShell.tsx
    BootLog.tsx
    Menu.tsx
    CommandLine.tsx
    tuiCommands.ts
    tuiScript.ts
/lib
  motion.ts
  keyboard.ts
  routes.ts
  store.ts
/content
  projects.json
  experience.json
  knowledge.json
  about.json
/public
  /logo
  /images
  /diagrams
```

---

## 4) Theme (monochrome + single purple accent)

Tailwind tokens (add in `tailwind.config.js`):

- `bg`: `#0B0B0E`
- `surface`: `#101018`
- `surface2`: `#151520`
- `text`: `#EDEDF2`
- `muted`: `#B7B7C2`
- `border`: `#262634`
- `accent`: `#8A5CFF` (tweak to match logo)

### Purple usage rules

- Only for: CTA button, active indicator, focus ring, selected TUI `>` marker.
- No random decorative purple.

UI rules:

- Borders over shadows (hairline, 1px).
- 18–24px radius.
- Soft overlays for hover (5% white), never loud.

---

## 5) Motion system (mechanical, calm)

Create `/lib/motion.ts` exporting:

- durations:
  - `micro = 220ms`
  - `short = 320ms`
  - `medium = 520ms`
- easing (mechanical):
  - `ease = cubic-bezier(0.2, 0.0, 0.0, 1.0)`
  - `easeInOut = cubic-bezier(0.2, 0.0, 0.2, 1.0)`
- distances:
  - `slideY = 10`
  - `slideX = 12`

### Hard rules

- No spring animations.
- No bounce.
- Keep slide distances tiny.
- Prefer fade + slight translate + subtle scale (0.98 → 1.0).

Respect reduced motion:

- detect `prefers-reduced-motion`
- allow manual toggle in footer
- if reduced: durations → 0, remove slide.

---

## 6) The “Morph Handoff” (TUI → GUI) — the signature feature

### 6.1 Shared container component

Implement `components/tui/TuiHandoff.tsx` that renders the main “card/shell” container used by both TUI and GUI.

Requirements:

- Wrap with `motion.div layout` (Framer Motion layout animations).
- Use a stable `layoutId` like `"handoff-shell"`.
- Same border radius, padding, and background on both sides.
- During transitions, the container should *morph* (size/position) smoothly.

### 6.2 How the handoff works

- TUI renders `TuiHandoff` in center-ish layout.
- When user selects “Use GUI” or a mode:
  - print a handoff log line: `handoff: guiRenderer engaged`
  - set state to `mode = <target>`
  - route to `/site?mode=<target>` OR render GUI in-place (preferred if feasible)
- GUI renders the same `TuiHandoff` container but as the main content shell.

Goal:

- The *container* morphs; the *content* crossfades.
- Use `AnimatePresence` to fade old content out while layout animates.

### 6.3 Minimum viable implementation

If in-place mode switching is easier than routing:

- Render TUI and GUI in the same page component based on global `mode`.
- Only update the URL optionally (shallow routing).
- This avoids losing layout animation across route boundaries.

---

## 7) TUI entry experience

### 7.1 TUI layout (not a literal terminal)

The TUI is terminal-flavored UI:

- A boot log area (scrollable)
- A menu list (hoverable, selectable)
- Optional command line input

Should look like a premium product, not hacker cosplay.

### 7.2 Boot script (`tuiScript.ts`)

Create an array of boot log lines:

- Keep it short: 10–18 lines.
- Tone: techy, playful, tasteful.
- Example topics:
  - loading content manifests
  - indexing projects
  - applying theme tokens
  - warming motion engine
  - checking reduced motion preference
  - preparing GUI fallback

Script format:

```ts
type BootLine = { delayMs: number; level: 'info'|'ok'|'warn'; text: string };
export const BOOT_SCRIPT: BootLine[] = [ ... ];
```

`runBootScript()` should append lines to history on timers.

### 7.3 Menu options

Default menu:

1. Projects (Work)
2. Experience
3. Knowledge
4. About
5. Use GUI
6. Contact

Menu behaviors:

- Up/Down changes selection
- Enter selects
- number keys select directly
- highlight selection with purple `>` indicator
- hover should also highlight (desktop)

### 7.4 Command line + easter eggs

Optional, but recommended.

Whitelist supported commands:

- `help` → show commands
- `ls` → show normal options
- `ls -a` → unlock hidden options (hobbies, gear, behind-the-scenes)
- `whoami` → one-liner about Haden
- `cat projects.yml` → print brief “manifest style” summary (keep short)
- `exit` → switch to GUI
- `sudo rm -rf .` → cheeky refusal
- `Ctrl+C` → cheeky refusal then GUI

Implementation:

- `tuiCommands.ts` exports patterns/handlers
- Parser must be safe/whitelist only (no eval, no real execution)

### 7.5 Escape hatches (must be obvious)

- “Use GUI” visible in the menu immediately.
- `exit` always works.
- `Ctrl+C` always works.

---

## 8) GUI portfolio (the real site)

### 8.1 Site shell

`SiteShell.tsx` includes:

- fixed top nav
- main handoff shell container (shared with TUI)
- footer

Header includes:

- tabs: Work / Experience / Knowledge / About
- CTA: Contact
- “Launch Terminal” button → switch to TUI

### 8.2 Orchestrated sections (state transitions)

Implement `OrchestratedView.tsx`:

- render section based on `mode`
- transitions: fade + small translate, mechanical easing
- use keys per mode so Framer Motion transitions correctly

No heavy page transitions. Treat section changes as “mode switches”.

---

## 9) Hero section (adaptive subtext via scroll intent)

Hero requirements:

- headline
- adaptive subtext based on exploration speed
- CTA button (purple)
- subtle background (image + gradient overlay, no required video)

Scroll intent:

- `ScrollIntent.tsx` listens to scroll container
- compute velocity (smoothed)
- `isExploringSlowly = abs(v) < threshold` (start around 600px/s)
- change microcopy with fade-only (no jumpy motion)

---

## 10) Work mode: “Systems I’ve Built” (progressive disclosure)

Desktop:

- left: project list
- right: detail panel

Mobile:

- list
- selecting opens a full-screen panel (still feels like state, not a new site)

Project card fields:

- title
- tagline (why it exists)
- 4 chips: Purpose / Constraints / Decisions / Impact
- “Open” CTA (purple) on hover/focus (desktop), always visible (mobile)

Detail panel:

- story summary
- optional diagram (SVG preferred)
- tech stack chips
- links: GitHub, Demo, Video

Animation orchestration:

- selecting project:
  - detail panel fades in + slides 10px
  - diagram animates (stroke draw if SVG, otherwise fade)
  - tech stack appears last (staggered fade)

---

## 11) Knowledge mode: expandable “map” (not a list)

Categories:

- Frontend
- Backend
- DevOps / Automation
- Systems / Networking
- Storytelling / Production

Each expands:

- skill name
- “used for” one-liner
- “proof” chips linking back to projects

Motion:

- animated height
- staggered fades for inner items

---

## 12) Experience mode: version-history timeline (git-ish)

Use “versions” instead of plain job list:

- v1.0 Foundations
- v2.0 Building Systems
- v3.0 Owning Outcomes
- v4.0 Hybrid Engineer/Creator

Timeline rules:

- left rail stays stable
- selected version gets purple dot + soft glow
- right panel crossfades

Mobile: accordion.

---

## 13) About mode: “What Actually Matters” (no cringe)

Three pillars:

- Family
- Craft
- Play

Each reveals:

- 1 short story paragraph
- 1 image (optional)
- 1 “how it shapes my work” line

Optional footer easter egg modal.

---

## 14) Contact pattern (polished)

Contact modal:

- email + copy button
- LinkedIn button
- optional small form (not required)

Motion:

- fade + scale (0.98 → 1.0)
- subtle overlay backdrop

---

## 15) Accessibility & quality signals

Must-haves:

- Full keyboard navigation for TUI and GUI
- Visible focus ring (purple)
- ARIA labels for menu and command input
- Reduced motion support (auto + manual toggle)
- Esc should never trap focus

Performance:

- keep boot script short
- optimize images
- avoid heavy blur effects
- keep SVG animations cheap

---

## 16) Content as JSON “CMS”

Use `/content/*.json` as the source of truth.

### 16.1 Projects model

`projects.json` entries include:

- `id, title, tagline`
- `purpose, constraints, decisions, impact`
- `tech: string[]`
- `githubUrl?, demoUrl?, videoUrl?`
- `diagramAsset?`

Load content via static import for speed and simplicity.

---

## 17) Build order (do this sequence)

1) Tailwind tokens + base layout  
2) Zustand store (modes + selection + reducedMotion)  
3) TUI: shell + boot log + menu + keyboard navigation  
4) TUI: command parser + easter eggs + escape hatches  
5) Morph handoff: shared container with `layoutId`  
6) GUI shell + top nav + orchestrated view transitions  
7) Work mode: list + detail panel + mobile panel  
8) Knowledge mode: expandable map  
9) Experience mode: version timeline  
10) About mode: pillars + optional modal  
11) Contact modal  
12) Polish: focus, reduced motion, perf pass  

---

## 18) Copilot implementation notes (what to generate)

When implementing, prefer:

- small, composable components
- minimal custom CSS (Tailwind only)
- motion tokens from `/lib/motion.ts` everywhere
- a single shared scroll container that `ScrollIntent` can observe

Framer Motion tips:

- Use `layout` + `layoutId="handoff-shell"` for the morph.
- Use `AnimatePresence mode="wait"` for clean crossfades.
- Keep transforms subtle.

Zustand tips:

- Keep action names explicit.
- Derive `isExploringSlowly` inside store action for consistency.

---

## 19) Final vibe check (don’t mess this up)

- The TUI is a **welcome mat**, not a maze.
- The GUI must be premium even without the gimmick.
- Purple is a **signal**, not decoration.
- Motion is **mechanical**, not playful.
- Easter eggs are **opt-in**, never disruptive.

---
