# CLOCKWORK-DS-1 — Foundry design proof of concept: completion report

## 1. Summary
- **Dimensional primary button: implemented** (toolkit pattern 1). Secondary variant unchanged.
- **Navigation hover/focus indicator: NOT ADOPTED.** The gate requires animation to be tested in a real browser; no browser could be run in this environment (see §7). Per the prompt, the indicator was built, then removed; `Navigation.astro` is byte-identical to `main`. **V-D2 remains open.**
- No screenshots were captured (no runnable browser). Nothing is fabricated; the screenshots folder is not created.

## 2. Pre-flight findings
- Base looked correct (clean `main` at 99b7f3c, worktree branch `worktree-ds-1`). `Button.astro`, `Navigation.astro`, `tokens.css` matched the prompt's description. 10 `<Button` call sites across `CreativeCard`, `antiphon`, `copper-leaf`, `index`, `404`.
- `FOUNDRY_UI_TOOLKIT.md` pattern 1 says the two-tone focus halo must stay; the prompt says it replaces the shadow stack on `:focus-visible` (as today). Implemented as the prompt says: the halo is the only box-shadow while focused, so it is as visible as before.
- No disabled button variant exists on the site.

## 3. Files changed
- `src/styles/tokens.css` — `--button-shadow-rgb` (Charcoal `43 43 43`) and four alpha tokens (highlight .22, shade .18, contact .28, ambient .16), with a comment that they originate from the Foundry toolkit and must be mirrored into the brand repo.
- `src/components/Button.astro` — `.btn-primary` four-layer shadow (inset highlight, inset shade, contact, ambient); `transition` only on `transform`, `box-shadow`, `background-color`; hover `translateY(-1px)` and active `translateY(1px)` only under `prefers-reduced-motion: no-preference`. Existing hover/active color tokens and focus halo kept.
- `CLAUDE.md` — one paragraph under Aesthetic (toolkit location; approved bounded exception).
- `docs/Results/clockwork-ds-1-foundry-design-proof-of-concept.md` — this file.

## 4. Files not changed and why
`Navigation.astro` (indicator not adopted, restored to original), pages, layouts, Footer, CreativeCard, fonts/logo/colors, brand repo, deploy, dependencies — out of scope.

## 5. Documentation changes
CLAUDE.md line added. Brand-repo token mirror listed in §11 (not edited).

## 6. Behavior impact (visual only)
Primary buttons gain a subtle tactile shadow stack and a 1px lift/press (suppressed for reduced motion). Fill and text colors unchanged. Focus halo unchanged. Fallback = flat button (shadow is purely additive). Layout unaffected (transforms only).

## 7. Gate results — nav indicator: NOT ADOPTED
- Implemented with `@supports (anchor-name: --a)`, md+ only, `anchor-name` set on `:hover`/`:focus-visible` link, 1px `--navigation-hover` line 8px above the bottom edge (clear of the 2px active underline), `left`/`width` transition 180 ms under `no-preference`.
- Could **not** test: Playwright MCP servers' browsers are not installed; the installed `chromium_headless_shell-1243` fails to start (`libnspr4.so` missing, no sudo); Windows Chrome could not be reached from WSL (CDP port not reachable / shell guard blocked further attempts). Firefox/WebKit not installed.
- Since animation, first-hover flicker, fallback and keyboard behavior could not be viewed, the gate is unmet → indicator removed. Only static facts established: `--navigation-hover` vs Charcoal contrast = **5.27:1** (≥3:1).
- **V-D2 still open.** Retry on a machine with a working Chromium/Firefox/WebKit; the design above is straightforward to re-add.

## 8. Verification
- `npm ci` and `npm run build` (`astro check && astro build`): **pass**, 9 pages, run after final changes. No other lint scripts defined.
- Contrast (white `--button-primary-text` on fill, computed): rest (`--color-action-primary`) **5.01:1**, hover **6.44:1**, active **8.03:1** — all ≥ 4.5:1, unchanged by this work (fill colors untouched). Inset highlight is a 1px edge, not behind the text.
- Checklist (FOUNDRY_ACCESSIBILITY.md):
  - Keyboard operable — pass (still an `<a>`); not run in browser.
  - Visible `:focus-visible` — pass by construction (halo rule overrides shadow stack, same as before); **not viewed**.
  - Hover/focus/active distinct — pass by construction; not viewed.
  - Touch targets ≥ 44px — not checked (button padding unchanged: `py-3`, text-sm ≈ 44px; unmeasured).
  - Reduced motion removes transforms — pass in CSS; not viewed.
  - No infinite animation / no rings — pass.
  - AA contrast — pass (above). Light/dark themes: site has a single theme.
  - Mobile + desktop layout — not checked (no browser); transforms don't affect layout.
  - Documented, viewed fallback — **not viewed** (fallback is the original flat button).
  - No new JS/dependency — pass.
  - Animation only transform/box-shadow/background-color — pass.
  - Browser support claim — not re-verified on caniuse (indicator not shipped; box-shadow/transform are universal).
  - Screenshots — **not captured**.

## 9. Review outcome
Codex review **skipped**: the session's worktree guard refused every `codex` invocation. Self-review only: specificity of scoped `.btn-primary` rules beats nothing from Tailwind utilities for `box-shadow`/`transition` (no conflicting utilities on primary; `transition-colors` class remains on the element but is overridden by the scoped rule); halo overrides shadow stack via `:focus-visible`. No fixes applied.

## 10. Out-of-scope items
Mirroring tokens to brand docs; shadows tokens `--shadow-soft/-medium` remain unassigned.

## 11. Suggested follow-ups
1. **Brand repo:** mirror `--button-shadow-rgb`, `--button-highlight-alpha`, `--button-shade-alpha`, `--button-contact-alpha`, `--button-ambient-alpha` into `docs/foundations/06-design-tokens.md`.
2. Visually review the primary button (default/hover/focus/active, desktop + mobile, reduced motion) and capture screenshots on a machine with a working browser.
3. Re-run the nav indicator experiment to close V-D2.
4. Install `libnspr4`/Playwright deps in this WSL environment.
