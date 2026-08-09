# Deploy 1 — GitHub Pages Deployment Pipeline: Completion Report

**Project:** Clockwork Otter Foundry Website
**Phase:** Deploy-1 (infrastructure, not part of the numbered content roadmap)
**Date:** 2026-08-09

---

## 1. Summary

Prepared the three files needed for this site to auto-deploy to GitHub Pages at `https://clockworkotterfoundry.com` on every push to `main`: the Astro `site` config, a `public/CNAME` file for the custom domain, and a GitHub Actions workflow using the official `withastro/action`. No git or GitHub operations were performed — everything here is file preparation only, per this phase's explicit scope. Also checked both `.claude/` folders for anything that shouldn't be tracked (Scope item 4) and added a root `.gitignore` as a result — see §4.

## 2. Workflow Location and Action Versions

The workflow landed at `.github/workflows/deploy.yml`, relative to the confirmed git root (`clockwork-otter-brand/`, one level above `website/`) — verified via `git rev-parse --show-toplevel` before creating anything, matching Project Context's confirmed git-root note.

Versions were **not** taken from this phase's suggested skeleton as-is — I checked current versions directly against GitHub before committing to pins, per the phase's own instruction not to treat the skeleton as gospel:
- `actions/checkout@v7` (current latest release, checked via `gh api repos/actions/checkout/releases/latest`)
- `withastro/action@v6` (current latest patch v6.1.2; README confirms `v6` as the recommended major pin, `path` as the documented input for a non-root Astro project)
- `actions/deploy-pages@v5` (current latest release, checked via `gh api repos/actions/deploy-pages/releases/latest`)

These match `withastro/action`'s own current README example workflow, which I fetched and read directly (`gh api repos/withastro/action/contents/README.md`) rather than assuming the phase's skeleton was already current. The `path: website` input is set explicitly, confirmed against the README's documented input list ("the root location of your Astro project inside the repository").

## 3. Files Changed

**Added:**
- `.github/workflows/deploy.yml` (git root)
- `website/public/CNAME` — single line, `clockworkotterfoundry.com`
- `.gitignore` (git root, new — see §4)

**Modified:**
- `website/astro.config.mjs` — added `site: 'https://clockworkotterfoundry.com'`, no `base`.

## 4. `.claude/` Folder Check

Checked both `.claude/settings.local.json` (root) and `website/.claude/settings.local.json`, plus the `scheduled_tasks.lock` file present in each `.claude/` directory, by reading their actual contents rather than assuming.

**What I found:**
- Both `settings.local.json` files contain only Bash-command permission allowlists (e.g. `Bash(npm run *)`, `Bash(npx astro *)`) — no secrets, tokens, or credentials of any kind.
- Both `scheduled_tasks.lock` files contain a session ID, PID, and process-start timestamp — session/process bookkeeping, not sensitive, but pure local noise with no value to a collaborator reading the repo.
- **All four files are already tracked and committed** — confirmed via `git ls-files` and `git log -- <path>`, which shows all four landed in the `feat: add core components...` commit (`fcc7d5b`). This isn't a pending decision about whether to commit them; they're already in shared history.

**What I decided:** added a root `.gitignore` with `**/.claude/settings.local.json` and `**/.claude/scheduled_tasks.lock` (double-star to cover both the root and nested `website/.claude/` locations from one root-level file). This is prophylactic, not remedial — verified with `git check-ignore -v --no-index` that the patterns match correctly. **It does not stop the four already-committed files from being tracked**; git's `.gitignore` only affects untracked files. It does prevent future edits to those files (e.g. a new permission grant, a new lock-file timestamp) from showing up as unintended diffs or getting swept into an unrelated `git add -A`. Actually untracking them (`git rm --cached`) would be a git operation, which is explicitly out of scope for this phase — flagged as a manual-step option below rather than performed.

**Why not act further:** no secrets are present, so there's no urgency to rewrite history or scrub anything — this is a tidiness/hygiene finding, not a security incident.

## 5. Documentation Changes

`CLAUDE.md` had no existing mention of deployment (checked via `grep -in "deploy\|github pages\|domain"` first, confirmed only the pre-existing Legal-pages entry matched `pages`, unrelated). Added a new Standing Decision, matching the style of the existing Logo/Legal/Font-loading entries, recording: the GitHub Pages + Actions choice, the workflow's location and `path: website` detail, the custom-domain config approach, and a pointer to this report for the manual-steps checklist.

## 6. Verification Results

```
$ cd website && npm run build
[build] ✓ Completed in 2.99s.
8 page(s) built in 3.63s. Complete.
```

Confirmed `dist/CNAME` exists and contains exactly `clockworkotterfoundry.com`. Manually inspected `dist/index.html` and `dist/about/index.html`: every internal link (`/`, `/about`, `/products`, `/contact`, `/documentation`, `/privacy-policy`, `/terms-of-service`, `/favicon.svg`, the built CSS asset) is plain root-relative with no `base`-style prefix, confirming the `site`-without-`base` config produced the expected output.

**Explicit caveat, as required by this phase:** the GitHub Actions workflow itself is **statically reviewed, not live-tested** — nothing was pushed (out of scope), so there's no live run to observe. I hand-reviewed the YAML for indentation, the three action versions (confirmed current as of this session, see §2), the `permissions`/`concurrency` blocks, and the `path: website` input. This is "prepared and reviewed, pending push," not "confirmed working."

## 7. Review Outcome

**Codex review ran successfully this time** (a first — Phases 3c and 3d both hung and were abandoned). Following this phase's explicit instruction, I did not use a plain `git diff` (which would have swamped the review with the large pre-existing uncommitted diff across `docs/`, `assets/`, and `website/src/`); instead I assembled a prompt containing only this phase's four changed/added files verbatim and passed it as a positional argument to `codex exec --skip-git-repo-check`, run from the repo root. It completed in well under a minute.

**Result: no findings.** Codex's own summary: *"The workflow should parse and run for the stated layout: `withastro/action@v6` supports `path: website`, npm should be detected from `website/package-lock.json`, and the referenced action majors exist."* No fix pass was needed as a result.

## 8. Out-of-Scope Items Discovered

- The already-tracked `.claude/settings.local.json` / `scheduled_tasks.lock` files (§4) — flagged, not untracked, since doing so requires a git operation outside this phase's scope. See manual-steps checklist item 1 below for the option.
- Nothing else outside the permitted change set was found to need touching.

## 9. Manual-Steps Checklist for the User

1. Review this phase's new/changed files (`website/astro.config.mjs`, `website/public/CNAME`, `.github/workflows/deploy.yml`, `.gitignore`), then commit and push to `main`. Optional at the same time: run `git rm --cached .claude/settings.local.json .claude/scheduled_tasks.lock website/.claude/settings.local.json website/.claude/scheduled_tasks.lock` to stop tracking those four already-committed local-only files now that `.gitignore` covers them going forward (§4) — not required, just recommended tidiness; no secrets are at risk either way.
2. GitHub repo → **Settings → Pages → Build and deployment → Source**: set to **GitHub Actions**.
3. GitHub repo → **Settings → Pages → Custom domain**: enter `clockworkotterfoundry.com`, save.
4. At Porkbun: add 4 apex `A` records for `clockworkotterfoundry.com` pointing to GitHub Pages' IPs — `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` — and, optionally, a `www` `CNAME` record pointing to `elindryn.github.io` if `www.clockworkotterfoundry.com` should also resolve.
5. Wait for DNS propagation, then enable **Enforce HTTPS** in Pages settings once GitHub issues the certificate (unavailable until DNS resolves correctly).
6. Confirm the Action runs green on push (check the Actions tab), then confirm the live site loads at `https://clockworkotterfoundry.com`.

## 10. Suggested Follow-Up Tasks (for Wolfgang to track)

1. Once DNS/Pages settings are live and the Action has run at least once, a quick follow-up check of the actual deployed site (broken links, correct favicon/CNAME behavior, cache headers) would close the loop this phase could only statically review.
2. `codex exec --skip-git-repo-check "<prompt>"` run from the repo root, with the prompt as a positional argument (not piped stdin) and files inlined directly in the prompt text rather than diffed, is the invocation that finally worked after two prior hangs (Phases 3c, 3d). Worth recording this as the known-good pattern for future phases' review steps.

---

Stopping here per the review workflow. Not beginning further phases without explicit approval.
