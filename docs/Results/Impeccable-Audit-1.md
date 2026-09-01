# Impeccable Audit-1 — Evaluate-Only Trial Run — Completion Report

**Project:** Clockwork Otter Foundry Website
**Phase:** Impeccable-Audit-1 (ad hoc, not part of the numbered Phase sequence)
**Date:** 2026-08-31
**Prompt:** `docs/Prompts/Impeccable-Audit-1.md` (`CLOCKWORK-IMPECCABLE-AUDIT-1`)

---

## 1. Summary

**What was run:** the `impeccable` skill (third-party plugin `impeccable` v4.1.2, `github.com/pbakaus/impeccable`) was loaded from a Claude Code session at this repo's root. Its Setup script (`scripts/context.mjs`) ran once, then its two Evaluate-category commands — `critique` (UX heuristic review) and `audit` (technical a11y / performance / responsive / theming / implementation-integrity) — were executed **evaluate-only**. No other `impeccable` command was run. The design detector hook was **not** installed.

**Target used:** the built site (`npm run build` → `dist/`, git-ignored, deleted after), served locally and driven with **Playwright / headless Chromium across all seven pages at desktop (1280×900) and mobile (390×844)**, cross-checked against live `https://clockworkotterfoundry.com`. This run was done **after the user enabled Playwright and installed the detector's missing `htmlparser2` dependency**, so — unlike the first pass recorded in this file's earlier revision — the deterministic detector ran in full (non-degraded) mode and real browser evidence was collected: screenshots, computed-style contrast, focus-indicator colors, touch-target geometry, horizontal-overflow checks, mobile-menu keyboard behavior, and `impeccable`'s own in-page overlay detector (`window.impeccableScan()`).

> Environment note: headless Chromium was missing OS libraries (`libnspr4`, `libnss3`, `libnssutil3`, `libasound2`) and `sudo` was unavailable. Worked around without touching the system by `apt-get download`-ing those four packages into the scratchpad, `dpkg -x`-ing them, and pointing `LD_LIBRARY_PATH` at the extracted libs. `htmlparser2` and `playwright` were installed with `npm install --no-save` (node_modules only — `package.json` and `package-lock.json` are byte-identical before/after; confirmed in §6).

**Coverage:** Home (`/`), Antiphon (`/antiphon/`), About (`/about/`), Contact (`/contact/`), Privacy (`/privacy/`), Terms (`/terms/`), 404.

**Overall read on the tool's output quality:**

- With the detector fully working, the **CLI detector** produced one repeated design-system-frozen finding (`overused-font` on Inter/Montserrat, 16 hits) plus **one genuinely useful new finding** (`cramped-padding` on the home hero section).
- The **in-browser overlay detector** (`impeccableScan()`) surfaced a real, consistent typographic observation (`line-length ~95 chars/line` on every content page) and **one false positive** (`gradient-text` — there is no `background-clip: text` or gradient anywhere in the source or built CSS).
- The **structured heuristic/dimension review** remains the highest-value part: it correctly reads this as a small, deliberately restrained brochure site, and the browser pass let it *confirm* three items that were only inferable from source before and *find two new real ones* (a focus-contrast gap on the logo link; an undersized contact CTA).
- The tool did **not** hallucinate a redesign or propose any brand/token change on its own initiative in evaluate-only mode. It did want to (a) persist a snapshot into `.impeccable/critique/` (not git-ignored) and (b) close with an interactive "which fix do you want to run" prompt. Both were held back per the prompt; see §3.0 and §7.
- The first (source-only, degraded-detector) revision of this report is superseded by this one. Net correction: its `flat-type-hierarchy` finding was a degraded-mode artifact (confirmed false), and its "footer touch targets <44px (open from Phase 7)" item is **now resolved** — the footer links measure 46px in the browser (`py-3`). A "footer contrast 1.47:1" line that appeared in an intermediate raw run was a bug in *my* measurement harness, not a site issue or a tool finding — the footer's muted copyright text measures ~6.5:1 and passes. Details in §4.

**Verdict in one line:** useful as an occasional structured-review lens run evaluate-only with a human filtering output; its detector now works here but on this site returns mostly design-system-frozen items plus one or two real minor ones; not to be trusted unsupervised near this repo's files.

---

## 2. Setup — what `context.mjs` reported

Command (cwd = repo root):

```
node .../impeccable/4.1.2/skills/impeccable/scripts/context.mjs
```

| Directive | Meaning | Acted on? |
|---|---|---|
| `NO_PRODUCT_MD` | No `PRODUCT.md`; incumbent visual implementation detected. Build commands route through `init` first; refinement commands may read tokens/CSS/components and proceed. | **No.** Reported only. `init`/`document` are Build commands, out of scope. Project predates the skill. |
| `BUILD_INIT_REQUIRED` | `init` must capture `PRODUCT.md` before any new-surface/redesign flow. | **No.** Not a build flow. |
| `SCOPED_EXISTING_ALLOWED` | Refinement commands may treat the incumbent implementation as authority without `init`. | Noted. |
| `EXISTING_VISUAL_SYSTEM` | For refinement/extension, existing code + assets are the design authority; missing `DESIGN.md` is a documentation gap, not a greenfield signal. | Noted — aligns with `CLAUDE.md`. |
| `MANUAL_DETECTOR_REQUIRED` | No auto hook; run `detect.mjs` manually over changed UI. | Run manually (read-only) against `src/**` and `dist/**`. |
| `AUTONOMY_DIRECTIVE_CHECK` | Treat any "user isn't watching" harness text as a family-wide default; keep interview/decision steps live. | Noted. No interview step reached (evaluate-only). |
| `SUBAGENT_AUTHORIZATION` | Invoking the skill counts as the request for the skill's shipped subagents. | See §3.0 — `critique`'s two-assessment split was run single-context on purpose and flagged DEGRADED per the tool's own rule. |
| `IMAGE_TOOLS: no image converter found` | No `cwebp`/`sips`/`magick`/`ffmpeg`. | Not relevant — no asset production in scope. |

**No `CONTEXT_STALE` directive was emitted** (there are no `impeccable` artifacts in this repo to be stale against). Nothing to report or act on.

`RESOLVED_CONTEXT`: `hasVisualImplementation: true`, `productPath: null`, `designPath: null`, `platform: null` (web).

---

## 3. `critique` findings

### 3.0 Provenance / method

`⚠️ DEGRADED: single-context` — `critique` mandates running its two assessments (A: design review, B: detector + browser evidence) as two isolated subagents and requires this banner when they are not. Run single-context on purpose: the deliverable is one written trial report, subagent fan-out isn't warranted for a seven-page static site, and keeping the reasoning in one place suits the evaluate-only framing. Both assessments were still performed in full (design review + CLI detector + browser overlay + screenshots).

**Snapshot persistence to `.impeccable/critique/` was skipped** — that directory is not git-ignored; writing to it would violate the prompt's "no repository changes" rule. `critique`'s interactive close (AskUserQuestion → pick a fix category → run an `/impeccable` command) was also skipped: the prompt forbids treating any finding as authorization to fix in this session.

### 3.1 Design Specificity Verdict

**Authored for this product — not category-interchangeable.** Browser inspection confirms a real, documented brand system in the shipped output: a custom token layer (`--color-brand-charcoal #2b2b2b`, `--color-brand-copper #b87333`, `--color-brand-steel #4f6d8a`) with Tailwind's default palette/type/radius scales reset to `initial`; Bebas Neue used only for the hero display line; Montserrat headings; a low-opacity (4%) copper otter-mark watermark bleeding off the right edge between home-page sections (visible in the captured screenshot); and the "Creativity is the goal. Software is the craft." motto carried across Home and About. Nothing reads as generic scaffold output.

### 3.2 Design Health Score (Nielsen's 10 Heuristics)

Surface mode: **Persuade** (Home, Antiphon) with **Read** sub-surfaces (Privacy, Terms). Heuristics 7 and 10 are `n/a` per the tool's mode-applicability rule — a static brochure site with no power-user task flow and (by explicit product decision) no product documentation yet.

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Nav active state solid (`aria-current="page"` + copper underline, confirmed in DOM and screenshot); link hover feedback present. No skip-to-content affordance. Nothing async. |
| 2 | Match System / Real World | 4 | Plain language throughout ("Get in Touch", "About the Foundry"). Developer terms (".NET APIs", "Java sidecars", "e-invoicing") are audience-appropriate. |
| 3 | User Control and Freedom | 3 | No traps, no modals, logo→home everywhere, 404 has "Return Home", browser back works. **Mobile menu does not close on `Esc`** (browser-confirmed: `aria-expanded` stays `"true"` after Escape). |
| 4 | Consistency and Standards | 3 | Shared `BaseLayout`/`Navigation`/`Footer`/`Button`; one token system. **But the Phase-7 focus-outline fix was applied to `.nav-link`/`.footer-link`/`.nav-toggle` and not to the logo link in the same component** (C8) — an inconsistency in the same file. |
| 5 | Error Prevention | 4 | Almost no error surface — no forms, `mailto:` only. |
| 6 | Recognition Rather Than Recall | 4 | All nav text-labelled; hamburger has `aria-label`; four-item IA. |
| 7 | Flexibility and Efficiency | n/a | No repeat/expert task on a seven-page brochure site. |
| 8 | Aesthetic and Minimalist Design | 4 | The site's strongest axis — restrained, spacious, one primary action per section; matches the documented "precision workshop" aesthetic. |
| 9 | Error Recovery | 3 | 404 is plain-language and actionable. No site search as an alternative recovery path. |
| 10 | Help and Documentation | n/a | Product docs deliberately not built yet ("Additional details and documentation coming soon." on Antiphon). Noted under Minor Observations, not scored. |
| **Total** | | **28/32** | **Good (88%)** |

(One point lower than the first-pass estimate: H4 drops 4→3 now that C8 is a confirmed same-file inconsistency rather than a hypothetical.)

First run for this target — no trend. (Snapshot intentionally not persisted, so `impeccable`'s own trend file will not show this run.)

### 3.3 Categorized findings

Key per prompt Scope item 4: **(a)** command · **(b)** UX-heuristic vs technical · **(c)** fits existing tokens vs needs a design-system change · **(d)** real vs generic.

| # | Finding | (a) | (b) | (c) | (d) Assessment |
|---|---|---|---|---|---|
| **C8** | **Logo / home-link focus indicator fails non-text contrast.** The `<a href="/">` wrapping the header logo has no `.nav-link` class, so on keyboard focus it falls back to the global `:focus-visible` outline (`--color-action-primary`, copper `#9c622b`). **Browser-measured computed `outline-color` = `rgb(156, 98, 43)` against the `#2b2b2b` charcoal header = 2.83:1** — below the 3:1 minimum. Phase 7 fixed exactly this for the *text* links in the same file but not the logo link. | critique + audit (A11y) | Technical / a11y — **WCAG 2.2 SC 1.4.11 Non-text Contrast (AA)** | **Fits.** Add the logo link to the existing `.nav-link, .nav-toggle:focus-visible` rule (or give it its own), reusing `--navigation-hover` (5.27:1 on charcoal, already in `tokens.css`). No new token. | **Real, new, highest-value finding of the run.** Deterministic, browser-verified, same defect class Phase 7 documented — one element was missed. |
| **C9** | **Contact-page email CTA is an undersized tap target.** The `info@clockworkotterfoundry.com` link is its own line, `font-medium`, **zero padding — browser-measured 258 × 20 px** (`padding-top/bottom: 0`). It is the contact page's single call to action, not an inline-in-prose link, so the inline exception doesn't apply. | critique + audit (Responsive/A11y) | Technical / target size — **WCAG 2.2 SC 2.5.8 Target Size (Minimum) (AA)** wants ≥ 24×24; the ~44px convention is the stronger bar | **Fits.** Add `inline-block py-2`/`py-3` (or make it a `Button` secondary) — spacing utilities only. | **Real, new.** The same link also appears inline inside Privacy (×2) and Terms (×1) body paragraphs — those are genuinely inline-in-sentence and exempt; only the Contact instance matters. |
| C1 | **No "skip to content" / bypass-blocks link.** Keyboard/SR users tab the logo + 4 nav links on every page before reaching `<main>`. | critique + audit (A11y) | Technical / a11y — **WCAG 2.4.1 Bypass Blocks (Level A)** | **Fits.** Visually-hidden `<a href="#main">` in `BaseLayout.astro`; `id="main"` on the existing `<main>`; focus style from existing tokens. | **Real.** Not called out by name in Phase 7 (which passed nav on the no-traps criterion). Smallest real a11y gap. |
| C2 | **Homepage `<title>` and `og:title` render doubled:** `Clockwork Otter Foundry · Clockwork Otter Foundry`. `index.astro` passes `title="Clockwork Otter Foundry"` and `BaseLayout` appends `· Clockwork Otter Foundry`. | critique | Technical / SEO + consistency | **Fits.** Code-only (special-case the home title, or pass a section title). | **Real.** Confirmed in built `dist/index.html` `<title>` and `og:title`. Minor; regression against Phase 6 SEO intent. |
| C3 | **Mobile menu: no `Esc` to close, no focus management.** Toggle sets `aria-expanded` correctly, but `Esc` doesn't close the panel and focus is not moved into or restored from it. | critique | UX-heuristic (H3) + a11y | **Fits.** A few lines in the existing inline `<script>` in `Navigation.astro`. | **Real, low-impact — now browser-confirmed.** Menu has 4 links, the toggle keeps focus (so `Enter` re-closes) and every navigation is a full page load that resets state, so practical cost is small. Polish, not a blocker. |
| C10 | **Hero section top padding is cramped.** `dist/index.html` hero `<section class="px-6 pt-4 pb-8">` on the full-bleed charcoal band — 16px between the nav divider and the logo. Flagged by the detector's `cramped-padding` rule; visible in the desktop screenshot. | audit (detector) | Quality / spacing | **Fits.** Bump `pt-4` → `pt-8`/`pt-12` on the hero only — spacing utility. | **Real, minor.** Genuine detector value (this rule only runs with the full HTML parser, which the first pass lacked). Low severity — it reads as slightly tight, not broken. |
| C5 | **Antiphon page is a dead end for an evaluating developer.** "Additional details and documentation coming soon." — no code sample, spec link, or "notify me". | critique (persona: "Riley") | UX-heuristic / content | Content-wise fits, but adding product claims is a **user copy decision** (see `CLAUDE.md` copy-origin rule), not a design task. | **Real but intentional / out of current scope.** Known product-stage fact. |
| C6 | **No `prefers-reduced-motion` handling.** | critique + audit (A11y) | Technical / a11y | Fits — a media query. | **Real but already adjudicated in Phase 7:** the only motion is 150ms `transition-colors` hover fades and an instant (no-transition) menu toggle — not what SC 2.3.3 targets. Re-raised as if new. |
| C7 | **No site search** (affects H9). | critique | UX-heuristic | N/A at seven pages. | **Generic.** Boilerplate; not actionable or desirable at this size. Noise. |

### 3.4 Persona red flags

- **Sam (accessibility-dependent):** C8 (logo focus contrast) and C1 (no skip link) are the real ones. Body-text and heading contrast all pass (browser-measured, §4). C3 is a minor secondary.
- **Riley (stress tester / evaluating dev):** C5 — Antiphon page terminates with no next step.
- **Casey (distracted mobile):** C9 (email CTA tap target) and C3 (menu ergonomics). No horizontal scroll at 390px (verified); watermark correctly hidden below 768px (verified); mobile toggle is exactly 44×44 (verified).

### 3.5 Minor observations

- Home `<title>` doubling (C2) also shows in the browser tab.
- `@fontsource/jetbrains-mono/400.css` is imported in `global.css` but no live page renders `code`/`pre`/`kbd`/`samp`. Deliberate per the file's own comment; ~3KB woff2 currently unused on the wire.
- Heading hierarchy is strong, not flat (browser-measured: Bebas display 48px → `h1` 32px → `h2` 24px → body 16px). This directly refutes the first pass's degraded-mode `flat-type-hierarchy` finding.
- The `impeccable` overlay injected and rendered visibly in the page (orange banner, top of viewport) on every page — the `critique` "visual overlay" deliverable works here.

---

## 4. `audit` findings

### 4.1 Audit Health Score

| # | Dimension | Score | Key Finding |
|---|-----------|-------|-------------|
| 1 | Accessibility | 3 | One AA non-text-contrast failure (C8, logo focus outline 2.83:1, browser-confirmed); plus C1 (2.4.1 A) and C9 (2.5.8 AA target size). Body/heading/link/eyebrow text contrast **all pass** (browser-measured across 7 pages — zero failures). |
| 2 | Performance | 4 | Zero shipped JS except one small inline nav script; fonts self-hosted and subset to loaded weights; SVG logos; fully static; no layout thrash. Only nit: one unused font import. |
| 3 | Responsive Design | 4 | No horizontal overflow at 390px or 1280px on any page (measured); `md:` breakpoints; watermark suppressed <768px; mobile nav works; toggle 44×44 exactly. Email CTA height is the one soft spot (counted under A11y as C9). |
| 4 | Theming | 4 | Full custom token system; Tailwind default scales reset to `initial`; `color-scheme: light` explicit; single-look commit (no dark mode) is a documented decision. Computed styles confirm tokens resolve correctly. |
| 5 | Implementation Integrity | 4 | Coherent, product-specific; decisions documented inline and in `docs/Results/`. Source-level detector run: clean (exit 0). |
| **Total** | | **19/20** | **Excellent** |

### 4.2 Implementation Integrity Verdict

**Pass.** The shipped output expresses a coherent, product-specific system: one token file as the single source of truth, shared layout/nav/footer/button components, no duplicated markup, contrast decisions carrying their computed ratios in comments. `detect.mjs` against `src/pages src/components src/layouts` returned empty (exit 0).

### 4.3 Deterministic detector output (Assessment B) — full, non-degraded

`detect.mjs` (HTML parser now available):

```
node .../detect.mjs --json src/pages src/components src/layouts   → []           (exit 0, clean)
node .../detect.mjs --json dist                                   → 17 findings  (exit 2)
```

The 17 `dist` findings:

| Rule | Count | Where | (c) | (d) Assessment |
|---|---|---|---|---|
| `overused-font` (Inter) | 8 | one per page HTML + the compiled CSS | **Design-system conflict** — Inter is the brand body face (`05-typography.md`). Frozen. | **Real observation, not actionable here.** The face *is* common; the choice is authoritative. No action. See §5. |
| `overused-font` (Montserrat) | 8 | same | **Design-system conflict** — brand heading face. Frozen. | Same as above. See §5. |
| `cramped-padding` | 1 | `dist/index.html` hero `<section> "px-6"` | **Fits** — bump `pt-4` on the hero. | **Real, minor (C10).** Genuine value from the now-working parser. |

**The first pass's `flat-type-hierarchy` finding did not reappear** with the real parser — confirmed as a degraded-mode (regex-only) artifact.

### 4.4 In-browser overlay detector (`impeccableScan()`)

Injected `http://localhost:PORT/detect.js` (407 KB, served by the skill's `live-server.mjs`) into every page in Chromium and read the results:

| Rule | Where | (c) | (d) Assessment |
|---|---|---|---|
| `line-length` — "~95 chars/line (aim for <80)" | Every content-heavy page, once per wide paragraph (Home 5, Antiphon 3, About 4, Contact 2, Privacy 31, Terms 19) | **Design-system-adjacent** — driven by `--reading-max-width: 760px`, a documented token ("within the 700–800px range in `07-layout-system.md`"). Tightening it is a token change. | **Real and consistent.** 95 chars/line is on the long side of comfortable (ideal ~66–80). Legitimate typographic observation; see §5. |
| `gradient-text` — "background-clip: text + gradient" | Antiphon, 404, Home (mobile) — inconsistent | N/A | **False positive.** `grep` of the source and the compiled CSS finds no `background-clip: text`, no `-webkit-background-clip`, and no `gradient(...)` anywhere. Detector heuristic misfire. Discard. |
| `overused-font` — "Primary font: inter (88% of text)" | DOM-level, intermittent | Design-system conflict (as CLI) | Same frozen-typeface item. |

> A raw intermediate run of my own measurement harness printed a "footer copyright 1.47:1 contrast FAIL" line on every page. **That was a bug in my harness** (it parsed the `color(srgb 0 0 0 / a)` float syntax as 0–255 integers). Re-run with a corrected parser: **zero contrast failures on any page**, and the footer's muted copyright text (`--footer-text-muted`, Foundry Paper at 65% alpha over charcoal) measures **~6.5:1**. Not a site issue and not an `impeccable` finding — recorded here only so the intermediate artifact isn't mistaken for one.

### 4.5 Cross-check against prior known findings (Phase 7, `CLOCKWORK-P3M`)

| Prior finding | Status coming in | Re-surfaced? | Browser check this run |
|---|---|---|---|
| `--navigation-hover` text contrast on charcoal (fixed to 5.27:1) | Fixed Phase 7 | No | Not re-flagged; nav/footer link hover text passes. |
| `--button-secondary-text/-border` contrast (fixed to 5.69:1 / 4.99:1 hover) | Fixed Phase 7 | No | Not re-flagged. |
| Nav/footer **link** focus outline fell back to copper (fixed to `--navigation-hover`) | Fixed Phase 7 | **Partially — C8** | `.nav-link`/`.footer-link` outlines measure the light-steel color and pass. **The logo `<a>` in the same file still measures copper `rgb(156,98,43)` = 2.83:1 — the fix skipped it.** |
| Primary-button focus halo (two-tone) | Fixed Phase 7 | No | Confirmed: `box-shadow: 0 0 0 2px #fff, 0 0 0 4px <ring>`, `outline: none`. Outer ring white on the charcoal hero, charcoal on light sections — as designed. |
| Footer touch targets ~38px (<44px), logged as accepted follow-up in Phase 7 §9 | Was open | **Resolved since** | Browser-measured **46 px** (`px-2 py-3`). No longer a finding. (The first pass of this report wrongly listed it as still open.) |
| `prefers-reduced-motion` deliberately not guarded | Adjudicated non-action | **Yes — C6** | Re-raised as if new; still a documented deliberate decision. |
| `CLOCKWORK-P3M` contrast pass | Fixed pre-Phase-7 | No | All text contrast passes in-browser. |

**Net:** the detector found **one genuinely new implementation item (C10, hero padding)**. The `critique` heuristic + browser review found **two genuinely new a11y items (C8 logo focus contrast, C9 email CTA size)**, one of which (C8) is a real WCAG AA failure that prior passes missed by one selector. Everything else is design-system-frozen, already-known-and-resolved, already-adjudicated, or a false positive.

---

## 5. Design-system-conflicting findings (called out separately)

Per prompt Scope item 4(c) and the "Do not…" list — recorded only as a possible future design-system decision, **not a code change and not a recommendation of this run:**

| Finding | What "fixing" it would require | Disposition |
|---|---|---|
| `overused-font: Inter` (CLI ×8 + overlay) | Replacing the brand body typeface. | **Out of bounds.** `05-typography.md` is authoritative; `CLAUDE.md` forbids substituting fonts; this prompt forbids recording any such change. No action. |
| `overused-font: Montserrat` (CLI ×8) | Replacing the brand heading typeface. | **Out of bounds.** Same. No action. |
| `line-length ~95 chars/line` (overlay, all content pages) | Reducing `--reading-max-width` (currently `760px`) or switching the reading column to a `ch`-based measure. Both change a value defined in `06-design-tokens.md` / `07-layout-system.md`. | **Design-system decision, not a code fix.** The current width is explicitly sanctioned by the layout doc's 700–800px range. A real typographic case exists for tightening toward ~65–75ch, but that is the brand system's call, not this tool's or this session's. |
| detector "slop" framing of a restrained monochrome palette | Adding decorative color / effects. | **Out of bounds and contrary to the documented aesthetic** ("restrained… avoid decorative effects"). No action. |

No other finding needs a new token, color, font, radius, breakpoint, or pattern. C1, C2, C3, C8, C9, C10 all fit the existing token/spacing system as-is.

---

## 6. Verification results

**`git status --porcelain` before Setup:**

```
?? docs/Prompts/Impeccable-Audit-1.md
```

**`git status --porcelain` after Scope item 4** (after stopping the local server and deleting `dist/`, `.impeccable/`):

```
?? docs/Prompts/Impeccable-Audit-1.md
?? docs/Results/Impeccable-Audit-1.md
```

The only tracked-tree change is this Result file (per the prompt's Result File section). `package.json` is byte-identical before/after (`diff -q` clean); `package-lock.json` shows no diff (`git diff --stat` empty). `dist/`, `.astro/` are git-ignored. `node_modules/` (untracked) gained `htmlparser2` and `playwright` via `--no-save`, at the user's explicit request to enable these checks; nothing tracked references them. No system packages were installed (Chromium's OS libs were extracted into the scratchpad and loaded via `LD_LIBRARY_PATH`). No commit, no push.

**Target used and why:** local `dist/` build served over HTTP and driven with Playwright/headless Chromium (desktop + mobile), cross-checked against live `https://clockworkotterfoundry.com`. `astro preview`'s known port-binding issue was never hit — a plain static file server was used instead.

**Did the commands try to write files?** Not to source. `critique` specified writing a snapshot to `.impeccable/critique/` (not git-ignored) and closing with an interactive fix-planning question; both were withheld to honor the prompt (§3.0).

---

## 7. Recommendation

**Is there enough real signal for a scoped follow-up fix phase?** **Yes — a small one, and it now has one genuine WCAG AA item in it.**

Candidate findings for Wolfgang to scope into a bounded phase (this run does **not** scope or write that phase):

1. **C8 — logo/home-link focus indicator (WCAG 2.2 SC 1.4.11, AA).** Add the header logo `<a>` to `Navigation.astro`'s existing `.nav-link, .nav-toggle:focus-visible` rule (reuse `--navigation-hover`, already proven 5.27:1 on charcoal). One-line CSS change; completes the Phase 7 fix that missed this element. **Highest priority — it's an actual AA failure.**
2. **C1 — add a "skip to content" link (WCAG 2.4.1, Level A).** Visually-hidden `<a href="#main">` in `BaseLayout.astro` + `id="main"` on `<main>`.
3. **C9 — contact-page email CTA tap target (WCAG 2.2 SC 2.5.8, AA).** Give the standalone `mailto:` link real vertical padding (or render it via the `Button` secondary variant). Leave the inline Privacy/Terms instances alone — they're exempt.
4. **C2 — fix the doubled homepage `<title>` / `og:title`.** Code-only.
5. *(Optional, P3)* **C10 — bump the hero section's `pt-4` top padding.** Spacing utility on `index.astro` only.
6. *(Optional, P3)* **C3 — `Esc`-to-close + focus handling for the mobile menu.** A few lines in the existing inline script.

Explicitly **not** recommended for any follow-up:

- `overused-font` (Inter/Montserrat) and `line-length` / `--reading-max-width` — design-system-frozen; §5.
- `gradient-text` and `flat-type-hierarchy` — confirmed false positives.
- C5 (thin Antiphon page) — product-stage fact; content is the user's to originate.
- C6 (`prefers-reduced-motion`) — already adjudicated in Phase 7.
- C7 (site search) — not warranted at seven pages.
- Installing the `impeccable` hook, persisting `impeccable` snapshots into the tree, or running any Refine/Enhance/Fix `impeccable` command against this repo.

**Trial verdict on the tool itself (for Wolfgang's `LESSONS_LEARNED.md`):**

- **Useful as** an occasional external structured-review lens (Nielsen heuristics + a11y/perf/responsive/theming dimensions), run evaluate-only against a build or the live URL, with a human filtering output. On this run it did produce three real, previously-missed items (C8, C9, C10) — one of them a true WCAG AA failure — which is more than the first (degraded, source-only) pass could find.
- **Signal-to-noise on this site is modest:** of ~20 distinct detector/overlay hits, 16 are one design-system-frozen typeface finding, 1 is a confirmed false positive (`gradient-text`), 1 was a degraded-mode false positive (`flat-type-hierarchy`), and 2 are real minor items. The heuristic/persona review is where the useful findings came from.
- **Not trustworthy unsupervised near this repo's files.** Its Evaluate commands are built to flow directly into its file-editing commands and to persist state into the working tree; holding it to "report and stop" required overriding its own closing instructions. Its "slop" detector treats a deliberately restrained, brand-frozen palette and typeface as defects — directly against `CLAUDE.md`'s "the design system always wins".
- **Now functional in this environment** only because the user installed `htmlparser2` and Playwright and Chromium's OS libs were side-loaded. A stock checkout of this machine cannot run the detector's HTML-parsing path or the browser overlay.

---

## 8. Out-of-scope items discovered (flagged, not implemented)

- **C2 — doubled homepage `<title>`/`og:title`.** Real; deferred to a scoped phase.
- **C8 — logo-link focus contrast (WCAG AA).** Real; deferred. Completes an incomplete Phase 7 fix.
- **C9 — contact email CTA tap target.** Real; deferred.
- **C10 — hero `pt-4` cramped padding.** Minor; deferred.
- **Unused `@fontsource/jetbrains-mono/400.css` import** in `global.css` — ~3KB woff2 with no `code`/`pre` usage on any live page. Deliberate per the file's comment; noted for a future maintainer, not changed.
- **`impeccable` `critique` wants to write to `.impeccable/critique/`** (not git-ignored). If this project ever adopts the tool, add `.impeccable/` to `.gitignore` first.
- **`impeccable` plugin ships no bundled dependencies** — `detect.mjs` needs `htmlparser2` (+ `css-select`/`css-tree`/`domutils`, which happen to be transitive deps here) and the overlay needs a browser. Environment/tooling note for Wolfgang, outside this repo.
- **First revision of this report** (source-only, degraded detector) is superseded by this one; its `flat-type-hierarchy` finding and its "footer touch targets still open" item were both wrong and are corrected above.
- No changes to `../clockwork-otter-brand`, Wolfgang, or any sibling repo. No commit, no push.
