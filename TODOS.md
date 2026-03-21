# TODOS

## Deferred

### RSS Feed
Add RSS feed support via `@astrojs/rss`. Lets readers subscribe to new posts.
Trivial to add (~5 min) — create `src/pages/rss.xml.ts` and install the package.
**When:** When the blog has regular readers.

### Custom Domain (saiduttgv.com)
Configure GitHub Pages to use custom domain. Steps:
1. Add `CNAME` file to `public/` with `saiduttgv.com`
2. Update `astro.config.mjs` site to `https://saiduttgv.com` and remove `base`
3. Configure DNS at domain registrar (A records or CNAME)
4. Enable HTTPS in GitHub Pages settings
**When:** After initial deploy is working on github.io.

### Tag Filtering for Notes
Add a `/notes/tag/[tag]` page that filters notes by tag.
Tags already exist in frontmatter — just need a dynamic route.
**When:** When note count exceeds ~20 and browsing by tag becomes useful.
