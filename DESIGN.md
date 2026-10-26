# Design System — gvs_blog

## Product Context
- **What this is:** Personal writing blog with three sections (about, blog, ideas & notes)
- **Who it's for:** Readers interested in technology, software, and the author's thinking
- **Space/industry:** Personal developer blogs (peers: t3.gg, rauchg.com, brianlovin.com, leerob.com)
- **Project type:** Editorial / personal site

## Aesthetic Direction
- **Direction:** Brutally Minimal — let the writing do all the work
- **Decoration level:** Minimal — typography and whitespace only. No textures, gradients, or backgrounds.
- **Mood:** Clean, intentional, content-first. Should feel like a well-typeset document, not a website. The kind of site where the design is invisible — you notice the writing, not the container.
- **Reference sites:** t3.gg (dark theme), rauchg.com (data-as-design), brianlovin.com (structured minimalism), leerob.com (ultra-minimal)

## Typography
- **Display/Hero:** DM Sans 700 — clean geometric sans-serif with excellent readability at large sizes
- **Body:** DM Sans 400 — warm, readable at 16px with generous line-height
- **UI/Labels:** DM Sans 400/500 — same as body for consistency
- **Code:** Geist Mono 400 — clean monospace from Vercel, pairs naturally with DM Sans
- **Loading:** Google Fonts CDN — `family=DM+Sans:wght@300;400;500;700` and `family=Geist+Mono:wght@400;500`
- **Fallback stack:** `'DM Sans', system-ui, -apple-system, sans-serif`

### Scale
| Element         | Size    | Weight | Line-height | Letter-spacing |
|-----------------|---------|--------|-------------|----------------|
| h1              | 2.5rem  | 700    | 1.2         | -1.5px         |
| h2              | 1.75rem | 700    | 1.3         | -0.5px         |
| h3              | 1.25rem | 600    | 1.3         | -0.5px         |
| Body text       | 16px    | 400    | 1.7         | normal         |
| Post body       | 16px    | 400    | 1.8         | normal         |
| Nav links       | 15px    | 400    | 1           | normal         |
| Post title list | 16px    | 500    | 1           | normal         |
| Note title      | 15px    | 400    | 1           | normal         |
| Dates / meta    | 13px    | 400    | 1           | normal         |
| Tags            | 11px    | 400    | 1           | normal         |
| Footer          | 13px    | 400    | 1           | normal         |
| Back link       | 14px    | 400    | 1           | normal         |
| Code            | 14px    | 400    | 1.6         | normal         |

## Color
- **Approach:** Restrained. Text and background do most of the work. One accent, `#AF87FF`, is used only for link underlines, the active nav item, blockquote rules, and the active-status dot.
- **Dark mode strategy:** t3.gg-inspired near-black. Reduce muted text brightness slightly for dark surfaces.

### Light Theme (default)
| Token        | Value     | Usage                     |
|--------------|-----------|---------------------------|
| `--bg`       | `#fafafa` | Page background           |
| `--text`     | `#222222` | Body text, headings       |
| `--muted`    | `#888888` | Subtitles, dates, meta    |
| `--border`   | `#e0e0e0` | Dividers, borders         |
| `--link`     | `#222222` | Links (underline on hover)|
| `--accent`   | `#AF87FF` | Link underline, active nav, blockquote rule |
| `--tag-bg`   | `#f0f0f0` | Tag pill background       |
| `--tag-text` | `#999999` | Tag pill text             |
| `--code-bg`  | `#f0f0f0` | Code block background     |

### Dark Theme (inspired by t3.gg)
| Token        | Value     |
|--------------|-----------|
| `--bg`       | `#050505` |
| `--text`     | `#fafafa` |
| `--muted`    | `#525252` |
| `--border`   | `#1a1a1a` |
| `--link`     | `#fafafa` |
| `--accent`   | `#AF87FF` |
| `--tag-bg`   | `#1a1a1a` |
| `--tag-text` | `#888888` |
| `--code-bg`  | `#161616` |

## Spacing
- **Base unit:** 8px
- **Density:** Comfortable
- **Scale:** 2xs(2px) xs(4px) sm(8px) md(16px) lg(24px) xl(32px) 2xl(48px) 3xl(64px)
- **Max content width:** 640px, centered
- **Nav padding:** 24px vertical, 48px horizontal (16px/20px on mobile)
- **Nav link gap:** 28px (16px on mobile)
- **Hero margin-top:** 80px desktop, 40px mobile
- **Section header margin-top:** 60px
- **Post item padding:** 16px vertical
- **Social link gap:** 16px

## Layout
- **Approach:** Grid-disciplined — single centered column, consistent alignment
- **Max content width:** 640px
- **Border radius:** sm(3px) for tags, md(4px) for buttons/pills/code blocks, lg(8px) for cards if ever used

## Motion
- **Approach:** Minimal-functional — only CSS transitions that aid comprehension
- **Hover transitions:** `transition: color 0.2s ease, border-color 0.2s ease`
- **No entrance animations, scroll effects, or page transitions**
- **Easing:** ease for all transitions (simple, predictable)

## Feature posts
- **Scope:** Only blog entries with `kind: feature`, rendered by `FeaturePostLayout`. Every other page keeps the Motion rules above.
- **Allowed:** Animated and interactive figures (inline SVG). Motion explains a process: dots along arrows, a step player, a context bar, a day and night toggle.
- **Not allowed:** Page transitions, parallax, scroll-jacking, animated text, or motion that does not explain something.
- **Triggers:** An animation runs once when its figure scrolls into view, or when the reader presses a control. Nothing loops without a control. Autoplay is off by default.
- **Reduced motion:** With `prefers-reduced-motion: reduce`, figures show their final state or a step-through with buttons.
- **Without JS:** Every figure renders as a readable static SVG with a caption and an ordered text description. Controls stay hidden.
- **Identity:** The same fonts (DM Sans, Geist Mono), the same light and dark tokens, the one accent `#AF87FF` and the 8px scale. Figures may use `--text`, `--muted`, `--border`, `--code-bg` and `--accent` at reduced opacity. No new colours or fonts. The dream figure may use the dark tokens in the light theme.
- **Width:** Body text stays at 640px. Figures may break out to 960px. Under 600px, figures switch to a vertical layout or scroll inside their own frame, never the page.
- **Mobile first:** At least half the readers are on phones. Figures are designed at 375px first: labels stay legible, tap targets are 44px or more, there is no horizontal page scroll, and the 960px breakout applies only at 600px and up.
- **No hover-only behaviour:** Tap, click or keyboard focus does everything hover does.
- **Budget:** All JS on a feature post is 60 KB gzipped or less. Lighthouse performance and accessibility are 95 or more. Figures cause no layout shift.

## Components
- **PostList:** Title + date (blog) or title + tags + date (notes)
- **PostLayout:** Back link, title, date/tags meta, markdown body
- **Tag pill:** 2px 8px padding, 3px border-radius, `--tag-bg` / `--tag-text`
- **Social link:** Border pill, 4px 12px padding, 4px border-radius
- **Theme toggle:** Border button, text label ("dark" / "light"), 4px 8px padding
- **Back link:** "← back to blog" / "← back to notes", muted color, 14px
- **Skip link:** Hidden, visible on focus, inverted colors (text on bg)

## Accessibility
- **Focus:** `outline: 2px solid var(--text); outline-offset: 2px` on `:focus-visible`
- **Skip link:** Hidden by default, appears on keyboard focus at top of page
- **ARIA:** `role="navigation"` on nav, `role="main"` on content area
- **Touch targets:** All interactive elements minimum 44px hit area (via padding)

## Breakpoints
- **Mobile:** max-width 600px
  - Nav tightens (16px gap, 14px font)
  - "ideas & notes" shortens to "notes"
  - Post items stack vertically (title above date)
  - Hero margin reduces to 40px
  - h1 reduces to 2rem

## Decisions Log
| Date       | Decision                           | Rationale                                                   |
|------------|------------------------------------|-------------------------------------------------------------|
| 2026-03-21 | Initial design system              | Created by /design-consultation                             |
| 2026-03-21 | DM Sans as primary font            | Clean, warm geometric sans-serif. Free. Not overused.       |
| 2026-03-21 | Geist Mono for code                | Pairs with DM Sans, modern monospace from Vercel ecosystem  |
| 2026-03-21 | No accent color                    | Restrained palette — text and bg do all the work            |
| 2026-03-21 | t3.gg dark theme (#050505)         | Near-black bg, warm white text — distinctive and readable   |
| 2026-03-21 | Minimal-functional motion          | Only hover transitions — matches brutally minimal aesthetic |
| 2026-03-21 | 640px max content width            | Optimal reading line length (65-75 characters)              |
| 2026-03-21 | Back links on post pages           | Added during /plan-design-review for better navigation      |
| 2026-03-21 | Skip-to-content + ARIA landmarks   | Accessibility baseline added during design review           |
| 2026-10-17 | Home page: "Selected work" + "Writing" lists | Reuse `post-list` rows so visitors see the work without leaving the about page |
| 2026-10-17 | Notes hidden from nav | Section is empty; route kept so it can come back with real notes |
| 2026-10-17 | Status dot on project pills | shipped green, active accent, paused amber, archived muted; the four states looked identical before |
| 2026-10-17 | Project cards show 4 tech tags | Less noise in the list; full list stays on the project page |
| 2026-10-17 | Reading time on posts, RSS in footer | Small reader conveniences, no new visual weight |
| 2026-10-17 | Record the `#AF87FF` accent | Added in commit 028aa96; this doc still said no accent |
| 2026-10-26 | Feature-post exception, approved by Dutt | Dutt asked for an animated, diagram-led Skynet HQ post; scoped to one layout so the rest of the site stays flat. Mobile first |
