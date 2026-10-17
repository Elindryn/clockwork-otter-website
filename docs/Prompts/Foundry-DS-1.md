<!-- Wolfgang-generated prompt. Source: Foundry UI design directive (inbox/2026-10-17_Foundry_Design_Directive.md); plan ecosystem/FOUNDRY_DESIGN_INITIATIVE.md §3 PoC-W; toolkit methodology/design/FOUNDRY_UI_TOOLKIT.md. Prompt ID: CLOCKWORK-DS-1. -->

# CLOCKWORK-DS-1 — Foundry design proof of concept: dimensional primary CTA, optional nav hover indicator

## How to Execute This Prompt

Open a **new Claude Code session launched from this repository's root** (or dispatch via `wolfgang-tools`). Do not run it from Wolfgang.

## Owner authorization (read this first)

This repository's `CLAUDE.md` says to avoid excessive animation, to not create new UI patterns, and that the design system in `../clockwork-otter-brand` wins conflicts. The owner has now explicitly approved the Foundry design toolkit (2026-10-17) and this proof of concept as a **bounded exception**: one button treatment and, only if it passes the gate below, one navigation indicator. Nothing else on the site may change. Brand colors, fonts, the logo and copper palette are untouched. Public-site rule from the toolkit: restrained, no attention rings, no glow.

## Goal

1. A **dimensional primary button** (tactile, subtle) for the primary call-to-action variant of `Button.astro`; secondary stays restrained/flat.
2. A **smooth navigation indicator** in `Navigation.astro` using CSS Anchor Positioning — **only if** it passes the gate in Scope 2; otherwise document "not adopted" and ship step 1 alone.

## Project Context

Astro + Tailwind v4; tokens in `src/styles/tokens.css` (derived from `../clockwork-otter-brand/docs/foundations/06-design-tokens.md`; copper `#b87333`, charcoal, steel; `--button-radius`, `--button-primary-*`, `--color-focus-ring-*`, `--transition-fast`, `--navigation-*`). Verified by Wolfgang 2026-10-17 — re-check:
- `src/components/Button.astro`: flat anchor; primary uses `bg-[var(--button-primary-background)]` with hover/active tokens and a `.btn-primary:focus-visible` two-tone halo (`--color-focus-ring-inner/outer`, chosen for contrast); secondary is outlined. Used by ~10 call sites.
- `src/components/Navigation.astro`: five links (Home, Antiphon, Creative [also `/copper-leaf/`], About, Contact); active link gets `aria-current="page"` and a static in-link copper underline `<span>`; links have their own charcoal-safe `:focus-visible` outline; mobile uses a hamburger menu (column, `.is-open`). It is a **multi-page** site (full page loads), so an indicator can only animate *within* a page.
- `tokens.css` states shadows have no assigned token values.

Browser support (searched 2026-10-17; re-verify on caniuse): anchor positioning is Baseline "Newly available" since Jan 2026 (Chrome/Edge 125, Firefox 147, Safari 26); conflicting sources exist for exact versions. Whether an anchored element's *position animates* between anchors in each engine is **not yet verified** — you must test it.

## Important Instructions

Do **not** touch anything in "Files and Folders Out of Scope", change copy/layout/colors/fonts, add dependencies, add JS for positioning, or deploy.

### Git and working-tree discipline (standing rule — do not deviate)

This session may be running inside an **auto-created Git worktree** on a `worktree-*` branch. That is expected and correct — work with the files exactly as they are checked out.

- **Leave every change uncommitted in the working tree.** Do not `git add`/`git commit`, do not `git push`, do not create branches, do not `gh pr create` / `gh pr merge` / `gh pr ready`. Committing and PR creation are the dispatcher's job or a human's — never this session's.
- **Do not move `HEAD` or rewrite history.** No `git reset`, `git checkout <ref>` / `git switch`, `git rebase`, `git merge`, `git pull`, `git fetch` followed by a reset, `git cherry-pick`, `git revert`, `git stash`, `git branch -D/-f/-m`, `git update-ref`, `git gc`, `git reflog expire`. `git status`, `git diff`, `git log`, `git show`, and a plain `git branch` listing are fine.
- **If the checked-out base looks wrong** — stale, missing a commit or file the phase depends on, on an unexpected branch — **STOP and say so in the completion report** (and block for input if running unattended). Do **not** try to correct it with git. Resetting or pulling to "fix" the base silently moves the work onto a different commit and breaks the dispatcher's ability to collect it — this has caused a manual recovery every time it has happened.
- A `PreToolUse` hook denies the git commands above and fails closed. Do not attempt to work around, disable, or overwrite it — if a denial blocks legitimate progress, that is a signal to stop and report, not to route around.

I will handle all source control (branching, committing, PRs, merges) myself or via the dispatcher.

## Read Before Changing

`CLAUDE.md`, then only: `../Wolfgang/methodology/design/FOUNDRY_UI_TOOLKIT.md` (patterns 1 and 2), `FOUNDRY_DESIGN_PRINCIPLES.md`, `FOUNDRY_ACCESSIBILITY.md`; `src/components/Button.astro`, `src/components/Navigation.astro`, `src/styles/tokens.css`; `../clockwork-otter-brand/docs/foundations/04-color-system.md` (contrast rules) and `06-design-tokens.md`; `grep -rn "<Button" src`.

## Scope

### 1. Dimensional primary button
- Add shadow tokens to `tokens.css` (e.g. `--button-shadow-rgb`, highlight/shade alpha values) with a comment that they originate from the Foundry toolkit and must be mirrored into `../clockwork-otter-brand/docs/foundations/06-design-tokens.md` (report that as a follow-up; do not edit that repo).
- `.btn-primary` gets the four-layer treatment from toolkit pattern 1: top inset highlight, bottom inset shade, small contact shadow, soft ambient shadow; hover lifts 1px; active presses 1px (keep existing hover/active color tokens); `transition` only on `transform`, `box-shadow`, `background-color`. Keep the two-tone focus halo (it replaces the shadow stack on `:focus-visible`, as today's box-shadow does — make sure the halo is still clearly visible). Check text/fill contrast is unchanged (copper fill darkened 85% — measure and report ratios). Secondary variant: unchanged or at most a restrained hover; do not add dimensionality.
- Reduced motion: no lift/press transform under `prefers-reduced-motion: reduce`.
- If the site has any disabled button use (probably none), no shadow/motion.

### 2. Navigation hover/focus indicator — gated
Design (meets "distinguish hover, focus, active"): the **active** page keeps today's static copper underline and `aria-current`. Add a separate, lighter *preview* indicator (a thin line, not copper-solid; use `--navigation-hover`) that slides between links following `:hover` and `:focus-visible`, anchored with `anchor-name`/`position-anchor`/`anchor()`/`anchor-size()` (set the anchor name on the hovered/focused link via `:has()` or per-link rules), positioned at the bottom of the nav, with a transition on `left`/`width` (or `inset`) of ~180 ms. When nothing is hovered/focused, the preview indicator is hidden (no change from today). Desktop (md and up) only; the mobile menu is unchanged. Wrap in `@supports (anchor-name: --a)` and `@media (prefers-reduced-motion: no-preference)` for the *motion*; without motion support the preview may still show but jumps. Without anchor support nothing changes from today. Indicator is `aria-hidden`, `pointer-events: none`; links keep their own focus outline.

**Gate — adopt only if all are true**, tested in the browsers you can run (at minimum Chromium via Playwright; also Firefox/WebKit if installed):
- the indicator visibly **animates** between links, with no jump/flicker on first hover, and returns/hides cleanly;
- no layout shift, no overlap with the active underline, contrast of the indicator against charcoal ≥ 3:1;
- the fallback (`@supports` false, simulated by temporarily removing the rule) leaves the nav exactly as today;
- keyboard tabbing shows the focus outline and the preview together without conflict.
If any is false or you cannot test animation, do **not** ship the indicator: remove it, record the evidence and the reason in the result ("not adopted"), and set V-D2 as still open. A "not adopted" outcome is a valid, successful result.

### 3. Evidence
Screenshots (desktop ~1280 px and mobile ~390 px) under `docs/Results/clockwork-ds-1-screenshots/`: primary + secondary button (default, hover, focus, active), nav with/without hover preview, reduced motion if possible. If you cannot run the dev server/browser, say so; never fabricate evidence. `npm run build` must pass.

## Files Allowed to Change
- `src/components/Button.astro`, `src/components/Navigation.astro`, `src/styles/tokens.css`
- `CLAUDE.md` (one line: Foundry toolkit location and that this PoC was an approved exception; the aesthetic rule otherwise stands)
- `docs/Results/clockwork-ds-1-foundry-design-proof-of-concept.md`, `docs/Results/clockwork-ds-1-screenshots/`

## Files and Folders Out of Scope
Pages and copy; `BaseLayout`, `Footer`, `CreativeCard`, `BrandWatermark`; fonts/logo/colors; `../clockwork-otter-brand` (report follow-ups only); GitHub Actions/deploy; dependencies; commit/push. **Stop-and-split** if more than ~400 lines change or a step needs another file.

## Verification Steps
```bash
npm ci && npm run build
```
plus whatever type/lint scripts `package.json` defines. Copy the checklist in `../Wolfgang/methodology/design/FOUNDRY_ACCESSIBILITY.md` (readable from the sibling checkout; if unavailable, apply: keyboard operable, visible `:focus-visible`, `prefers-reduced-motion`, WCAG AA contrast per theme, touch targets, mobile + desktop, viewed fallback) and report each line pass / fail / not checked with a reason. Report contrast ratios measured for the primary button text/fill and the preview indicator.

## Post-Completion Review (bounded — one round)
After verification, run **one** Codex review of the diff and apply exactly **one** fix pass for findings with a concrete failure scenario (lost focus visibility, contrast failure, broken mobile menu, layout shift). Style findings are recorded only. If Codex is unavailable, say so and skip.

## Documentation Updates
- [ ] `CLAUDE.md` line; [ ] state in the result whether the nav indicator was adopted and why/why not; [ ] list the token mirror follow-up for the brand repo.

## Result File
`docs/Results/clockwork-ds-1-foundry-design-proof-of-concept.md`

## Completion Report
1. Summary. 2. Pre-flight findings. 3. Files changed. 4. Files not changed and why. 5. Documentation changes. 6. Behavior impact (visual only). 7. Gate results for the nav indicator (adopted / not adopted, evidence, browsers tested). 8. Verification (commands, contrast ratios, checklist lines). 9. Review outcome. 10. Out-of-scope items. 11. Suggested follow-ups (including brand-repo token mirror and V-D2 status).
