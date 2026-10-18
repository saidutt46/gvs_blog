---
title: "Apollo-Net"
description: "An operator dashboard for my home network that pulls in Home Assistant and shows a live network topology."
date: 2026-04-18
status: "paused"
tech: ["React", "TypeScript", "Tailwind", "Python", "Home Assistant", "Docker"]
featured: false
draft: false
---

Apollo-Net is a dashboard for my own apartment. Home Assistant is good at integrations. I do not think it is a good control surface, so I built one on top of it.

## What it does

Two products share one frontend and one backend.

The consumer dashboard is at `/`, `/rooms`, and `/devices`. It uses cards, and each card renders from the capabilities of the device. The system knows what a device can do, so it shows the correct control. Nobody writes a layout for each device by hand.

The operator console is at `/ops`. I also plan to add `/network` and `/events`. Stock Home Assistant does not have this part. It shows the live network topology, which devices are online, which devices have problems, and what changed in the last hour. I use it when something stops working late at night.

## How it's wired

The full stack runs on a Minisforum UM790 Pro (Ubuntu 24.04, codename gayaprime) in the apartment.

| Component | Runs as | Notes |
|---|---|---|
| Snapshot builder | systemd user timer | Python in a venv. Regenerates `topology.json` every 30 seconds. |
| HUD static server | systemd user service | Localhost only, on port 8765. Serves the legacy HUD and the current topology. |
| Home Assistant | Docker container | `network_mode: host` for mDNS/SSDP. Aggregates the smart-home integrations in the apartment. |
| New TS HUD | Vite dev server | React 19, TypeScript strict, Tailwind v4. It will replace the legacy HUD. |

I turned on `loginctl enable-linger`, so the user units start again after a reboot. From my Mac, I forward ports 8765, 8123, and 5173 over SSH. Then the stack works as if it runs locally.

This project uses systemd user units as personal infrastructure. For more about that pattern, see [Personal infrastructure with systemd user units](/blog/personal-infrastructure-systemd/).

## Why

My home network has fiber, a mesh, a managed switch, a separate IoT segment, and more than forty devices. Off-the-shelf dashboards hide the information I need, or they show it only as text logs. I wanted a HUD for this network, so I built one.
