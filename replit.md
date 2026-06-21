# Daily Quest

**Daily Quest** is a mobile-first daily challenge PWA built with React, TypeScript, Tailwind CSS and Replit. It gives users one quest per day and helps them build consistency through small actions across different life areas.

## Run & Operate

- `pnpm --filter @workspace/daily-quest run dev` — run the Daily Quest app (dev server)
- `pnpm --filter @workspace/daily-quest run typecheck` — typecheck the frontend
- `pnpm run typecheck` — full typecheck across all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite + Tailwind CSS v4
- UI: shadcn/ui components, Framer Motion animations, Lucide React icons
- State: React `useState` + `useEffect` with localStorage persistence
- No backend — all data stored locally in the browser
- PWA: manifest + Apple mobile web app meta tags

## Where things live

- `artifacts/daily-quest/` — the main app
- `artifacts/daily-quest/src/data/challenges.ts` — all 64 predefined challenges
- `artifacts/daily-quest/src/hooks/useAppState.ts` — all state management and localStorage logic
- `artifacts/daily-quest/src/types/index.ts` — TypeScript types (Challenge, AppState, etc.)
- `artifacts/daily-quest/src/utils/` — xp.ts, streak.ts, date.ts, audio.ts
- `artifacts/daily-quest/src/pages/` — TodayPage, HistoryPage, StatsPage, LibraryPage, SettingsPage
- `artifacts/daily-quest/public/manifest.json` — PWA manifest
- `artifacts/daily-quest/src/index.css` — dark theme CSS variables (HSL-based, dark-only)

## Architecture decisions

- **No backend / no auth** — all persistence is localStorage under the key `daily-quest-state`. Defensive parsing on load; corrupted state falls back to defaults.
- **Dark-only theme** — `class="dark"` is hardcoded on `<html>` in `index.html`. The `:root` and `.dark` CSS blocks both carry identical dark values so the theme is consistent regardless of HMR order.
- **Challenge selection** — one challenge per day, keyed by `dateGenerated` (YYYY-MM-DD). Skipping logs the old one to history and draws a fresh random one (avoiding last 7 used). New day auto-generates a new challenge on app open.
- **Streak logic** — streak increments only on `completeQuest()`. `calculateStreak()` resets to 0 if the last active date is 2+ days ago (missed day). Best streak is tracked separately.
- **Sound/haptics** — Web Audio API oscillator tones (no external files). `navigator.vibrate()` for haptics. Both are gated on user settings toggles.

## Product

**Habit loop:** Open app → receive one daily quest → Complete or Skip/Reroll → earn XP → maintain streak → track history and stats.

**Screens:**
- **Today** — active quest card (category-colored strip, difficulty badge, XP chip, Complete + Skip/Reroll CTAs) and completed state (celebration, XP earned, streak, quest summary)
- **History** — filterable log of all past challenges (completed / skipped / by category)
- **Stats** — visual overview: completion rate, streaks, most-completed category, 7-day activity grid
- **Library** — browse all 64 challenges filtered by category and difficulty (read-only)
- **Settings** — sound/haptics toggles, Install App PWA instructions, export/import JSON, reset progress

**Level system:** 10 levels based on cumulative XP (0 → 5000). Animated gold progress bar.

**Categories:** Productivity, Learning, Health, Creativity, Social, Career, Reflection, Fun.

**Difficulty / XP:** Easy = 10 XP, Medium = 25 XP, Hard = 50 XP.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- The `.dark` CSS block in `index.css` must have real HSL values — if it still has `red` placeholders, all dark-mode styles break when `class="dark"` is active on `<html>`.
- Do not use `window.confirm()` — use shadcn `Dialog` for confirmations instead.
- Do not import React explicitly — Vite's JSX transformer handles it automatically.
- `pnpm run build` requires `PORT` and `BASE_PATH` env vars (set by workflows). Use `typecheck` for local verification instead.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
