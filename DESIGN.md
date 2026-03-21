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
- **Approach:** Restrained — no accent color. Text and background do all the work.
- **Dark mode strategy:** t3.gg-inspired near-black. Reduce muted text brightness slightly for dark surfaces.

### Light Theme (default)
| Token        | Value     | Usage                     |
|--------------|-----------|---------------------------|
| `--bg`       | `#fafafa` | Page background           |
| `--text`     | `#222222` | Body text, headings       |
| `--muted`    | `#888888` | Subtitles, dates, meta    |
| `--border`   | `#e0e0e0` | Dividers, borders         |
| `--link`     | `#222222` | Links (underline on hover)|
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
