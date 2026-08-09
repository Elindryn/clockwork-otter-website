# Migrate 1 — Split Website Into Its Own Public Repository — Completion Report

**Project:** Clockwork Otter Foundry Website
**Phase:** Migrate-1 (infrastructure, not part of the numbered content roadmap)
**Date:** 2026-08-09

---

## 1. Summary

The Astro website was lifted out of `clockwork-otter-brand/website/` (a private monorepo subfolder) and moved into this new standalone public repo, `clockwork-otter-website`, at repo root. This was purely a lift-and-shift: same domain, same design tokens, same components, same content. The only things adapted were the things that broke when the project stopped being a subfolder of a monorepo and became a repo root of its own — path references from `website/` up to the brand docs (one level → two levels, since the two repos are now siblings), and the deployment workflow's `path: website` input (removed, since the Astro project is now at this new repo's root).

`CLAUDE.md` and `.gitignore` were already present in this repo at session start, already correctly adapted to the new path convention — no further edits were needed there beyond what had already been done.

## 2. Path references fixed in `CLAUDE.md`

`CLAUDE.md` arrived already adapted (all `../docs/...` references already rewritten to `../clockwork-otter-brand/docs/...`, and the Logo assets line already pointing at the current SVGs rather than the stale master PNG). I verified every one of these paths resolves from this repo's root:

| Reference | Resolves? |
|---|---|
| `../clockwork-otter-brand/docs/foundations/01-brand-philosophy.md` | OK |
| `../clockwork-otter-brand/docs/foundations/02-brand-identity.md` | OK |
| `../clockwork-otter-brand/docs/foundations/03-logo-system.md` | OK |
| `../clockwork-otter-brand/docs/foundations/04-color-system.md` | OK |
| `../clockwork-otter-brand/docs/foundations/05-typography.md` | OK |
| `../clockwork-otter-brand/docs/foundations/06-design-tokens.md` | OK |
| `../clockwork-otter-brand/docs/foundations/07-layout-system.md` | OK |
| `../clockwork-otter-brand/docs/components/08-ui-component-library.md` | OK |
| `../clockwork-otter-brand/docs/11-voice-and-tone.md` | OK |
| `../clockwork-otter-brand/docs/12-website-spec.md` | OK |
| `../clockwork-otter-brand/docs/standards/accessibility.md` | OK |
| `../clockwork-otter-brand/docs/standards/ai-implementation-guide.md` | OK |
| `../clockwork-otter-brand/docs/standards/governance.md` | OK |
| `../clockwork-otter-brand/docs/standards/motion.md` | OK |
| `../clockwork-otter-brand/assets/` (logo SVGs) | OK |

I additionally found and fixed two path references the prompt didn't call out explicitly but which had the identical problem — source-code comments pointing at the design-token docs:

- `src/styles/global.css:6` — `../../docs/foundations/05-typography.md` → `../../../clockwork-otter-brand/docs/foundations/05-typography.md` (from `src/styles/`, two levels no longer reaches the sibling repo; needs three)
- `src/styles/tokens.css:3` — `../../docs/foundations/06-design-tokens.md` → `../../../clockwork-otter-brand/docs/foundations/06-design-tokens.md`

Both verified to resolve via `ls` from `src/styles/`.

## 3. Files copied

From `../clockwork-otter-brand/website/`:
- `src/` (all components, layouts, pages, styles, assets)
- `public/` — including `CNAME` (unchanged: `clockworkotterfoundry.com`) and `favicon.svg`
- `docs/Prompts/*.md` (Phase 1 through Deploy-1, plus `PROMPT_LOG.md`)
- `docs/Results/*.md` (Phase 1 through Deploy-1)
- `package.json`, `package-lock.json`, `astro.config.mjs` (unchanged — `site` field already correct), `tsconfig.json`

Not copied, per the "do not copy" list: `node_modules/`, `dist/`, `.astro/`, `.claude/`. None of these were copied.

`CLAUDE.md` and `.gitignore` were not copied by this session because they already existed in this repo, already adapted — see Section 1.

`docs/Prompts/Phase-Migrate-1-Repo-Split.md` (this phase's own prompt) was already present at session start — this session was launched from a copy of it, so no separate copy step was needed.

Nothing expected was missing from the source.

## 4. Deployment workflow — final state

Copied `clockwork-otter-brand/.github/workflows/deploy.yml` to `.github/workflows/deploy.yml` in this repo, with the `path: website` input removed from the `withastro/action` step (Astro project is now at repo root, which is the action's documented default).

Action versions — checked current releases via `gh release list` against each action's repo and confirmed the pinned majors are still current as of 2026-08-09:
- `actions/checkout@v7` (latest `v7.0.1`) — unchanged
- `withastro/action@v6` (latest `v6.1.2`) — unchanged
- `actions/deploy-pages@v5` (latest `v5.0.0`) — unchanged

All three were already current; no version bumps were needed, only the `path:` removal.

## 5. Verification results

```
$ npm ci
added 285 packages, and audited 286 packages in 2m
found 0 vulnerabilities

$ npm run build
astro check: 0 errors, 0 warnings, 0 hints
[build] 8 page(s) built in 5.20s
[build] Complete!

$ cat dist/CNAME
clockworkotterfoundry.com
```

Both commands succeeded. `dist/CNAME` exists and contains the correct domain.

## 6. Review outcome

Ran one Codex review (`codex exec --skip-git-repo-check`) covering `.github/workflows/deploy.yml`, `astro.config.mjs`, the two adapted CSS comment headers, and the full `CLAUDE.md`. Codex's own sandbox filesystem was read-only, so it could not execute `npm run build` itself (it hit `EROFS` on `astro check`'s type-generation write) — this repo's own `npm run build` above already covers that verification directly. Codex's findings:

- **No concrete failure findings.** It confirmed the workflow YAML parses correctly, matches `withastro/action`'s current documented usage (no `path:` needed at repo root), all three pinned action versions match current upstream examples, `package-lock.json` is in sync with `package.json`, and all imported components/assets referenced in source resolve.

Nothing to fix.

## 7. Manual steps checklist (user)

1. Review the working tree in `../clockwork-otter-website`, then `git add`, `commit`, and `push` everything to `main`.
2. GitHub repo (`clockwork-otter-website`) → **Settings → Pages → Build and deployment → Source** → set to **GitHub Actions**.
3. GitHub repo → **Settings → Pages → Custom domain** → enter `clockworkotterfoundry.com`, save.
4. Porkbun DNS: confirm the 4 apex `A` records (`185.199.108.153`, `.109.153`, `.110.153`, `.111.153`) are still in place, plus optional `www` CNAME — unchanged by this migration, only relevant if not already configured from Deploy-1.
5. Once DNS resolves, enable **Enforce HTTPS** in Pages settings.
6. Confirm the GitHub Actions run goes green on push to `main`.
7. Confirm the live site loads at `https://clockworkotterfoundry.com`.

## 8. Suggested follow-up tasks

- **Remove `clockwork-otter-brand/website/`** now that this repo holds the canonical copy — flagged only, not done. Recommend waiting until the manual steps above are confirmed working (DNS resolved, Action green, site live) before deleting the old folder, so there's a fallback during the cutover window.
- **Deploy-1's now-unused workflow/config files** in `clockwork-otter-brand` (its own `.github/workflows/deploy.yml`, and possibly a `CNAME`/`astro.config.mjs` `site` value if Deploy-1 touched anything outside `website/`) sit inertly in the private repo now that this repo is the deploy target. Harmless as-is, but worth a cleanup decision — likely folded into the same cleanup pass as removing `website/` above, rather than a separate task.
- No design-system gaps to flag from this phase — it touched no content or components, only paths and deployment config.
