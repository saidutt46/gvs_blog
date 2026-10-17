---
title: "Loot"
description: "A self-hosted catalog for a household's toys. Drop in phone photos, a local 7B vision model identifies each one, and a job pipeline turns it into a structured, queryable record."
date: 2026-05-12
status: "paused"
tech: ["Python", "FastAPI", "Next.js", "PostgreSQL", "Redis", "MinIO", "Ollama", "Qwen2.5-VL"]
featured: false
draft: false
---

Loot started as a practical question: what toys do we actually own, and which ones are gathering dust? You drop in up to a hundred phone photos, a background pipeline identifies each toy with a local vision model, and a web UI shows live job status, the catalog, and analytics on top of it.

## How it's wired

Next.js 15 on the front, FastAPI on Python 3.12 behind it, Postgres 16 for the catalog, MinIO for the photos, and ARQ on Redis for the job queue. Vision runs through a provider interface. The default is **Qwen2.5-VL 7B** on Ollama on my Linux box, and hosted providers are opt-in. Provider IDs are model-qualified everywhere, so a record always says exactly which model produced it.

## What a 7B vision model taught me

Most of the interesting work was in the decision log, not the code.

**Don't ask for what the model can't know.** The first prompt asked for approximate dimensions. From a single photo with no reference object, a 7B model will happily call a 30 cm toy 10 cm long, and those numbers poison every analytic downstream. I removed the field from the vision schema entirely. Dimensions now come only from product data or from a person.

**Collapse the categories the model coin-flips on.** Run the same Hot Wheels truck through the model twice and it might pick "car" once and "truck" the next time. Forcing that choice was just adding noise, so `vehicle.car.diecast` and `vehicle.truck.diecast` became `vehicle.diecast`, with the distinction kept in free text. The taxonomy should match what the model can tell apart reliably, not what a human would draw on a whiteboard.

## The part I parked

Phase 4 was enrichment: take an identified toy and fill in product data from retailers. I built the whole thing, with an enricher interface, a polite HTTP client that honors `robots.txt` and identifies itself, failure reasons, tests, and UI. Then I tested it end to end against the real internet.

Every source was a dead end. Two retailers disallow search in `robots.txt`. One collector site is a client-rendered app whose search page is a 17.9 KB shell with no product links. A fan wiki sits behind a Cloudflare challenge. The last needs a business API account. Polite scraping at personal scale gets close to zero useful sources, and no amount of regex tuning changes that.

So I parked the branch unmerged, wrote down why, and kept the infrastructure. When I pick it back up, enrichment works from product URLs the user pastes in, with versioned re-runs that can be restored. The source is private.
