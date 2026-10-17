---
title: "domain-check at 1.0: one engine, three faces"
date: 2026-05-02
description: "Where domain-check is two years later. It grew from a Rust learning project into a CLI, a library, and an MCP server that cover 1,200+ TLDs, with a release pipeline to Homebrew, crates.io, and the MCP Registry."
draft: false
---

*Update, October 2026: domain-check is now at 1.2, with more than 300 stars and 21 forks. The formula is now in homebrew-core instead of my own tap. Version 1.1 added RFC 10023 for-sale detection, and 1.2 hardened WHOIS. The [project page](/projects/domain-check/) has the details.*

Some time ago, I wrote a [Medium post](https://medium.com/@saidutt46/domain-check-transforming-curiosity-into-a-thriving-rust-project-7fbd7344311b) about the early days of [domain-check](https://github.com/saidutt46/domain-check). The story was small then. It was a learning project that grew a little. It got 40 stars from a good Reddit thread. It split into a CLI and a library because someone asked politely.

Now the project has 260 stars and 14 forks, and it is at version 1.0.2. It looks very different. It still checks domain availability, but it is no longer one binary that does one thing. This post is about what changed and why.

## What the project is now

The workspace has three crates, and all three share one engine:

| Crate | Audience | Role |
|---|---|---|
| `domain-check-lib` | Rust developers | Core async library. The other two crates call into it. |
| `domain-check` | CLI users | The crate most users install with `brew` or `cargo`. |
| `domain-check-mcp` | AI agents | Model Context Protocol server. Structured tools, JSON-RPC over stdio. |

Each crate has a different audience, and all of them use the same domain checking logic. This structure let the project grow without becoming tangled.

## TLD coverage in the CLI

The first big change after the split into two crates was TLD coverage. The original CLI had 32 hardcoded TLDs. To add a TLD, a person had to open a PR, edit the list by hand, and cut a release. That works for a small list. It does not work when users ask for `.eu`, `.jp`, and a hundred other ccTLDs.

Version 0.9.0 fixed this with IANA bootstrap. On first use, the CLI fetches the IANA RDAP bootstrap registry. One request returns the full mapping of TLDs to RDAP endpoints. The CLI caches the result for 24 hours. That one fetch increased TLD coverage from 32 to about 1,180.

Some ccTLDs do not publish RDAP endpoints. For these, the CLI uses a second path: WHOIS server discovery through IANA referral. The CLI queries `whois.iana.org` for the TLD and gets the authoritative WHOIS server. Then it queries that server directly. This path adds about 189 more TLDs, mostly country codes.

As a result, domain-check covers more than 1,200 TLDs with no manual maintenance. When IANA updates its list, the coverage updates too. The 32 hardcoded TLDs are still in the code. They are the offline fallback when the bootstrap fetch fails.

## The library

The split into two crates, which I described in the Medium post, is the most important decision in this project. Every later feature lives in `domain-check-lib`: presets, name generation, and the JSON and CSV output formats. The CLI is a thin wrapper around the library. The MCP server is its own crate, and it is a thin wrapper too. When I build a new feature, it goes in the library first. Then the CLI and the MCP server use it.

The library also gives you `initialize_bootstrap()` to pre-warm the IANA cache. It has the same RDAP-first engine with WHOIS fallback that the CLI uses, and the same preset definitions. It is the least exciting part of the project, but it made everything else possible.

## The MCP server

`domain-check-mcp` shipped in 1.0.0. It is built on [rmcp](https://crates.io/crates/rmcp), the official Rust MCP SDK, and it speaks JSON-RPC 2.0 over stdio. It has six tools. All of them are read-only and return structured JSON:

| Tool | What it does |
|---|---|
| `check_domain` | Single FQDN lookup |
| `check_domains` | Batch lookup (limited to 500, so an agent cannot run without limit) |
| `check_with_preset` | Scan a base name across a named preset |
| `generate_names` | Pattern-based name generation |
| `list_presets` | Preset discovery |
| `domain_info` | Registrar, dates, nameservers, status codes |

You can add it to Claude Code with `claude mcp add domain-check -- domain-check-mcp`. Then you can ask the model to find a three-word `.com` name that contains "forge". The model checks availability with the tool, instead of guessing names that were registered in 2014. This use case is the reason I built the MCP server.

I also learned that an MCP server and a CLI are different products, even when they share a backend. The CLI needs readable terminal output, color, prompts, and progress. The MCP server needs deterministic JSON, safety limits, and tool annotations (`readOnlyHint: true`, `idempotentHint: true`). The library lets both exist without duplicate logic.

## How it ships

The project ships through these channels:

| Channel | What ships | Command |
|---|---|---|
| Homebrew | CLI binary | `brew install domain-check` |
| crates.io (CLI) | Source for the CLI | `cargo install domain-check` |
| crates.io (lib) | Source for library users | `domain-check-lib = "1.0"` in Cargo.toml |
| crates.io (MCP) | Source for the MCP server | `cargo install domain-check-mcp` |
| GitHub Releases | Pre-built binaries for 5 platforms | Download from releases |
| MCP Registry | MCPB bundles | Listed automatically |

I start a release with `cargo release`, which bumps the version and pushes a tag. The tag starts one GitHub Actions workflow. It publishes the library to crates.io first, because the CLI and the MCP server both depend on it. Next it publishes the CLI, and then the MCP server. It builds binaries for Linux x86_64, Linux musl, macOS x86_64, macOS aarch64, and Windows x86_64. It also packages MCPB bundles for the MCP server. It publishes those bundles to the official MCP Registry through `mcp-publisher` with GitHub OIDC authentication.

A release takes one command on my side. The pipeline does the rest.

## Changes in 1.0 that the changelog summary does not show

Some changes in the 1.0 release need more detail.

### Binary size: 5.88 MB → 2.71 MB

The release binary is 54% smaller. I got this result with link-time optimization, a single codegen unit, symbol stripping, abort-on-panic, and a strict dependency audit. I removed `regex`, because the code did not use it. I replaced `lazy_static` with `std::sync::OnceLock`. I replaced the `futures` meta-crate with `futures-util`. I reduced the `tokio` features from `"full"` to the seven that the code calls. The release binary is now small enough to embed.

### Dual license: MIT OR Apache-2.0

This is the standard license for the Rust ecosystem. The compiler, `serde`, and `clap` all use it. It also removes a problem for downstream users who must pick one license or the other.

### RDAP 404 false-positive fix in 1.0.2

The original logic treated every RDAP 404 response as "domain available." Per RFC 7480 §5.3, that is incorrect. A 404 means "no data," not "no registration." Some registries return 404 for registered domains that have no NS delegation. `.moe` was the registry that showed this bug. The bug came from trusting a status code to tell me the registration state.

The fix treats an RDAP 404 as inconclusive and falls back to WHOIS. domain-check reports AVAILABLE only when both protocols agree independently. When the protocols disagree, the user gets UNKNOWN instead of a false AVAILABLE. The semantics are stricter, and the defaults are more conservative.

---

## What I learned from the second half of this project

The first half of the project taught me Rust. The second half taught me the rest of the work.

First, distribution is a product feature. The Homebrew formula, the cargo install path, and the MCP Registry listing are how the project reaches users where they already work. Homebrew users do not want to install Rust. Library users do not want a CLI. MCP users want neither. They want a tool definition that their agent can call.

Second, the workspace structure carries a lot of weight. The three crates share dependencies, a version, and a release pipeline. I built this once, and it continues to save me work. With three separate repos, the maintenance would have been too much, and I would have stopped.

Third, release engineering is most of the project. The domain checking logic is a few thousand lines. The rest is the CI pipeline, the release scripts, changelog discipline, documentation, the FAQ, the contributing guide, and the security policy. That work is what lets other people rely on the project.

## Next steps

I have a list. The MCP server will continue to improve as the protocol matures. The output formats need more configuration options. Templated output for piping into other tools is the most-requested item. The IANA bootstrap could include a built-in snapshot for full offline use. The pattern generator could get real combinatorial controls.

But now, the most useful thing I can do is keep the project stable. It works. It has 260 stars, and the issue tracker is short. The tests pass, and the release pipeline ships without errors. At this point, I prefer to stop adding features and let the project be what it is.

domain-check is on [GitHub](https://github.com/saidutt46/domain-check). The library is on [crates.io](https://crates.io/crates/domain-check-lib). The CLI is on [Homebrew](https://github.com/saidutt46/homebrew-domain-check) and [crates.io](https://crates.io/crates/domain-check). The MCP server is on [crates.io](https://crates.io/crates/domain-check-mcp) and the MCP Registry.
