# Phase 3n — Homepage Visual Refinement (Watermark, Eyebrow, Spacing) — Completion Report

**Project:** Clockwork Otter Foundry Website
**Phase:** 3n (interstitial, continues 3b–3i numbering; homepage-only)
**Date:** 2026-08-10

---

## 1. Files modified

- `src/pages/index.astro` — eyebrow label, "Creativity is the goal..." treatment, section padding, watermark insertion point.
- `src/components/BrandWatermark.astro` — **new**.

No other files touched. `src/components/Button.astro`, `src/styles/tokens.css`, `src/components/Navigation.astro`, `src/components/Footer.astro`, and every other page were confirmed untouched (see §6, Scope item 7).

## 2. Exact design changes made, by Scope item

**Item 1 (hero, verification only).** Confirmed unchanged: no edits touched the hero section. Its markup is byte-identical to the pre-phase state.

**Item 2 ("Creativity is the goal...").**
- Spacing above: `mt-4` (16px) → `mt-8` (32px), doubled.
- Typography: `font-semibold` (600) → `font-bold` (700), plus a step up from the section's default body size to `text-lg` (1.125rem/18px).
- Added the optional thin rule: a `12px`-wide, `1px`-tall `div` (`h-px w-12`) in `var(--color-brand-copper)`, `12px` below it (`mb-3`) before the line, `aria-hidden="true"` (purely decorative).
- Copy text itself unchanged.

**Item 3 ("ANTIPHON" eyebrow).**
- Added `<p>Antiphon</p>` directly above the section's `<h2>`, styled `text-xs` (12px), `font-semibold`, `tracking-wide`, `uppercase` (source text stays "Antiphon" — see §5 on why), color originally `var(--color-brand-copper)`, **changed to `var(--color-action-primary)`** after the Codex review (see §10).
- `mb-2` (8px) gap before the heading.
- Homepage only — `src/pages/antiphon.astro` untouched, per explicit scope.

**Item 4 (spacing reduction — see full math in §8).** `py-24` on both sections → split into independent top/bottom: "Tools Built With Purpose" is now `pt-24 pb-20`; "Antiphon Home Page Introduction" is now `pt-20 pb-24`. Combined transition space: 192px → 160px (16.67% reduction, inside the 15–25% band). Outer edges (space below hero, space above footer) both remain at the original 96px (`pt-24`/`pb-24`), untouched.

**Item 5 (watermark — see §3–4 for full detail).** Added, sized 600×600px, positioned `right: -180px` (30% off-screen), vertically centered on the section boundary via a zero-height positioning wrapper, `opacity: 0.04` (4%), Foundry Copper via CSS mask.

**Item 6 (logo-usage confirmation).** Confirmed: this phase adds no new logo/wordmark placement. The watermark uses the mark-only SVG (`clockwork-otter-logo-mark-black.svg`) purely as a mask shape recolored to Copper at 4% opacity — a decorative texture, not a third logo placement. Header (small, reversed) and hero (primary, white/reversed) remain the only two logo appearances on the page.

**Item 7 (CTA states, verification only).** `git diff --stat` against `src/components/Button.astro` and `src/styles/tokens.css` shows zero changes this phase — confirmed clean, no accidental edits.

**Item 8 (responsive/accessibility review).** See §4–5.

## 3. Watermark implementation technique

`BrandWatermark.astro`, imported and placed as `<BrandWatermark />` between the two light sections in `index.astro`:

```astro
<div class="watermark-clip" aria-hidden="true">
  <div class="watermark"></div>
</div>
```

- `.watermark-clip`: `position: relative; overflow-x: clip;` — a zero-height, non-content wrapper (no children contribute to its flow height, since `.watermark` is `position: absolute`). Its `top: 0` reference point sits exactly at the boundary between the two sections regardless of either section's actual rendered height, since it's a sibling inserted directly at that point in the DOM rather than a percentage-based reference against either section's box.
- `.watermark`: `position: absolute; top: 0; right: -180px; width/height: 600px; transform: translateY(-50%);` — the `translateY(-50%)` centers the 600px mark vertically on that zero-height boundary point. `right: -180px` on a 600px-wide element = exactly 30% of it extending past the container's right edge (`180/600 = 0.30`), inside the 25–40% target.
- Color/shape: `background-color: var(--color-brand-copper); opacity: 0.04;` combined with `mask-image`/`-webkit-mask-image` referencing the existing `clockwork-otter-logo-mark-black.svg` (unmodified — the SVG file itself was never touched, only referenced as a mask shape) at `mask-size: contain; mask-repeat: no-repeat; mask-position: center`.
- `z-index: -1;` — see §10, this was added deliberately after checking stacking order rather than assuming DOM order was sufficient.
- `pointer-events: none;` on the mark, `aria-hidden="true"` on the wrapper.

**Deviation from the suggested `define:vars`/mask approach — a real bug found and worked around, not a style choice.** The suggested technique (`mask-image: url(var(--maskUrl))`, i.e., a `var()` nested inside `url()`) was tried first and **silently emptied the entire CSS rule** in this project's build pipeline — reproduced in isolation with a minimal test component (a plain `position: absolute` div with no mask at all built correctly; adding a single `mask-image: url(var(--x))` declaration, even referencing an undefined variable, caused the whole rule's declarations to vanish from the compiled output). Confirmed this wasn't a minification artifact by rebuilding with `vite.build.cssMinify: false` (temporarily, then reverted — `astro.config.mjs` is untouched in the final diff) — the unminified output showed the exact same missing properties, so the bug is in the CSS transform/scoping step, not the minifier.

**Workaround:** define the CSS custom property to already hold the complete `url(...)` value (`const maskUrl = \`url(${mark.src})\`` in frontmatter), then reference it bare (`mask-image: var(--maskUrl)`, no nested `url()`). This produces functionally identical CSS and was verified to compile completely and correctly. Documented inline in the component with a comment explaining why, so a future edit doesn't reintroduce the nested form and silently break again.

## 4. Desktop/mobile behavior

- **Desktop/tablet (≥768px):** watermark renders at fixed 600×600px, positioned as described in §3.
- **Mobile (<768px, matching `--breakpoint-md`):** `display: none` — **hidden entirely**, not reduced/repositioned. Chosen over a scaled-down version because at narrow viewports the two light sections' text columns already occupy most of the available width; even a much smaller version of a 600px mark risks sitting directly under or through body text rather than safely off to the side, and the brief explicitly said to prefer hiding over a version that "would still clutter or threaten readability." A purely decorative element with zero layout dependency (confirmed — see §5) costs nothing to simply omit at narrow widths.
- The 767px breakpoint is a plain CSS media query (`@media (max-width: 767px)`), hardcoded to match `--breakpoint-md`'s value (768px) rather than referencing the token directly — CSS custom properties can't be used inside media-query conditions, so this is the closest equivalent; noted in the component's own comment for future maintainers.

## 5. Accessibility considerations

- `aria-hidden="true"` on the outer `.watermark-clip` wrapper — both inner divs are empty (no text content), so they have no accessible name and no role regardless, but the explicit `aria-hidden` guarantees removal from the accessibility tree rather than relying on "empty div" behavior being implementation-defined.
- `pointer-events: none` — never intercepts clicks/taps, never focusable (no `tabindex`, not an interactive element).
- **Stacking order re-verified, not assumed** (per the phase's explicit instruction not to trust "DOM order + transparent backgrounds" blindly): neither light section sets its own `background-color` (both inherit `body`'s Foundry Paper), and the watermark visually overlaps the tail end of the section *before* it in the DOM as well as the section after. Without an explicit `z-index`, plain DOM order would have painted the watermark **in front of** the "Tools Built With Purpose" section's content in the overlap region (since that section comes first in markup) while correctly staying behind the Antiphon section (which comes after). Fixed by adding `z-index: -1` to `.watermark`, which — since neither `.watermark-clip` nor either section sets its own `z-index` (so none of them individually establish an isolated stacking context) — places the mark behind *all* normal-flow content in the surrounding stacking context, both sections included. Confirmed in the compiled build output that `z-index:-1` is present in the shipped CSS.
- Content readability with the watermark removed: the watermark has no layout participation whatsoever (`position: absolute`, contributes 0 to document flow) — deleting the `<BrandWatermark />` line would leave the two sections' spacing, headings, and copy completely unaffected. Verified structurally, not just asserted.
- Eyebrow label reads "Antiphon" in the DOM/accessible tree (Title Case), with the all-caps *visual* presentation applied via the `uppercase` CSS utility rather than typing "ANTIPHON" literally into the markup — this avoids a known screen-reader gotcha where short, all-caps text in the source can be announced letter-by-letter as if it were an acronym/initialism in some browser/AT combinations. Visually it renders identically to the brief's "ANTIPHON."
- Eyebrow contrast — see §10, a real failure was found and fixed.

## 6. Design-system tokens used

`--color-brand-copper` (watermark fill, decorative rule), `--color-action-primary` (eyebrow text, post-fix), `--color-text-primary` (closing-line text), `--breakpoint-md`'s value (768px, referenced by number in the media query since custom properties aren't usable in media conditions), existing spacing scale (`pt-24`/`pb-20`/`pt-20`/`pb-24`, `mt-8`, `mb-2`, `mb-3`), existing type scale (`text-lg`, `text-xs`, `font-bold`, `font-semibold`). No new tokens invented; `--reading-max-width` untouched as required.

## 7. Anything that could not be implemented exactly as specified

The suggested `mask-image: url(var(--x))` implementation technique itself could not be used as specified — see §3 for the bug found and the equivalent workaround used instead. Every visual/behavioral requirement in Scope item 5 was still met; only the specific CSS syntax differs from the prompt's suggested form (which the prompt itself flagged as "a suggestion, not a mandate").

## 8. Spacing-reduction math (Scope item 4)

- Before: `py-24` (96px) on both sections' meeting edges → 96 + 96 = **192px** combined transition space.
- Target band (15–25% reduction): 144px–163.2px.
- Chosen: `pb-20` (80px) on "Tools Built With Purpose", `pt-20` (80px) on the Antiphon section → 80 + 80 = **160px**.
- Reduction: (192 − 160) / 192 = **16.67%**, inside the 15–25% band, using only Tailwind's existing spacing scale (no arbitrary pixel value needed).
- Outer edges confirmed unchanged: "Tools Built With Purpose" keeps `pt-24` (96px, space below hero); the Antiphon section keeps `pb-24` (96px, space above footer).

## 9. Verification results (measured vs. calculated)

- `npx astro check` → 0 errors, 0 warnings, 0 hints (14 files). **Measured** (actual tool run).
- `npx astro build` → succeeded, 7 pages generated, `dist/` structure unaffected beyond `index.html`'s content (confirmed the watermark's CSS/markup appears only on the homepage). **Measured.**
- Compiled CSS inspected directly in `dist/index.html` to confirm every declared property survived the build (position, top, right, width, height, transform, background-color, opacity, mask-image, z-index, the `@media` hide rule) — **measured**, not assumed, specifically because the first implementation attempt silently lost most of these and only direct inspection caught it.
- **Live browser attempted, partially available, ultimately not usable.** Unlike some prior phases, a Playwright Chromium binary was actually already cached in this environment and installed successfully. However, `astro preview` did not bind to its port within a reasonable wait (no server response, no error output either), so no live render/screenshot was actually captured. Everything reported as "confirmed" in this report is a **calculated/traced verification from the actual compiled build artifacts** (dist/ output, computed CSS, contrast math), not a rendered screenshot — flagged explicitly per this project's standing discipline. Horizontal-overflow prevention (`overflow-x: clip` on the zero-height wrapper, independent of `overflow-y` which is left at its default so the mark can still overflow vertically past the wrapper) is reasoned from CSS Overflow Module semantics and is a widely-established, well-supported pattern in current browsers (the same technique behind Tailwind's own `overflow-x-clip` utility), not independently re-verified pixel-by-pixel in a real viewport.
- Screen-reader exposure: confirmed via the compiled HTML that `aria-hidden="true"` is present on the wrapper and both inner divs carry no text/accessible name — **measured** from build output, not a live AT test (no screen reader available in this environment).
- Contrast math (§10): computed via the standard WCAG relative-luminance formula, cross-checked against the exact hex values present in the compiled `tokens.css` output — **calculated**, consistent with every prior phase's contrast-verification method in this project.

## 10. Review outcome

Ran `codex exec --skip-git-repo-check` with `src/pages/index.astro` and `src/components/BrandWatermark.astro` inlined verbatim (positional argument, `--skip-git-repo-check`).

One finding, fixed:

- **Confirmed and fixed — eyebrow label contrast failure.** Codex computed `--color-brand-copper` (`#b87333`) against the page background (`#f7f7f5`) at **3.54:1**, below the 4.5:1 WCAG AA minimum for normal (non-large) text — the eyebrow's `text-xs` (12px) doesn't qualify for the 3:1 large-text exception. This was a genuine defect introduced by this phase's own new eyebrow element, not a pre-existing issue. Fixed by swapping the eyebrow's text color from `var(--color-brand-copper)` to `var(--color-action-primary)` (the already-approved, Brand-1-derived darker Copper shade used elsewhere for the primary CTA, computed at **4.67:1** — passes). This isn't a new color invention; it reuses an existing, already-vetted token rather than picking an arbitrary new shade.

Codex also explicitly checked the watermark's stacking/overflow setup and reported no issue found there (its own note: "I did not find a concrete issue with the watermark stacking/overflow in the current surrounding layout"), and separately noted it couldn't run a full Astro build in its own sandbox (read-only filesystem) — this doesn't affect my own verification, which used my own working build environment (§9).

## 11. Judgment calls flagged for review

- **Eyebrow color swap to `--color-action-primary` rather than a new copper-text token.** A reasonable person might prefer introducing a distinct `--color-text-copper` (or similar) semantic token rather than reusing the action/button-semantic token for a decorative label — I chose reuse specifically because the design system explicitly prohibits inventing new color values, and this shade is already brand-approved and already serves a "Copper, but darkened for text/foreground contrast" role elsewhere on this exact page (the CTA buttons).
- **`z-index: -1` fix for the watermark stacking order.** Chosen after determining plain DOM order was actually insufficient (see §5) — a reasonable person doing a lighter-touch review might have missed this since the visual effect at 4% opacity is subtle either way, but the phase prompt specifically asked not to assume this was handled.
- **Hide-not-reduce for mobile.** A reasonable person might prefer a small, further-cropped version rather than nothing at all on mobile, for visual consistency with desktop. I judged full removal safer given the "prefer hiding if a reduced version would still clutter" guidance and the tight text columns at narrow widths.
- **`text-lg font-bold` for "Creativity is the goal..."** — a modest but real step up (18px/700 vs. the prior implicit 16px/600). A reasonable person might have judged an even smaller bump (e.g., staying at the base size but only changing weight) sufficient; I judged a combined size+weight change gave it enough presence to read as intentional emphasis without approaching "pull-quote" territory.
- **Mask-image workaround discovery.** Spent meaningful verification effort here rather than trusting the prompt's suggested syntax to "just work" — flagging this pattern (`url(var(--x))` inside a scoped Astro `<style>` on this stack) as worth remembering for any future phase that reaches for CSS masks, since it reproduces reliably and isn't specific to this one component.

## 12. Out-of-scope items discovered (flagged, not implemented)

- `src/pages/antiphon.astro` doesn't have the same "ANTIPHON" eyebyrow treatment — Scope item 3 explicitly said this is homepage-only and flagged applying it elsewhere as a follow-up decision, not this phase's job. Noting it here as the prompt requested.
- The `mask-image: url(var(--x))` bug reproduces independent of this specific component (confirmed via an isolated minimal test case) — worth a note in this project's own methodology/lessons file if this project keeps one, since any future phase using a CSS mask on this stack will hit the same silent failure.

---

Per the brief's own explicit instruction: **stopping here for visual review.** No further stylistic changes made beyond Scope items 1–8.
