---
title: "Oareo"
description: "A LiDAR scanning app for iPhone and iPad Pro that makes measured floor plans and 3D models, with no accounts and no cloud."
date: 2026-03-14
status: "shipped"
tech: ["Swift", "SwiftUI", "Core Data", "RoomPlan", "ARKit", "LiDAR"]
appStore: "https://apps.apple.com/us/app/oareo/id6757112907"
liveUrl: "https://oareo.com"
featured: true
draft: false
---

Oareo is a spatial capture app for iPhone and iPad Pro. You point the device at a room and walk through it. The app gives you a measured floor plan and a 3D model that you can export.

## What it does

The iPhone Pro has a LiDAR scanner, and I think Apple's RoomPlan API is good. Most apps that use this hardware are either consumer apps for simple 3D scans or expensive enterprise surveying SDKs that take time to learn. I made Oareo for the space between those two. It is a tool for work.

You scan a room, then you scan the next room. You link the rooms into a multi-room structure. Then you export the result.

| Format | What it's for |
|---|---|
| USDZ | Apple ecosystem, AR Quick Look |
| OBJ | General 3D pipelines |
| PLY | Vertex-colored point clouds |
| STL | 3D printing |
| PDF | Floor plans for paperwork |
| PNG | Quick visual reference |

## What I care about with this product

### Geometry first

The app does not use AI to guess walls that are not there. Every measurement comes from LiDAR depth data. You must be able to trust the numbers.

### Local first

The app has no accounts, no cloud uploads, and no analytics on the spaces you scan. Your scans of an apartment, an office, or a client site stay on the device. They leave only when you share an export. I have not found another scanning app that works this way.

### Professional exports

People who use scans for work need the right file formats. For them, the export list in the table above is the most important part of the app.

## Stack

The app uses Swift and SwiftUI, with Core Data for persistence. It uses RoomPlan and ARKit for capture, and a custom export pipeline for the formats above. The site at [oareo.com](https://oareo.com) is a separate SvelteKit project (Svelte 5, Tailwind v4, and Three.js for the hero scene). The app and the site are both closed source.
