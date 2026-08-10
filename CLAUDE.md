# Clockwork Otter Foundry Website

You are responsible for implementing the Clockwork Otter Foundry website.

You are NOT responsible for redesigning it.

The design language, branding, colors, typography, and philosophy already exist and are documented in the parent brand repository, `../clockwork-otter-brand` (private — this repo is public, that one is not). Your job is to faithfully implement the design system — not to reinterpret it.

## Design System — Source of Truth

The complete design system lives in the sibling `../clockwork-otter-brand` repository:

- `../clockwork-otter-brand/docs/foundations/01-brand-philosophy.md` — why the company exists, core beliefs, motto
- `../clockwork-otter-brand/docs/foundations/02-brand-identity.md` — mission, values, audience, brand attributes/non-attributes
- `../clockwork-otter-brand/docs/foundations/03-logo-system.md` — logo variants, clear space, minimum sizes, usage rules
- `../clockwork-otter-brand/docs/foundations/04-color-system.md` — full color palette, tokens, usage rules per color
- `../clockwork-otter-brand/docs/foundations/05-typography.md` — typeface system, hierarchy, font loading, weights
- `../clockwork-otter-brand/docs/foundations/06-design-tokens.md` — canonical CSS custom property names and values
- `../clockwork-otter-brand/docs/foundations/07-layout-system.md` — grid, spacing, page structure, responsive rules
- `../clockwork-otter-brand/docs/components/08-ui-component-library.md` — component categories and the spec template each component doc should follow
- `../clockwork-otter-brand/docs/11-voice-and-tone.md` — writing voice, tone by context, brand dictionary (terminology), UI copy rules

The following standards documents exist as empty placeholders — **not yet written**, not "no requirements":
- `../clockwork-otter-brand/docs/12-website-spec.md`
- `../clockwork-otter-brand/docs/standards/accessibility.md`
- `../clockwork-otter-brand/docs/standards/ai-implementation-guide.md`
- `../clockwork-otter-brand/docs/standards/governance.md`
- `../clockwork-otter-brand/docs/standards/motion.md`

Where these are empty, fall back to the general accessibility/motion/implementation guidance embedded in the foundations docs above (e.g. WCAG 2.2 AA is specified in `04-color-system.md` and `05-typography.md`), and to the principles in this file. Do not invent standards content to fill these files — flag the gap in your phase completion report instead.

Logo assets: `../clockwork-otter-brand/assets/` — production SVGs (`ProdHorizWhiteLogo.svg`/`-Black`, `ProdVertWhiteLogo.svg`/`-Black`, `ProdMarkWhiteLogo.svg`/`-Black`) are the current canonical source; copy what you need into this repo's `src/assets/images/logo/`, never edit the source files in place.

**If an implementation decision conflicts with the design system, the design system always wins.** Do not invent new branding. Do not substitute colors, fonts, or the logo. Do not create new UI patterns unless a design need genuinely has no covered pattern — and say so explicitly when you do.

## Aesthetic

Precision engineering workshop: restrained, professional, calm, spacious, technically confident. Avoid startup aesthetics, excessive animation, flashy gradients, oversized hero sections, decorative effects.

## Technology Stack

- **Astro** — static-first site generation, islands architecture, minimal shipped JS by default
- **Tailwind CSS** — per Wolfgang ecosystem decision (2026-07-29), Tailwind over Bootstrap for all new web UI; configure Tailwind theme values from the design tokens in `06-design-tokens.md` rather than hard-coding Tailwind's default palette/spacing scale
- Markdown/MDX content collections for the Documentation phase (Phase 4)
- Minimal JavaScript — reach for it only where static HTML/CSS cannot do the job

## Development Process

The project is built in phases. Each phase ends with a complete review before moving to the next. **Do not begin the next phase until the current one has been explicitly approved.**

At the end of every phase, provide:
- Summary of completed work
- Files created or modified
- Architectural decisions
- Any assumptions made
- Items that should be reviewed before continuing

Steady, reviewable progress — not rapid completion — is the goal.

### Phase 1 – Foundation
Project structure, build configuration, global layout, responsive layout framework, navigation component, footer component, global typography, design token implementation, CSS variables, theme implementation, font loading, basic page templates, asset organization. Pages contain placeholder structure only — no marketing content, no invented product descriptions, no Lorem Ipsum. Use simple placeholder headings where needed.

### Phase 2 – Home Page
Hero section, introductory content, product overview section, call-to-action components, footer integration. Spacious, clean, technically focused — avoid oversized marketing sections.

### Phase 3 – Products
Products overview page, product card component, individual product page template. Reuse existing components; no new visual patterns unless necessary.

### Phase 4 – Documentation
Excellent readability, search-ready structure, code block styling, navigation, table styling, callouts, responsive layout. Should feel like a professional technical manual.

### Phase 5 – About & Contact
About page, contact page, footer refinement. Concise and authentic — avoid marketing language.

### Phase 6 – Polish
Full refinement pass: accessibility, responsive behavior, typography, layout consistency, color consistency, component consistency, performance, keyboard navigation, cross-browser behavior. Remove duplication, simplify, improve maintainability.

## Implementation Principles

Prefer: semantic HTML, modern CSS, accessible components, reusable architecture, responsive layouts, minimal JavaScript, clean project organization, strong separation of concerns.

Use design tokens rather than hard-coded values. Use reusable components rather than duplicate markup.

## Code Quality

The codebase should be one another experienced developer would enjoy maintaining. Prioritize readability, simplicity, consistency, maintainability, performance.

## Review Workflow

At the completion of every phase, stop. Do not continue automatically. Wait for approval before beginning the next phase. Completed phases are reviewed externally against the design system before work continues.

## Standing Decisions

Decisions made during phase review that apply to all subsequent phases, not just the phase that raised them.

**Logo (decided 2026-08-07, Phase 1 review).** Superseded — see the Logo contrast entry below and Phase 3e. The original master PNG this decision was about no longer exists in the codebase.

**Legal pages (decided 2026-08-07, Phase 1 review; real copy landed 2026-08-10, Phase 4).** Privacy Policy (`/privacy`) and Terms of Use (`/terms`) are real, permanent pages linked from the footer. As of Phase 4, both carry real, conservative-draft legal text — sourced verbatim from the user's own approved copy via Wolfgang's intake process, not generated by a Claude Code session. Both pages retain genuinely unresolved `[TODO: ...]` markers (effective date on each page; Privacy's business legal identity/mailing address; Terms' governing jurisdiction) — these must **not** be filled in by any future phase without explicit user confirmation. The standing principle is unchanged going forward: no session should ever originate new legal language. Any future edit to this content must be a faithful transcription of copy explicitly supplied by the user, exactly as Phase 4 did — never AI-drafted.

**Font loading (decided 2026-08-07, Phase 1 review; self-hosted 2026-08-10, Phase 5).** Fonts are self-hosted via the `@fontsource` npm packages (`@fontsource/bebas-neue`, `@fontsource/montserrat`, `@fontsource/inter`, `@fontsource/jetbrains-mono`), all SIL OFL 1.1. The Google Fonts CDN is no longer used anywhere in this repository. Weights shipped: Bebas Neue 400; Montserrat 600, 700; Inter 400, 500, 600; JetBrains Mono 400 (weight 500 dropped — no live usage found anywhere on the site; see Phase 5 completion report). The centralized font-loading declaration lives in `src/styles/global.css` (moved from `BaseLayout.astro`'s `<head>`, which previously held the Google Fonts `<link>` tags) — this remains the one place to touch if the font set ever changes again.

**Logo contrast on Foundry Charcoal (decided 2026-08-09, Phase 3b review; worked around 2026-08-09 in Phase 3c; resolved properly 2026-08-09 in Phase 3e).** The original production SVGs were strictly two-tone black/white with no separate light-background variant, and measured only 1.48:1 contrast against Foundry Charcoal (`#2b2b2b`) — below WCAG 2.2 SC 1.4.11's 3:1 minimum. Phase 3c worked around this with a white box/copper border. Phase 3e replaced that with the real fix: proper flat, single-color White/Black logo variants (`ProdHorizWhiteLogo.svg` etc. in `../clockwork-otter-brand/assets/`), removing the box entirely. If this file still describes a white-box treatment anywhere else, that's stale — Phase 3e's own completion report is the authoritative record of the final state; update this section to match once that phase runs.

**Deployment (decided 2026-08-09, Deploy-1 phase; repo migrated 2026-08-09).** Hosting is **GitHub Pages**, deployed via a **GitHub Actions workflow** at `.github/workflows/deploy.yml` using the official `withastro/action`, on every push to `main`. Custom domain: `clockworkotterfoundry.com` (registered/DNS-hosted at Porkbun), configured via `astro.config.mjs`'s `site` field and `public/CNAME` — no Astro `base` path, since a custom domain serves from the root. **This repository (`clockwork-otter-website`) is the deploy target, not `clockwork-otter-brand`** — GitHub Pages on the Free plan requires a public source repository, and the brand repo's `docs/`/`assets/` needed to stay private, so the website was split out here. See `docs/Results/Phase-Deploy-1-GitHub-Pages.md` and `docs/Results/Phase-Migrate-1-Repo-Split.md` (once it exists) for the full history and manual-steps checklist.

## Provenance

This project's phase prompts are generated by a separate Wolfgang session (the HowlingHound ecosystem's planning/documentation hub) and placed in `docs/Prompts/`. Wolfgang does not implement here — implementation happens entirely in Claude Code sessions launched from this repository's root. Completion reports for each phase should be saved to `docs/Results/` in this repository, matching the prompt's filename.

This repository was split out of `../clockwork-otter-brand/website` on 2026-08-09 (`CLOCKWORK-MIGRATE-1`) — that repo's `docs/Prompts/`/`docs/Results/` hold the history through Phase 3d and Deploy-1; this repo continues the same numbering from Phase 3e / Migrate-1 onward.
