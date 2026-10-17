---
title: "Loot"
description: "A self-hosted catalog of a household's toys. A local 7B vision model identifies each toy in a photo, and a job pipeline stores it as a structured record."
date: 2026-05-12
status: "paused"
tech: ["Python", "FastAPI", "Next.js", "PostgreSQL", "Redis", "MinIO", "Ollama", "Qwen2.5-VL"]
featured: false
draft: false
---

I started Loot to answer a simple question: what toys do we have, and which ones does nobody play with? You upload up to 100 phone photos. A background pipeline identifies each toy with a local vision model. A web UI shows the job status, the catalog, and analytics.

## How it works

The front end is Next.js 15. The API is FastAPI on Python 3.12. Postgres 16 stores the catalog, MinIO stores the photos, and ARQ on Redis runs the job queue.

Vision calls go through a provider interface. The default provider is Qwen2.5-VL 7B on Ollama, on my Linux box. Hosted providers are available, but you must turn them on. Each record stores the full model ID, so I always know which model made it.

## What I learned from a 7B vision model

I wrote each design decision in a decision log. Two of them taught me the most about the model.

**I removed a field that the model could not fill.** My first prompt asked for the toy's approximate size. A single photo has no reference object, so the model guessed. It could call a 30 cm toy 10 cm long, and those numbers made the analytics wrong. I removed the field from the vision schema. Now the size comes only from product data or from a person.

**I merged categories that the model could not tell apart.** When I sent the same Hot Wheels truck to the model twice, it could say "car" one time and "truck" the next time. That choice only added noise. I merged `vehicle.car.diecast` and `vehicle.truck.diecast` into `vehicle.diecast`, and kept the detail in a free-text field. The categories now match what the model can tell apart reliably.

## The phase I paused

Phase 4 was enrichment: find product data for each identified toy on retailer websites. I built all of it. It had an enricher interface, an HTTP client that obeys `robots.txt` and identifies itself, failure reasons, tests, and a UI. Then I tested it against the real websites.

No source worked:

- Two retailers block search in their `robots.txt`.
- One collector site renders in the browser. Its search page is a 17.9 KB shell with no product links.
- A fan wiki shows a Cloudflare challenge.
- The last source needs a business API account.

At this scale, polite scraping gets almost no data. Better parsing does not change that. I paused the branch without a merge, wrote down the reasons, and kept the infrastructure. When I continue, enrichment will use product URLs that the user pastes in, with versioned re-runs that you can restore. The source is private.
