# Validator-Link-2 — Completion Report

**Project:** Clockwork Otter Foundry Website
**Phase:** Validator-Link-2 (ad hoc)
**Date:** 2026-09-01

---

## 1. Summary

Added a second, lower-emphasis call-to-action next to the existing "Explore Antiphon"
button in the homepage's dedicated Antiphon section ("Antiphon Home Page Introduction") —
"Try the free validator", linking to `https://validator.clockworkotterfoundry.com`. This
gives a homepage visitor a low-commitment, immediate-value action alongside the
higher-commitment "learn about the product" CTA.

Per the prompt's already-made design decision, the new button uses `variant="secondary"`
(outline style) so the two buttons form a real hierarchy — primary = learn about the
product, secondary = try the free tool now — rather than two equal-weight buttons
competing. It reuses the `target` / `rel` pass-through props `Button.astro` already gained
in `CLOCKWORK-VALIDATOR-LINK-1`; no component change was needed.

The hero section and both existing `variant="primary"` "Explore Antiphon" buttons were not
touched.

## 2. Files changed

**Updated:**

- `src/pages/index.astro` — in the "Antiphon Home Page Introduction" section only, wrapped
  the existing single-button `<div class="mt-6">` into a flex row containing the unchanged
  primary "Explore Antiphon" button plus the new secondary validator button
  (`target="_blank" rel="noopener noreferrer"`, copy "Try the free validator" — matching
  the `/antiphon/` precedent).

No other file changed. (`git status` also shows `src/components/Button.astro` and
`src/pages/antiphon.astro` as modified — those are the still-uncommitted changes from
`CLOCKWORK-VALIDATOR-LINK-1`, not this phase; this phase touched only `index.astro`.)

## 3. Layout decision

The button container went from `<div class="mt-6">` to:

```
<div class="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
```

- **Narrow viewports (< 640px):** `flex-col items-start` stacks the two buttons vertically,
  each at its natural content width (not stretched full-bleed), left-aligned — visually
  identical in feel to how the single button read before. `gap-4` provides vertical
  separation. No horizontal overflow: each button is `inline-flex` with `px-6` and short
  labels, well within a narrow column.
- **`sm:` and up:** `sm:flex-row sm:items-center` places them side by side, vertically
  centered, separated by the same `gap-4`.

This matches the codebase's established stack-then-row idiom — `Footer.astro` uses
`flex flex-col gap-6 ... sm:flex-row sm:items-center` for the same purpose. No new layout
utility or pattern was introduced.

**Responsive confirmation:** verified by Tailwind class reasoning and by inspecting the
compiled `dist/index.html` (below), not a live browser — this environment has the
project's known Chromium / `astro preview` binding gap (documented in `Phase-3n` /
`Phase-3f` results). The class set is a standard, well-understood responsive flex pattern
already proven elsewhere in this repo, so class reasoning is sufficient here.

## 4. Verification results

```bash
npm run build
```

Result: exit 0 — "7 page(s) built in 6.96s", no errors or warnings.

Compiled `dist/index.html` checks:

- New link present exactly once:
  `grep -c 'validator.clockworkotterfoundry.com' dist/index.html` → `1`.
- Compiled anchor:
  `href="https://validator.clockworkotterfoundry.com" target="_blank" rel="noopener noreferrer"`
  with the **secondary** variant classes (`border-[...] bg-transparent
  text-[var(--button-secondary-text)] hover:bg-[var(--button-secondary-background-hover)]
  ...`) — confirmed it is the outline style, not primary.
- Both buttons sit inside the new flex container: the compiled markup shows
  `...sm:flex-row sm:items-center"><a href="/antiphon/" ...>Explore Antiphon</a><a
  href="https://validator.clockworkotterfoundry.com" ...>Try the free validator</a>`.
- "Explore Antiphon" still appears twice, both with `btn-primary` /
  `bg-[var(--button-primary-background)]` classes — neither changed variant.
- **Hero unchanged:** the first "Explore Antiphon" anchor is immediately followed by
  `</a></div></div></section>` — no sibling button was added to the hero, and the hero
  section markup is otherwise untouched.

`git status`: the only change attributable to this phase is `src/pages/index.astro`. No
commit or push was made.

## 5. Out-of-scope items discovered

None. `Button.astro` needed no changes — `variant`, `target`, and `rel` from the prior
phase covered everything. No documentation describes the homepage's CTA content
(`docs/current/` does not exist in this repo), so no doc update was needed.

## 6. Suggested follow-up tasks

- **Commit the Validator-Link-1 + Validator-Link-2 changes together** — `Button.astro` and
  `antiphon.astro` (Link-1) remain uncommitted in the working tree alongside this phase's
  `index.astro` change; they're a natural single commit.
- **Live cross-browser check of the two-button row** once the environment's
  Chromium/`astro preview` gap is resolved — confirm the stack→row transition and focus
  order at real viewport widths.
- **Remaining `CLOCKWORK-IMPECCABLE-AUDIT-1` C5 items** (spec link, code sample on
  `/antiphon/`) — still open, still gated on the Antiphon SDK and its docs shipping.
