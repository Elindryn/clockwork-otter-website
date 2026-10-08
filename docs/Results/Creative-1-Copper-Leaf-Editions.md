# Creative-1 — Copper Leaf Editions: Completion Report

**Date:** 2026-10-08

## 1. Summary
Added a flat **Creative** nav/footer link, `/creative/` (Copper Leaf Editions linked, Bardsong a non-interactive "Coming soon" card), and `/copper-leaf/` rendering three books from `src/data/copper-leaf-books.ts`. No client JS, no new dependencies, no tokens changed.

## 2. Real vs placeholder books
**All three are placeholders.** The owner had not supplied titles, factual lines, Amazon URLs or spread images (`src/assets/images/copper-leaf/` did not exist; no notes in `docs/`). Each renders a "Book details to be added" frame, no Amazon link, and the build logs a `[copper-leaf]` warning listing them. To go live: place image, fill the entry, remove `placeholder: true`.

## 3. Files changed
Added: `src/data/copper-leaf-books.ts`, `src/components/CreativeCard.astro`, `src/pages/creative/index.astro`, `src/pages/creative/copper-leaf-editions.astro`, `src/assets/images/copper-leaf/.gitkeep`, this report.
Updated: `Navigation.astro`, `Footer.astro`, `CLAUDE.md`, `docs/Prompts/PROMPT_LOG.md`.

## 4. Not changed
Nothing from the allowed list was unnecessary.

## 5. Documentation
`CLAUDE.md` Standing Decisions: new "Creative section" entry. `PROMPT_LOG.md`: Creative-1 row (status `executed`).

## 6. Design-system conformance
Existing tokens only. The "quiet" Bardsong card uses `--color-text-secondary` (#555 on #f7f7f5) text with a thin 40% mix border and no hover/focus affordance. The framed-card border uses `color-mix` of an existing token because no border-colour token exists. The copy intro on the Copper Leaf page deliberately omits the "facing notes" claim (not confirmed for the three books). Bardsong wording confirmed by owner: "Advanced TTRPG Character Builder" with a "Coming soon" badge.

## 7. Verification
- `npm run build` (astro check + build): 0 errors / 0 warnings / 0 hints, 9 pages.
- Nav `aria-current` present on `/creative/` and only on matching paths; sitemap contains `/creative/` and `/copper-leaf/`; Bardsong card has no anchor; one `<script>` per page (existing nav toggle only); grep for AI/generated/handmade/imprint/publisher in both pages: 0 hits.
- Temporary real-entry test (synthetic 2550×1649 PNG, then reverted): image served as WebP (1200 px wide), Amazon link rendered with `target="_blank" rel="noopener noreferrer"` and accessible name "View on Amazon: <title> (opens in a new tab)", warning listed only the remaining two. Fixtures removed.
- **Not performed:** live-browser checks at 320/768/1280 px and keyboard tab order (no preview session run); layouts rely on single-column/`md:grid-cols-2` classes and `aspect-ratio` frames. Served size of a *real* spread not measurable (no images).

## 8. Review outcome
Codex review **not run** (not attempted; prior phases found it unreliable here). No fix pass.

## 9. Out-of-scope items
None found.

## 10. Follow-ups
Owner to supply titles, lines, alt text, Amazon URLs and the three spread PNGs (and visually confirm none show PROOF/UNVERIFIED); do the browser viewport/keyboard pass once content is in.

## Addendum 2026-10-08 — real content and revised page design
- All three books now real (no placeholders): CL-001 *Great National Parks of America*, CL-002 *The Haunted Atlas*, CL-006 *Halloween & Spirit Traditions Around the World* (exact cover titles, per owner). Each shows cover, description, details line, "A look inside" with two spreads (each links to a 2550 px WebP in a new tab — no JS), and an Amazon button once `amazonUrl` is set (all still `null`; URLs not yet supplied).
- Owner-supplied copy used verbatim except: "imprint" wording replaced with "a line of coloring books from Clockwork Otter Foundry" (owner chose to keep the earlier no-imprint rule); nav label stays "Creative". Details line (30 illustrations, 8.5 × 11 in) is owner-supplied, not verified by me.
- All six spreads inspected: no PROOF/UNVERIFIED marks. Covers carry a coloured frame (blue on CL-001) that is part of the cover file.
- Not implemented: per-book "Coming soon" (conflicts with the original prompt; needs to know which titles are unpublished), ivory background (existing `--color-background` kept), site-wide "Creative Publishing" nav label.
- Build: 0 errors/0 warnings/0 hints; no placeholder frames in output. Browser viewport/keyboard checks still not run.

- Owner confirmed 2026-10-08: 30 illustrations with editorial notes, 8.5 × 11 in. Books without `amazonUrl` now show a plain "Coming soon" label (Amazon listings pending); it becomes the "View on Amazon" button when the URL is set.

- Owner request 2026-10-08: Copper Leaf page moved to `/copper-leaf/` (`src/pages/copper-leaf.astro`); the Creative nav link stays active on it, and the `/creative/` card links there. No redirect from the old URL (never deployed).
