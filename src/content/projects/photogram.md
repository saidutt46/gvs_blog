---
title: "Photogram"
description: "A command-line tool that turns a folder of photos into a 3D model with Apple's Object Capture. A reusable Swift engine with a CLI on top."
date: 2026-05-26
status: "active"
tech: ["Swift", "SwiftPM", "RealityKit", "Object Capture", "CLI"]
github: "https://github.com/saidutt46/photogram"
featured: false
draft: false
---

RealityKit includes a photogrammetry engine, `PhotogrammetrySession`. It makes good 3D models from photos, but Apple gives you no command-line tool for it. To use it, you have to write an app. I wrote Photogram so I can run it from the terminal.

```bash
photogram convert ./shoe-photos shoe.usdz --mode object --detail full
```

## Commands

| Command | What it does |
|---|---|
| `convert <input> [output]` | Makes a USDZ or OBJ model from a folder of images. This is the default command. |
| `info <input>` | Shows the image count and formats, and tells you if the folder is usable. Run it before a two-minute conversion. |
| `doctor` | Tells you if this Mac supports Object Capture, and shows the engine limits. |

All commands accept `--json`, so you can use them in scripts. `--mode object` masks and crops the images to one item. `--mode area` keeps the full scene, for a room. The other flags map directly to the session's settings: detail level, sample ordering, and feature sensitivity for smooth objects with little texture.

## How I built it

The Swift package has two targets. `PhotogrammetryKit` is the engine. It wraps the session, sends progress as an async stream of events, and turns errors into messages that a person can act on. The `photogram` CLI is a thin layer on the engine. I kept them separate so that a SwiftUI app can use the same engine later.

Photogram needs macOS 15 or later on Apple silicon. `make install` builds a release binary and installs a man page. Version 0.1.0 is on GitHub.
