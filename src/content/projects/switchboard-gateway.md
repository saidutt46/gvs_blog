---
title: "Switchboard Gateway"
description: "An API gateway in Go that handles auth, rate limiting, caching, routing, and hot-reload config, with under 2 ms of gateway overhead in my load tests."
date: 2025-11-14
status: "active"
tech: ["Go", "PostgreSQL", "Redis", "Kafka", "Docker", "FastAPI"]
github: "https://github.com/saidutt46/Switchboard-Gateway"
featured: false
draft: false
---

Switchboard is an API gateway. It is for cases where Kong is too large and custom middleware is too much code to maintain. It runs between clients and your services and handles the common backend tasks.

## What it does

It runs as one process. In my load tests, it sustained 5,075 requests per second with a p50 latency of 4.44 ms, and the gateway itself added under 2 ms. It does the tasks that most backends need.

| Capability | What it does |
|---|---|
| Authenticate | Checks API keys that are linked to a consumer record, on every request. |
| Rate limit | Per consumer, per route, or per any other useful bucket. |
| Cache | Stores responses in Redis, with a TTL that fits each upstream. |
| Route | Sends requests by host, path, or method to the correct backend service. |
| Reconfigure | Hot-reloads config, with no restarts and no dropped connections. |

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

I often work on projects where someone has combined nginx, a custom auth filter, and a Redis script for rate limiting. This setup works until it fails, and then nobody can debug it. I want a gateway that is small enough to read and fast enough that you do not notice it. You must also be able to change its config without a redeploy.

The full stack starts with one `docker compose up`. I think that is important.
