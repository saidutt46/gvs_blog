---
title: "contextsmith"
description: "A deterministic, token-aware CLI in Rust that bundles code context for LLMs, offline and with no model calls."
date: 2026-02-01
status: "active"
tech: ["Rust", "CLI", "Tokenization", "LLM"]
github: "https://github.com/saidutt46/contextsmith"
featured: false
draft: false
---

contextsmith is a CLI that builds the context bundle you give to a language model. It works like `grep`, but its question is "which code should I paste into Claude?"

## The problem

When you use an LLM on a real codebase, you must decide how much context to give it.

| Too little context | Too much context |
|---|---|
| The model invents APIs | You go over the context window |
| It hallucinates function names | You pay for tokens you did not need |
| It misses the answer | Round-trips are slow |

You can copy files, trim them, and count tokens by hand. I find that the worst part of the workflow.

## What it does

You run contextsmith on a repo with a query or a path glob. It selects files and trims them deterministically. It counts tokens for the model you target. Then it writes a clean bundle that you can paste or pipe. The same input always gives the same output. It makes no network calls and uses no model, so you do not wait on anything.

I wrote it in Rust because a context tool must be fast. It handles large repos with many files in less than a second.
