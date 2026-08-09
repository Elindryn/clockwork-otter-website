# Phase 3b — Logo Integration: Completion Report

**Project:** Clockwork Otter Foundry Website
**Phase:** 3b (between Phase 3 — Products, and Phase 4 — Documentation)
**Date:** 2026-08-09

---

## 1. Summary

Replaced the old opaque-white-background PNG logo with the three new production SVGs across the site: the horizontal lockup in the nav, the vertical lockup in the hero, and the mark-only SVG as a new favicon (this repo had none before). The PNG-to-SVG swap structurally fixes the nav's white-patch problem noted since Phase 1, because the SVGs have transparent backgrounds. However, the live legibility check this phase exists to perform (see §7) surfaced a more serious, previously-invisible problem: the new artwork is strictly two-tone (`#000000` / `#ffffff`), and its black elements — the gear silhouette **and the entire wordmark** — have a measured WCAG contrast ratio of only **1.48:1** against Foundry Charcoal (`#2b2b2b`), far below the 3:1 minimum for non-text contrast (WCAG 2.2 SC 1.4.11). Per this phase's explicit instructions, no workaround was invented for that; it is reported as an open item below (§7, §13).

## 2. Naming Chosen for the Three Copied SVG Files

`docs/foundations/03-logo-system.md`'s own "Naming Convention" section lists exactly these five canonical filenames: `clockwork-otter-logo-primary.svg`, `clockwork-otter-logo-horizontal.svg`, `clockwork-otter-logo-reversed.svg`, `clockwork-otter-logo-monochrome.svg`, `clockwork-otter-symbol.svg`. Three of the five match the assets that landed this phase, so those exact names were used instead of inventing new ones:

| Source file | Repo file |
|---|---|
| `ProdHorizLogo.svg` | `src/assets/images/logo/clockwork-otter-logo-horizontal.svg` |
| `ProdVertLogo.svg` | `src/assets/images/logo/clockwork-otter-logo-primary.svg` |
| `ProdMarkLogo.svg` | `src/assets/images/logo/clockwork-otter-symbol.svg` |

`ProdVertLogo.svg` was named `-primary.svg`, not `-vertical.svg` (which the brand doc doesn't define): the old PNG it replaces was itself a vertically-stacked lockup named `clockwork-otter-logo-primary.png`, so this preserves both the doc's own convention and this repo's existing precedent for what "primary" means in this codebase.

All three files were copied byte-for-byte (verified with `diff` against the source in `../clockwork-otter-brand/assets/`) — no markup, path, or color edits.

## 3. Sizing Decisions

**Nav (horizontal, 4:1 aspect, `viewBox="0 0 1000 250"`):** rendered at **180×45px**. The nav bar is a fixed 72px (`--header-height`), which caps how tall the logo can be before clear space is squeezed out. Solving for the 25%-of-gear-diameter clear space (gear diameter ≈ the graphic's full height) against a 72px bar: `height + 2×(0.25×height) ≤ 72` → `height ≤ 48px`. At height 45px (chosen to land on a whole multiple of the 4:1 ratio), width = 180px — which happens to land exactly on the "180px recommended minimum digital width" from `03-logo-system.md`. Actual available clear space from flex-centering is `(72-45)/2 = 13.5px` per side, above the `0.25×45 = 11.25px` required.

**Hero (vertical, `viewBox="0 0 862.78498 1084.263"`, aspect ≈ 0.796):** rendered responsively — intrinsic `width={224} height={281}` (matches source aspect ratio to within 0.17%, no distortion) with Tailwind `class="h-auto w-40 sm:w-56"`, i.e. **160px wide on mobile, 224px wide at `sm:` and above**. This is well under half the hero's content width even on narrow viewports, so it doesn't dominate. Clear space here is generously satisfied by the hero's own `gap-6` (24px) to the H1 below plus the section's `py-24 sm:py-32` padding — far more than the 25%-of-gear-diameter minimum at either logo size.

**Favicon (mark, `viewBox="0 0 250 250"`, square):** served as a single SVG (`<link rel="icon" type="image/svg+xml">`), so it scales losslessly to whatever size the browser tab requests — no fixed-size decision needed. Composited at 32×32px for inspection (the doc's "Symbol Mark" minimum digital size) as part of the legibility check below.

## 4. Files Changed

**Added:**
- `src/assets/images/logo/clockwork-otter-logo-horizontal.svg`
- `src/assets/images/logo/clockwork-otter-logo-primary.svg`
- `src/assets/images/logo/clockwork-otter-symbol.svg`
- `public/favicon.svg`

**Modified:**
- `src/components/Navigation.astro` — swapped PNG import for the horizontal SVG; changed `Image` sizing from 52×52 to 180×45.
- `src/pages/index.astro` — added `Image` import and one `<Image>` above the H1 in the hero section.
- `src/layouts/BaseLayout.astro` — added `<link rel="icon" type="image/svg+xml" href="/favicon.svg">` to `<head>`.

**Deleted:**
- `src/assets/images/logo/clockwork-otter-logo-primary.png` — confirmed via `grep -rn` across `src/` and `public/` that no reference to it remained before deleting.

## 5. Files Not Changed

- `src/components/Button.astro`, `src/components/Footer.astro`, `src/components/ProductCard.astro` — correctly out of scope, untouched.
- `/products`, `/documentation`, `/about`, `/contact` pages — untouched; this phase's permitted change set didn't include them and they don't reference the logo.

## 6. Documentation Changes

Added one new Standing Decision to this repo's `CLAUDE.md` (below) recording the black/white contrast finding, since it's exactly the kind of cross-phase-relevant fact the Standing Decisions section exists for — future phases (including any that touch the Footer, which also sits on Foundry Charcoal) need to know not to silently re-attempt a workaround here. No other documentation needed updating; `03-logo-system.md` itself is the parent brand repo and out of scope to edit from here.

## 7. Live Legibility Check Results

**What I tried and why it doesn't have a normal browser screenshot:** `npm run dev` starts cleanly (confirmed listening on `localhost:4321`, `curl` returns `200`). Playwright (`1.62.1`) and a cached Chromium/`chrome-headless-shell` were both found in this environment — a real step up from Phases 1–3, which had no such tooling at all. However, actually launching either cached browser binary fails: `chrome-headless-shell: error while loading shared libraries: libnspr4.so: cannot open shared object file`. `ldd` confirms four missing shared libraries (`libnspr4`, `libnss3`, `libnssutil3`, `libasound.so.2`). `apt-get install -s` confirms the fix is a known, available package set — but `sudo` in this session requires interactive authentication that isn't available, so I cannot install them. **This is reported precisely, not glossed over as "no GUI" the way Phases 1–3 did** — the tooling exists, one specific missing OS-level dependency blocks it, and no privilege escalation path is available to fix that from inside this session.

**What I did instead, and why it's a strong substitute here:** I confirmed via `curl` against the live dev server that Astro's SVG image service is a byte-for-byte passthrough (the transformed `/_image?...&f=svg` response `diff`s identical to the source file) — so there is no dev-server-specific transformation to miss. I then used `sharp` (already a project dependency, used internally by Astro's own image pipeline) to rasterize each SVG at its actual on-page pixel dimensions and composite it onto a `#2b2b2b` (Foundry Charcoal) background, matching real layout: 180×45 in a 600×72 strip (nav), 160×201 and 224×282 on charcoal (hero at mobile/desktop widths), and the mark at 180×180 and 32×32 (favicon-scale). I then visually inspected the resulting PNGs directly.

**What I observed, at both widths, both placements:** the white otter-face portion of the mark is crisp and highly legible in every render. The black gear ring and the **entire wordmark** ("CLOCKWORK OTTER" / "FOUNDRY") are very hard to read — in the nav render the wordmark reads as a barely-there dark smudge next to the otter face; the gear teeth are only visible as a faint edge highlight, not a clear silhouette. The same holds at both hero sizes (160px and 224px) and in the standalone mark closeup — the gear ring nearly disappears into the charcoal field, leaving what looks like a white otter face floating with no visible frame.

**Quantified:** computed WCAG 2.2 relative luminance/contrast for the exact hex values in use:
- `#000000` vs `#2b2b2b` (Foundry Charcoal): **contrast ratio 1.48:1** — well below the 3:1 minimum WCAG 2.2 SC 1.4.11 (Non-text Contrast) sets for meaningful graphical objects.
- `#ffffff` vs `#2b2b2b`: **contrast ratio 14.16:1** — comfortably exceeds even the AAA text threshold (7:1).

**Basis of this report:** this is a code-only inference in the strict sense that no browser rendered it — but it is pixel-accurate (real SVG rasterization via the same library Astro's own image pipeline uses, composited over the exact production background color) and numerically confirmed against the WCAG contrast formula, not a guess from reading markup. I'm confident in it, but it is not the browser-based check Scope item 6 asked for, and I want that distinction on record rather than implied away.

## 8. Contrast Observation on the New SVGs

Confirmed via `grep -oE 'fill:#[0-9a-fA-F]{3,6}'` across all three files: only `#000000` and `#ffffff` appear, matching Wolfgang's XML-inspection note exactly — no brand copper or charcoal, no third color, no embedded `<text>` (the wordmark is already paths, so no font-availability risk). I did not alter this. Whether black/white-only is *intentional* — i.e., a deliberate two-tone badge meant to be paired with a light or mid-tone backdrop, not applied directly to Foundry Charcoal — vs. an oversight in the production export is a real open question worth confirming upstream with whoever produced the SVGs, especially since `03-logo-system.md` lists Charcoal as one of three "Preferred Backgrounds" for the primary logo.

## 9. Verification Results

```
$ npx astro check
Result (15 files):
- 0 errors
- 0 warnings
- 0 hints

$ npx astro build
8 page(s) built in 5.60s. Complete.
```

Also manually confirmed via `curl` against the running dev server: home page HTML contains both `<img>` tags at the intended 180×45 and 224×281 intrinsic sizes with the `sm:w-56` responsive class present; `/about` (representative of every non-home page) renders the nav logo identically; `GET /favicon.svg` returns `200 image/svg+xml`.

## 10. Review Outcome

**Review skipped.** Codex CLI (`codex-cli 0.143.0`) is installed, but this repo still has no git history (unchanged since Phase 3), so a diff-based `codex review` wasn't available — the same limitation Phase 3 hit. Following Phase 3's precedent, I invoked `codex exec` directly with the changed-file list and review instructions. Unlike Phase 3, this invocation never produced a review: it printed only `Reading additional input from stdin...` and then hung — it appears this version/invocation of `codex exec` expects piped stdin rather than (or in addition to) a prompt argument, which I didn't provide. After roughly 19 minutes with no output, I terminated it rather than let it run indefinitely or guess at a fix live in this phase. Per this phase's own Rule 4 ("If Codex is unavailable, say so in the completion report and skip this section"), I'm treating this as unavailable-for-this-invocation and skipping the review rather than fabricating one. No fix pass was performed as a result — nothing here was fixed under a "Codex found it" pretense.

As a substitute, I did a manual pass over the four changed source files myself: confirmed no remaining references anywhere in `src/`/`public/` to the deleted PNG; confirmed both new `<Image>` usages have width/height matching their source aspect ratio (nav: exact 4:1; hero: 224:281 vs. true 862.78:1084.26, a 0.17% difference — imperceptible, not a distortion); confirmed the favicon `<link>` is well-formed and present in the rendered `<head>`. One non-blocking observation, recorded but not changed: the hero's `<Image alt="Clockwork Otter Foundry">` is not inside a link, so unlike the nav logo (whose alt is superseded by the parent anchor's `aria-label`), a screen reader will announce it as a standalone image immediately before the H1 — mildly redundant with the page's own title, but not a WCAG failure, so left as-is pending an explicit accessibility-standards doc (`docs/standards/accessibility.md` is still an empty placeholder).

## 11. Out-of-Scope Items Discovered

- `Footer.astro`'s background is also `var(--footer-background)` → Foundry Charcoal. It carries no logo today, but if a future phase adds one there, the same 1.48:1 black-contrast problem documented here will recur. Flagging now so it isn't rediscovered from scratch.
- `docs/standards/accessibility.md` remains an empty placeholder (noted in Phase 1 and still true) — the hero alt-text redundancy observation in §10 is exactly the kind of judgment call a real accessibility standard would resolve consistently instead of per-phase.

## 12. Suggested Follow-Up Tasks (for Wolfgang to track)

1. Resolve the black-gear/wordmark-on-Charcoal contrast problem upstream — most likely via the still-pending Reversed or Monochrome logo variant (`03-logo-system.md` already defines both), rather than a per-site workaround.
2. Confirm with whoever produced `ProdHorizLogo.svg`/`ProdVertLogo.svg`/`ProdMarkLogo.svg` whether strict `#000000`/`#ffffff` was intentional given Charcoal is a listed preferred background.
3. Investigate the correct invocation syntax for `codex exec` in this environment (stdin-based, apparently) — Phase 3's invocation style no longer works as expected and blocked this phase's review step for ~19 minutes before being abandoned.
4. Environment gap: headless-browser-based live checks are blocked by missing shared libraries (`libnspr4`, `libnss3`, `libnssutil3`, `libasound.so.2`) with no available privilege escalation to install them. If live browser verification is wanted for a future phase, this needs to be fixed at the environment/image level, not per-phase.
5. Revisit the hero's decorative-image alt-text question once `docs/standards/accessibility.md` exists.

---

Stopping here per the review workflow. Not beginning Phase 4 without explicit approval.
