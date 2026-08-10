# Phase 5 — Font Self-Hosting — Completion Report

**Project:** Clockwork Otter Foundry Website
**Phase:** 5 (renumbered 2026-08-10, was 3k)
**Date:** 2026-08-10

---

## 1. Summary

Switched font loading from the Google Fonts CDN to self-hosted `@fontsource` npm packages, per the recommended approach — no concrete reason to deviate was found (all four families installed cleanly, each ships pre-built per-weight CSS + WOFF2 with `font-display: swap` already set, and licensing checked out for web self-hosting — see §2). The centralized loading declaration moved from `BaseLayout.astro`'s `<head>` (Google Fonts `<link>` tags) to `src/styles/global.css` (a set of `@import` statements immediately above the existing typography rules that already reference every `--font-*` token) — chosen over keeping `BaseLayout.astro` as the centralization point because it collapses "what fonts are loaded" and "how they're used" into one file instead of two.

## 2. License findings (verified, not assumed)

Installed all four packages and read each one's actual bundled `LICENSE` file rather than trusting the prompt's characterization:

| Family | Package | License found |
|---|---|---|
| Bebas Neue | `@fontsource/bebas-neue` | **SIL Open Font License 1.1** |
| Montserrat | `@fontsource/montserrat` | **SIL Open Font License 1.1** |
| Inter | `@fontsource/inter` | **SIL Open Font License 1.1** |
| JetBrains Mono | `@fontsource/jetbrains-mono` | **SIL Open Font License 1.1** |

**Correction to the prompt's assumption:** Wolfgang's prompt guessed JetBrains Mono was distributed under Apache License 2.0. That's wrong — the actual bundled `LICENSE` file (and the package's own `package.json` `"license"` field) both say SIL OFL 1.1, same as the other three. All four are OFL 1.1, which explicitly permits bundling, embedding, and web self-hosting (the license's core restriction is against selling the font software by itself and against using the reserved font name to promote derivative works — neither applies to using it as a website's typeface). This satisfies the brief's "legally permitted for web use" requirement for all four families.

## 3. Final weight list per family, and JetBrains Mono findings

| Family | Weights shipped | Change from CDN |
|---|---|---|
| Bebas Neue | 400 | none |
| Montserrat | 600, 700 | none |
| Inter | 400, 500, 600 | none |
| JetBrains Mono | **400 only** | **500 dropped** |

**JetBrains Mono finding:** grepped the entire `src/` tree for `<code`, `<pre`, `<kbd`, `<samp` — zero matches anywhere on any page. The `--font-code` typography rule in `global.css` (`code, pre, kbd, samp { font-family: var(--font-code); }`) exists but currently has no element anywhere on the site to apply to. Since neither weight is actually rendering today, I kept weight 400 (the one that would apply by default via inheritance if such an element were added, since none of those elements set an explicit `font-weight`) and dropped weight 500 (which would only ever apply if something explicitly combined `font-medium` with a code element — no such combination exists anywhere in the codebase). This matches the prompt's own suggested treatment for weight 500 specifically.

**A gap Wolfgang's traced table missed, found independently before Codex's review confirmed it (see §7):** `src/pages/index.astro`'s "Creativity is the goal..." line (added in Phase 3n) uses `font-bold` with no explicit `font-family`, so it inherits `--font-body` (Inter) — meaning it requests **Inter weight 700**, which the traced table lists as only using 400/500/600. Checked against the *original* Google Fonts CDN URL (`Inter:wght@400;500;600`) and confirmed **Inter 700 was never loaded even before this phase** — so the browser has been synthesizing/substituting that weight since Phase 3n shipped, not something this phase introduces. Not fixed here — see §7 for the full reasoning on why fixing it would violate this phase's "zero visual change" and "no typography changes" scope, rather than satisfy it.

## 4. Files changed

- `package.json` / `package-lock.json` — four new dependencies (`@fontsource/bebas-neue`, `@fontsource/montserrat`, `@fontsource/inter`, `@fontsource/jetbrains-mono`, all `^5.3.0`).
- `src/styles/global.css` — added the seven `@import` lines (one per family/weight combination actually shipped) plus an explanatory comment; no other content changed.
- `src/layouts/BaseLayout.astro` — removed the two `<link rel="preconnect">` tags and the Google Fonts `<link rel="stylesheet">`, replaced with a one-line comment pointing to the new location.
- `CLAUDE.md` — "Font loading" Standing Decision rewritten (required, see Documentation Updates).

No `--font-*` token value in `tokens.css` was touched — family names and fallback stacks are byte-identical to before this phase.

## 5. Verification results (measured vs. calculated)

- `npm install` → succeeded, 4 packages added, 0 vulnerabilities. **Measured.**
- `npx astro check` → 0 errors, 0 warnings, 0 hints (14 files). **Measured.**
- `npx astro build` → succeeded, 7 pages generated. **Measured.**
- **Font artifacts in `dist/`** — confirmed directly, not trusted from "the import worked": 37 `.woff2` files present under `dist/_astro/`, spanning every family/weight/subset combination actually imported (Bebas Neue latin + latin-ext at 400; Inter latin/latin-ext/greek/greek-ext/cyrillic/cyrillic-ext/vietnamese at 400/500/600; JetBrains Mono latin/latin-ext/greek/cyrillic at 400; Montserrat latin/latin-ext/cyrillic/cyrillic-ext/vietnamese at 600/700). **Measured** — inspected the actual filenames, not just a file count.
- **Compiled `@font-face` rules** — extracted every `font-family`/`font-weight`/`font-display` triple from the built CSS: exactly `Bebas Neue 400`, `Inter 400/500/600`, `JetBrains Mono 400`, `Montserrat 600/700` — matching the intended set exactly, with `font-display: swap` present on every single rule. **Measured** directly from `dist/_astro/*.css`.
- **Live browser** — re-checked whether this has changed since prior phases rather than assuming it's still blocked: attempted `npx astro preview` again this phase; the server process starts but never binds/responds (same behavior observed in Phase 3n). No live render was captured. Everything else in this report is a **calculated/traced verification from the compiled build artifacts** (exact `@font-face` rules, exact `font-family` strings matching the unchanged token values, exact weight sets matching what the CDN previously served), not a rendered screenshot comparison — flagged explicitly, same discipline as every prior phase.

## 6. Confirmation of zero remaining Google Fonts references

```
grep -rn "fonts.googleapis.com|fonts.gstatic.com" src/   → no matches
grep -rl "fonts.googleapis.com|fonts.gstatic.com" dist/   → no matches
```
Both clean — zero references anywhere in source or build output.

## 7. Review outcome

Ran `codex exec --skip-git-repo-check` with `src/layouts/BaseLayout.astro` and `src/styles/global.css` inlined verbatim, plus a grep dump of every `font-semibold`/`font-medium`/`font-bold`/`text-display` usage site for reference.

One finding, matching what I'd already identified independently before running the review (§3):

- **Recorded, not fixed — Inter 700 used but not imported.** Codex correctly identified that `index.astro`'s `font-bold` paragraph requests Inter weight 700, which isn't among the imported weights, and will render via browser weight-matching/synthesis rather than the real Inter 700 face. **Deliberately not fixed**, for two combined reasons: (1) this predates this phase — the original Google Fonts CDN URL never requested Inter 700 either, so the exact same substitution has been happening since Phase 3n shipped that line, and (2) this phase's explicit scope forbids touching typography weights or making any design change ("Any component's typography classes/weights — zero design changes, this phase is infrastructure only"), and its explicit goal is **zero visual change** from the site's actual current rendering. Adding `@fontsource/inter/700.css` now would swap a browser-synthesized bold for a real 700 face for the first time — which is a rendering *change*, not a preservation of current behavior, even though it would arguably be a quality improvement. Fixing this properly belongs to a future phase where typography adjustments are actually in scope, not this one.

## 8. Judgment calls flagged for review

- **Not fixing the Inter 700 gap (§3, §7).** A reasonable person might argue the "correct" fix is obviously to just add the missing weight, especially since Codex flagged it independently too. I judged the letter and spirit of this phase's explicit scope ("zero design changes," "zero visual change") more important than opportunistically fixing an adjacent pre-existing issue while I happened to be in the file — but this is a genuine judgment call, not a clear-cut reading, and I'd be comfortable being told to just add the import if that's the preferred resolution.
- **`global.css` chosen over `BaseLayout.astro` as the new centralization point.** The prompt offered this as "your call." A reasonable person might have kept `BaseLayout.astro` as the single font-loading location (closer to where the old `<link>` tags lived, more discoverable to someone unfamiliar with the CSS file's role) rather than moving it to `global.css`. I chose `global.css` because it's already the file that owns every `--font-*` token and every rule that consumes them — keeping "what's loaded" next to "what it's used for" seemed like the tighter grouping, but it's a defensible either way.
- **JetBrains Mono weight 400 kept despite zero live usage of the family at all.** A reasonable person might argue for dropping the entire family (0 bytes of code-font CSS) rather than keeping one dormant weight for a typography rule with nothing to render. I kept it because the CSS rule itself (`code, pre, kbd, samp { font-family: var(--font-code) }`) is presumably intentional groundwork for future documentation/code-sample content (per this project's own roadmap having previously included and then removed a Documentation phase — see Phase 3h), and the prompt's own framing treated "the rule exists" as the bar for keeping a weight, not "an element currently uses it."

## 9. Out-of-scope items discovered

- The Inter 700 gap (§3, §7) — flagged in detail above, not implemented; belongs to a future typography-focused phase.
- No other out-of-scope items found. The `--font-*` token values, fallback stacks, and every component's typography classes were confirmed unchanged (diffed `tokens.css` — zero changes; grepped for any new `font-*` utility class usage — none introduced).

## 10. Suggested follow-up tasks

- Resolve the Inter 700 gap (§3, §7) in a phase where typography changes are in scope — either import the weight or change the "Creativity is the goal..." line's utility class, whichever the actual design intent turns out to be.
- If/when a Documentation phase (or any code-sample content) is reintroduced, revisit whether JetBrains Mono needs a second weight at that point, and confirm 400 alone is still sufficient for whatever styling that content ends up using.
- Consider re-verifying the "zero visual change" claim with an actual rendered comparison once a working live-browser environment is available in this project's sandbox — every phase since at least 3b has hit the same "preview server doesn't bind" limitation, which is now a standing, recurring environment gap worth fixing at the infrastructure level rather than re-discovering per phase.
