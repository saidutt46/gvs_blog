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

One process, sub-millisecond overhead, and the things every backend ends up needing:

- **Authenticate** every request with API keys tied to a consumer record.
- **Rate limit** per consumer, per route, per anything you care about.
- **Cache** responses in Redis with whatever TTL the upstream deserves.
- **Route** by host, path, or method to the right backend.
- **Reconfigure** on the fly. No restarts, no dropped connections.

The gateway is Go. The admin API is FastAPI. There's a small React admin UI for staring at consumers and routes without curling everything. State lives in PostgreSQL, cache and rate-limit counters in Redis, async events on Kafka.

## Why I'm building it

I keep ending up in projects where someone has glued together nginx, a hand-rolled auth filter, and a Redis script for rate limiting. It works until it doesn't, and then nobody can debug it. I wanted to write the gateway I keep wishing existed: small enough to read, fast enough to forget about, and configurable without redeploying.

The whole stack runs out of one `docker compose up`. That part matters more than it sounds.
