---
title: "ChannelOS"
description: "A self-hosted life log with a nightly LLM insight agent. The events, the database, and the model all run on hardware I own."
date: 2026-06-14
status: "active"
tech: ["Python", "FastAPI", "PostgreSQL", "Redis", "ARQ", "Ollama", "Gemma", "Swift"]
featured: false
draft: false
---

ChannelOS records what I do during the day. Each night, a local language model reads the day and writes a short summary. I log from my phone with one tap. The data and the model stay on my own Linux box.

## Parts

| Part | What it does |
|---|---|
| Capture | Records point-in-time events, start and stop activity spans, and Apple Health samples. The log is append-only. |
| Catalog | Holds 120+ activities in 16 categories. The catalog is data, so a new activity is a new row and needs no deploy. |
| Ranking | Sorts the quick-log buttons by recency, weighted by time of day. The activity I am most likely to log next is at the top. |
| Insight agent | Runs each night. It renders the day as text and asks the model for a `DailyInsight`: a summary, highlights, anomalies, habit notes, and a score. A weekly job does the same for the week. |
| Client | A SwiftUI app for iOS with an offline queue. Ingest is idempotent, so a retry after a dropped connection does not log an event twice. |

The API is FastAPI on async SQLAlchemy 2.0. The data is in Postgres 16, with Alembic for migrations. ARQ on Redis runs the scheduled and on-demand jobs. Everything runs in Docker Compose. The API is reachable only on my private network, and every endpoint except the health check needs a bearer token.

## How the insight agent gets structured output

The simple approach is one call: give the model a JSON schema and ask for the answer in that shape. Research on this topic shows that a strict output format during reasoning can make the reasoning worse. Also, function calling on `gemma4:26b` was not reliable enough for me to put an agent framework in the path.

So the agent makes two calls:

1. The model reads the rendered day and writes about it in free text.
2. A second call converts that text into a flat `DailyInsight`. Only this call uses Ollama's structured-output `format` option.

The job has no tools and one output shape, so a direct async client is enough. On a synthetic test day, the two calls took about 131 seconds in total on the box's integrated GPU. The job runs once a night, so that time is acceptable.

The agent writes each run to an audit table with its input and output. When an insight looks wrong, I can see exactly what the model received.

## What came next

ChannelOS was the first version of an idea. After the logging and the insight agent worked well for me, I built the idea again for the phone as [Meontor](/projects/meontor/). Meontor runs its model on the device with Apple Intelligence, so it needs no server. Meontor is the version for other people.

I still use ChannelOS and I continue to develop it. The next steps are a provider-agnostic agent layer and an agent that can act on notes and jobs. ChannelOS is a personal project. I will not release it, and the source is private.
