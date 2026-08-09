# Phase 3f — Hero Spacing Refinement — Completion Report

**Project:** Clockwork Otter Foundry Website
**Phase:** 3f (Home page hero, spacing only)
**Date:** 2026-08-09

---

## 1. Summary

Reduced the Home page hero's vertical whitespace by cutting the section's top/bottom padding and un-flattening the uniform child gap so the logo-to-headline spacing could shrink independently of the other two gaps. Content (logo size, headline/description/button text and sizing, horizontal composition) is untouched — this was a padding/gap-only change, run in this repo per the prompt's note that once the repo split has landed, work continues here rather than in `clockwork-otter-brand/website/`.

Before this phase, this session first pulled a second update from `clockwork-otter-brand/website/` — the `Phase-3f-Hero-Spacing.md` prompt itself, which had been added there after Migrate-1 completed. Confirmed via `diff -bq` against every file in `src/`, `public/`, and `docs/Results/` that nothing else had drifted (all other apparent differences were CRLF/LF line-ending noise from the source repo's own uncommitted working tree, not real content changes) — so this phase's own change is the only thing pulled forward besides the prompt file itself.

## 2. Final padding/gap values and the math

**Section padding:** `py-24 sm:py-32` (96px/128px, responsive) → `pt-4 pb-8` (16px top / 32px bottom, same at every breakpoint).

**Child spacing:** the flex container's uniform `gap-6` (24px between every child) was removed and replaced with per-child `margin-top`:
- Logo → headline: `mt-4` on the `<h1>` (16px, tightened from 24px)
- Headline → description: `mt-6` on the `<p>` (24px, unchanged)
- Description → button: `mt-6` on a wrapper `<div>` around `<Button>` (24px, unchanged — `Button.astro` itself is out of scope and its `Props` type doesn't accept a `class` prop, so the margin had to go on a wrapper rather than the component)

**Top vs. bottom reduction (scope items 1–2):** top padding dropped 128px → 16px (a 112px / 87.5% reduction); bottom padding dropped 128px → 32px (a 96px / 75% reduction). Top is reduced by more than bottom, and the two are not symmetric, per spec.

**Math for the 650–700px target (scope item 4):**

Token values used, read directly from `06-design-tokens.md`/`05-typography.md` via `src/styles/tokens.css` and `global.css` (not guessed):
- `--header-height: 72px` (fixed)
- `.text-display`: `--text-4xl` = 3rem = 48px, `--line-height-tight` = 1.2 → 57.6px per line
- `.text-body-large`: `--text-lg` = 1.125rem = 18px, `--line-height-reading` = 1.6 → 28.8px per line
- Logo: intrinsic 224×281px; rendered at `sm:w-56` = 14rem = 224px width with `h-auto`, i.e. rendered at its native 224×281 with no scaling at the 1440px viewport this phase targets
- Button: `py-3` (12px × 2 = 24px) + `text-sm` (14px, inheriting the body's `--line-height-reading` 1.6 since neither Tailwind's default nor the token system pairs a line-height with `text-sm`) → 14 × 1.6 = 22.4px text line height → ≈46.4px total

Headline and description line-wrap counts (needed to know how many line-heights to sum) can't be read from a token file — they depend on actual glyph metrics. I estimated them from character count and typical average-advance-width for each typeface family, then sanity-checked against each container's max-width:
- Headline, "Crafted with precision. Designed for creativity." (48 characters) in Bebas Neue (condensed) at 48px, avg. advance ≈0.52em/char ≈25px/char → ≈1200px unwrapped, well over the `max-w-3xl` (768px) container. It wraps at the natural sentence break: "Crafted with precision." (23 chars, ≈575px) / "Designed for creativity." (25 chars, ≈625px) — both comfortably under 768px, so **2 lines**, high confidence.
- Description placeholder, "[Placeholder — one-sentence description of Clockwork Otter Foundry]" (67 characters) in the regular body typeface at 18px, avg. advance ≈0.5em/char ≈9px/char → ≈603px, under the `max-w-2xl` (672px) container → **1 line**, lower confidence (603px is close enough to the 672px ceiling that real glyph metrics could push it to 2 lines).

Content sum:
```
logo                          281.0px
mt-4 + headline (2 lines)      16.0 + 115.2 = 131.2px
mt-6 + description (1 line)    24.0 +  28.8 =  52.8px
mt-6 + button                  24.0 +  46.4 =  70.4px
                                              --------
content total                                535.4px

+ section padding (16 + 32)                    48.0px
                                              --------
hero total                                   583.4px

+ header (fixed)                               72.0px
                                              --------
combined header + hero                       655.4px
```

**655.4px, within the 650–700px target**, with ~5px of margin above the floor and ~45px below the ceiling — enough headroom to absorb the description-wrap uncertainty above (if it actually wraps to 2 lines, add one more 28.8px line: 684.2px, still inside the range).

## 3. Viewport-height-driven question (Project Context)

Confirmed there was **no viewport-height mechanism to remove** — the hero `<section>` has no `min-h-screen`, `100vh`, or flex-grow sizing of its own. `BaseLayout.astro`'s `flex min-h-screen flex-col` / `<main class="flex-1">` sticky-footer pattern was left untouched, as instructed; it governs the *page*, not the hero. The hero's height was already purely a function of its own padding and content — "make it content-driven" was already true structurally. This phase was, as the prompt itself anticipated as the likely case, a pure padding/gap reduction, not a structural fix.

## 4. Files changed

- `src/pages/index.astro` — hero section only (padding classes, gap → per-child margins, `Button` wrapped in a `div` to carry its margin)

Everything else in the file (introductory content, product overview, closing CTA sections) is untouched.

## 5. Verification results

```
$ npx astro check
Result (15 files): 0 errors, 0 warnings, 0 hints

$ npx astro build
[build] 8 page(s) built in 3.78s
[build] Complete!
```

Both clean.

**Measured vs. calculated:** I attempted a live-browser measurement first, per the prompt's preference. Headless Chromium (Playwright, already cached locally) failed to launch — missing shared libraries (`libnspr4.so`, `libnss3.so`, `libnssutil3.so`, `libasound.so.2`) not present in this sandboxed environment. I flagged this to the user and, with their approval, they attempted `sudo apt-get install` for the missing packages three times from their own terminal; most of the requested libraries (libatk, libcairo, libpango, libgbm, libx11-family) did land, but the four Chromium actually needs did not (confirmed via `dpkg -l` and `ldd` after each attempt) — likely a copy/paste or session-boundary issue rather than a real blocker, but not one we resolved in the time available. **Falling back to the calculated verification** the prompt explicitly permits for this case (Section 2 above), clearly labeled as calculated, not measured. Recommend a quick visual/DevTools check once this deploys, specifically to confirm the description renders on 1 line as estimated — that's the one input in the calculation with real uncertainty.

## 6. Review outcome

Ran one Codex review (`codex exec --skip-git-repo-check`) of the full changed file. Codex's own sandbox is also read-only (same `.astro/content.d.ts` write restriction as this session hit initially), so it validated Astro syntax via an in-memory compiler parse instead of a full `astro check` — parsed cleanly. **No concrete failure findings.** It confirmed the changed classes are valid, referenced CSS variables/classes exist, the logo asset path resolves, and no supported-breakpoint layout break was evident from the spacing change. Nothing to fix.

## 7. Out-of-scope items discovered

- `Button.astro`'s `Props` interface doesn't accept a `class` prop, which is why the description→button gap had to be implemented as a margin on a wrapping `<div>` rather than directly on `<Button>`. Not a bug — `Button.astro` is explicitly out of scope for this phase — but worth knowing if a future phase wants `Button` to accept passthrough classes directly.
- The section's padding is no longer responsive (`pt-4 pb-8` at every breakpoint, replacing the old `py-24 sm:py-32` two-tier scale). This wasn't explicitly requested — the prompt's target was specifically the 1440×900 desktop measurement — but there was no scope rationale to keep a separate, larger mobile-only padding once the desktop value dropped this far, and scope item's "vertical spacing only" restriction covers this. Flagging in case the design system's `07-layout-system.md` has an unstated expectation about breakpoint-scaled hero padding that should be revisited.

## 8. Suggested follow-up tasks

- Visual/DevTools confirmation of the actual header+hero pixel height and the description's line count, once a live browser or deployed preview is available — to close the measured-vs-calculated gap noted in Section 5.
- Investigate why the missing Playwright/Chromium shared libraries (`libnspr4`, `libnss3`, `libnssutil3`, `libasound2`) didn't take across three `sudo apt-get install` attempts from the user's terminal in this session — worth resolving before the next phase that might benefit from live-browser verification, so it isn't a repeated blocker.
