# Creative-1 — Copper Leaf Editions: Completion Report

**Date:** 2026-10-08
**Status:** merged (PR #9) and live at `clockworkotterfoundry.com`. Follow-up PR #10 (closing-line spacing fix) open, held by owner until a separate page goes live.

## 1. Summary
Added a flat **Creative** nav/footer link, a `/creative/` index, and the Copper Leaf Editions page. The prompt was written for one spread per book with placeholder entries; the owner then supplied real books and a revised page design, so the shipped result differs from the prompt in the ways listed in §6.

- `/creative/` — Copper Leaf Editions (linked, first) and Bardsong (non-interactive "Coming soon" card, "Advanced TTRPG Character Builder", owner-supplied wording).
- `/copper-leaf/` — **top-level URL by owner request** (not `/creative/copper-leaf-editions/`). Intro, three stacked books, closing section.
- Each book: cover, exact printed title, owner-supplied description, details line ("Coloring book for adults · 30 illustrations · 8.5 × 11 inches", confirmed by owner), "A look inside" with two sample spreads, and a plain "Coming soon" label until `amazonUrl` is set (then a "View on Amazon" button).
- Covers and spreads open in a large **CSS-only** (`:target`) preview overlay — no client-side JavaScript added.
- Thin warm-gray divider above each book after the first.
- No new dependencies; tokens, Antiphon and legal pages untouched.

## 2. Real vs placeholder books
All three are **real**; placeholder mode remains in code as a safeguard (also logs a build-time warning).

| Slot | Title (exact printed) | Files in `src/assets/images/copper-leaf/` | Amazon URL |
|---|---|---|---|
| CL-001 | Great National Parks of America | `CL-001-Cover.png`, `CL-001-Spread1.png`, `CL-001-Spread2.png` | **pending** (`null`) |
| CL-002 | The Haunted Atlas | `CL-002-Cover.png`, `CL-002-Spread1.png`, `CL-002-Spread2.png` | **pending** (`null`) |
| CL-006 | Halloween & Spirit Traditions Around the World | `CL-006-Cover.png`, `CL-006-Spread1.png`, `CL-006-Spread2.png` | **pending** (`null`) |

All six spreads were inspected: no PROOF/UNVERIFIED marks. Covers have a coloured frame (part of the cover files). Source folder was moved out of the repo to `../copper-leaf-source`.

## 3. Files changed
Added: `src/data/copper-leaf-books.ts`, `src/components/CreativeCard.astro`, `src/pages/creative/index.astro`, `src/pages/copper-leaf.astro`, nine images in `src/assets/images/copper-leaf/`, `docs/Prompts/Creative-1-Copper-Leaf-Editions.md`, this report.
Updated: `src/components/Navigation.astro` (Creative link; `also` prefix list so the link stays active on `/copper-leaf/`), `src/components/Footer.astro`, `CLAUDE.md`, `docs/Prompts/PROMPT_LOG.md`.

## 4. Files not changed
Nothing from the allowed list was unnecessary. `astro.config.mjs`, tokens, `package.json`, workflows untouched.

## 5. Documentation changes
`CLAUDE.md` Standing Decisions: new "Creative section" entry (flat nav, `/copper-leaf/` URL, data-file convention, image location, CSS-only previews, "Coming soon" rule, copy rules). `PROMPT_LOG.md`: Creative-1 row, status `executed`.

## 6. Design-system conformance and deviations from the prompt
- Existing tokens only; the warm-gray divider and quiet-card borders are `color-mix` of existing tokens (no border-colour token exists). Site background stays `--color-background` (owner's "warm ivory" suggestion not adopted — would need a token change).
- **Owner overrides of the prompt:** (a) page URL `/copper-leaf/`; (b) two spreads + cover per book instead of one spread; (c) per-book "Coming soon" label (prompt said render nothing); (d) in-page large preview instead of a plain image.
- **Copy rules kept** (owner confirmed when pasted design copy used "imprint"): no "imprint"/"publisher" wording — replaced with "a line of coloring books from Clockwork Otter Foundry"; nav label stays "Creative", not "Creative Publishing"; silent on how the art is made; no ecommerce elements.
- Titles use the exact cover titles, not the shortened ones in the owner's pasted copy.
- "30 illustrations" and "8.5 × 11 inches" are owner-supplied and owner-confirmed.
- The preview overlay is CSS-only: no focus trap and **Escape does not close it** (Close link, backdrop click and browser Back do). Adding a script for Escape would be a second JS exception to the zero-JS decision; not done, owner not yet asked to decide.

## 7. Verification
- `npm run build` (astro check + build): 0 errors / 0 warnings / 0 hints, 9 pages, on every revision.
- Built HTML: Creative link `aria-current` on `/creative/` and `/copper-leaf/`; both pages in the sitemap; Bardsong card has no anchor; one `<script>` per page (existing nav toggle); no hits for AI/generated/handmade/imprint/publisher in the page copy.
- Images served as WebP: spreads ~90–135 kB at 1200 px, full-size preview ~250–390 kB at 2550 px, covers ~115 kB.
- Temporary real-entry test before real content arrived (synthetic image, Amazon link rendering, placeholder warning) — fixtures removed.
- **Not performed:** viewport checks (320/768/1280 px) and keyboard tab order — the headless browser is not installed in this environment (`chrome-for-testing` missing) and WSL cannot reach the Windows-side preview. Owner reviewed the live site manually after deploy and reported one defect (see §8).

## 8. Review outcome
Codex review **not run**. Post-deploy owner review found one defect: the closing line rendered "…books fromClockwork Otter Foundry" because Astro trimmed whitespace before the inline link. Fixed with an explicit `{" "}` and verified in built HTML; shipped in **PR #10** (open, awaiting owner merge). No other findings recorded.

## 9. Out-of-scope items discovered
- Headless browser not installed here, so automated viewport/keyboard verification is unavailable in this environment.
- The repo root previously held the owner's source image folder (19 MB, untracked); moved outside the repo to avoid committing it to a public repo.

## 10. Suggested follow-up tasks
1. Owner to supply the three Amazon URLs (plain `https://www.amazon.com/...`, no tracking) — set `amazonUrl` per book; each "Coming soon" becomes the button.
2. Merge PR #10.
3. Decide whether Escape-to-close on the preview is worth a second small JS exception.
4. Manual viewport (320/768/1280 px) and keyboard pass on `/creative/` and `/copper-leaf/`.
5. Consider a real "border"/warm-gray token and an ivory background in the brand repo if the owner wants these as system-level choices.
