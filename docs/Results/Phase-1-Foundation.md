# Phase 1 — Foundation: Completion Report

**Project:** Clockwork Otter Foundry Website
**Phase:** 1 of 6 — Foundation
**Date:** 2026-08-07

---

## Summary of Completed Work

Stood up the Astro + Tailwind CSS project skeleton: build tooling, the full design-token set as CSS custom properties, font loading, global typography, a Navigation component, a Footer component, and placeholder page templates for every route in the site's information architecture. No marketing copy, product descriptions, or Lorem Ipsum were introduced anywhere.

Verified via:
- `astro check` — 0 errors, 0 warnings, 0 hints across all 12 `.astro`/config files.
- `astro build` — static build succeeds, 7 pages generated, logo image optimized by Astro's asset pipeline (1126 kB PNG → 1 kB WebP at the 52×52 render size actually used).
- `astro preview` served the build; all 7 routes return HTTP 200.
- Manual inspection of generated HTML/CSS confirmed token values, semantic derivations (e.g. `--navigation-background: var(--color-brand-charcoal)`), and Tailwind utility generation are all wired correctly.
- **Not done:** a live visual check in an actual browser. This sandboxed session has no GUI and no `sudo`, so Chromium's system shared libraries (`libnspr4.so` etc.) couldn't be installed for a Playwright screenshot, and `astro dev`'s dev server also failed to report ready within its startup window (this repo lives on a `/mnt/c` WSL-mounted NTFS path, which is known to be slow for filesystem-heavy dev-server startup — `astro preview`, which does far less I/O, worked fine). **Recommend running `npm run dev` locally and visually reviewing the nav/footer/typography before or during Phase 1 review** — see Items to Review below for the one visual issue this would surface immediately.

---

## Files Created

```
.gitignore
astro.config.mjs
package.json
package-lock.json
tsconfig.json
src/styles/tokens.css
src/styles/global.css
src/layouts/BaseLayout.astro
src/components/Navigation.astro
src/components/Footer.astro
src/pages/index.astro
src/pages/products/index.astro
src/pages/documentation/index.astro
src/pages/about.astro
src/pages/contact.astro
src/pages/privacy-policy.astro
src/pages/terms-of-service.astro
src/assets/images/logo/clockwork-otter-logo-primary.png
docs/Results/Phase-1-Foundation.md   (this file)
```

Nothing under `../docs/` or `../assets/` was modified.

---

## Architectural Decisions

**Tailwind v4, CSS-first config, no `tailwind.config.js`.** Tailwind CSS v4 replaced the JS config file with an `@theme` block authored directly in CSS. `src/styles/tokens.css` uses this to define the full token set from `06-design-tokens.md` — colors, font families/sizes/weights, line heights, radius, breakpoints, and the spacing base — as the actual Tailwind theme, not a separate layer that mirrors it. This satisfies CLAUDE.md's "Tailwind config referencing those custom properties" more directly than a parallel JS config would: the tokens *are* the Tailwind config.

**Tailwind's default palette/type/radius scales are reset (`--color-*: initial`, etc.) before redefining our own.** Without this, Tailwind's built-in reds/blues/grays and its default type/radius scale would remain available alongside the brand tokens, inviting accidental use of unapproved colors — directly contrary to `04-color-system.md`'s "Introduce unapproved brand colors" prohibition and CLAUDE.md's "rather than hard-coding Tailwind's default palette/spacing/typography scale." Breakpoints and font-weight namespaces were reset too, for the same reason (Tailwind ships extra weights like `thin`/`extralight`/`black` that we never load — see Font Loading below). `--spacing` (the multiplier Tailwind's numeric utilities like `p-4` are built from) was left alone but pinned explicitly to `4px`, which is the token system's own base unit — it already matched Tailwind's default, but the value is now an intentional decision rather than a coincidence.

**Named `--space-*` tokens live alongside Tailwind's numeric spacing utilities, with different numbering.** `06-design-tokens.md` names spacing tokens by their pixel value (`--space-16` = 16px), while Tailwind's own convention multiplies the base unit by the utility number (`p-4` = 4 × 4px = 16px). Both systems are present — the named tokens for direct `var()` use in component CSS, Tailwind's numeric utilities for markup — but they don't share numbering. This is called out in a comment in `tokens.css` to prevent a future developer from assuming `p-16` means 16px.

**Google Fonts CDN, not self-hosted.** The prompt allowed either. Went with Google Fonts + `preconnect` for Phase 1 simplicity; only the exact approved weights (Bebas Neue 400; Montserrat 600/700; Inter 400/500/600; JetBrains Mono 400/500) are requested via the CSS2 API URL, with `display=swap` to avoid blocking render. Self-hosting could reduce a third-party network dependency and is worth reconsidering during Phase 6 performance work.

**`products/index.astro` and `documentation/index.astro`, not flat `products.astro`/`documentation.astro`.** Both sections will grow nested routes in later phases — individual product pages (Phase 3) and a documentation content collection (Phase 4) — so the directory form was chosen now to avoid a routing restructure later. About and Contact have no expected nesting and stayed flat.

**Added `privacy-policy.astro` and `terms-of-service.astro`, beyond the five pages named in the prompt's Exact Scope list.** `07-layout-system.md` specifies the footer should link to Privacy Policy and Terms of Service. The Footer component (in scope for Phase 1) needed somewhere real to point rather than a dead `#` anchor, so minimal placeholder pages were added for both, following the same "Page Title — placeholder" pattern as every other Phase 1 page. Flagging this since it wasn't explicitly named in the prompt's page list.

**Component tokens for buttons and cards were not added.** `06-design-tokens.md`'s Component Tokens section gives `--button-primary-*` and `--card-*` as *examples* of the pattern, not a required set. Phase 1 doesn't build a Button or Card component (CTAs are Phase 2, product cards are Phase 3), so inventing values for them now — especially the button hover state, for which no color is specified anywhere in the design system — risked locking in an undesigned decision. Left for whichever phase actually builds those components.

**Logo placed via `astro:assets`, not a static `<img>` in `public/`.** Using `src/assets/` lets Astro's build-time image pipeline generate an appropriately-sized, optimized WebP rather than shipping the full 1.1 MB master PNG at nav scale. Filename follows `03-logo-system.md`'s naming convention (`clockwork-otter-logo-primary.png`).

---

## Assumptions Made

- **Navigation renders the actual logo PNG, not a text reconstruction.** An earlier draft of this component set "Clockwork Otter" as plain text in Bebas Neue as a lightweight wordmark placeholder. That was reverted before finishing the phase: `03-logo-system.md` explicitly prohibits reconstructing the logo/wordmark from memory or approximating it, and CSS text mimicking the logo's typographic treatment would have done exactly that. The nav now renders the master PNG as-is via `<Image>`. See the flagged visual issue below — this decision has a real cost.
- Copyright-line boilerplate ("© 2026 Clockwork Otter Foundry. All rights reserved.") in the footer was treated as structural chrome, not marketing copy, and included per the standard convention `07-layout-system.md` calls for.
- `--footer-text-muted` (a translucent variant of `--color-background` for the copyright line) is a component-level derivation from an already-approved token, in the same spirit as `--color-action-primary: var(--color-brand-steel)` — not a new brand color.

## Design-System Gaps Not Invented Around

Per CLAUDE.md's "flag the gap... do not invent," the following were left undefined rather than guessed at:

- **Semantic status colors** (success/warning/error/information) — `04-color-system.md` states these will be finalized after accessibility testing. Not defined in `tokens.css`. No Phase 1 UI needs them.
- **`--shadow-soft` / `--shadow-medium`** — declared in `06-design-tokens.md` by name only, no values given. Only `--shadow-none: none` is defined. Not needed until a Card or elevated-surface component exists (Phase 2+).
- **`--border-color-default` / `--border-color-subtle`** — same pattern, declared without values in the source doc. Omitted entirely; nothing in Phase 1 references them.
- **The five placeholder standards docs** (`12-website-spec.md`, `standards/accessibility.md`, `standards/ai-implementation-guide.md`, `standards/governance.md`, `standards/motion.md`) are confirmed still empty, per CLAUDE.md's existing note. Fell back to the accessibility/motion guidance embedded in `04-color-system.md` and `05-typography.md` (contrast minimums, focus-visible requirements, WCAG 2.2 AA) throughout.

---

## Items to Review Before Phase 2

1. **Logo-on-nav visual mismatch (real, not hypothetical).** The master PNG is a square, vertically-stacked lockup (gear-and-otter symbol above a three-line wordmark) on an **opaque white background — no alpha channel**. Placed on the Foundry Charcoal nav bar as required by `04-color-system.md`, it will render as a visible white square patch, and the wordmark text is not legible at the ~52px scale a 72px-tall nav can accommodate. `03-logo-system.md` anticipates exactly this with a Horizontal Variant and a Reversed (white) Variant — neither exists yet, and this phase's Out of Scope explicitly forbids creating or modifying logo variants, so I used the PNG unmodified rather than cropping/recoloring it myself. **This needs a real horizontal lockup and/or a transparent-background reversed export before the nav will look right** — worth prioritizing ahead of Phase 2's hero work, which will likely hit the same constraint.
2. Confirm the Google-Fonts-CDN vs. self-hosted font-loading choice, or flag for revisit in Phase 6.
3. Confirm the two added footer pages (Privacy Policy, Terms of Service) are wanted now vs. deferred.
4. No automated test suite was added, per the prompt's own guidance that Phase 1 has no application logic to test yet.
5. Visual/browser verification of this phase was done via static build output inspection only, not a live browser — see the note under Summary. Recommend a local `npm run dev` pass before sign-off.

---

## Confirmation

No marketing copy, invented product descriptions, or Lorem Ipsum were introduced. Every page body is a single `<h1>Page Name — placeholder</h1>`, per the prompt's instruction.

---

Stopping here per the review workflow. Not beginning Phase 2 without explicit approval.
