---
title: "domain-check"
description: "A Rust CLI that checks domain availability in bulk, published on Homebrew, crates.io, and as an MCP server."
date: 2025-06-01
status: "active"
tech: ["Rust", "Tokio", "WHOIS", "RDAP", "MCP"]
github: "https://github.com/saidutt46/domain-check"
featured: true
draft: false
---

I built domain-check because I did not want to type names into a registrar one at a time. I wanted a terminal tool that runs a hundred lookups in parallel and gives an answer in less than a second.

## What it does

You give it a name or a list of names, and optionally a set of TLDs. It tells you which ones are available. It uses RDAP when it can and falls back to WHOIS when it must. The output is clean, so you can pipe it into other tools.

It is also an MCP server, so an LLM can call it directly. I found this use case more interesting than the CLI. For example, you can ask Claude to "find me a three-word .com that contains the word 'forge'". Claude then checks real availability and does not suggest names that are already registered.

## How it's distributed

| Audience | Install |
|---|---|
| macOS users | `brew install domain-check` (homebrew-core) |
| Rust devs (CLI) | `cargo install domain-check` |
| Rust devs (lib) | `domain-check-lib = "1.2"` in `Cargo.toml` |
| AI agents | `cargo install domain-check-mcp` |
| Anyone else | Pre-built binaries on [GitHub Releases](https://github.com/saidutt46/domain-check/releases) |

## Why Rust

I had two reasons. First, network I/O at this scale needs async, and Tokio is a stable and reliable way to get it. Second, I wanted a complete Rust project with a release pipeline, a tap, a published crate, and users who file issues. Domain checking is a problem small enough to finish.

The repo now has more than 300 stars. I think other people had the same problem.

## Since 1.0

The formula moved from my own tap into homebrew-core. Now `brew install domain-check` works without a tap, and new releases get bumped automatically.

1.1 added RFC 10023 for-sale detection. For a taken domain, it looks up the `_for-sale` DNS record and reports whether the owner says the domain is for sale. The MCP server also exposes this, with an explicit disclaimer. An agent must not treat a DNS record as a price quote.

1.2 was mostly about clear reports when lookups fail. I made three changes:

- I wrote a built-in WHOIS client. Its reply parser reads fields, so registry disclaimers do not break it.
- I limited queries to two at a time per WHOIS server. Now the large registries do not throttle batch runs.
- The tool keeps the reason a lookup failed. Before, it showed only UNKNOWN.

The project started as a learning project and grew into a workspace with three crates. The IANA bootstrap increased TLD coverage from 32 to 1,200. For that history and more about the MCP server, see [domain-check at 1.0: one engine, three faces](/blog/domain-check-three-faces/).
