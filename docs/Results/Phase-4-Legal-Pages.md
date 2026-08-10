# Phase 4 — Legal Pages (Privacy Policy + Terms of Use) — Completion Report

**Project:** Clockwork Otter Foundry Website
**Phase:** 4 (renumbered 2026-08-10; first phase of the post-Phase-3 sequence)
**Date:** 2026-08-10

---

## 1. Summary

Both `src/pages/privacy.astro` and `src/pages/terms.astro` were rewritten in full, replacing the literal `"— placeholder"` `<h1>` content with the real, conservative V1 legal drafts transcribed verbatim from this prompt. Every paragraph, list item, and section heading was copied exactly as supplied — nothing paraphrased, shortened, reordered, or added. Verified programmatically (§5) by extracting all rendered text from the built HTML and comparing it against the prompt's copy block by block.

## 2. Files changed

- `src/pages/privacy.astro` — full rewrite (14 `<h2>` sections plus intro/contact).
- `src/pages/terms.astro` — full rewrite (11 `<h2>` sections plus intro/contact).
- `CLAUDE.md` — "Legal pages" Standing Decision updated (required, see §6 below and Documentation Updates).

No other files touched. `src/components/Footer.astro` confirmed already correct and left untouched, per scope.

## 3. Effective-date choice

Used the `[TODO: effective date]` marker on both pages rather than setting today's date (2026-08-10). Reasoning: this site isn't at public launch yet (per prior phases' own framing — e.g. Phase 3n's report referred to "before real public launch"), and setting an actual date now risks it going stale or being mistaken for the real effective date if launch slips. The brief explicitly offered this as an acceptable default ("your call"), and the marker is unambiguous and easy to find-and-replace at actual launch time. Both pages use the identical treatment for consistency.

## 4. `[TODO]` marker visibility confirmation

All four required markers confirmed present in the actual built HTML output (not just source), rendered as plain visible text, not hidden in comments or attributes:

- Privacy Policy: `[TODO: effective date]`
- Privacy Policy: `[TODO: business legal identity and mailing address to be finalized]`
- Terms of Use: `[TODO: effective date]`
- Terms of Use: `[TODO: governing jurisdiction — do not finalize until confirmed]`

The Governing Law section's body is *only* the TODO marker, exactly as instructed — no invented jurisdiction, venue, or arbitration language was added under any circumstances.

## 5. Verification results

- `npx astro check` → 0 errors, 0 warnings, 0 hints (14 files).
- `npx astro build` → succeeded, 7 pages generated, `dist/privacy/index.html` and `dist/terms/index.html` both present.
- **Heading hierarchy** — confirmed programmatically from the built HTML: each page has exactly one `<h1>` (`Privacy Policy`, `Terms of Use`), followed only by `<h2>` for every section (14 on Privacy, 11 on Terms), no skipped levels, no stray `<h3>`.
- **`mailto:` links** — confirmed 2 occurrences of `href="mailto:info@clockworkotterfoundry.com"` on the Privacy page (Privacy Rights section + Contact section) and 1 on the Terms page (Contact section), all using the same markup pattern as the existing Contact page (`class="font-medium"`, real `<a href="mailto:...">` anchor, not a JS handler or obfuscated address).
- **Verbatim copy** — extracted every rendered `<h1>`/`<h2>`/`<p>`/`<li>` text node from both built pages and diffed by eye against the prompt's locked copy block by block; every sentence matches exactly. (Full extracted text was reviewed inline during this session, not just spot-checked.)

## 6. Review outcome

Ran `codex exec --skip-git-repo-check` with `src/pages/privacy.astro` and `src/pages/terms.astro` inlined verbatim, explicitly instructing it to review implementation only (markup/accessibility/links), not legal-content judgment, per the prompt's own restriction.

One finding, **not fixed — reviewed and determined not applicable**:

- Codex flagged that the `mailto:` links "may not be visually identifiable as links" since the two files it saw only apply `font-medium`, with no visible underline/distinct color in what it was shown. This doesn't hold up against the actual site: `src/styles/global.css` (not included in the review's file set, since it wasn't changed this phase) already applies `a { color: var(--color-action-primary); }` globally, plus a thicker underline on `:hover` — so every link on the site, including these two, already renders in a visually distinct color by default. This is also the exact same pattern already used on the existing Contact page since Phase 3h, so changing it here would both be unnecessary and would break consistency with the established site-wide link convention. No fix applied.

No heading-hierarchy or broken-link issues were found — Codex's own assessment: "No heading hierarchy issues found... I don't see malformed Astro/HTML markup in the provided files."

## 7. Google Fonts CDN / locked-copy tension

Confirmed and publishing as instructed: the Privacy Policy's Third-Party Services and Links section includes, verbatim, *"Website fonts should be served locally by this website rather than loaded from Google Fonts or another external font CDN."* This repository still loads fonts from the Google Fonts CDN today (`BaseLayout.astro`, per the Phase 1 Standing Decision — self-hosting is Phase 5). The sentence is phrased prescriptively ("should be"), not descriptively ("are"), so it isn't factually false about current behavior, but it's clearly written anticipating the Phase 5 self-hosting change. Published as locked text, not reworded — flagging per the prompt's instruction, for a human eye, not something I attempted to quietly resolve.

**No other locked sentence found in tension with current site behavior.** I read both pages' full copy against the site's actual present state item by item looking for the same pattern (a present-tense or prescriptive claim that doesn't match reality): the "no analytics/tracking/advertising" claims are accurate (confirmed no such code exists anywhere in `src/`); the "no user accounts/contact forms/payment processing" claims are accurate; the GitHub Pages hosting description matches the actual Deployment Standing Decision; the "does not submit your message through a Clockwork Otter Foundry web form" claim is accurate (Contact page uses a plain `mailto:` link, no form, confirmed in Phase 3h). The font-CDN sentence is the one genuine exception.

## 8. Out-of-scope items discovered

- Both legal pages now share a large amount of structural duplication (the same container/heading/paragraph pattern repeated ~25 times across two files). The prompt itself anticipated this ("stop and report the idea rather than building it" re: a shared prose/legal-page layout component) — flagging as a legitimate future refactor candidate (a `LegalPage.astro` or similar layout wrapper handling the `h1`/effective-date/section pattern), not implemented here.
- No other out-of-scope items found. `Footer.astro` was double-checked and needs no changes (already links to `/privacy/` and `/terms/` with the correct labels, confirmed in Phase 3i).

## 9. Suggested follow-up tasks

- Phase 5: font self-hosting, which will resolve the Google Fonts CDN tension noted in §7 (the Privacy Policy text will then be fully accurate in the present tense too, though no rewording is needed either way since it's already phrased prescriptively).
- At actual public launch: revisit all four `[TODO]` markers — effective dates (both pages), business legal identity/mailing address (Privacy), and governing jurisdiction (Terms) — with explicit user-supplied values, per the updated CLAUDE.md Standing Decision's instruction that no future session should fill these in unprompted.
- Consider the shared legal-page layout component noted in §8, if a third long-form legal/policy page is ever added.
