# TODOS

## Deferred

### RSS Feed
Add RSS feed support via `@astrojs/rss`. Lets readers subscribe to new posts.
Trivial to add (~5 min) — create `src/pages/rss.xml.ts` and install the package.
**When:** When the blog has regular readers.

### Tag Filtering for Notes
Add a `/notes/tag/[tag]` page that filters notes by tag.
Tags already exist in frontmatter — just need a dynamic route.
**When:** When note count exceeds ~20 and browsing by tag becomes useful.
