# Phase 3i — V1 Route Restructure + 404 Page — Completion Report

**Project:** Clockwork Otter Foundry Website
**Phase:** 3i (interstitial, continues 3b–3h numbering; third phase of the V1 roadmap)
**Date:** 2026-08-10

---

## 1. Summary by scope item

1. **Build-output structure verified** — see §2. No `astro.config.mjs` change needed.
2. **Legal-page routes renamed** — `src/pages/privacy-policy.astro` → `src/pages/privacy.astro` (via `git mv`, content/title untouched); `src/pages/terms-of-service.astro` → `src/pages/terms.astro` (via `git mv`, content untouched, `title` prop changed from `"Terms of Service"` to `"Terms of Use"`).
3. **Internal links updated to trailing-slash form** — `Navigation.astro` (`/antiphon/`, `/about/`, `/contact/`), `Footer.astro` (same three plus `/privacy/`, `/terms/`), `index.astro`'s two Antiphon CTAs (`/antiphon/`). `Home` link stays `/` per the prompt's explicit exclusion. Active-nav-highlight logic verified against real build output — see §3.
4. **`noindex` support added to `BaseLayout.astro`** — new optional `noindex?: boolean` prop (default `false`); when `true`, renders `<meta name="robots" content="noindex" />` alongside the existing description meta tag.
5. **404 page created** — `src/pages/404.astro`, using `BaseLayout` with `title="Page Not Found"` and `noindex={true}`, the LOCKED heading/body copy verbatim, and a `Button` (`variant="primary"`) reading "Return Home" linking to `/`.

## 2. Scope item 1 — build-output check

Ran `npx astro build` against the pre-3i tree first (before any renames), inspected `dist/`, and confirmed Astro's default `build.format: 'directory'` (unset in `astro.config.mjs`, so it's on the default) already produces `about/index.html`, `contact/index.html`, `antiphon/index.html`, `privacy-policy/index.html`, `terms-of-service/index.html` — i.e., the exact directory shape the brief's route map shows, with zero config change. **No `trailingSlash` or `build.format` option was added.** `astro.config.mjs` is untouched this phase.

## 3. `dist/` structure confirmation (post-rename build)

```
dist/404.html
dist/about/index.html
dist/antiphon/index.html
dist/contact/index.html
dist/index.html
dist/privacy/index.html
dist/terms/index.html
```

`dist/products/` and `dist/documentation/` do not exist (confirmed absent — `find dist -iname "products" -o -iname "documentation"` returned nothing). `404.html` is emitted at the site root exactly as Astro's special-filename convention promises, confirmed directly in this build's output rather than assumed from documentation.

**Active-nav-highlight logic** — checked the generated HTML directly rather than assuming the logic holds: for each of `dist/index.html`, `dist/about/index.html`, `dist/antiphon/index.html`, `dist/contact/index.html`, exactly one nav `<a>` carries `aria-current="page"`, and in each case it's the correct item (Home/About/Antiphon/Contact respectively). This is a **calculated confirmation from the actual build artifacts**, not a live-browser check (no browser available in this environment, consistent with every prior phase) — but it's stronger than reasoning from source alone, since it inspects what Astro actually rendered per-route at build time.

## 4. Files changed

- `astro.config.mjs` — **untouched** (verification showed no change needed)
- `src/pages/privacy-policy.astro` → **renamed** `src/pages/privacy.astro` (`git mv`, content unchanged)
- `src/pages/terms-of-service.astro` → **renamed** `src/pages/terms.astro` (`git mv`, content unchanged, `title` prop changed)
- `src/components/Navigation.astro` — links updated to trailing-slash form
- `src/components/Footer.astro` — links updated to trailing-slash form, including the two renamed legal pages
- `src/pages/index.astro` — both Antiphon CTA hrefs updated to `/antiphon/`
- `src/layouts/BaseLayout.astro` — `noindex` prop added
- `src/pages/404.astro` — **new**

`src/pages/antiphon.astro`, `about.astro`, `contact.astro` — confirmed untouched (grepped, no outbound links in `antiphon.astro` per Phase 3h; the other two have no internal links to update).

## 5. Stale-reference grep result

```
grep -rn "/privacy-policy\|/terms-of-service" src/       → no matches
grep -rn 'href="/antiphon"|href="/about"|href="/contact"' src/  → no matches (non-trailing-slash forms)
```

Both clean.

## 6. Verification

- `npx astro check` → 0 errors, 0 warnings, 0 hints (13 files).
- `npx astro build` → succeeded, 7 pages generated (6 routes + `404.html`); `dist/` structure matches §3 exactly.
- `<meta name="robots" content="noindex">` confirmed present in `dist/404.html`'s `<head>` and absent from every other page.
- `dist/terms/index.html`'s `<title>` confirmed as "Terms of Use · Clockwork Otter Foundry".

## 7. Review outcome

Ran `codex exec --skip-git-repo-check` with this phase's changed files inlined verbatim (positional argument, `--skip-git-repo-check`, per the established pattern). Codex's own `npm run check` attempt failed in its sandbox with `EROFS: read-only file system` (its environment couldn't write `.astro/content.d.ts`) — a limitation of Codex's own sandbox, not this repository; my own `astro check`/`astro build` runs above are unaffected and both clean.

Two findings, neither actioned:

1. **Recorded, not fixed — Terms page heading mismatch.** `terms.astro`'s `<h1>` still reads "Terms of Service — placeholder" while the `title` prop and footer label now say "Terms of Use." This is exactly what the phase prompt specifies: Scope item 2 explicitly says the file's *content* stays unchanged, only the `title` prop changes, with real legal copy deferred to Phase 3j. Intentional, not a defect.
2. **Recorded, not fixed — active-nav trailing-slash edge case.** Codex flagged that `currentPath.startsWith("/about/")` would fail to match if a visitor reached `/about` without a trailing slash, since `astro.config.mjs` doesn't force `trailingSlash: 'always'`. This doesn't apply to this site's actual architecture: it's a fully static build with no client-side routing — the `aria-current` markup is computed once per route at build time using that route's own canonical pathname (verified correct for all four nav items in §3), not read from the live request URL at runtime. Whatever URL form a visitor uses to reach a page, the server returns the same prebuilt HTML file with the same (already-correct) markup baked in. No fix needed.

## 8. Judgment calls flagged for review

- **No `trailingSlash: 'always'` added despite the route map's slash convention.** Scope item 1 was explicit that this should only be added if verification showed the default didn't already match — it did, so I left `astro.config.mjs` untouched. A reasonable person might still add it defensively for extra safety/explicitness (e.g., to guarantee dev-server redirect behavior matches production), but that would be solving a problem the verification didn't find.
- **404 page styling** — used a plain centered text-plus-button layout (`text-center`, existing spacing tokens), matching the brief's explicit "normal visual system, no special illustration" instruction. A reasonable person might add a bit more visual weight (e.g., a larger display-style "404"), but the brief specifically ruled that out.

## 9. Out-of-scope items discovered (flagged, not implemented)

- Terms/Privacy pages' placeholder content — real legal copy is explicitly Phase 3j's job, untouched here as instructed.
- No redirect mechanism added for `/products/antiphon` or `/documentation` (now both correctly 404) — per the prompt's explicit instruction that GitHub Pages has no server-side redirect capability and none should be built.
- Codex's own sandbox couldn't run `astro check`/`astro build` due to a read-only filesystem limitation in its environment — not a finding about this codebase, noted here only so it isn't mistaken for an unverified claim on my part (my own verification runs, not Codex's, are what §6 reports).

## 10. Suggested follow-up tasks

- Phase 3j: real legal copy for `/privacy/` and `/terms/`.
- Phase 3l: canonical URLs, sitemap, `robots.txt`, Open Graph tags (this phase's `noindex` prop is the only SEO surface touched, as scoped).
- Consider whether `trailingSlash: 'always'` is worth adding defensively at some point for explicitness, even though nothing currently depends on it (see §8).
