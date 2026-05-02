---
title: "contextsmith"
description: "A deterministic, token-aware context bundler for LLMs. Grep for the LLM era. Fast, offline, no model calls."
date: 2026-02-01
status: "active"
tech: ["Rust", "CLI", "Tokenization", "LLM"]
github: "https://github.com/saidutt46/contextsmith"
featured: false
draft: false
---

contextsmith is a CLI that builds the context bundle you feed to a language model. Think of it as `grep` rewritten for the question "what should I paste into Claude."

## The problem

Working with an LLM on a real codebase is a packaging problem.

| Too little context | Too much context |
|---|---|
| Model invents APIs | Blow the window |
| Hallucinated function names | Pay for tokens you didn't need |
| Miss the actual answer | Slow round-trips |

Doing this by hand, copying files, trimming, counting, is the worst part of the workflow.

## What it does

You point contextsmith at a repo with a query or a path glob. It selects files, trims them deterministically, counts tokens against the model you're targeting, and emits a clean bundle ready to paste or pipe. Same input, same output, every time. No network calls, no model in the loop, nothing to wait on.

It is built in Rust because the only thing worse than packaging context by hand is waiting for a slow tool to do it for you. Large repos, many files, sub-second runs.
