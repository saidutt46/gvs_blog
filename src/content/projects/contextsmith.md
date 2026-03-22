---
title: "contextsmith"
description: "A deterministic, token-aware context bundler for LLMs. Grep for LLMs. Fast, offline, no LLM calls."
date: 2026-02-01
status: "active"
tech: ["Rust", "CLI", "LLM", "Tokenization"]
github: "https://github.com/saidutt46/contextsmith"
featured: false
draft: false
---

contextsmith is a CLI tool that bundles code context for LLMs. Think of it as grep, but designed specifically for feeding code to language models.

## The problem

When working with LLMs on codebases, you need to give them the right context. Too little and they hallucinate. Too much and you blow the token limit. Manually copying files is tedious and error-prone.

## What it does

contextsmith is deterministic and token-aware. It bundles exactly the files and code sections you need, counts tokens accurately, and outputs a clean context bundle. No LLM calls required. Everything runs locally and offline.

Built in Rust for speed. Handles large codebases without breaking a sweat.
