---
title: "Markdown Template: Blog Post Guide"
date: 2026-03-21
description: "A reference post showing all markdown elements supported on this blog."
draft: false
---

This post demonstrates every markdown element you can use when writing blog posts. Use this as a reference for formatting.

## Headings

Use `##` for main sections and `###` for subsections. Avoid `#` (that's the post title).

### This is a subsection heading

Content under a subsection.

## Text formatting

Regular paragraph text. You can use **bold text** for emphasis and *italic text* for softer emphasis. You can also use ***bold italic*** when needed.

You can ~~strikethrough~~ text that's no longer relevant.

## Links

Inline links look like this: [visit GitHub](https://github.com). They will show with a subtle underline in the blog's design.

## Lists

### Unordered list

- First item
- Second item
  - Nested item
  - Another nested item
- Third item

### Ordered list

1. First step
2. Second step
3. Third step

## Code

Inline code uses backticks: `const x = 42;`

Code blocks use triple backticks with an optional language identifier:

```rust
fn main() {
    let name = "world";
    println!("Hello, {}!", name);
}
```

```typescript
interface Project {
  title: string;
  status: 'active' | 'shipped';
  tech: string[];
}
```

```bash
npm run build
git push origin main
```

## Blockquotes

> The best way to predict the future is to invent it.
>
> Alan Kay

## Images

Images can be included with standard markdown syntax:

```
![Alt text](./path-to-image.png)
```

Place image files in `public/images/` and reference them as `/images/filename.png`.

## Horizontal rule

Use three dashes to create a divider:

---

## Tables

| Language | Use case | Stars |
|----------|----------|-------|
| Rust | CLI tools | 250+ |
| Swift | iOS apps | N/A |
| TypeScript | Web | N/A |

## Frontmatter reference

Every blog post needs this frontmatter at the top:

```yaml
---
title: "Your Post Title"
date: 2026-03-21
description: "A short description for SEO and link previews."
draft: false
---
```

Set `draft: true` to hide a post from the listing while you're writing it.
