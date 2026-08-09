# Phase 2 — Home Page: Completion Report

**Project:** Clockwork Otter Foundry Website
**Phase:** 2 of 6 — Home Page
**Date:** 2026-08-07

---

## Summary of Completed Work

Reworked `/` from Phase 1's single placeholder heading into a real four-section homepage: a charcoal hero carrying the company motto and a primary CTA, a left-aligned introductory section, a three-slot product overview grid, and a closing secondary-CTA section. Built one new reusable component, `Button.astro` (primary/secondary variants), and added the deferred Button component tokens to `tokens.css`. Reused `BaseLayout`, `Navigation`, and `Footer` from Phase 1 unchanged. No product names, descriptions, or finished marketing copy were invented anywhere — see Confirmation below.

Verified via:
- `astro check` — 0 errors, 0 warnings, 0 hints across 13 files.
- `astro build` — static build succeeds, 7 pages generated.
- Manual inspection of the generated `dist/index.html`: the motto renders verbatim, all three CTA/link labels are present exactly as specified ("View Products", "Contact Us", "Learn more" ×3), and all 11 expected placeholder strings are present and unmodified.
- **Not done:** a live visual check in an actual browser, for the same environment reason noted in the Phase 1 report (sandboxed session, no GUI/`sudo`, slow `/mnt/c` dev-server startup). **Recommend a local `npm run dev` pass before sign-off**, particularly to eyeball the hero's vertical rhythm and the product-grid responsive collapse at the `sm`/`lg` breakpoints, neither of which static HTML inspection can fully confirm.

---

## Files Created or Modified

```
src/pages/index.astro                  (modified — full rework)
src/components/Button.astro            (new)
src/styles/tokens.css                  (modified — added Button component tokens)
docs/Results/Phase-2-Home-Page.md      (this file)
```

`src/components/Hero.astro` was **not** created — see Architectural Decisions.

Nothing under `../docs/` or `../assets/` was modified.

---

## Architectural Decisions

**Hero kept inline in `index.astro`, no `Hero.astro` extracted.** The prompt left this optional. The hero is used exactly once on the site; extracting it into its own component would add an indirection layer with no reuse benefit yet, contrary to CLAUDE.md's "reusable architecture" guidance being about avoiding *duplicate markup*, not about pre-emptively splitting single-use sections into files. If a second hero-like section appears in a later phase, extraction becomes justified then.

**Logo omitted from the hero, despite being explicitly allowed.** The Standing Decision in `CLAUDE.md` says the logo's *proportions* work fine at hero scale — that's about the square/stacked shape fitting a spacious layout, not about the asset's opaque white background. Foundry Charcoal is the correct hero background per `04-color-system.md` (it's listed under Foundry Charcoal's own Primary Uses), but placing the current opaque-white-background PNG on charcoal would reproduce the exact white-patch problem already flagged in Phase 1's nav review (Item to Review #1) — just larger. Framing it in a white card to fix the contrast would mean inventing a new decorative UI pattern not called for anywhere in the design system. Omitting it was the more honest choice; it costs nothing since the prompt marked it optional, and the future reversed/transparent logo variant can drop straight into the hero once it exists.

**Button component tokens added to `tokens.css`, filling the gap Phase 1 intentionally left.** Phase 1's completion report explicitly deferred `--button-primary-*` values because no Button component existed yet and inventing a hover color risked locking in an undesigned decision. Phase 2 is the phase that actually builds the component, so the tokens were added now — following the same derivation pattern already established (`--footer-text-muted`'s `color-mix()` precedent): hover states are `color-mix()` derivations of the already-approved Steel Blue/Copper tokens, not new brand colors. This keeps `04-color-system.md`'s "reference semantic tokens rather than raw hex" rule intact for the new component.

**Product overview cards use white-surface elevation, not borders.** `06-design-tokens.md` declares `--border-color-default`/`--border-color-subtle` and `--shadow-soft`/`--shadow-medium` by name only, with no values — Phase 1 explicitly left these undefined rather than guess. Rather than invent a border or shadow value to separate the three product slots from the page background, the slots use `--color-surface` (white) against the page's Paper background, which `04-color-system.md`'s Neutral Palette section calls out directly: "Using white only for elevated surfaces creates natural visual hierarchy." This achieves the same visual separation without inventing anything.

**Spacing values double-checked against the approved scale.** Every Tailwind spacing utility used (`py-24`, `py-32`, `p-8`, `gap-8`, `gap-6`, `mt-12`, `mt-4`, `mt-2`) resolves through `--spacing: 4px` to a value already on `07-layout-system.md`'s explicit preferred list (24→96px, 32→128px, 8→32px, 6→24px, 12→48px, 4→16px, 2→8px). No arbitrary spacing values were introduced.

**"Learn more" used as the product-slot link label, distinct from the CTA-button rule.** The prompt itself specifies "a 'Learn more'-style link" for this section, separately from the "CTA button labels are the exception" rule that requires specific, real labels. Since Phase 3 hasn't defined individual product routes yet, all three links point to `/products` (the one real, existing route) rather than inventing a per-product destination.

---

## Assumptions Made

- The closing CTA section (secondary "Contact Us" button) was added beyond the prompt's four numbered scope items because the Goal statement names "call-to-action component**s**" (plural) and having only one CTA (the hero's primary button) would leave the secondary Button variant unused anywhere on the page. This gives the page a natural close before the footer and exercises both button variants once each, matching Copper's "used sparingly" guidance in `04-color-system.md`.
- Product overview grid uses 3 slots (the top of the prompt's allowed 2–3 range) so the `lg:grid-cols-3` → `sm:grid-cols-2` → single-column responsive collapse is demonstrated meaningfully; 2 slots would only ever show one collapse step.
- Hero supporting text and all section/product placeholder text use the exact bracket convention given in the prompt's Content Discipline section (`[Placeholder — ...]`), rather than Phase 1's plain `Page Name — placeholder` convention, since the prompt specifies this format explicitly for Phase 2 content.

---

## Items to Review Before Phase 3

1. **Hero has no logo, by design decision above** — confirm this reading of the Standing Decision is correct, or clarify whether a white-card treatment (or similar) would be acceptable to force the logo in despite the background mismatch.
2. **Visual/browser verification was not done live** — same environment limitation as Phase 1. Recommend a local `npm run dev` pass, particularly for the hero's vertical rhythm and the product-grid's responsive breakpoints.
3. **A formal Button component spec** (per `08-ui-component-library.md`'s template) was not written — that's out of this session's scope (cross-repo write restriction into `../docs/components/`). Worth adding upstream in the brand repo separately, now that a real implementation exists to document from.
4. **Product overview section is intentionally throwaway markup**, per the prompt's explicit instruction not to build a formal `ProductCard` component this phase. Phase 3 should expect to replace this section's markup entirely rather than extend it.
5. The Phase 1 nav logo-contrast issue (Item to Review #1 in that report) is still unresolved and now additionally shapes this phase's hero decision — still worth prioritizing a horizontal/reversed logo variant.

---

## Confirmation

No invented product names, descriptions, or non-placeholder marketing copy were introduced. The only real copy on the page is the verbatim company motto (hero headline, sourced from `01-brand-philosophy.md`) and the CTA/link labels ("View Products", "Contact Us", "Learn more"), which the prompt's Content Discipline section explicitly carves out as real, action-describing text rather than placeholder. Every other string on the page is a bracketed `[Placeholder — ...]` marker.

---

Stopping here per the review workflow. Not beginning Phase 3 without explicit approval.
