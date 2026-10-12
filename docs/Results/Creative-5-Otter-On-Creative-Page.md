# Creative-5 — Completion Report

1. **Summary.** `/creative/` now has the mascot in a left column (≥ md) with projects as stacked full-width rows; on mobile he sits centered (w-40) above the heading. Implemented with a CSS grid: otter wrapper in col 1/row 2 sized to 60% of the image height, image absolutely positioned and lifted `-translate-y-[40%]` so the elbow (~40% down) lands on the first row's top edge. No JS, no tokens/colors changed. `CreativeCard.astro` became a row (flex row ≥ sm, button right and vertically centered; same surface/quiet styles).
2. **Safety.** Started at `main` = c74e370 (after 95f1c3c); the harness-created worktree `worktree-creative-5` was based on 95f1c3c (satisfies "at or after"). Brand repo only read (one file copied). Nothing committed.
3. **Files changed.** Added `src/assets/images/otter/otter-gear-toss.png`, this report. Updated `src/pages/creative/index.astro`, `src/components/CreativeCard.astro`.
4. **Not changed.** Everything else; `global.css` not needed.
5. **Docs.** None needed.
6. **Impact.** One page's layout; one new public image (2 MB source PNG; not shipped, only WebP derivatives).
7. **DB.** None.
8. **Verification.** SHA-256 source = copy = `efcfc210f97c5aba8e3884caf14d764ebccb54fc80922f8c0575e055963ec7d6`. `npm run build` (includes `astro check`) passes, run twice. WebP sizes: 320w 37 kB, 480w 68 kB, 640w 102 kB, 720w 122 kB, default (largest generated) 186 kB. `dist/creative/index.html`: one otter `<img>` with the specified alt, WebP srcset, width=1024/height=1536, eager/async; h1 then two h2s; "See the books" → `/copper-leaf/`; Bardsong has no link; the only `<script type="module">` is the site-wide nav script (identical on /about/), none added.
   **Visual check: NOT done.** No headless browser is installed (both Playwright MCP servers failed: Chromium/Chrome missing). I did not see the page at 360/768/1280 px, so the elbow alignment, overlap, horizontal scroll and halo are unverified; the 40% elbow figure comes from the prompt, and the 10rem top padding (`md:pt-[10rem]`) reserving room for his upper body/gear is a guess to be checked by eye.
9. **Review.** Codex ran once. One finding (P2): with the 2.5rem column gap the image stays in column 1, so the elbow could sit 40px short of the row. Fixed by widening the image on ≥ md to `calc(100%+2.5rem)`; rebuilt green. Side effect: image height grows slightly relative to its wrapper, so the lift is ~24px off the 40% math; needs an eye check.
10. **Out of scope / asset.** Halo/fringe not assessed (no rendering). Asset not edited.
11. **Follow-ups.** Eyeball at 360/768/1280 and tune `md:pt-[…]`/translate; homepage Creative teaser; OG image; mirrored pose variant.
