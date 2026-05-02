---
title: "Oareo"
description: "Professional LiDAR scanning for iOS. Turn an iPhone into a precision surveying tool. No accounts, no cloud, real metric accuracy."
date: 2026-03-14
status: "shipped"
tech: ["Swift", "SwiftUI", "Core Data", "RoomPlan", "ARKit", "LiDAR"]
appStore: "https://apps.apple.com/us/app/oareo/id6757112907"
liveUrl: "https://oareo.com"
github: "https://github.com/saidutt46/oareo-client"
featured: true
draft: false
---

Oareo is a professional spatial capture app for iPhone and iPad Pro. Point the device at a room, walk through it, and get a measured floor plan and a 3D model you can export.

## What it actually does

The pitch is simple: the iPhone Pro already has a LiDAR scanner and Apple's RoomPlan API is genuinely good. The hardware is in your pocket. Most apps wrap that hardware in something either too consumer (toy 3D scans) or too enterprise (a $5k surveying SDK with a learning curve). Oareo sits in the middle.

> It is a tool, not a toy.

You scan a room. You scan another. You link them into a multi-room structure. Then you export.

| Format | What it's for |
|---|---|
| USDZ | Apple ecosystem, AR Quick Look |
| OBJ | General 3D pipelines |
| PLY | Vertex-colored point clouds |
| STL | 3D printing |
| PDF | Floor plans for paperwork |
| PNG | Quick visual reference |

## What I care about with this product

**Geometry first.** No AI hallucinations of walls that aren't there. Every measurement is grounded in real LiDAR depth data. The numbers have to be defensible.

**Local first.** No accounts. No cloud uploads. No analytics on the spaces you scan. Your apartment, your office, your client site, none of it leaves the device until you choose to share an export. This sounds like marketing copy until you actually try to find another scanning app that does this.

**Professional exports.** USDZ for the Apple ecosystem, OBJ for general 3D pipelines, PLY for point-cloud workflows, STL for printing, PDF and PNG for paperwork. The export list is the product surface for anyone who actually uses scans for work.

## Stack

The app is Swift and SwiftUI with Core Data for persistence, RoomPlan and ARKit for capture, and a custom export pipeline for the formats above. The marketing site at [oareo.com](https://oareo.com) is a separate SvelteKit project (Svelte 5, Tailwind v4, Three.js for the hero scene). The repo linked below is the marketing client. The app source itself is private.
