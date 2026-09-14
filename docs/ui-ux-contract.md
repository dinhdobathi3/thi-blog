# UI/UX Contract — thi-blog (current state)

Static HTML site, no build tooling (no `package.json`). Deployed via GitHub Pages/Jekyll (`.github/workflows/jekyll-gh-pages.yml`), custom domain `blog.dinhdobathi.com` (CNAME). This doc captures the **current** design system as evidence for a redesign — not a spec to preserve.

## 1. Page inventory

| Page | Body class | Role |
|---|---|---|
| `index.html` | `tech-blog-home` | Home — hero, post list, topics, about |
| `karpenter.html`, `mcpjungle.html`, `n8n-webhook-gateway.html`, `k8s-multicluster-with-kind-and-cilium.html`, `create-and-manage-kubernetes-clusters-with-cluster-api-and-argocd.html`, `helm-chart.html` | `tech-article-page` | Article/post template |
| `contact.html`, `gallery.html` | legacy (Bootstrap-era, not restyled) | Secondary pages, still on old visual language |

6 published posts, 5 topic tags (Kubernetes, Automation, AI Tooling, Cloud Security, Engineering Notes).

## 2. Tech stack / constraints

- Pure HTML + CSS (`css/style.css`, 2231 lines) + jQuery-era JS (`js/app.js`, `js/custom.js`, plus vendored Bootstrap 3, Magnific Popup, particles.js, parallax).
- `style.css` is additive/layered history: legacy Bootstrap theme (lines 1–822) → "2026 Personal Tech Blog Refactor" light system (823–1516) → "image-forward homepage" pass (1381–1516) → dark/cyber override for `.tech-blog-home` and `.tech-article-page` (1517–2231, wins via specificity/cascade order).
- **Effective live theme = the dark/cyber layer** (last in cascade). The light `:root` tokens are overridden per-page by `.tech-blog-home`/`.tech-article-page` class scoping.
- No CSS framework/design-token pipeline — hand-written custom properties (`--tb-*`), redefined 3 times at different scopes.
- Google Fonts loaded via `<link>` per page (no self-hosting, no `font-display` control beyond `swap`).

## 3. Design tokens (as currently defined)

### Base (`:root`, light — effectively dead on published pages, still applies to `contact.html`/`gallery.html` legacy sections)
```
--tb-bg: #fafafa       --tb-surface: #ffffff   --tb-ink: #09090b
--tb-muted: #52525b    --tb-soft: #e4e4e7      --tb-line: #d4d4d8
--tb-accent: #2563eb   --tb-accent-dark: #1d4ed8
--tb-radius: 8px       --tb-shadow: 0 18px 45px rgba(24,24,27,.08)
```

### Live theme (`.tech-blog-home` / `.tech-article-page`, dark)
```
--tb-bg: #0b0f19       --tb-surface: rgba(30,41,59,.72/.76)
--tb-ink: #f1f5f9/#f8fafc   --tb-muted: #cbd5e1
--tb-soft: rgba(148,163,184,.16)   --tb-line: rgba(59,130,246,.28/.3)
--tb-accent: #38bdf8   --tb-accent-dark: #818cf8/#a78bfa
```
Background: layered radial gradients (blue @18-16%/30-20%, purple @82-86%/8-18%) over `#0b0f19`, plus a fixed 64×64px grid-line overlay (`::before`, `rgba(37,99,235,.07-.08)`).

### Typography
| Role | Font stack |
|---|---|
| Body / UI | `"IBM Plex Sans", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` |
| Display (hero H1, article H1/H2) | `"Space Grotesk", "IBM Plex Sans", sans-serif` — bold (800), tight/negative letter-spacing (`-1px` to `-3px`) |
| Mono (brand, kickers, meta, pills, code) | `"JetBrains Mono", monospace` |
| Loaded weights | IBM Plex Sans 300–700, JetBrains Mono 400–700, Space Grotesk 400–800 |

Scale is fluid via `clamp()`, no fixed type-scale table:
- Home hero H1: `clamp(46px, 8vw, 104px)`, line-height 0.98
- Article H1: `clamp(42px, 5.2vw, 78px)`
- Section H2: `clamp(28px, 4vw, 52px)` / article section H2: `clamp(30px, 4vw, 48px)`
- Post card H3: `clamp(22px, 3vw, 34px)`
- Body copy: 16–18px, line-height 1.6–1.8 (article body 18px/1.8)

### Color usage pattern
- Accent (`#38bdf8` cyan) for links, focus rings, kickers/pills borders, hover states.
- Gradient accent (`#22d3ee → #3b82f6 → #a855f7`, cyan→blue→purple) used as text-clip on brand logo and metric numbers — a recurring "gradient text" motif.
- Card surfaces: `linear-gradient(180deg, rgba(30,41,59,.8), rgba(15,23,42,.72))` + `backdrop-filter: blur(16px)` — consistent glassmorphism across post cards, topic cards, summary tiles, about panel, article sidebar (author/TOC), article sections.

### Spacing / layout
- Max content width: `1120px` (home), `1420px` (article shell/hero) — two different container widths, unreconciled.
- Section side padding: 24px desktop → 16–20px mobile.
- Radius: 8px (buttons/images/cards) up to 12–14px (article cards/sections) — not tokenized consistently (`--tb-radius` only used in a few places; many components hardcode `8px`/`10px`/`12px`/`14px`).
- Grid-based layout throughout (CSS Grid), no flex-only components except nav/footer/pills.

## 4. Component inventory (current)

| Component | Selector(s) | Notes |
|---|---|---|
| Sticky header/nav | `.site-header`, `.site-nav` | `backdrop-filter: blur(16px)`, sticky top, brand = gradient-text mono logo |
| Hero (home) | `.hero-panel.image-hero`, `.hero-content`, `.hero-visual` | Full-bleed bg image + gradient scrim, grid: 6fr content / 5fr visual, min-height `calc(100vh - 72px)` |
| Hero (article) | `.article-hero`, `.article-hero-grid`, `.article-hero-card` | min-height 86vh, kicker + H1 + deck + meta pills + a hero card (image/caption or diagram variant `.article-diagram-hero-grid`) |
| Buttons | `.button-primary` (gradient blue→purple, glow shadow), `.button-secondary`/`.read-link` (glass/outline) | Pill-shaped (`border-radius: 999px`), min-height 44px (touch target ok) |
| Summary stats | `.summary-grid` (3-col), `.metric` (gradient-text mono number), `.metric-label` | |
| Post card | `.post-card` (grid-template-areas: image/meta/title/desc/action), `.featured-post` variant | Hover: border glow + shadow + image scale 1.035 |
| Topic card | `.topic-grid` (4-col desktop → 2 → 1), `.topic-card` | Simple glass tile |
| About panel | `.about-panel` | 4fr/8fr grid |
| Footer | `.site-footer`, `.footer-links` | Flex space-between |
| Article sidebar | `.article-sidebar` (sticky), `.article-author`, `.article-toc` | Sticky at `top: 96px`, static on mobile |
| Article body blocks | `.article-section`, `.article-callout`, `.article-code`, `.article-table`, `.article-quote`, `.article-inline-image`, `.article-diagram-image` (bleeds past container), `.article-logo-row`, `.article-screenshot`(-grid) | Rich content-block system, glass card per section |
| Legacy Bootstrap chrome | `.navbar-default`, `#blog-single-post`, `.main-single-post` | Still referenced by `contact.html`/`gallery.html`; inconsistent with new system |

## 5. Interaction & motion

- Transitions: 180–220ms ease on hover (border-color, box-shadow, transform, image scale).
- Focus: custom `:focus-visible` outline (3px, accent @35% opacity, 3px offset) — applied globally to links/buttons.
- `prefers-reduced-motion: reduce` respected globally (animation/transition durations collapsed to 0.01ms).
- Skip-link present (`.skip-link`, keyboard-accessible, `top: -48px` → `16px` on focus).
- No dark/light mode toggle — dark theme is hardcoded per page class, no `prefers-color-scheme` handling, no user override.
- jQuery plugins present (parallax, particles, magnific-popup) but usage against current dark redesign is unclear from CSS alone — needs a JS-level check before assuming they still run.

## 6. Responsive breakpoints (consistent across file)

| Breakpoint | Changes |
|---|---|
| `max-width: 980px` | Hero/section/about grids collapse to 1 col; post card grid collapses; topic grid → 2 col; article hero/shell collapse to 1 col; sidebar goes static |
| `max-width: 768px` | (legacy Bootstrap rules only, pre-refactor section) |
| `max-width: 650px` | Nav stacks vertically; section padding 24→16px; summary/topic grid → 1 col; hero padding-top reduced; article hero H1 fixed to 42–44px; hero thumb row → 1 col |

No tablet-specific (e.g. 1024px) or large-desktop (>1420px) rules beyond `max()`-clamped container padding.

## 7. Accessibility state

- Semantic landmarks used: `<header>`, `<nav aria-label>`, `<main id="main">`, `<section aria-labelledby>`, `<article>`, `<aside aria-label>`, `<footer>`.
- Images have `alt` text (spot-checked on index.html and karpenter.html — all present).
- Skip link + focus-visible styling present — better than typical Bootstrap-3-era baseline.
- **Gaps observed**: gradient/text-clip elements (brand logo, metric numbers, gradient H1 spans) rely on background-clip color — no fallback color declared for browsers without `background-clip: text` support, and contrast against the dark background for `#cbd5e1`/`#94a3b8` muted text should be re-verified against WCAG AA once redesigned. No `lang` switching, no explicit heading-order audit done here.

## 8. Known inconsistencies for the redesign to resolve

1. **Two container widths** (1120px home vs 1420px article) with no documented reason.
2. **Three token layers** in one file (legacy Bootstrap vars, light `:root` `--tb-*`, dark override `--tb-*`) — the light layer is dead code on all pages except the un-migrated `contact.html`/`gallery.html`.
3. **`contact.html` and `gallery.html` were never migrated** to the `tech-blog-home`/`tech-article-page` dark system — visually inconsistent with the rest of the site today.
4. **Radius values not tokenized** — `--tb-radius: 8px` exists but components hardcode 8/10/12/14px independently.
5. **No dark/light toggle** despite a full light token set existing in the CSS (dead weight, or intended future feature — worth deciding explicitly).
6. Vendored legacy JS/CSS (Bootstrap 3, jQuery, magnific-popup, particles.js) adds weight; unclear how much is still exercised by the current dark design — verify before carrying into redesign.

## 9. Redesign brief inputs

Use this contract as the "as-is" baseline. Before starting the redesign, decide explicitly:
- Keep the dark/glassmorphism direction, or reset to a new visual language?
- Single container width (pick one of 1120px/1420px, or a new value)?
- Keep the mono/display/sans 3-font system, or simplify?
- Migrate `contact.html`/`gallery.html` into the new system (recommended) or leave as legacy?
- Drop unused vendored libraries (Bootstrap 3, particles.js, magnific-popup) if the redesign doesn't need them?
