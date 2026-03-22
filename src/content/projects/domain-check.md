---
title: "domain-check"
description: "A fast CLI tool for checking domain name availability. Supports bulk checking, multiple TLDs, and clean terminal output."
date: 2025-06-01
status: "active"
tech: ["Rust", "CLI", "Tokio", "DNS", "WHOIS"]
github: "https://github.com/saidutt46/domain-check"
featured: true
draft: false
---

I built domain-check because I was tired of manually searching for domain names one at a time. I wanted something fast, something that worked from the terminal, and something that could check multiple domains in bulk.

## What it does

domain-check is a CLI tool that checks domain name availability. You give it a name (or a list of names), it tells you which ones are taken and which are available. It supports bulk checking, multiple TLDs, and outputs results in a clean, readable format.

## Why Rust

I chose Rust for two reasons: speed and the learning experience. Domain checking involves a lot of network I/O. Rust's async runtime (tokio) handles concurrent requests efficiently, and the compiled binary is fast and portable.

The other reason was that I wanted to get better at Rust. Building a real tool that solves a real problem is the best way to learn a language.

## What I learned

Building a CLI tool is a great first project in any language. The scope is naturally constrained. You have clear inputs, clear outputs, and no UI to worry about. It forces you to think about error handling, argument parsing, and user experience in the terminal.

The project now has over 250 stars on GitHub, which tells me other developers had the same itch I did.
