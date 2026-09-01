# Validator-Link-1 — Completion Report

**Project:** Clockwork Otter Foundry Website
**Phase:** Validator-Link-1 (ad hoc)
**Date:** 2026-09-01

---

## 1. Summary

`src/pages/antiphon.astro` previously ended on "Additional details and documentation
coming soon." with nothing for a visitor to act on. The now-live free validator
(`https://validator.clockworkotterfoundry.com`) gives an evaluating developer something
real to try, so this phase adds a single call-to-action linking to it.

The change is copy plus one outbound link. It reuses the existing `Button` component and
existing design tokens — no new component, no new colors, no layout or page redesign. The
CTA opens in a new tab because it leaves the site for a sibling domain.

This closes `CLOCKWORK-IMPECCABLE-AUDIT-1` finding C5 ("Antiphon page is a dead end for an
evaluating developer… no code sample, no spec link, no notify me"), which was correctly
left unactioned at the time because nothing existed yet to link to.

## 2. Files changed

**Updated:**

- `src/pages/antiphon.astro`
  - Imported the existing `Button` component.
  - Added a short, factual paragraph describing what the validator does (checks XRechnung,
    Peppol BIS Billing 3.0, Factur-X, and EN 16931 invoice XML against their Schematron
    business rules, entirely in the browser, nothing leaves the page).
  - Added a `Button` (`variant="primary"`, `target="_blank"`, `rel="noopener noreferrer"`)
    linking to `https://validator.clockworkotterfoundry.com`, labelled "Try the free
    validator".
  - Reworked the trailing "coming soon" line (see section 4).

- `src/components/Button.astro`
  - Added two optional, pass-through props: `target?: string` and `rel?: string`, rendered
    as attributes on the existing `<a>`. When not supplied they are `undefined` and Astro
    omits them entirely, so every existing caller renders byte-for-byte as before.

**Not changed:** `src/pages/index.astro` and its two "Explore Antiphon" buttons were left
untouched — they correctly route to `/antiphon/` (learn about the product first).

## 3. Design decision

**Variant: `primary`.** The brand color system
(`../clockwork-otter-brand/docs/foundations/04-color-system.md`) states "Primary buttons
should communicate action" and "Secondary buttons emphasize brand", and further that Copper
is the sitewide primary-CTA color as a deliberate decision. "Try the free validator" is the
page's one clear action, so the filled primary (Copper) variant is the correct choice. The
page had no button previously, so there was no on-page precedent to match; the homepage's
"Explore Antiphon" CTAs also use `variant="primary"`, so this is consistent with how the
site already presents its primary calls to action.

**`target`/`rel`: added to `Button.astro`** rather than hand-rolling the anchor markup on
the page. Two small optional pass-through props keep every existing caller working
unchanged (verified: the full `npm run build` of all 7 pages succeeds and the homepage
buttons still compile identically), and it avoids duplicating `Button.astro`'s class list
inline on one page where it would silently drift if the component's styling ever changes.
The alternative — copying the component's class string into `antiphon.astro` — was rejected
as a maintenance hazard for no benefit.

## 4. What happened to the "coming soon" line

**Reworded and repositioned, not deleted.** Full SDK documentation genuinely still is not
published, so the true statement was kept — but leaving it verbatim directly after a live
CTA would imply the validator itself is "coming soon", which is now false. It now reads
"Full SDK details and documentation are still coming soon." and sits *after* the CTA block,
so the page order is: what Antiphon is → the validator you can use today → the SDK docs
still to come. A new sentence before the CTA introduces the validator as "available now"
and describes its actual (Schematron-only) scope, so nothing on the page overstates it.

## 5. Verification results

```bash
npm run build
```

Result: exit 0, "7 page(s) built in 7.52s", no errors or warnings.

Compiled-output check of `dist/antiphon/index.html`:

```
<a href="https://validator.clockworkotterfoundry.com" target="_blank" rel="noopener noreferrer" class="… btn-primary bg-[var(--button-primary-background)] …" …>Try the free validator</a>
```

- `href` is the literal `https://validator.clockworkotterfoundry.com` — confirmed in the
  compiled HTML, not just source.
- `target="_blank"` and `rel="noopener noreferrer"` are both present on the compiled anchor.
- `grep -c 'validator.clockworkotterfoundry.com' dist/antiphon/index.html` → `1`.
- `grep -rl 'validator.clockworkotterfoundry' dist/` → only `dist/antiphon/index.html`; no
  other page (including `dist/index.html`) gained the link.

No live browser click-through was performed — this environment has the project's known
Chromium/`astro preview` gap (see `docs/Results/Phase-3n-*` and `Phase-3f`), and the target
is an external production domain. Verification was done by reading the compiled HTML, as
the prompt permits.

`git status` after the change: only `src/pages/antiphon.astro` and
`src/components/Button.astro` modified (plus the pre-existing untracked `docs/Prompts/` and
`docs/Results/` files unrelated to this phase). No commit or push was made.

## 6. Out-of-scope items discovered

None. `docs/current/` does not exist in this repository, so there is no Antiphon-page
content doc to update. No necessary change outside the permitted file set was found.

## 7. Suggested follow-up tasks

- **Validator link on the homepage Antiphon section** — `index.astro`'s Antiphon block
  currently offers only "Explore Antiphon" → `/antiphon/`. Once the Antiphon page itself is
  a satisfying destination, a secondary "Try the validator" link on the homepage may be
  worth considering. Explicitly out of scope here (the prompt forbids touching
  `index.astro`); flag for Wolfgang to decide.
- **Remaining C5 gaps** — the audit finding also mentioned "no code sample, no spec link".
  The validator link addresses "something to try"; a link to the EN 16931 / Peppol spec
  references and a minimal C# usage snippet would close the rest, but both depend on the
  SDK and its docs actually shipping.
- **`target`/`rel` prop consistency** — `Button.astro` now supports outbound-link props; if
  future pages add external links, they should use this same component rather than
  reintroducing hand-rolled anchors.
