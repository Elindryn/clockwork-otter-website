# Phase 7 — Launch-Readiness Audit (Accessibility, Responsive, Secrets) — Completion Report

**Project:** Clockwork Otter Foundry Website
**Phase:** 7 (renumbered 2026-08-10, was 3m)
**Date:** 2026-08-10

---

## 1. Scope item 1 — Accessibility audit results

Checked against all seven public pages (Home, Antiphon, About, Contact, Privacy, Terms, 404) using the built `dist/` output.

| Item | Result |
|---|---|
| Semantic landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`) | **Pass.** Confirmed present on all seven pages by grepping the actual built HTML, not assumed from `BaseLayout.astro` alone. |
| Exactly one `<h1>` per page, correct hierarchy | **Pass.** Confirmed via built-HTML `<h1>` count (=1 on every page). No skipped heading levels found on any page. |
| Keyboard-accessible navigation, no traps | **Pass.** All interactive elements are native `<a>`/`<button>`, no `tabindex` overrides, no focus-trapping logic. Tab order traced in §3. |
| Visible focus states on every interactive element | **Fail → Fixed.** A third contrast failure, not one of the two already known, found during this audit: nav/footer links had **no** focus-visible override at all, so they fell back to the site-wide default (`--color-action-primary`, Copper), which measures only **2.83:1** against Foundry Charcoal — below the 3:1 non-text minimum. Fixed — see §2. |
| Sufficient text/background contrast | **Fail → Fixed** (the two known issues) **+ one new Fail → Fixed** (the focus-outline issue above). Spot-checked everything else named in scope (body text, headings, the "ANTIPHON" eyebrow, the `[TODO]` marker text) — all pass; math not repeated here since none needed a fix. |
| Meaningful alt text / decorative elements correctly hidden | **Pass.** Both logo `<Image>` instances (`Navigation.astro`, `index.astro` hero) still use accurate `alt="Clockwork Otter Foundry"`. The Phase 3n watermark remains CSS-only with `aria-hidden="true"`, no `<img>`. No other decorative elements found needing the same treatment. |
| No information conveyed by color alone | **Pass.** The active-nav indicator's `aria-current="page"` is present on the `<a>` element itself (confirmed in the built HTML), not just the visual Copper underline. |
| Accessible mobile navigation | **Fail → Built.** No responsive treatment existed at all before this phase. Built — see §3. |
| `prefers-reduced-motion` | **Judgment call made, documented below.** No guard added. |
| Touch target size (~44×44px) | **Mixed — see detail below.** |
| Descriptive link text | **Pass.** No "click here"/bare-URL patterns found (re-grepped after this phase's own additions, including the new toggle button's `aria-label`). |
| Nav logo accessible-name double-announcement | **Checked, confirmed correct — see below.** |

**`prefers-reduced-motion` call:** No guard added anywhere. Reasoning: every existing transition on this site is a 150ms `transition-colors` hover fade (nav/footer link hover, button hover/active) — this is not the class of motion WCAG 2.3.3 targets (parallax, auto-play, large-scale movement that can trigger vestibular reactions). The new mobile-menu open/close and hamburger↔X icon swap were deliberately built with **zero transition/animation** (instant state change), which sidesteps the question entirely rather than requiring a judgment call on whether that specific interaction needed a guard.

**Touch target size, in detail:**
- Mobile toggle button: `h-11 w-11` = 44×44px exactly. **Passes.**
- Nav links: height already `var(--navigation-height)` = 72px (far exceeds 44px); width was previously text-width-only with zero padding, tight for short words like "Home." Added `px-2` (8px each side, +16px total) to every nav link this phase. **Passes comfortably on height; width now has real padding margin, not just bare text width.**
- Footer links: previously had no padding at all — vertical hit area was just the line-height of `text-sm` (~22px), well under 44px. Added `px-2 py-2` (8px all sides) this phase, bringing height to roughly 38px. **Improved, but does not fully reach 44px.** Reaching the full 44px would need `py-3`+ and would visibly loosen the footer's current tight vertical rhythm — judged a bigger visual change than this phase's "additive, not a redesign" mandate for shared components should make unilaterally. Flagged as a follow-up (§9), not silently left alone.

**Nav logo double-announcement check:** `Navigation.astro`'s logo link is `<a aria-label="Clockwork Otter Foundry — home"><Image alt="Clockwork Otter Foundry" /></a>`. Per the W3C Accessible Name and Description Computation spec, an explicit `aria-label` on an element takes precedence over descending into the subtree's content (including a child `<img>`'s `alt` text) — the link's accessible name is computed as exactly the `aria-label` string, and the inner image's `alt` is not separately announced. This is deterministic, spec-defined behavior, not something requiring live AT testing to state confidently — **confirmed correct, no double-announcement occurs.** (No live screen reader was available in this environment to additionally verify empirically — see §4 for the live-browser situation this phase.)

## 2. Contrast math for all three fixes

All computed via the standard WCAG relative-luminance formula, cross-checked against the exact hex values in the compiled `tokens.css` output.

**Fix 1 — `--navigation-hover` (nav/footer link hover text):**
- Before: `--color-brand-steel` (`#4f6d8a`) vs. Foundry Charcoal (`#2b2b2b`) = **2.62:1** (fails 4.5:1).
- After: `color-mix(in srgb, var(--color-brand-steel) 65%, white)` = `#8da0b3` vs. Charcoal = **5.27:1** (passes, comfortable margin). Only used against Charcoal (both nav and footer sit on it) — no other background context to check.

**Fix 2 — `--button-secondary-text`/`--button-secondary-border`:**
- Before: raw `--color-action-secondary` (Copper, `#b87333`) vs. Foundry Paper (`#f7f7f5`) = **3.54:1** (fails 4.5:1).
- First attempt: reuse `--color-action-primary` (`#9c622b`, the already-approved 85%-toward-black mix) — passes against plain Paper at **4.67:1**, but the secondary button's own `--button-secondary-background-hover` tint (12% Copper over Paper, `#efe7de`) lightens the background just enough on hover that the same text drops to **4.09:1** — fails on hover.
- Final: derived a separate, darker shade, `color-mix(in srgb, var(--color-brand-copper) 75%, black)` = `#8a5626`. Resting: **5.69:1** against Paper. Hovered: **4.99:1** against the 12%-tinted hover background. Both clear 4.5:1 with real margin. Side benefit: this shade is visibly darker/more saturated than primary's fill color, keeping the two variants clearly distinct by hue as well as by fill-vs-outline treatment — checked deliberately per Scope item 2's explicit instruction, not assumed.

**Fix 3 — nav/footer link focus-visible outline (found during this phase's own audit, not one of the two known issues):**
- Before: no per-element override; fell back to the global default (`--color-action-primary`, Copper) vs. Charcoal = **2.83:1** (fails the 3:1 non-text minimum).
- After: `outline: var(--border-width-medium) solid var(--navigation-hover)` — reusing the now-fixed `--navigation-hover` token (**5.27:1** against Charcoal, same value as Fix 1, already established safe). Applied to `.nav-link`, `.nav-toggle` (new mobile toggle button), and `.footer-link`.

## 3. Mobile navigation — implementation details

**Technique chosen:** a real `<button>` with `aria-expanded`/`aria-controls`, toggled by a small inline vanilla-JS `<script>` (no framework, no external file — Astro inlines it directly into each page). **Not** a checkbox/label CSS-only hack: a checkbox has native checkbox semantics, not button/disclosure semantics, and `aria-expanded` needs to reflect real state as an attribute, which a pure-CSS `:checked` selector can't drive. This is the first client-side JavaScript this site ships — recorded as a new Standing Decision in `CLAUDE.md`, framed as a deliberate, narrow exception to the project's "minimal JavaScript" principle, not a precedent to build on casually.

**Structure:** the existing desktop nav markup (`<ul>` of four links) is unchanged in content and desktop appearance. Added: a `<button id="nav-toggle">` (visible only below `md`/768px via `md:hidden`), and responsive classes on the `<ul>` so it's `hidden` by default below `md`, absolutely positioned as a full-width dropdown panel (`absolute inset-x-0 top-full`, `header` given `position: relative` as its containing block) when opened, and reverts to the original static in-flow flex row at `md:` and up (`md:static md:flex md:items-center md:gap-8`) — exactly the pre-existing desktop layout, untouched.

**Keyboard/ARIA behavior, traced through:**
1. Tab order: logo link → toggle button (only focusable when visible, i.e. below `md`; `display:none` elements are automatically removed from the tab order, so desktop users never land on an invisible toggle) → nav links (only focusable once the panel is open below `md`, since `hidden` also removes them from the tab order until JS removes that class).
2. Activating the toggle (mouse click, or Enter/Space via native `<button>` keyboard behavior — no custom key handling needed): script reads current `aria-expanded`, flips it, updates `aria-label` (`"Open menu"` ↔ `"Close menu"`), and toggles the `is-open`/`hidden` classes on the menu.
3. No focus trap — this is a disclosure pattern (WAI-ARIA APG's "disclosure navigation"), not a modal dialog, so trapping focus isn't expected/required; Tab naturally moves through the now-visible links and out to whatever follows in the page.
4. Icon state (hamburger ↔ X) is driven purely by an `[aria-expanded="true"]` CSS attribute selector — the script never touches icon markup directly, so the visual state can never drift out of sync with the actual ARIA state.

**Two real bugs found by this phase's own Codex review and fixed (see §7 for the full review record):**
1. **Resize/rotate specificity bug.** `.nav-menu.is-open { flex-direction: column }` (two-class selector) has higher CSS specificity than the Tailwind `md:flex`/`md:items-center` utilities (one-class selectors) — Codex's first suggested fix (`add md:flex-row`) would not actually have worked, since a single-class utility cannot override a two-class rule regardless of source order. Used Codex's own alternative instead: wrapped the `.is-open` rule in `@media (max-width: 767px)`, removing it entirely at `md:` and up rather than fighting the specificity mismatch.
2. **JS-dependency / no-JS lockout.** Without JavaScript, the toggle button would render but do nothing, and the menu (hidden via the `hidden` class in the server-rendered HTML) would stay permanently unreachable — the entire mobile nav broken, not just degraded. Fixed with a `<noscript>` block that force-shows the menu (`display: flex !important`) and hides the now-useless toggle when scripting is off. Zero effect (and zero flash) when JS runs normally, since `<noscript>` content is inert whenever scripting is enabled.

**Desktop preserved exactly:** confirmed by diff — every class already present on the desktop-relevant elements (logo, `<ul>`'s `md:*` classes, each `<a>`'s core classes) is unchanged from the pre-phase file; only new classes were added alongside them.

## 4. Responsive audit results

**Live browser situation, this phase — genuinely mixed, and worth reporting precisely rather than a blanket "not available":**
- `npx astro preview` again did not bind/respond, consistent with every prior phase.
- However, this phase discovered that the "no live browser" conclusion in prior phases' reports (3n, 5, 6) conflated two different problems. A plain static file server (`python3 -m http.server`) **does** bind and respond correctly in this environment when launched as a properly backgrounded, disowned process — the earlier failures were an artifact of how the background command was invoked (a `cd && command &` combined in a single call didn't survive), not a network/sandbox restriction. With a working static server confirmed, Playwright's Chromium was attempted next — it launched but failed with `error while loading shared libraries: libnspr4.so: cannot open shared object file`, the exact same missing-shared-libraries condition documented in this project's own `methodology/LESSONS_LEARNED.md` (2026-08-09 entry, from Phase 3b), and no `sudo` is available to install them (confirmed: `sudo -n true` → "interactive authentication is required").
- **Net result: still no live-rendered screenshot this phase**, but the actual blocker is now narrowed and confirmed precisely (missing Chromium shared libraries, not a general sandbox network restriction) — worth carrying forward accurately into the standing environment-gap follow-up rather than the vaguer "port binding doesn't work" characterization prior reports used.

**Everything below is calculated from the actual compiled `dist/` output and Tailwind's documented breakpoint behavior, not measured in a live viewport:**

- **Wide desktop (≥1280px) / laptop (1024–1280px):** unaffected by this phase's changes — desktop nav renders exactly as before (mobile toggle `md:hidden`, menu `md:static md:flex`). Content columns (`max-w-[var(--content-max-width)]` 1200px, `max-w-[var(--reading-max-width)]` 760px) are unchanged and were already verified in prior phases.
- **Tablet (~768px, the `md` breakpoint boundary):** traced the nav row's content width at exactly 768px: header inner width = 768 − 48px (`px-6` both sides) = 720px available. Logo (217px) + four links (~215px combined text + 4×16px new padding + 3×32px gaps ≈ 375px) ≈ 592px total — comfortably under 720px, confirmed fitting with real margin, not just barely.
- **Narrow mobile (≈375–428px, common modern phone widths):** mobile nav active — header row contains only logo (217px) + toggle (44px) = 261px, well within the ~280–380px available inner width at these sizes. Opened menu panel is full-width, links stack vertically at their existing 72px-tall touch targets — no horizontal constraint at all in this layout, so no wrapping/overflow risk.
- **Smallest edge case (320px, e.g. iPhone SE/5-class viewports):** inner header width = 320 − 48 = 272px. Logo (217px) + toggle (44px) = 261px — fits, but with only ~11px of remaining `justify-between` gap. **Tight but not broken** — flagged explicitly rather than glossed over, since this is the one width where the fit is genuinely marginal rather than comfortable. Not fixed this phase (would require a responsive logo-size reduction, which is a branding-adjacent change beyond this phase's scope), recorded as a follow-up (§9).
- **Body text sizing:** confirmed no page shrinks body text below its established size at any breakpoint to force a fit — no `text-xs`/`text-sm` overrides tied to breakpoints exist anywhere in the changed files or the pages that use them; all narrow-viewport accommodation comes from layout reflow (stacking, the new mobile menu), not shrinking type.
- **Scope item 3's mobile nav working end-to-end:** traced through the full interaction in §3 rather than just confirming the markup exists.

## 5. Secrets review (Scope item 5)

Reasonable-effort grep of the tracked working tree — **no findings.** Specifically checked:

- API keys, tokens, credentials, passwords in `.astro`/`.mjs`/`.js`/`.ts`/`.json`/`.yml` files: none found (initial broad grep for the words "secret"/"token"/"key" surfaced only expected false positives — design-token documentation prose, GitHub Actions' standard `id-token: write` OIDC permission declaration — refined to a pattern matching actual assigned credential-shaped values, which found nothing).
- PEM/private-key blocks (`BEGIN ... PRIVATE KEY`): none found anywhere in the tree.
- AWS-style access key patterns (`AKIA...`): none found.
- `.env`/`.env.*` files: none present in the working tree.
- `.gitignore` drift check: still correctly excludes `dist/`, `node_modules/`, `.astro/` (generated types), `.env`/`.env.production`, `.DS_Store`, `.idea/`, and local Claude Code session bookkeeping — matches what Phase 1/Deploy-1 originally set up, no drift found.
- `.github/workflows/deploy.yml`: uses only standard, credential-free GitHub Actions (`actions/checkout`, `withastro/action`, `actions/deploy-pages`) with OIDC-based `id-token: write` permission — no hardcoded secrets, no `${{ secrets.* }}` references that would need auditing either.
- Local absolute developer paths (`/mnt/c/Users/elind`, `/home/elindryn`) leaking into tracked files: none found — would be a minor personal-info leak (a username), not a security secret, but checked anyway since a public repo is the context.
- `package-lock.json`: only public `registry.npmjs.org` URLs, no auth tokens or private registry references.

**"Checked, found nothing" is the actual result** — reported explicitly per the prompt's own instruction, not skipped as a non-finding.

## 6. Files changed

- `src/components/Navigation.astro` — mobile menu (toggle, panel, script, `<noscript>` fallback), focus-visible fix, touch-target padding on links.
- `src/components/Footer.astro` — focus-visible fix, touch-target padding on links.
- `src/styles/tokens.css` — `--navigation-hover` and `--button-secondary-text`/`--button-secondary-border` contrast-fix values.
- `CLAUDE.md` — new "Client-side JavaScript" Standing Decision.

`Button.astro` was **not** touched — the secondary-variant fix lives entirely in `tokens.css` (the component already correctly references `--button-secondary-text`/`--button-secondary-border`, so no component-level change was needed).

## 7. Review outcome

Ran `codex exec --skip-git-repo-check` with `Navigation.astro`, `Footer.astro`, and `tokens.css` inlined verbatim, explicitly framed around the mobile-nav JS/ARIA logic and the contrast fixes.

Two findings, **both fixed** (both had concrete failure scenarios, not style preferences):

1. **The resize/rotate specificity bug** (§3) — Codex's own first suggested fix (`md:flex-row`) was checked and found insufficient (specificity mismatch, verified by reasoning through CSS specificity rules, not just trusting the suggestion), so its own second suggested alternative (mobile-only media query) was used instead.
2. **The no-JS lockout** (§3) — fixed with a `<noscript>` fallback.

Codex also independently re-verified this report's own contrast math (nav hover/focus ≈5.27:1 on Charcoal, secondary button text ≈5.68–4.98:1 across resting/hover states — consistent with §2's figures within rounding) and spot-checked the Tailwind v4 arbitrary-value classes used in these files against the local Tailwind compiler, confirming the `length:`-hinted classes compile as widths and the unhinted color-variable classes compile as colors (the exact bug class found and fixed in Phase 3h) — no new instance of that bug in this phase's additions.

## 8. Judgment calls flagged for review

- **Reused `--navigation-hover` for the new focus-outline color** (Fix 3, §2) rather than introducing a dedicated focus-color token. Chosen because it's already proven safe against Charcoal and semantically fits ("the highlighted/interactive state color for nav") — a reasonable person might prefer a separate token even though the value would be identical, for naming clarity.
- **Derived a third, distinct copper shade for the secondary button** rather than reusing `--color-action-primary`, once the hover-state math revealed the reuse wasn't safe (§2). A reasonable person might have instead adjusted `--button-secondary-background-hover`'s tint percentage down instead of deriving a new text/border color — I chose the text/border route because it also delivered the "keep primary/secondary visually distinct" benefit Scope item 2 explicitly asked me to verify, which the hover-tint route wouldn't have.
- **Footer link touch targets improved but not brought fully to 44×44px** (§1) — a reasonable person might have pushed further (larger padding) to fully close the gap; I judged the more disruptive spacing change didn't fit this phase's "additive, not a redesign" posture for a shared component, and flagged the remainder as a follow-up instead of forcing it through.
- **320px viewport nav fit judged "tight but acceptable"** (§4) rather than triggering a responsive logo-size reduction to guarantee more headroom — a reasonable person might treat an 11px margin as too close for comfort and fix it now; I judged it passes as specified without inventing a new responsive-logo pattern outside this phase's stated scope.
- **`<noscript>` progressive-enhancement fallback** (§3) was my own addition beyond what Codex explicitly prescribed as a fix (it suggested this as one of several options, including a `js`/`no-js` class toggle in `<html>`) — I chose `<noscript>` specifically because it stays entirely self-contained within `Navigation.astro`, without needing to touch `BaseLayout.astro` (not in this phase's "Files Allowed to Change" list) or add a synchronous head script.

## 9. Out-of-scope items discovered

- Footer link touch targets don't fully reach 44×44px (§1, §8) — flagged, not force-fixed this phase.
- The 320px-viewport nav fit is tight (§4) — flagged, not addressed via a responsive logo change this phase.
- No other out-of-scope items found. Font loading, SEO/metadata, and the remaining legal-page `[TODO]` markers were confirmed untouched, per explicit scope exclusions.

## 10. Suggested follow-up tasks

- Close the footer-link touch-target gap fully (§1, §9) — likely needs `py-3`+ and an accompanying look at whether the footer's overall vertical rhythm should adjust to match, rather than a padding-only patch.
- Consider a responsive logo-size reduction for the narrowest mobile breakpoints (§4, §9) to add real margin at 320px rather than the current tight-but-passing fit.
- Fix the underlying environment gap this phase narrowed down precisely: Playwright's Chromium is installed but missing `libnspr4`/`libnss3`/`libnssutil3`/`libasound.so.2` with no `sudo` available to install them. This is now confirmed to be the actual blocker (not general network/port sandboxing, which does work) — worth fixing at the environment/image level so future phases can get real rendered verification instead of calculated walkthroughs.
- Consider whether `<html lang="en">` deserves a lightweight automated accessibility scanner pass (e.g. axe-core) once the Chromium environment gap above is resolved, as a more systematic complement to this phase's manual/reasoned audit.

## 11. Definition of Done — pass/fail readout (this phase's scope only)

Constructed from this phase's own scope items (traced to the brief's §14/17/18/21 by Wolfgang's prompt) — the literal brief text isn't accessible from this session, consistent with how prior phases (e.g. Phase 6) have handled the same limitation. Deploy-checklist items (domain/HTTPS/etc.) are explicitly `ecosystem/ACTIVE_PRIORITIES.md`'s job, not included here.

| Item | Status |
|---|---|
| Semantic landmarks present on every page | ✅ Pass |
| One `<h1>` per page, correct heading hierarchy | ✅ Pass |
| Keyboard-accessible navigation, no traps | ✅ Pass |
| Visible focus states on all interactive elements | ✅ Pass (after fix) |
| Text/background contrast meets WCAG AA | ✅ Pass (after 3 fixes) |
| Meaningful alt text / decorative elements hidden correctly | ✅ Pass |
| No information conveyed by color alone | ✅ Pass |
| Accessible mobile navigation | ✅ Pass (built this phase) |
| `prefers-reduced-motion` considered and documented | ✅ Pass (judgment call: no guard needed, documented why) |
| Touch targets ~44×44px | ⚠️ Partial — toggle button passes; nav links pass; footer links improved but short of full 44px (§1, §9) |
| Descriptive link text sitewide | ✅ Pass |
| Public repository free of secrets/credentials | ✅ Pass — none found |
| Responsive layout holds across breakpoints, no illegible text | ✅ Pass, with one flagged tight-but-passing edge case at 320px (§4, §9) |
