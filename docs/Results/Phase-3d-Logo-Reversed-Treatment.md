# Phase 3d — Logo Reversed Treatment (CSS-Controlled Fill Swap): Completion Report

**Project:** Clockwork Otter Foundry Website
**Phase:** 3d (supersedes 3c)
**Date:** 2026-08-09

---

## Status: Stopped per the phase's own instructions — the proposed two-class swap does not work

This phase's Goal and Project Context sections explicitly anticipated the possibility that the two-class swap ("black → light, white → transparent") might not hold up once rendered, and instructed: *"verify this is actually true by rendering it, don't take Wolfgang's structural read as a guarantee. If it looks wrong (loses the otter's face, reads as a blob, or anything else off), that's exactly the 'stop and report' case."* I built the mechanism, rendered it against the real SVGs at real on-page sizes, and it does exactly that — loses the otter's face entirely, reads as a flat blob. Per the phase's explicit instruction, I'm stopping here rather than pushing through with a different design unilaterally. **`Navigation.astro` and `index.astro` are unchanged from Phase 3c's state; no `LogoReversed.astro` component was added to the repo.**

## 1. What I built and tested

Per Scope item 1, I wrote a text-transform function (tested standalone, not yet wired into a component) that takes the raw SVG markup and:
- Replaces every literal `fill:#000000` → `fill:#f7f7f5` (the light swap, using `--color-background`'s raw value as the prompt recommended).
- Replaces every literal `fill:#ffffff` → `fill:transparent`.
- Adds a `fill="#f7f7f5"` presentation attribute on the root `<svg>` element so the wordmark paths (`ClockworkOtter`/`Foundry`, which — confirmed by reading the files directly — have no `fill` set anywhere and rely on inheritance) pick up the light color too.
- Strips `id="..."` attributes, since (confirmed by `grep` across all three files) the mark's internal element IDs — `path4-8`, `g50`, `path48` through `path36` — are byte-identical across `clockwork-otter-logo-horizontal.svg` and `clockwork-otter-logo-primary.svg`. Both are used on the same page (home page: horizontal in the Nav, primary in the Hero), so inlining both raw would have produced duplicate DOM IDs — a real, if minor, document-validity problem the read-only inspection wouldn't have caught. Stripping IDs sidesteps it since the color-swap approach doesn't need ID-based CSS targeting.

I ran this transform against the actual `clockwork-otter-logo-horizontal.svg` and `clockwork-otter-logo-primary.svg` files, then rasterized the output with `sharp` at true on-page pixel sizes composited onto `#2b2b2b` (Foundry Charcoal) — the same verification technique Phases 3b/3c used — and looked at the results directly.

## 2. What I observed

**Wordmark:** reverses correctly. "CLOCKWORK OTTER" / "FOUNDRY" render in the light off-white color and are clearly legible against Charcoal in both the Nav and Hero renders.

**The mark (gear + otter face) does not reverse correctly — it loses all internal detail and renders as a solid light disc.** At all three sizes tested (Nav 180×45, Hero mobile 160×201, Hero desktop 224×281), the gear silhouette shows as an unbroken light-off-white blob with visible gear teeth around the rim, but the otter's face — jaw, whiskers, eye, ear, head — is completely invisible. No trace of the internal artwork survives.

## 3. Root cause (not a bug in my transform — a structural mismatch between the plan and how SVG painting works)

The two-class swap's logic assumed that making the six white detail shapes `transparent` would "punch a window" through to whatever's behind the *entire graphic* — i.e., reveal the Charcoal page background through the gear, showing the face as dark cutouts in a light gear. That's not what SVG transparency does here. Painting order in the file (confirmed by reading it directly) is: `BlackGear` (bottom, now light) → six "white" detail shapes (now transparent) → six "black" detail shapes (now light again), all painted **on top of the gear itself**, not on top of the page. A `fill:transparent` shape simply does not paint — it doesn't erase or reveal what's beneath it within the same graphic, it just leaves the layer immediately below (the gear, now also light) showing through unchanged. Since the gear and the "transparent" face shapes are now effectively the same light color (one by fill, one by absence of fill revealing the identical layer beneath), the whole mark reads as one undifferentiated light shape. The small "black → light" detail shapes on top (eye, ear, whiskers) are also now invisible, for the same reason — light-on-light.

This is a structural property of how the artwork is layered, not something a different color choice or an ID/CSS-targeting mechanism would fix. The transparent-window concept the prompt described would only work if the white shapes were the *bottommost* layer with the gear silhouette *cut out* around them (true compositing subtraction) — that's not how this file is built.

## 4. A mechanism that would work, for consideration — not implemented

While testing, I confirmed (by inverting the swap direction only, i.e. black → light and white → a *second, opaque* dark color rather than transparent) that a straightforward **two-color opaque swap** reproduces the mark correctly with full internal detail intact: gear silhouette becomes light (fixing the actual Charcoal-contrast problem), the six detail shapes that were white become a dark color instead of transparent, and the small black-on-white details become light again — the same visual structure as the original artwork, just with the two colors swapped, rather than one of them becoming invisible. This is a materially different design than what this phase's Scope specified (an opaque recolor, not a transparent "reversed negative"), so I did not implement it — that's a design call, and the phase's own instructions are explicit that a "looks wrong" result is a stop-and-report case, not a "pick something else and continue" case.

I have not chosen a specific dark color for that second swap in code; `--color-text-primary` (#222222) or `--color-brand-charcoal` (#2b2b2b) are both already-approved tokens that would work if this direction is approved.

## 5. Files Changed

**None.** `Navigation.astro`, `index.astro`, and `tokens.css` are untouched — Phase 3c's white-frame treatment remains live and correct on the site. No new component file was added to the repository (the transform function above was tested standalone, outside the codebase, and discarded after verification).

## 6. Documentation Changes

**None.** `CLAUDE.md`'s Phase 3c Standing Decision was not touched, since the treatment it describes is still what's actually live on the site.

## 7. Verification Results

`npx astro check` / `npx astro build` were not re-run, since no source files changed from Phase 3c's already-verified state.

The rendering check described in §1–3 above is the verification this phase asked for (Scope item 5) — it's what surfaced the blocking finding, using the same rasterize-and-measure technique as Phases 3b/3c since a live browser was not attempted here (moot, since no code change was made to check in a browser).

## 8. Review Outcome

**Review skipped: no code changes made.** Nothing to review.

## 9. Out-of-Scope Items Discovered

- The duplicate-element-ID hazard noted in §1 (identical IDs across `clockwork-otter-logo-horizontal.svg` and `clockwork-otter-logo-primary.svg`) is real but currently harmless, since neither file is inlined as raw SVG anywhere yet — both are still consumed via `<Image src={...}>`, which produces an `<img>`, not inline markup, so no duplicate-ID collision exists on the live site today. Only relevant if/when either file is inlined in the future.

## 10. Suggested Follow-Up Tasks (for Wolfgang / the user to decide)

1. **Decide how to proceed on the reversed-logo idea**, given the two-class transparent-swap doesn't work as designed:
   - (a) Approve the opaque two-color swap described in §4 (light gear, dark internal details, wordmark light) — same inline-SVG mechanism, different color mapping, preserves full artwork detail, still requires no edits to the canonical SVGs.
   - (b) Revert to Phase 3c's white-frame treatment as the standing solution (already live, already verified working).
   - (c) Pursue the upstream fix flagged since Phase 3b — a true Reversed/Monochrome logo variant produced by whoever owns the source artwork, rather than any in-browser color trick.
2. If (a) is approved, a follow-up phase should specify the exact dark color for the swapped-white elements (candidates: `--color-text-primary` #222222 or `--color-brand-charcoal` #2b2b2b) and confirm the Nav/Hero sizing questions Phase 3b/3c already answered still apply once the box is removed (very likely yes, since removing the box removes the padding/border constraint that shrank the Nav logo in 3c).

---

Stopping here per the phase's own stop-and-report instruction. Not implementing a substitute design without direction. Not beginning further phases without explicit approval.
