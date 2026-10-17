---
title: "ChannelOS"
description: "A local-first life log with an LLM insight agent. Append-only events in Postgres, a nightly agent on a 26B open model, and nothing leaves hardware I own."
date: 2026-06-14
status: "active"
tech: ["Python", "FastAPI", "PostgreSQL", "Redis", "ARQ", "Ollama", "Gemma", "Swift"]
featured: false
draft: false
---

ChannelOS logs what I do during the day and turns it into a daily and weekly read-out. The logging is one tap from my phone. The read-out is written by a local model running on my own Linux box. Neither the data nor the model leaves hardware I control.

## The shape of it

| Piece | What it is |
|---|---|
| Capture | Point-in-time events, start/stop activity spans, and Apple Health samples. All append-only. |
| Catalog | 120+ activities in 16 categories, stored as data. A new button is a row, not a deploy. |
| Ranking | The quick-log screen ranks buttons by recency-weighted time of day, so the likely next thing is on top. |
| Insight agent | A nightly job renders the day as text and asks the model for a structured `DailyInsight`: summary, highlights, anomalies, habit notes, a score. Weekly rollups too. |
| Client | A SwiftUI iOS app with an offline queue. Ingest is idempotent, so retries after a dropped connection don't double-log. |

The backend is FastAPI on async SQLAlchemy 2.0, Postgres 16 with Alembic migrations, and ARQ on Redis for the cron and on-demand jobs. It all runs in Docker Compose on the box and is reachable only over my tailnet, behind bearer-token auth.

## The decision worth explaining

The obvious way to get structured output from a model is to hand it a JSON schema and ask for the answer in one call. The research on this is fairly consistent that constraining the format while the model is still reasoning costs you reasoning quality. And `gemma4:26b`'s function calling was flaky enough that I did not want an agent framework in the path.

So the insight runs in two calls:

1. **Reason in free text.** The model gets the rendered day and writes whatever it wants about it.
2. **Extract to a flat schema.** A second call turns that text into a `DailyInsight`, using Ollama's native structured-output `format` on this step only.

For a job with no tools and one output shape, a direct async client was simpler and more reliable than a framework. On a synthetic test day, both calls together took about 131 seconds on the box's integrated GPU, which is fine for something that runs once a night.

Every agent run is written to an audit table with its inputs and outputs, so when an insight looks wrong I can see exactly what the model was given.

## Where it went

ChannelOS was the stepping stone. Once the logging loop and the insight agent proved themselves, I rebuilt the idea for the phone as [Meontor](/projects/meontor/), with the model running on-device through Apple Intelligence instead of on a box I have to keep online. Meontor is the one meant for everyone.

ChannelOS stays mine. It is a personal system I keep using and developing, next with a provider-agnostic agent layer and an agent that can act on notes and jobs rather than only summarize. It will not be released, and the source is private.
