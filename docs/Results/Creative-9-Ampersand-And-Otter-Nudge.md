# Creative-9 — Completion Report

## 1. Summary
Fixed the double-escaped ampersand (`title="Cauldron &amp; Tome"` → `title="Cauldron & Tome"`) and nudged the otter down 1.25 rem on desktop (`md:-translate-y-[40%]` → `md:-translate-y-[calc(40%-1.25rem)]`).

## 2. Safety checks
- Starting commit: `90106e4` (site PR #17) — matches the requirement. Worktree branch `worktree-creative-9`.
- Diff is two changed lines in `src/pages/creative/index.astro`. Nothing committed.

## 3. Files changed
- `src/pages/creative/index.astro` (updated)
- `docs/Results/Creative-9-Ampersand-And-Otter-Nudge.md` (added)

## 4. Files not changed
Everything else. (`CreativeCard.astro` was read only: it renders `{title}`, auto-escaped.)

## 5. Documentation changes
None needed.

## 6. Behavior impact
Visible title fix; otter 1.25 rem lower at ≥ md. No layout flow change (image is absolutely positioned).

## 7. Database impact
None.

## 8. Verification
- `npm ci` then `npm run build` (runs `astro check && astro build`): succeeded; `astro check` reports 0 errors, 0 warnings, 0 hints.
- `grep -c "amp;amp;" dist/creative/index.html` → `0`.
- Built heading HTML is `Cauldron &amp; Tome` (correct escape, displays "&").
- Otter `<img>` class list contains `md:-translate-y-[calc(40%-1.25rem)]`; built CSS defines it correctly: `md\:-translate-y-\[calc\(40\%-1\.25rem\)\]{--tw-translate-y:calc(calc(40% - 1.25rem) * -1)…}`. The negative-prefixed calc works, so no fallback form was needed.
- Visual check: **not performed** (no screenshot taken); no visual result is claimed. 1.25 rem is an estimate from the owner's screenshot; the owner may ask for ±0.5 rem.

## 9. Review outcome
Skipped — diff contains only the two spots named in Scope.

## 10. Out-of-scope items discovered
`grep -rnE "&amp;|&nbsp;|&#" src` found exactly one hit: the Cauldron & Tome title (fixed). No other pre-escaped entities.

## 11. Suggested follow-ups
Owner to eyeball `/creative/` at ≥ 1280 px and adjust the nudge if needed.
