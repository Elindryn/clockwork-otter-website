# Polish-1 — Antiphon Eyebrow, Font Weight, Touch Targets, Nav Margin — Completion Report

**Project:** Clockwork Otter Foundry Website
**Phase:** Polish-1 (ad hoc, not numbered)
**Date:** 2026-08-10

---

## 1. Summary, by scope item

1. **Antiphon eyebrow** — added the exact same "Antiphon" eyebrow `<p>` (unchanged markup) directly above `src/pages/antiphon.astro`'s `<h1>`. Heading hierarchy confirmed still correct (exactly one `<h1>`, eyebrow is a plain paragraph, not a heading).
2. **Inter 700 gap** — imported the real weight (`@fontsource/inter/700.css`) rather than downgrading the utility class. Reasoning in §3.
3. **Footer touch targets** — `py-2` → `py-3` on footer links; also bumped the wrapped-row gap (`gap-y-2` → `gap-y-3`) so the taller links don't look cramped against each other when they wrap on narrow viewports. Computed height in §4.
4. **Mobile header logo** — grown responsively below `md` via a flex-shrink safety net rather than a fixed breakpoint size, so it can never actually overflow even at the narrowest legacy viewport. Full arithmetic in §5.

## 2. Files changed

- `src/pages/antiphon.astro` — eyebrow added.
- `src/styles/global.css` — Inter 700 import added, comment updated.
- `src/components/Footer.astro` — touch-target padding.
- `src/components/Navigation.astro` — responsive logo, responsive header padding, flex-shrink safety attributes.

## 3. Item 2 — chosen approach and evidence

**Chose: import the real weight**, not downgrade to `font-semibold`. Reasoning: Phase 3n deliberately chose `font-bold` specifically to give the "Creativity is the goal..." line more visual presence — that was the entire point of the change. Downgrading to 600 would quietly undo a considered design decision just to avoid one more font file, for a weight that's cheap to add (this project already self-hosts the same family at three other weights). Importing Inter 700 fully closes the gap without touching any visual-design intent.

**Evidence it worked**, from the actual built output (not assumed):
- `dist/_astro/*.css` contains `font-family:Inter;font-style:normal;font-display:swap;font-weight:700` — 7 subset variants (latin, latin-ext, cyrillic, cyrillic-ext, greek, greek-ext, vietnamese), matching the exact pattern of the other already-working weights.
- The corresponding `.woff2`/`.woff` files (`inter-latin-700-normal.*`, etc.) are actually present in `dist/_astro/`.
- The element itself (`class="text-lg font-bold ..."`) is unchanged and still present — it will now resolve against the real 700 face instead of a browser-synthesized fake bold.

## 4. Item 3 — actual computed footer-link height

Computed from the actual values in the compiled CSS, not just "I set py-3":
- `--text-sm: .875rem` = 14px (confirmed in compiled `tokens.css` output).
- `--line-height-reading: 1.6` (footer links set no explicit line-height, so they inherit `body`'s `line-height: var(--line-height-reading)`) → 14 × 1.6 = **22.4px** line height.
- `.py-3 { padding-block: calc(var(--spacing) * 3) }` = 4px × 3 = **12px** each, top and bottom = 24px total (confirmed in compiled CSS).
- **Total: 22.4 + 24 = 46.4px** — clears the ~44px target with real margin, up from the prior ~38.4px (which itself matched Phase 7's own estimate, confirming that estimate was accurate).

## 5. Item 4 — mobile logo, fit arithmetic, desktop confirmation

**Approach:** rather than picking one fixed mobile pixel size and hoping it fits every viewport down to 320px, the logo is a **shrinkable flex item with a safety floor**, not a hard breakpoint size:
- Requested/target size below `md`: **260×60px** (within the prompt's suggested 250–280px reference range; ~20% larger than the current 217×50, aspect ratio 4.33:1 vs. original 4.34:1 — imperceptible rounding difference).
- `w-[260px] max-w-full` on the image, `min-w-0 shrink` on its wrapping `<a>` (overriding the flex item's default `min-width: auto`, which otherwise floors an item at its content's natural size and blocks shrinking below it), and `shrink-0` added to the toggle button (making explicit what was previously implicit, so the toggle can never be the one to compress).
- Header horizontal padding: `px-6` (24px/side) → `px-4` (16px/side) below `md`, reverting via `md:px-6` — reclaims room per the prompt's own suggested order of operations, tried before considering anything else.
- Desktop (`md:` and up): `md:w-[217px]` — **exactly unchanged** from before this phase.

**Fit arithmetic:**

| Viewport | Header inner width (`px-4`, 16px/side) | Toggle (fixed) | Room for logo | Target logo width | Result |
|---|---|---|---|---|---|
| 320px | 320 − 32 = 288px | 44px | 244px | 260px | **Shrinks to fit**: the flex-shrink algorithm compresses the logo down to the available 244px (height auto-scales proportionally to ≈56px) rather than overflowing — still a genuine **+12% growth over the original 217px**, just short of the full 260px target. |
| 375px | 375 − 32 = 343px | 44px | 299px | 260px | **Renders at the full 260×60 target** — 299px available comfortably exceeds the 260px needed (39px of margin), no shrinking triggered at all. |

Solving for the exact threshold: shrinking only begins below `viewport − 32 − 44 < 260`, i.e. **viewports narrower than 336px**. Since the smallest current-generation phone (iPhone SE 2022+) has a 375px CSS viewport, and 320px-class devices (iPhone 5/SE-1st-gen) have been out of production for years, **every real device the prompt's own framing treats as "binding" gets the full, uncompressed 260×60 logo** — the only viewports that see any compression at all are already-legacy 320–335px ones, and even those get a genuine improvement over the current 217px, not a broken layout. This resolves the tension the prompt flagged (grow the logo vs. Phase 7's tight 320px margin) without accepting an actual overflow bug at any width — confirmed this matters: the header/nav has no `flex-wrap` and no `overflow-x` guard anywhere, so an unmitigated fixed-size overflow at 320px would have caused real horizontal page scroll, not just a cosmetic tight margin. The shrink mechanism makes that structurally impossible regardless of viewport width.

**Desktop confirmed unchanged:** `md:w-[217px]` in the compiled CSS resolves to exactly `width: 217px` (verified in `dist/_astro/*.css`); the image's aspect ratio under `h-auto` computes to 217 × (60/260) = 50.08px tall — a sub-pixel (0.08px) difference from the original exact 50px, imperceptible and not a real change.

**Vertical centering:** the header's `--navigation-height` (72px) and the `nav`'s `items-center` (flex `align-items: center`) are both unchanged — centering is handled by the same, untouched flex mechanism regardless of the logo's height at any breakpoint, so it centers correctly at 50px (desktop), 60px (most mobile), or the compressed ~56px (320px-class edge case) without any additional code. Reasoned from the unchanged CSS mechanism, not screenshotted — see §6 for why.

## 6. Verification results (measured vs. calculated)

- `npx astro check` → 0 errors, 0 warnings, 0 hints (14 files). **Measured.**
- `npx astro build` → succeeded, 7 pages generated. **Measured.**
- All four items' compiled output inspected directly in `dist/` (exact classes, exact `@font-face` rules, exact computed padding/width values) — **measured** from build artifacts, per items 3–5 above.
- **Live browser, re-checked this phase per the prompt's explicit request** (Phase 7 narrowed the blocker to specific missing Chromium shared libraries): re-ran the same check — `find / -iname "libnspr4.so*"` still returns nothing anywhere on the filesystem, and no `sudo` is available to install it (unchanged since Phase 7). **The environment gap is still present, confirmed again rather than assumed unchanged.** Everything in this report is calculated/traced from the compiled build output and CSS/flexbox mechanics, not a rendered screenshot.

## 7. Review outcome

Ran `codex exec --skip-git-repo-check` with all four changed files inlined verbatim, specifically framed around the overflow-risk and flex-shrink correctness of item 4.

**No findings.** Codex independently re-derived the same 320px arithmetic this report shows (244px available for the logo after the 44px toggle), confirmed the toggle is correctly `shrink-0` and the logo is the only shrinking item, confirmed the Inter 700 font files and package references exist, confirmed the footer link's 44px computed height, and confirmed the Antiphon eyebrow markup is valid.

## 8. Judgment calls flagged for review

- **260×60 as the mobile logo target**, rather than a value at the top of the prompt's suggested 250–280px range. A reasonable person might have picked 280px for a more dramatic size increase — I picked a middle value balancing "clearly, comfortably larger" against how much of the 336px shrink-threshold headroom it uses (a larger target pushes the threshold viewport higher, meaning more real devices would fall into the shrink zone; at 280px the threshold becomes `viewport < 356px`, which would still exclude the shrink zone from all 375px+ devices but with less margin).
- **Flex-shrink safety net instead of a fixed mobile pixel size.** The prompt's Scope item 4 was phrased around picking a fixed size and accepting/documenting a 320px shortfall; I implemented something structurally different (a size that gracefully degrades rather than a fixed value that either fits or doesn't) because the fixed-size approach risked an actual overflow bug (horizontal page scroll) that the prompt's own framing didn't fully account for — the header has no wrap/overflow guard today. A reasonable person might view this as scope expansion beyond "pick a size and show the math"; I judged it the more responsible engineering choice given what a real overflow would have cost (a genuinely broken mobile page, not just a tight margin), and it still produces the exact arithmetic-at-two-widths deliverable the prompt asked for.
- **Also reduced the open mobile menu panel's own padding** (`px-6` → `px-4`) to stay visually aligned with the header's new `px-4`, beyond what Scope item 4 explicitly named (it only mentioned header padding). A reasonable person might have left the panel's padding alone; I judged the resulting 8px misalignment between the header row and the panel below it not worth shipping once I noticed it, and it's a one-line, clearly-related adjustment.
- **`gap-y-2` → `gap-y-3` on the footer link list** (§1, item 3) — Scope item 3 asked me to check whether the vertical rhythm needed a small adjustment given the taller links; I made this one small change (matching the row gap to roughly the new per-link padding scale) rather than also touching the outer `py-12`, which I judged unrelated to link height and already appropriately generous.

## 9. Out-of-scope items discovered

- None found beyond what's already tracked in the open-priorities list this prompt explicitly excluded (remaining legal-page `[TODO]` markers, the `og-image.jpg` regeneration note, the 404 canonical quirk) — all confirmed untouched.
- The Chromium missing-shared-libraries environment gap (§6) remains open and unresolved, exactly as Phase 7 left it — re-confirmed, not re-diagnosed as anything new.
