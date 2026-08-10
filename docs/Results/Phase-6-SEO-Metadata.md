# Phase 6 — Effective Dates + SEO/Metadata — Completion Report

**Project:** Clockwork Otter Foundry Website
**Phase:** 6 (renumbered 2026-08-10, was 3l)
**Date:** 2026-08-10

---

## 1. Part A — Effective-date confirmation

Both `src/pages/privacy.astro` and `src/pages/terms.astro` had `[TODO: effective date]` replaced with `August 1, 2026`, exactly as supplied. Nothing else on either page changed — confirmed by diffing each file against its pre-phase state; only that one line differs (plus Part B item 1's separate `description` prop addition). The other three `[TODO]` markers from Phase 4 (Privacy's business identity/address, Terms' governing jurisdiction) are untouched, confirmed still present verbatim in the built output.

## 2. Files changed

- `src/pages/privacy.astro` — effective date filled in; `description` prop added.
- `src/pages/terms.astro` — effective date filled in; `description` prop added.
- `src/layouts/BaseLayout.astro` — canonical `<link>`, Open Graph tags, `og-image.jpg` import.
- `astro.config.mjs` — `@astrojs/sitemap` integration added (via `npx astro add sitemap`), with a `filter` excluding `/404`.
- `package.json` / `package-lock.json` — `@astrojs/sitemap` dependency added.
- `public/robots.txt` — new.
- `src/assets/images/og-image.jpg` — new, derived/pre-composited asset (see §5). `src/assets/images/logo/primarylogo.png` itself was read only, never edited.

## 3. New Privacy/Terms descriptions (verbatim)

- Privacy Policy: **"Privacy Policy for the Clockwork Otter Foundry website."**
- Terms of Use: **"Terms of Use for the Clockwork Otter Foundry website."**

Kept deliberately plain/factual per the brief's own instruction — no marketing language.

## 4. Confirmation of canonical tags, sitemap, robots.txt, and OG tags (cited from actual `dist/` output)

**Sitemap** — `dist/sitemap-index.xml` references `dist/sitemap-0.xml`, which lists exactly the six real pages (`/`, `/about/`, `/antiphon/`, `/contact/`, `/privacy/`, `/terms/`) — `/404` is absent, confirmed by inspecting the file directly, not just trusting the `filter` config. No `/products` or `/documentation` entries (both deleted in Phase 3h) resurfaced from any stale cache.

**`robots.txt`** — `dist/robots.txt` matches the prompt's exact required content, including `Sitemap: https://clockworkotterfoundry.com/sitemap-index.xml` — verified `sitemap-index.xml` is in fact `@astrojs/sitemap`'s actual default output filename (confirmed both by inspecting the generated file and by Codex's independent check of the installed integration version, 3.7.3).

**Canonical + OG tags** — extracted from every built page's compiled `<head>`:

| Page | canonical | og:url | og:title |
|---|---|---|---|
| `/` | `https://clockworkotterfoundry.com/` | same | `Clockwork Otter Foundry · Clockwork Otter Foundry` |
| `/about/` | `.../about/` | same | `About · Clockwork Otter Foundry` |
| `/antiphon/` | `.../antiphon/` | same | `Antiphon · Clockwork Otter Foundry` |
| `/contact/` | `.../contact/` | same | `Contact · Clockwork Otter Foundry` |
| `/privacy/` | `.../privacy/` | same | `Privacy Policy · Clockwork Otter Foundry` |
| `/terms/` | `.../terms/` | same | `Terms of Use · Clockwork Otter Foundry` |
| `/404` | `.../404/` | same | `Page Not Found · Clockwork Otter Foundry` |

Each page's canonical/`og:url` is genuinely distinct (not all pointing at one URL), computed per-page from `Astro.site` + `Astro.url.pathname`. `og:image` resolves identically on every page to `https://clockworkotterfoundry.com/_astro/og-image.c3r_mhWr.jpg` — a single site-wide image, as scoped. One discovered inconsistency on the `/404` page specifically — see §8.

## 5. `og:image` handling — composited, with a real pipeline limitation found and worked around

**What was tried first, and why it didn't work:** Astro's built-in `astro:assets` `getImage()` function, with `{ width: 1200, height: 630, fit: "contain", background: "#f7f7f5" }`, per the prompt's suggested approach. This was **not assumed to work** — the actual built output file was inspected directly, and it measured **493×630**, not 1200×630. In this Astro version (`^7.2.0`), the built-in image service's `fit: "contain"` scales the source to fit within the requested box while preserving aspect ratio, but does not pad the result out to the full requested canvas — so what "contain" produced was just the portrait source scaled down to fit a 630px height, with no landscape framing at all. This is a genuine, verified limitation of this version's built-in transform, not a config mistake on my part (confirmed by testing the exact same operation with plain `sharp` — the library Astro's own image service is built on — which correctly padded to 1200×630 with the background color filling the letterbox bars, using the identical `resize(w, h, { fit: 'contain', background })` + `.flatten({ background })` call).

**What was actually shipped:** used `sharp` directly (already a resolved dependency in this project, transitively via Astro's own image service) to generate the real composited frame once: the 660×844 portrait `primarylogo.png` centered on a 1200×630 **Foundry Paper** (`#f7f7f5`, existing brand token) background, flattened to remove the source's transparency, exported as JPEG. Saved as a new source asset, `src/assets/images/og-image.jpg`, and imported into `BaseLayout.astro` the same way every other image in this codebase is imported (`import ogImage from "../assets/images/og-image.jpg"`) — so it still goes through Astro's asset pipeline for hashing/caching (ships as `dist/_astro/og-image.c3r_mhWr.jpg`), it's just not re-transformed at render time since it's already the exact final size. The exact regeneration command is documented in a comment directly above the import in `BaseLayout.astro`, in case `primarylogo.png` is ever replaced.

**Background choice:** tested both Foundry Charcoal and Foundry Paper as the letterbox/flatten color before deciding. Charcoal created a visible "white rectangle floating in a dark bar" effect, since the source PNG's own logo card already has an opaque white backing. Foundry Paper (near-white) blends almost seamlessly with that existing white card instead, reading as one clean image rather than a composited box — confirmed by visually inspecting both renders before choosing.

**Final shipped dimensions/format:** 1200×630 JPEG, no alpha channel (62,597 bytes) — the standard, widely-supported `og:image` size (1.91:1), resolving both caveats flagged in Project Context (portrait aspect ratio and transparency-compositing ambiguity) directly rather than punting to the "ship as-is" fallback, since a working alternative to the built-in transform was found and verified.

## 6. Verification results (Scope item 6 spot-checks)

- **Heading hierarchy** — checked directly in the built HTML for all seven pages (six real pages + 404): exactly one `<h1>` per page, confirmed via grep count, not assumed from Phase 4's report alone.
- **Descriptive link text** — grepped `src/` for "click here"/"read more" (case-insensitive): zero matches.
- **`/documentation` and `/products` absence from sitemap** — confirmed directly in `dist/sitemap-0.xml`'s contents (§4); no stale-cache resurrection occurred.
- **No fake localization** — grepped `src/` and `dist/` for `hreflang`: zero matches; this phase's own additions (canonical, OG, sitemap) introduce none.
- `npx astro check` → 0 errors, 0 warnings, 0 hints (14 files). **Measured.**
- `npx astro build` → succeeded, 7 pages generated, sitemap files and `robots.txt` present in `dist/`. **Measured.**

## 7. Review outcome

Ran `codex exec --skip-git-repo-check` with `BaseLayout.astro`, `astro.config.mjs`, `public/robots.txt`, `privacy.astro`, and `terms.astro` inlined verbatim.

**No findings.** Codex independently verified the same facts this report cites: `@astrojs/sitemap` 3.7.3's actual default filename is `sitemap-index.xml` (matching `robots.txt`'s reference), the `/404` filter excludes both `/404` and `/404/` forms, `URL` objects passed to Astro template attributes stringify correctly (not `[object Object]`), `og-image.jpg` exists and is genuinely 1200×630, and both legal pages' edits look correct. It noted it couldn't run a full build in its own sandbox (read-only filesystem) — my own build (§6) is unaffected by that and is what this report's findings are based on.

## 8. Judgment calls / discovered inconsistencies flagged for review

- **`/404` page's canonical/`og:url` says `/404/` (trailing slash) but the file ships as `dist/404.html` (no trailing slash, no directory).** Astro's route resolution for the special `404.astro` filename apparently normalizes `Astro.url.pathname` to `/404/` during prerendering even though the emitted file itself is flat (`404.html`, per GitHub Pages' special-file convention, confirmed still correct in Phase 3i). This means the 404 page's self-referencing canonical technically points at a URL that isn't exactly where the file is reachable. **Not fixed** — severity is low since the page already carries `noindex={true}` (Phase 3i), so it's excluded from indexing regardless of what its canonical says, and special-casing this one route would add branching logic to a shared layout for a cosmetic inaccuracy on a page search engines are explicitly told to ignore. Flagging rather than silently accepting it, per this project's standing discipline.
- **`getImage()` limitation and the sharp-direct workaround (§5).** A reasonable person might have just shipped the raw 660×844 portrait per the prompt's explicit fallback clause, rather than spending extra effort finding a working alternative. I judged that since a clean, verified alternative existed (sharp directly, same engine, zero new design decisions — just padding/background compositing exactly as scoped), it was worth using rather than defaulting to the weaker fallback; but this was a genuine choice point, not a forced conclusion.
- **`og-image.jpg` as a static pre-generated file rather than a live per-build transform.** The prompt's language leaned toward "composite... at build time." What ships is composited once and checked in as a source asset (still re-hashed/copied through Astro's pipeline on every build, but not re-composited from the portrait source unless someone manually reruns the documented command). A reasonable person might prefer a live build-time transform (e.g., a small local Astro integration hook) so the image regenerates automatically if `primarylogo.png` ever changes, without a human remembering to rerun a command. I chose the simpler static-file approach to avoid introducing new build tooling/integration code beyond what this phase's "Files Allowed to Change" list anticipated (which explicitly named a possible new derived-image file, not new tooling).

## 9. Out-of-scope items discovered

- None beyond what's already flagged in §8. Everything else in this phase's scope (Part A date fix, canonical URLs, sitemap, robots.txt, OG tags, verification spot-checks) was completable within the stated scope and files.

## 10. Suggested follow-up tasks

- If `primarylogo.png` is ever replaced or the brand mark changes, rerun the documented `sharp` command (comment in `BaseLayout.astro`) to regenerate `og-image.jpg` — currently a manual step, not automated.
- Consider whether the `/404` canonical/`og:url` trailing-slash mismatch (§8) is worth a small special-case fix in a future phase, even though its `noindex` tag already prevents any real-world SEO consequence.
- Once HTTPS enforcement (the open manual step noted in `ecosystem/ACTIVE_PRIORITIES.md`) is actually live, the canonical/OG URLs will be accurate as-is — no further code change needed, per the prompt's own note that implementing this now (rather than waiting) is correct and harmless.
