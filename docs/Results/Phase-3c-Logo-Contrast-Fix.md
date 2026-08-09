# Phase 3c — Logo Contrast Fix (White Frame Treatment): Completion Report

**Project:** Clockwork Otter Foundry Website
**Phase:** 3c (resolves 3b's open defect)
**Date:** 2026-08-09

---

## 1. Summary

Wrapped the logo in both the Nav (`src/components/Navigation.astro`) and Hero (`src/pages/index.astro`) in a white box with a thin copper border, resolving the WCAG contrast failure Phase 3b identified and explicitly declined to work around (black gear silhouette and wordmark measured 1.48:1 against Foundry Charcoal, below the 3:1 non-text minimum). The underlying SVG artwork was not touched — only a container was added around each `<Image>`. This is a user-directed fix (2026-08-09), not an executor-invented workaround, and per the phase prompt's own reasoning it does not repeat Phase 2's rejected white-card idea: that rejection targeted an asset defect (the old opaque PNG) that already had a real fix in flight; this targets a two-tone mark that reads correctly against the light background it was evidently designed for (White is one of `03-logo-system.md`'s listed preferred backgrounds).

## 2. Final Frame Styling Values

- **Background:** `var(--color-surface)` (`#ffffff`) — matches the doc's "White" preferred background exactly, no new token needed.
- **Border:** `var(--border-width-medium)` (2px) / `var(--color-brand-copper)` (`#b87333`) — used the suggested default. This repeats the existing precedent already active in the same component (`--navigation-divider` uses Copper at `--border-width-medium` as the header's bottom divider), so the frame reads as consistent with, not competing against, the nav's existing accent line. No deviation, no new token invented.
- **Radius:** `var(--radius-card)` (8px), same value at both Nav and Hero despite the large size difference between the two boxes (184×64 vs. up to 340×397) — kept identical deliberately so the two placements read as one visual treatment, per the phase's own instruction, rather than picking a differently-scaled radius per box.

No new entries were added to `tokens.css` — every value used (`--radius-card`, `--border-width-medium`, `--color-brand-copper`, `--color-surface`) already existed and was already in active use elsewhere in the codebase.

## 3. Nav Sizing Math

Header is `height: var(--header-height)` = 72px, with Tailwind's preflight (`@import "tailwindcss"` in `global.css`) applying `box-sizing: border-box` globally — confirmed by inspection, not assumed. The header also carries its own `border-b-[var(--border-width-medium)]` (2px). Under border-box sizing, that border is carried inside the 72px box, so the header's actual content height is **72 − 2 = 70px**.

The nav previously rendered the logo at 180×45 (Phase 3b's sizing). Fitting a padded, bordered box around that inside 70px doesn't work at the original size: minimum required padding (25% of the 45px graphic height = 11.25px, rounded up to 12) plus a 2px border on each side gives a box height of 45 + 24 + 4 = 73px — 3px taller than the available space.

Final numbers, solving for a box that both meets the 25%-clear-space minimum and leaves genuine margin (not just clears by touching the edges):

- **Logo:** 160×40 (same 4:1 aspect ratio as the source `viewBox="0 0 1000 250"`, scaled down from 180×45).
- **Clear-space minimum:** 25% × 40px height = 10px. **Padding used: 10px** — meets the minimum exactly, no more.
- **Border:** 2px (`--border-width-medium`) each side.
- **Box height:** 40 + (10×2) + (2×2) = **64px**.
- **Margin remaining:** 70 − 64 = 6px total, ≈3px top and bottom — real breathing room, not a hairline fit.
- **Box width:** 160 + 20 + 4 = 184px.

**Deviation flagged:** the 160px logo width is below `03-logo-system.md`'s 180px recommended minimum digital width, by 20px. This is a direct consequence of the fixed 72px nav height leaving no room for a padded, bordered frame at the original 180×45 size — the same fixed-height constraint Phase 3b's own nav sizing math was built around. Worth confirming with whoever owns the logo-system doc whether the 180px minimum is intended to apply to the bare logo or the logo-plus-frame footprint (184px, if so, actually exceeds it).

## 4. Files Changed

- `src/components/Navigation.astro` — wrapped the existing `<Image>` in a `<span>` frame (white background, copper border, radius-card); reduced logo render size from 180×45 to 160×40.
- `src/pages/index.astro` — wrapped the existing hero `<Image>` in the same frame treatment (`p-10 sm:p-14` for the 40px/56px breakpoint padding); logo size itself unchanged (160×201 mobile / 224×281 `sm:`+).
- `src/styles/tokens.css` — **not changed**; no new token was needed (see §2).

## 5. Documentation Changes

Updated the existing Phase 3b Standing Decision in `CLAUDE.md` (rather than adding a separate new entry, since it's a direct resolution of the same fact) to record: the fix now in place, the exact frame values, the Nav sizing numbers, and an explicit paragraph distinguishing this from the Phase 2 white-card rejection so the two decisions don't read as contradictory to a future session. Full text is in `CLAUDE.md`'s Standing Decisions section under "Logo contrast on Foundry Charcoal."

## 6. Contrast Verification Results

**Live browser check attempted first, per Scope item 4 — blocked, more restrictively than Phase 3b.** `npm run dev` was run and given 30+ seconds; it did not come up (`Dev server failed to start within 30s`, confirmed via the dev server's own JSON log and repeated `curl` returning connection-refused). This is a step down from Phase 3b's environment, which at least got the dev server listening (the blocker there was a missing shared library for the headless browser itself). No further environment changes were available to try from inside this session, so I fell back to the rasterize-and-measure technique, reusing Phase 3b's exact approach.

**Rasterize-and-measure (via `sharp`, same library used internally by Astro's own image pipeline):** built the actual frame (white rounded rect + copper stroke, matching the real CSS values) around each real SVG at true on-page pixel dimensions, composited onto a `#2b2b2b` page background matching real layout — Nav (184×64 box, 160×40 logo, 10px padding), Hero mobile (244×285 box, 160×201 logo, 40px padding), Hero desktop (340×397 box, 224×281 logo, 56px padding) — then visually inspected the output PNGs. In all three, the gear silhouette and the full wordmark are now crisp and fully legible; the copper border is clearly visible as a distinct line against both the white interior and the charcoal exterior.

**Quantified (WCAG 2.2 relative luminance/contrast on the exact hex values in use):**

| Check | Colors | Ratio |
|---|---|---|
| Black gear/wordmark vs. new white box background | `#000000` vs `#ffffff` | **21.00:1** (maximum possible; comfortably clears the 3:1 minimum) |
| Internal white-face vs. black-gear contrast (sanity check — should be unaffected) | `#ffffff` vs `#000000` | **21.00:1** — unchanged, confirms wrapping the mark in a frame doesn't touch its internal contrast |
| Copper border vs. white box interior | `#b87333` vs `#ffffff` | **3.79:1** |
| Copper border vs. charcoal page exterior (both Nav and Hero) | `#b87333` vs `#2b2b2b` | **3.73:1** |

The border isn't required to hit a formal ratio (it's a decorative accent, not content), but both values are well clear of "indistinguishable" in either direction, matching what the rendered PNGs show.

**Basis of this report:** rasterize-and-measure substitute, not a live browser — same category of evidence as Phase 3b's §7, and reported as such rather than implied to be a live check.

## 7. Verification Results

```
$ npx astro check
Result (15 files):
- 0 errors
- 0 warnings
- 0 hints

$ npx astro build
8 page(s) built in 5.00s. Complete.
```

## 8. Review Outcome

**Review skipped: Codex unavailable (repeat hang).** Tried two invocation forms — `git diff ... | codex exec --skip-git-repo-check -` (stdin-piped, the syntax flagged as a follow-up investigation after Phase 3b's hang) and `codex exec --skip-git-repo-check "<prompt>"` (positional-argument form). Both hung with no output; per this phase's explicit instruction not to wait indefinitely a second time, each was capped at 45–60 seconds and killed rather than left running. Treating Codex as unavailable for this invocation, per Rule 4, and skipping the review section.

As a substitute, did a manual pass over both changed files: confirmed the new `<span>` wrappers are the only structural change (no logic, no removed attributes); confirmed the nav `<a>`'s existing `aria-label="Clockwork Otter Foundry — home"` still supersedes the inner image's `alt` for screen readers, unaffected by the added wrapper; confirmed the hero image's already-known non-blocking alt-text redundancy (noted in Phase 3b §10, unrelated to this phase's change) is unchanged, not newly introduced. No fix pass was needed as a result — nothing here was fixed under a "Codex found it" pretense, and no new finding required action.

## 9. Out-of-Scope Items Discovered

- Same open item Phase 3b flagged: `Footer.astro` sits on the same Foundry Charcoal background and carries no logo today, but if a future phase adds one, the white-frame treatment documented here (§2 above, now in `CLAUDE.md`) should be reused rather than re-derived.
- The Nav's 160px logo width falling 20px under the doc's 180px recommended minimum (§3) — flagged for upstream confirmation, not changed here since fixing it would mean either enlarging the nav bar (out of this phase's file scope) or accepting the frame overflowing the header (a worse outcome).

## 10. Suggested Follow-Up Tasks (for Wolfgang to track)

1. Confirm with whoever owns `03-logo-system.md` whether the 180px recommended minimum digital width is meant to apply to the bare logo graphic or the logo-plus-frame footprint, given the Nav's fixed 72px height now forces the bare graphic slightly under that number.
2. If/when a logo is ever added to the Footer, apply the same white-frame treatment (§2/§6) rather than re-deriving values.
3. Still-unresolved from Phase 3b: correct invocation syntax for `codex exec` in this environment. Two more forms were tried here (stdin-piped and positional-argument) and both hung; this now spans two phases without a working invocation. Worth investigating outside a phase's time budget rather than re-attempting per-phase.
4. Still-unresolved from Phase 3b: `npm run dev` environment reliability — this phase couldn't even get the dev server listening (a regression from Phase 3b, which did get it running but was blocked by a missing shared library at the browser-launch step). If live browser verification is wanted for a future phase, both issues need fixing at the environment/image level.

---

Stopping here per the review workflow. Not beginning further phases without explicit approval.
