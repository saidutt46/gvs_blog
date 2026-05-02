---
title: "domain-check"
description: "A fast Rust CLI for checking domain availability in bulk. Published on Homebrew, crates.io, and as an MCP server."
date: 2025-06-01
status: "active"
tech: ["Rust", "Tokio", "WHOIS", "RDAP", "MCP"]
github: "https://github.com/saidutt46/domain-check"
featured: true
draft: false
---

I built domain-check because I was tired of typing names into a registrar one at a time. I wanted something that lived in the terminal, ran a hundred lookups in parallel, and gave me an answer in under a second.

## What it does

You feed it a name or a list of names, optionally with a set of TLDs, and it tells you which ones are available. It speaks RDAP where it can and falls back to WHOIS where it has to. The output is clean enough to pipe into other tools.

It also ships as an MCP server, so an LLM can call it directly. That turned out to be the more interesting use case. You can ask Claude "find me a three-word .com that contains the word 'forge'" and have it actually verify availability instead of hallucinating names that were registered in 2014.

## How it's distributed

| Audience | Install |
|---|---|
| macOS users | `brew install domain-check` |
| Rust devs (CLI) | `cargo install domain-check` |
| Rust devs (lib) | `domain-check-lib = "1.0"` in `Cargo.toml` |
| AI agents | `cargo install domain-check-mcp` |
| Anyone else | Pre-built binaries on [GitHub Releases](https://github.com/saidutt46/domain-check/releases) |

## Why Rust

Two reasons. Network I/O at this scale wants async, and Tokio is the most boring, most reliable way to get that. And I wanted a real Rust project under my belt, something with a release pipeline, a tap, a published crate, and users who would file issues. Domain checking is a small enough problem to actually finish.

> The repo is past 260 stars now. Mostly tells me other people had the same itch.

For the longer story (how it grew from a learning project to a tri-crate workspace, the IANA bootstrap that took TLD coverage from 32 to 1,200, and the MCP server angle), see [domain-check at 1.0: one engine, three faces](/blog/domain-check-three-faces/).
