---
title: "Photogram"
description: "Turn a folder of photos into a 3D model from the terminal, using Apple's Object Capture. A reusable Swift engine plus a scriptable CLI."
date: 2026-05-26
status: "active"
tech: ["Swift", "SwiftPM", "RealityKit", "Object Capture", "CLI"]
github: "https://github.com/saidutt46/photogram"
featured: false
draft: false
---

Apple ships a very good photogrammetry engine in RealityKit, `PhotogrammetrySession`, and almost no way to use it without writing an app. Photogram is the missing command line.

```bash
photogram convert ./shoe-photos shoe.usdz --mode object --detail full
```

## What it does

| Command | What it does |
|---|---|
| `convert <input> [output]` | Reconstruct a USDZ or OBJ model from a folder of images. The default command. |
| `info <input>` | Image count, format breakdown, and whether the folder is usable, before you commit to a two-minute run. |
| `doctor` | Whether this Mac supports Object Capture, plus the engine's limits. |

Every command takes `--json`, so it scripts cleanly. `--mode object` masks and crops to a single item; `--mode area` keeps the full extent for a room or scene. The rest of the flags map one-to-one onto the session's own configuration: detail level, sample ordering, and feature sensitivity for smooth or low-texture objects.

## How it's built

Two targets in one Swift package. `PhotogrammetryKit` is the engine: it wraps the session, streams progress, and maps errors into something a human can act on. The `photogram` CLI is a thin layer on top. I split them on purpose so a SwiftUI drag-and-drop app can share the same engine later.

It needs macOS 15+ on Apple silicon. `make install` builds a release binary with a man page. Version 0.1.0 is on GitHub.
