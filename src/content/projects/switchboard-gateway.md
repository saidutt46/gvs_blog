---
title: "Switchboard Gateway"
description: "A high-performance API gateway in Go. Auth, rate limiting, caching, routing, and hot-reload config, all with sub-millisecond overhead."
date: 2025-11-14
status: "active"
tech: ["Go", "PostgreSQL", "Redis", "Kafka", "Docker", "FastAPI"]
github: "https://github.com/saidutt46/switchboard-gateway"
featured: false
draft: false
---

Switchboard is the API gateway you reach for when Kong feels like overkill and writing your own middleware feels like a trap. It sits between clients and your services, handles the boring stuff, and stays out of the way.

## What it does

One process, sub-millisecond overhead, and the things every backend ends up needing.

| Capability | What it actually does |
|---|---|
| Authenticate | API keys tied to a consumer record. Every request, every time. |
| Rate limit | Per consumer, per route, per anything else worth bucketing. |
| Cache | Responses in Redis with whatever TTL the upstream deserves. |
| Route | By host, path, or method to the right backend service. |
| Reconfigure | Hot-reload, no restarts, no dropped connections. |

## Stack

| Layer | Tech |
|---|---|
| Gateway | Go |
| Admin API | Python + FastAPI |
| Admin UI | React |
| State | PostgreSQL |
| Cache + counters | Redis |
| Async events | Kafka |

## Why I'm building it

I keep ending up in projects where someone has glued together nginx, a hand-rolled auth filter, and a Redis script for rate limiting. It works until it doesn't, and then nobody can debug it. I wanted to write the gateway I keep wishing existed: small enough to read, fast enough to forget about, and configurable without redeploying.

> The whole stack runs out of one `docker compose up`. That part matters more than it sounds.
