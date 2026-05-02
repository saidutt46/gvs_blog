---
title: "domain-check at 1.0: one engine, three faces"
date: 2026-05-02
description: "Where domain-check is two years on. From a Rust learning project to a CLI, library, and MCP server with 1,200+ TLDs and a release pipeline that ships to Homebrew, crates.io, and the MCP Registry."
draft: false
---

A while back I wrote a [Medium post](https://medium.com/@saidutt46/domain-check-transforming-curiosity-into-a-thriving-rust-project-7fbd7344311b) about the early days of [domain-check](https://github.com/saidutt46/domain-check). The story at the time was small: a learning project that grew up a little, picked up 40 stars on a good Reddit thread, and split itself into a CLI plus a library because someone politely asked.

That was a while ago. We are at **260 stars and 14 forks** now, version **1.0.2**, and the project looks materially different. It is still domain availability checking. It is no longer one binary doing one thing.

This post is about what changed and why.

## What the project is now

Three crates in one workspace, all sharing one engine:

| Crate | Audience | Role |
|---|---|---|
| `domain-check-lib` | Rust developers | Core async library. Everything else calls into this. |
| `domain-check` | CLI users | The thing most users install via `brew` or `cargo`. |
| `domain-check-mcp` | AI agents | Model Context Protocol server. Structured tools, JSON-RPC over stdio. |

> Three crates. Three audiences. One source of truth for the actual domain checking logic.

That is the structure that let the project keep growing without becoming a tangle.

## The CLI grew up

The first big change after the dual-crate split was TLD coverage. The original CLI shipped with 32 hardcoded TLDs. To add a new one, someone had to open a PR, hand-edit a list, and cut a release. That is fine when the list is small. It is not fine when users start asking about `.eu` and `.jp` and a hundred other ccTLDs.

Version 0.9.0 fixed this with **IANA bootstrap**. The CLI now fetches the IANA RDAP bootstrap registry on first use, gets back the entire mapping of TLDs to RDAP endpoints in one request, and caches the result for 24 hours. That single fetch took TLD coverage from 32 to about 1,180.

For the ccTLDs that don't publish RDAP endpoints, there is a second path: **WHOIS server discovery via IANA referral**. Query `whois.iana.org` for the TLD, get back the authoritative WHOIS server, query that server directly. This adds another ~189 TLDs to the coverage list, mostly country codes.

The net is that domain-check now covers around 1,200 TLDs without any manual maintenance. The list updates itself when IANA updates theirs. The 32 hardcoded TLDs are still there as an offline fallback for when the bootstrap fetch fails.

## The library is the foundation

The dual-crate refactor I mentioned in the Medium post is the load-bearing decision in this project. Every feature that came after it (presets, name generation, the MCP server, the JSON and CSV output formats) lives in `domain-check-lib`. The CLI is a thin wrapper around the library. The MCP server is a thin wrapper around the library. If something is worth building, it goes in the library, and then the surfaces consume it.

The library is also what gets you `initialize_bootstrap()` for pre-warming the IANA cache, the same RDAP-first-with-WHOIS-fallback engine the CLI uses, and the same preset definitions.

It is the boring part of the project. It is also the part that made everything else possible.

## The MCP server is the interesting one

`domain-check-mcp` shipped in 1.0.0. It is an MCP server built on [rmcp](https://crates.io/crates/rmcp), the official Rust MCP SDK, and it speaks JSON-RPC 2.0 over stdio. Six tools, all read-only, all returning structured JSON:

| Tool | What it does |
|---|---|
| `check_domain` | Single FQDN lookup |
| `check_domains` | Batch lookup (capped at 500 to keep agents from running away) |
| `check_with_preset` | Scan a base name across a named preset |
| `generate_names` | Pattern-based name generation |
| `list_presets` | Preset discovery |
| `domain_info` | Registrar, dates, nameservers, status codes |

Plug this into Claude Code with `claude mcp add domain-check -- domain-check-mcp` and you can ask the model to find a three-word `.com` containing "forge" and have it actually verify availability instead of guessing names that were registered in 2014. That is the use case that made the MCP server worth building.

It also turns out that "MCP server" and "CLI" are not the same product, even when they share a backend. The CLI cares about pretty terminal output, color, prompts, progress. The MCP server cares about deterministic JSON, safety limits, and tool annotations (`readOnlyHint: true`, `idempotentHint: true`). The library is what lets both of those exist without duplicating logic.

## How it ships

Three faces means three distribution channels, plus one for the binaries.

| Channel | What ships | Command |
|---|---|---|
| Homebrew | CLI binary | `brew install domain-check` |
| crates.io (CLI) | Source for the CLI | `cargo install domain-check` |
| crates.io (lib) | Source for library users | `domain-check-lib = "1.0"` in Cargo.toml |
| crates.io (MCP) | Source for the MCP server | `cargo install domain-check-mcp` |
| GitHub Releases | Pre-built binaries for 5 platforms | Download from releases |
| MCP Registry | MCPB bundles | Listed automatically |

The release pipeline is a single GitHub Actions workflow. It cuts a tag with `cargo release`, publishes the library to crates.io first (because the CLI and MCP server both depend on it), then the CLI, then the MCP server. It builds binaries for Linux x86_64, Linux musl, macOS x86_64, macOS aarch64, and Windows x86_64. It packages MCPB bundles for the MCP server and publishes them to the official MCP Registry via `mcp-publisher` with GitHub OIDC authentication.

Cutting a release is one command and a tag. The pipeline does the rest.

## Engineering work that didn't make the changelog summary

A few things from the 1.0 release worth calling out specifically.

### Binary size: 5.88 MB → 2.71 MB

A 54% reduction, achieved through link-time optimization, single codegen unit, symbol stripping, abort-on-panic, and an aggressive dependency audit. Removed `regex` (not actually used), `lazy_static` (replaced with `std::sync::OnceLock`), the `futures` meta-crate (replaced with `futures-util`), narrowed `tokio` features from `"full"` to the seven we actually call. The release binary is now small enough to embed.

### Dual license: MIT OR Apache-2.0

Standard for the Rust ecosystem (the compiler itself, `serde`, `tokio`, `clap` all use this), and it removes a friction point for downstream consumers who have to pick one or the other.

### RDAP 404 false-positive fix in 1.0.2

This one was annoying. The original logic treated any RDAP 404 response as "domain available." Per RFC 7480 §5.3 that is incorrect: 404 means "no data," not "no registration." Some registries (`.moe` was the one that surfaced this) return 404 for registered domains that don't have NS delegation. The fix is to treat RDAP 404 as inconclusive, fall back to WHOIS, and only report AVAILABLE when both protocols independently agree. AND, not OR.

> That kind of bug is the price of speaking two protocols. It is also the price of trusting a status code as a proxy for state.

The fix is the right kind of fix: tighter semantics, more conservative defaults, and the user gets UNKNOWN instead of a false AVAILABLE when the protocols disagree.

---

## What I learned from the second half of this project

The first half taught me Rust. The second half taught me everything else.

It taught me that **distribution is a product feature**. The Homebrew formula, the cargo install path, the MCP registry listing: these are not a checklist, they are how the project meets users where they already are. The Homebrew users do not want to install Rust. The library users do not want a CLI. The MCP users do not want either, they want a tool definition their agent can call.

It taught me that **a workspace is a load-bearing structure**. Three crates with shared dependencies, a shared version, and a shared release pipeline is something you build once and benefit from forever. Trying to do this with three separate repos would be a maintenance burden I would have abandoned.

It taught me that **release engineering is most of the project**. The actual domain checking logic is a few thousand lines. The CI pipeline, the release scripts, the changelog discipline, the documentation, the FAQ, the contributing guide, the security policy: all of this is what makes the project something other people can rely on.

> The code is the easy part.

## Where it goes from here

There is a list. The MCP server is going to keep getting smarter as the protocol matures. The output formats could use more configurability (templated output for piping into other tools is the most-requested item). The IANA bootstrap could ship with a baked-in snapshot for true offline use. The pattern generator could grow real combinatorial controls.

But I am also at the point where the most useful thing I can do is keep it boring. The project works. It is on 260 stars and the issue tracker is short. The tests pass. The release pipeline ships clean. Sometimes the right move is to stop adding features and let the project be what it already is.

domain-check is on [GitHub](https://github.com/saidutt46/domain-check). The library is on [crates.io](https://crates.io/crates/domain-check-lib). The CLI is on [Homebrew](https://github.com/saidutt46/homebrew-domain-check) and [crates.io](https://crates.io/crates/domain-check). The MCP server is on [crates.io](https://crates.io/crates/domain-check-mcp) and the MCP Registry. Pick whichever surface you need.
