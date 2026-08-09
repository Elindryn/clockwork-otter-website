# Phase 3e — Final Logo Variants (Flat Black/White, No Box): Completion Report

**Project:** Clockwork Otter Foundry Website
**Phase:** 3e (resolves 3b/3c/3d)
**Date:** 2026-08-09

---

## 1. Summary

Replaced Phase 3c's white-box/copper-border workaround with the new flat, single-color White/Black logo variants supplied upstream. The Nav and Hero now render the White horizontal/vertical variants directly against Foundry Charcoal, transparent background, no container — the box treatment is fully removed. The favicon now uses the Black mark variant. This closes the logo-contrast saga that ran through Phases 3b (found the problem), 3c (worked around it), and 3d (attempted a CSS fix on the old artwork and found it structurally impossible) — this phase's assets are the actual fix, not another workaround.

## 2. Repository Used

Ran in `clockwork-otter-brand/website/` (the original location). Checked first, per this phase's own instruction: `CLOCKWORK-MIGRATE-1` has **not** run — `../clockwork-otter-website` does not exist locally (confirmed by directory listing) — so there is no sibling repo to run this in yet.

## 3. Final Asset Filenames

Copied from `../assets/` into `src/assets/images/logo/`, verified byte-identical via `diff` against the source:

| Source (`../assets/`) | Repo file | Used for |
|---|---|---|
| `ProdHorizWhiteLogo.svg` | `clockwork-otter-logo-horizontal-white.svg` | Nav |
| `ProdVertWhiteLogo.svg` | `clockwork-otter-logo-vertical-white.svg` | Hero |
| `ProdMarkBlackLogo.svg` | `clockwork-otter-logo-mark-black.svg` | Favicon |

The other three variants (`ProdHorizBlackLogo.svg`, `ProdVertBlackLogo.svg`, `ProdMarkWhiteLogo.svg`) were not copied — no current context in this codebase places the logo on a light background, so there's no use for a Black horizontal/vertical or White mark yet. Left uncopied per this phase's own instruction not to stockpile unused assets.

Before wiring anything in, I read each of the six source files directly to confirm Wolfgang's structural description: all three copied files do contain a hidden "Dark" layer alongside the visible "White"/"Black" layer (`display:none` vs `display:inline`, confirmed via `grep`), and each visible shape is a single flat fill with no internal two-tone layering — unlike the old artwork, this really does support a clean swap. I also rasterized all three against their real target backgrounds with `sharp` before wiring them into components (not just reading the XML) — the otter's full facial detail renders correctly at every size, unlike Phase 3d's failed attempt on the old two-tone files.

## 4. Nav and Hero Sizing

**Nav: did not hold at Phase 3b's exact original numbers — the new source SVG has a different native aspect ratio.** The old horizontal SVG's `viewBox` was `0 0 1000 250` (4:1). The new `clockwork-otter-logo-horizontal-white.svg`'s `viewBox` is `0 0 862.78497 199.99999` (4.31:1) — confirmed by reading the file, not assumed. Keeping Phase 3b's target height of 45px, the correct width at the new aspect ratio is **194px**, not 180px. This still fits comfortably: header content height is ~70px (72px `--header-height` minus the header's own 2px bottom border, border-box sizing), so a 45px-tall logo leaves the same ~12.5px clear margin per side Phase 3b's original math computed (25%-of-height minimum was 11.25px) — the aspect-ratio change only affects width, not the height-driven clear-space math. Final: **194×45**.

**Hero: Phase 3b's original numbers held exactly.** The new vertical SVG's `viewBox` (`0 0 862.78497 1084.2629`) is the same aspect ratio as the old one (`0 0 862.78498 1084.263`, effectively identical after rounding) — confirmed by reading both files. Sizes are unchanged: **160×201 (mobile) / 224×281 (`sm:`+)**, with the same responsive `w-40 sm:w-56` Tailwind classes as before.

## 5. Files Changed

**Added:**
- `src/assets/images/logo/clockwork-otter-logo-horizontal-white.svg`
- `src/assets/images/logo/clockwork-otter-logo-vertical-white.svg`
- `src/assets/images/logo/clockwork-otter-logo-mark-black.svg`

**Modified:**
- `src/components/Navigation.astro` — swapped to the White horizontal SVG, removed Phase 3c's box wrapper, resized to 194×45.
- `src/pages/index.astro` — swapped to the White vertical SVG, removed Phase 3c's box wrapper, sizes unchanged (160/224 responsive).
- `public/favicon.svg` — replaced with the Black mark variant (previously the old two-tone symbol).

**Deleted** (confirmed unreferenced via `grep -rn` across `src/` and `public/` before removal):
- `src/assets/images/logo/clockwork-otter-logo-horizontal.svg`
- `src/assets/images/logo/clockwork-otter-logo-primary.svg`
- `src/assets/images/logo/clockwork-otter-symbol.svg`

**`src/styles/tokens.css` — not changed.** Checked whether removing Phase 3c's box left any dead tokens: `--radius-card`, `--border-width-medium`, `--color-brand-copper`, and `--color-surface` are all still actively used elsewhere (`ProductCard.astro`, `example-product.astro`, the Nav's own divider/active-indicator tokens, `Button.astro`, `global.css`) — confirmed via `grep` before concluding nothing needed removing.

## 6. Documentation Changes

Updated (not appended to) the "Logo contrast on Foundry Charcoal" Standing Decision in `CLAUDE.md`: condensed the 3b→3c→3d history into a short lead-in, replaced the box-treatment description with the final flat-variant resolution (filenames, sizes, contrast numbers, favicon choice), and added the Nav aspect-ratio note from §4. Full text is in `CLAUDE.md`.

## 7. Contrast Verification Results

**Live browser check attempted first, per this phase's instruction to try again since environments have varied run to run.** Same result as Phases 3b/3c: `chrome-headless-shell` still fails with the same four missing shared libraries (`libnspr4.so`, `libnss3.so`, `libnssutil3.so`, `libasound.so.2`, confirmed via `ldd`) — no change from prior phases, no `sudo` available to fix it in this session. Fell back to the rasterize-and-measure technique.

**Rasterize-and-measure:** rendered all three new assets at true on-page pixel sizes onto their real target backgrounds with `sharp` (Nav: 194×45 on `#2b2b2b`; Hero: 224×281 on `#2b2b2b`; favicon: 64×64 on `#f7f7f5`) and inspected the output directly. All three show the full otter-and-gear artwork with complete internal detail — jaw, whiskers, eye, ear, head all clearly visible — unlike Phase 3d's failed blob. The wordmark is crisp in both Nav and Hero renders.

**Quantified:** the visible fill in the White variants is a flat `#ffffff` (confirmed via `grep -oE 'fill:#[0-9a-fA-F]{3,6}'` on the visible, non-`display:none` layers). WCAG 2.2 contrast of `#ffffff` vs. Foundry Charcoal `#2b2b2b`: **14.16:1** — the same number Phase 3b measured for the old artwork's white elements, since this is now a flat white shape rather than a mixed two-tone mark whose black elements dragged the *effective* contrast down. This comfortably clears the 3:1 minimum, as expected — this was confirmation, not an open question, and it passed as predicted with no surprise.

**Basis:** rasterize-and-measure substitute, not a live browser — same category of evidence as Phases 3b/3c/3d.

## 8. Verification Results

```
$ npx astro check
Result (15 files):
- 0 errors
- 0 warnings
- 0 hints

$ npx astro build
8 page(s) built in 7.39s. Complete.
```

Also confirmed directly: `dist/CNAME` still contains `clockworkotterfoundry.com` (unaffected, unrelated to this phase); `dist/favicon.svg` contains the `Dark Gear`/`Dark Text` layers from the Black mark variant (correct — the built output actually reflects the swap, not just the source file).

## 9. Review Outcome

**Codex review ran successfully**, using the pattern Deploy-1 established (`codex exec --skip-git-repo-check "<files inlined>"` as a positional argument, run from the repo root). Two findings came back, neither fixed:

1. *"`logo` always uses the White variant; if `--navigation-background` were ever light, the logo would disappear."* **Not fixed — no concrete failure scenario in the actual codebase.** Checked: `--navigation-background` is defined exactly once in `tokens.css`, always `var(--color-brand-charcoal)`, with no per-page override, theme switch, or alternate value anywhere in the source (confirmed via `grep -rn "navigation-background" src/`). There's no reachable code path that produces a light nav today — this is a hypothetical-future-state concern, not a bug in what exists, so it's recorded rather than acted on per this phase's Rule 1.
2. *"Redundant alt text: the nav `<a>` has `aria-label`, and the child `<Image>` also has a non-empty `alt`, which some screen reader/browser combinations may announce twice."* **Not fixed — pre-existing since Phase 3b, unchanged by this phase.** This exact pattern was already present and was explicitly reviewed and left as-is in Phase 3b's own completion report (§10, "non-blocking, not a WCAG failure"). This phase's diff touched only the image `src`/`width`/`height` and removed the box wrapper — it didn't introduce or modify the `alt`/`aria-label` relationship, so there's nothing new here to fix under this phase's scope.

## 10. Out-of-Scope Items Discovered

- The alt/aria-label redundancy above remains an open, low-priority item pending a real accessibility standard (`docs/standards/accessibility.md` is still an empty placeholder, flagged since Phase 1).
- The three unused variants (`ProdHorizBlackLogo.svg`, `ProdVertBlackLogo.svg`, `ProdMarkWhiteLogo.svg`) remain in the brand repo's `assets/` for future use if a light-background placement is ever needed — not copied here, per this phase's own "don't stockpile" instruction.

## 11. Suggested Follow-Up Tasks (for Wolfgang to track)

1. Consider the light-nav hypothetical from the Codex review (§9, finding 1) if a future phase ever introduces a light-background nav variant or theme — at that point the Nav component would need to conditionally choose White vs. Black, which it currently has no mechanism for.
2. Resolve the nav alt/aria-label redundancy once `docs/standards/accessibility.md` exists and gives a real answer, rather than re-deciding it ad hoc per phase.
3. This closes the multi-phase logo-contrast saga (3b→3c→3d→3e) — worth a `LESSONS_LEARNED.md` entry on the general pattern: a CSS/box workaround bought time, but the durable fix was getting the right upstream asset (flat single-color variants), not a cleverer client-side trick on artwork that structurally couldn't support one.

---

Stopping here per the review workflow. Not beginning further phases without explicit approval.
