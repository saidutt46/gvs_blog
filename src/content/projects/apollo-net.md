---
title: "Apollo-Net"
description: "Operator HUD for my home network. Aggregates Home Assistant, builds a live topology, and runs as the command plane for the apartment."
date: 2026-04-18
status: "active"
tech: ["React", "TypeScript", "Tailwind", "Python", "Home Assistant", "Docker"]
featured: false
draft: false
---

Apollo-Net is the dashboard I wanted to exist for my own apartment. Home Assistant is great at integrations and bad at being a control surface. This is the control surface.

## What it does

Two products share one frontend and one backend.

The **consumer dashboard** at `/`, `/rooms`, `/devices` is card-driven and capability-rendered. A device shows up as the right control because the system knows what the device can do, not because someone hand-wrote a layout for it.

The **operator console** at `/ops` (and a planned `/network` and `/events`) is the part that doesn't exist in stock Home Assistant. Live topology of the network, who's online, who's misbehaving, what changed in the last hour. The thing you actually want when something stops working at 11pm.

## How it's wired

The whole stack runs on a Minisforum UM790 Pro box (Ubuntu 24.04, codename gayaprime) sitting in the apartment.

| Component | Runs as | Notes |
|---|---|---|
| Snapshot builder | systemd user timer | Python in a venv. Regenerates `topology.json` every 30 seconds. |
| HUD static server | systemd user service | Localhost-only on port 8765. Serves the legacy HUD + current topology. |
| Home Assistant | Docker container | `network_mode: host` for mDNS/SSDP. Aggregates SmartThings, webOS, Apple TV, Cync, thermostats, blinds, the PS5, the Matter bridge. |
| New TS HUD | Vite dev server | React 19, TypeScript strict, Tailwind v4. The eventual replacement for the legacy HUD. |

`loginctl enable-linger` is on, so the user units survive reboot. From my Mac I port-forward 8765, 8123, and 5173 over SSH and the whole thing feels local.

For the systemd-user-unit-as-personal-infrastructure pattern this project sits on top of, see [Personal infrastructure with systemd user units](/blog/personal-infrastructure-systemd/).

## Why

I run a moderately involved home network: BGW320 for fiber handoff, eero Pro 6 mesh, a managed switch, IoT segmented off, and forty-something devices. Off-the-shelf dashboards either hide the wrong things or surface them as text logs.

> I wanted a HUD. So I built one.
