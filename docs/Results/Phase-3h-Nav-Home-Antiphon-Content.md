# Phase 3h — V1 Navigation, Footer, Home, Antiphon, About, Contact Content — Completion Report

**Project:** Clockwork Otter Foundry Website
**Phase:** 3h (interstitial, continues 3b–3g numbering; first phase of the new V1 roadmap)
**Date:** 2026-08-10

---

## 0. Baseline discrepancy (read this first)

This prompt's "Current site structure" section describes a pre-3g baseline (`Navigation.astro` links `Home | Products | Documentation | About | Contact`, logo `width={194} height={45}`, `src/pages/products/index.astro` + `example-product.astro`). The actual repository state at the start of this phase already reflected **Phase 3g's** completed work (`docs/Results/Phase-3g-Visual-Polish.md`, dated 2026-08-09): logo already at `width={217} height={50}` (already inside the 10–15% band), nav/footer already relabeled `Products` → `Antiphon` pointing at `/products/antiphon`, and `src/pages/products/antiphon.astro` (not `index.astro`/`example-product.astro`) as the single product page. Phase 3g's own report notes its CTA-color/focus-ring scope item was blocked on `CLOCKWORK-BRAND1`, which explains why `tokens.css`/`Button.astro` were still untouched exactly as this prompt described.

I worked from the actual repository state, not the prompt's stated baseline. Net effect on scope: item 1's logo resize was already done (verified, not re-done); every other scope item's *destination* state (nav/footer copy and hrefs, `/antiphon` as a new top-level route, deletion of `/products` and `/documentation`) was carried out as specified regardless of the intermediate starting point.

---

## 1. Summary by scope item

1. **Navigation** — Links now `Home | Antiphon | About | Contact`. `Antiphon` → `/antiphon`. Logo confirmed already at `width={217} height={50}` (+11.9%/+11.1% from the original `194×45`, both inside the 10–15% band, aspect ratio 4.34:1 vs. original 4.31:1) — no change needed, no edit made.
2. **Footer** — Links now `Home, Antiphon, About, Contact, Privacy Policy, Terms of Use`, in that order. `Antiphon` → `/antiphon`. `Privacy Policy`/`Terms of Use` keep their existing URLs (`/privacy-policy`, `/terms-of-service`); only the "Terms of Use" label changed. Copyright line unchanged (already dynamic-year, already names "Clockwork Otter Foundry").
3. **Home page** (`src/pages/index.astro`) — Rewritten to hero + two sections (Tools Built With Purpose, Antiphon Home Page Introduction). Old placeholder intro section, 3-card grid, and closing Contact CTA section removed entirely. Hero tagline unchanged; description and CTA replaced per LOCKED copy. `BaseLayout` given `title="Clockwork Otter Foundry"` and the specified `description`.
4. **Antiphon page** (`src/pages/antiphon.astro`, new) — Single page with the LOCKED heading, the three-paragraph description (same copy as Home's Antiphon section), and the plain V1 status line. No feature grid, screenshot, pricing, download button, or documentation link. `src/pages/products/` (containing `antiphon.astro`, the actual file present — see §0) deleted entirely.
5. **Documentation route removed** — `src/pages/documentation/` deleted entirely (was just `index.astro`).
6. **About page** — Replaced with the LOCKED founder copy, signed "— Rob G.". No team/history/office/investor content added.
7. **Contact page** — Replaced with the LOCKED copy and a real `mailto:` link to `info@clockworkotterfoundry.com`. No form, no newsletter signup, no tracking.
8. **Primary CTA color** — `--color-action-primary` now `color-mix(in srgb, var(--color-brand-copper) 85%, black)` (≈`#9c622b`); `--color-action-secondary` unchanged. Verified `--button-primary-background` derives from it and `--button-primary-background-hover`'s existing formula now yields ≈`#855325` (both confirmed by reading `tokens.css` and by inspecting the Tailwind-compiled output in `dist/`, not assumed). Added `--button-primary-background-active` and `Button.astro`'s `active:` class. Added the two-tone focus-visible halo to the primary variant, resolving the Charcoal-on-Charcoal gap (see §2).

## 2. Focus-ring Charcoal-context gap — resolution

**Contexts checked:** the hero CTA (Home page, section background = Foundry Charcoal `#2b2b2b`) and the two light-section CTAs (Home's Antiphon-introduction section and the Antiphon page's would-be CTA location — confirmed both light sections have no explicit background color, so they inherit `body`'s `--color-background` = Foundry Paper `#f7f7f5`). The Antiphon page itself has no button per Scope item 4's "do not add" list, so in practice the primary CTA only appears in two live contexts: the Charcoal hero and the Paper-background Antiphon-intro section on Home.

**Math (independently re-derived, not trusted from BRAND1's doc comment alone):**

- White inner ring vs. the copper action-primary fill (`#9c622b`): **5.01:1** (recomputed via WCAG relative-luminance formula) — passes 3:1, matches the design-token doc's own figure.
- Charcoal outer ring vs. Foundry Paper (`#f7f7f5`): **13.20:1** — passes comfortably, matches the doc.
- Charcoal outer ring vs. Foundry Charcoal itself (the actual hero context): **~1.0:1** — the gap this phase exists to close. Confirmed the doc's single-fixed-color conclusion by testing the alternative directly rather than trusting it blind: **White outer ring vs. Foundry Charcoal: 14.15:1** — passes, but a fixed white outer ring would in turn fail against Foundry Paper (contrast ~1:1, invisible), so no single fixed color clears 3:1 in both contexts — the doc's conclusion held up under an independent check.

**Fix implemented:** `--color-focus-ring-outer` defaults to Charcoal at `:root` in `tokens.css` (correct for the light-section CTA). The hero section in `index.astro` overrides it locally to white via its own inline `style` attribute (`--color-focus-ring-outer: #ffffff;`, alongside its existing `background-color: var(--color-brand-charcoal)`), so the override only applies to buttons actually sitting on that Charcoal background — no new prop or class needed, just CSS custom-property cascade. `Button.astro`'s primary variant gets a scoped `:focus-visible` rule using `box-shadow: 0 0 0 2px var(--color-focus-ring-inner), 0 0 0 4px var(--color-focus-ring-outer)` in place of the default outline.

## 3. Header logo — final dimensions

`width={217} height={50}` (unchanged this phase — already set in Phase 3g, confirmed still within the 10–15% band from the original `194×45`). `--navigation-height`/`--header-height` remains 72px, untouched. **Calculated confirmation, not a live-browser measurement** — no browser/GUI is available in this environment (consistent with every prior phase's limitation); the flex/height CSS controlling vertical centering is unchanged from Phase 3g, so the prior phase's reasoning (50px logo centers within the unchanged 72px flex row with room on both sides) still holds.

## 4. LOCKED copy verbatim confirmation

Every LOCKED/verbatim block in the prompt (hero tagline — unchanged — hero description, Tools Built With Purpose's three paragraphs + closing line, Antiphon Home-intro's three paragraphs + closing line reused identically on the Antiphon page, About's five paragraphs + signature, Contact's opening line + mailto address) was grepped directly against the rendered source files and matches exactly, character for character. No paraphrasing.

## 5. Files changed

- `src/components/Navigation.astro` — links updated; `border-b-[var(--border-width-medium)]` → `border-b-[length:var(--border-width-medium)]` (bug fix, see §7)
- `src/components/Footer.astro` — links updated
- `src/components/Button.astro` — active state, focus-visible halo on primary; `border-[var(--border-width-medium)]`/`outline-[var(--border-width-medium)]` → `[length:...]` form on secondary (bug fix, see §7)
- `src/pages/index.astro` — rewritten (hero copy/CTA, two new sections, old sections removed)
- `src/pages/antiphon.astro` — **new**
- `src/pages/about.astro` — rewritten
- `src/pages/contact.astro` — rewritten
- `src/styles/tokens.css` — CTA color, active-state token, focus-ring tokens
- `src/components/ProductCard.astro` — **deleted** (confirmed unused: grepped `src/` for `ProductCard` before deleting, zero usages once `index.astro` and `products/` were updated/removed)
- `src/pages/products/` — **deleted** entirely (contained only `antiphon.astro`, the file actually present per §0, not the `index.astro`/`example-product.astro` pair the prompt described)
- `src/pages/documentation/` — **deleted** entirely

## 6. Stale-reference grep result

```
grep -rn "Products\|Documentation\|/products\|/documentation" src/ --include="*.astro"
```
No matches. (One unrelated hit on the word "documentation" inside Antiphon's own body copy — "Additional details and *documentation* coming soon" — confirmed to be prose, not a route reference or nav/footer label.)

## 7. Verification

- `npx astro check` → 0 errors, 0 warnings, 0 hints (12 files).
- `npx astro build` → succeeded, 6 pages generated (`/`, `/antiphon`, `/about`, `/contact`, `/privacy-policy`, `/terms-of-service`); no `/products` or `/documentation` in output.
- CTA button four-state contrast (WCAG relative-luminance, hand-computed and cross-checked against the Tailwind-compiled `dist/` output):
  - Normal `#9c622b` vs. white text: **5.01:1** ✓ (>4.5:1)
  - Hover `#855325` vs. white text: **6.44:1** ✓
  - Active `#71471f` vs. white text: **8.01:1** ✓
  - Focus ring: see §2 (inner 5.01:1, outer 13.20:1 on Paper / 14.15:1 on Charcoal, both contexts covered) ✓
- Header logo: calculated confirmation only, no live browser available (see §3).
- Post-build Codex review found and I fixed a genuine, unrelated-to-CTA-color bug: `border-[var(--x)]`/`outline-[var(--x)]` (no `length:` prefix) compile as **color** utilities in Tailwind v4, not width utilities. This silently zeroed out the header's bottom-border width (`Navigation.astro`) and would have done the same to the secondary button's border/focus-outline width (`Button.astro`) had it ever been rendered. Fixed both to the `[length:var(--x)]` form and confirmed via the compiled CSS that `border-bottom-width`/`outline-width` now resolve correctly.

## 8. Review outcome

Ran `codex exec --skip-git-repo-check` with the phase's changed files inlined verbatim, per the working pattern from `../Wolfgang/methodology/LESSONS_LEARNED.md` (positional prompt argument, not stdin; `--skip-git-repo-check` for this repo's atypical git state). Completed in a few minutes (this run took noticeably longer than Deploy-1's "well under a minute" — Codex did its own live Tailwind-compilation experiments to verify the arbitrary-value claim rather than asserting it, which is why).

Four findings:
1. **Fixed** — Tailwind `border-[var(--x)]`/`outline-[var(--x)]` arbitrary-value bug (see §7). Concrete, in-scope, touched files I was already editing.
2. **Recorded, not fixed** — nav/footer hover text (`--navigation-hover: var(--color-brand-steel)`) measures 2.62:1 against the Charcoal nav/footer background, below 4.5:1. Real failure, but the token and its usage predate this phase (Phase 1) and this phase's scope never touched `--navigation-hover` or asked for a color audit beyond the CTA. Flagged as an out-of-scope pre-existing issue, not fixed.
3. **Recorded, not fixed** — secondary-button text (`--button-secondary-text: var(--color-action-secondary)` = raw Copper `#b87333`) measures 3.54:1 against the page background, below 4.5:1. Also pre-existing (Phase 1's Button component), and the secondary variant has zero live usages anywhere in the site after this phase (confirmed via grep) — not touched here since it's outside this phase's CTA-color scope, which only covered the primary variant.
4. **Recorded, not fixed** — no responsive/mobile nav treatment; a 217px logo + 4 links + `gap-8` will not fit common mobile widths. Pre-existing since Phase 1, already flagged in Phase 3g's own report; this phase's nav actually has one fewer link than before (4 vs. 5), a small improvement, not a regression, but the underlying gap remains.

## 9. Judgment calls flagged for review

- **Closing-CTA-section removal** — the old Home page's third section (`Contact Us` CTA) had no corresponding entry in the brief's three-section Home spec, so I dropped it rather than inventing filler copy for it. This is Wolfgang's own inference as stated in the prompt, carried out as instructed; flagging per the prompt's own request in case a reasonable person would have kept a slimmed-down version instead.
- **Active-state color** — chose a third, further-darkened `color-mix()` step (`#71471f`) rather than reusing the hover value, on the reasoning that a visibly different active state gives real tactile feedback and costs nothing (all three states pass contrast easily). A reasonable person might have judged the hover/active difference too subtle to bother distinguishing and reused the hover shade.
- **ProductCard removal** — deleted outright rather than kept-but-unused, since grep confirmed zero remaining usages anywhere in `src/` and CLAUDE.md's implementation principles favor removing dead code over leaving unused abstractions around "just in case."
- **Focus-ring adaptive-override mechanism** — used a plain CSS custom-property override via the hero section's existing inline `style` attribute rather than adding a new Button prop (e.g. `onDark`) or a dedicated CSS class. Chosen because it required touching zero component APIs and scopes correctly via normal CSS cascade; a reasonable person might prefer an explicit, more discoverable prop on `Button.astro` instead of an implicit environmental override that a future editor could accidentally break by moving the button out of the hero's DOM scope.
- **Codex-review bug fix scope** — fixed the Tailwind arbitrary-value bug in both files it appeared in (`Navigation.astro`'s pre-existing divider *and* `Button.astro`'s secondary variant, including the line I'd just added), even though the divider bug technically predates this phase. Judged in-scope because both files were already open for edits this phase and both are in "Files Allowed to Change"; a stricter reading might have left the pre-existing divider bug for a separate phase and fixed only the newly-introduced instance.

## 10. Out-of-scope items discovered (flagged, not implemented)

- Nav/footer hover-state text contrast (2.62:1, below 4.5:1) — pre-existing Phase 1 token, needs a real color decision (not this phase's to invent).
- Secondary-button text contrast (3.54:1, below 4.5:1) — pre-existing Phase 1 token; currently zero live usages of the secondary variant sitewide, but the component itself ships broken if ever used.
- No mobile/responsive navigation pattern — pre-existing since Phase 1, previously flagged in Phase 3g, still unaddressed.
- `/products/antiphon` had no redirect put in place before deletion — any external link/bookmark to that URL now 404s. Consistent with this phase's explicit instruction (no `/products` landing page in V1) but noted per Codex's own flag, same as Phase 3g's equivalent finding for `/products` itself.

## 11. Suggested follow-up tasks

- A real color decision for `--navigation-hover` and `--button-secondary-text`/`--button-secondary-border` (Copper alone fails 4.5:1 against both the light page background and the Charcoal nav) — likely needs its own small BRAND-style phase, since inventing a color isn't this repo's call to make unilaterally.
- Mobile navigation pattern for `Navigation.astro`.
- Phase 3i's 404 page will need to account for the newly-dead `/products/antiphon` and `/documentation` routes alongside whatever else it covers.
