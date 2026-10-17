---
title: "Orbium"
description: "Live satellite traffic overhead, propagated on-device by my own zero-dependency SGP4 engine, and projected onto your ceiling with LiDAR and Metal."
date: 2026-06-14
status: "active"
tech: ["Swift", "SwiftUI", "ARKit", "Metal", "SGP4", "LiDAR"]
featured: false
draft: true
---

Orbium shows the human-made sky. Point an iPhone up and you see Starlink, the ISS, GPS, weather and comms satellites moving overhead in real time. Then lock it to your ceiling and the room becomes a live orbital display.

## Three views

- **Sky map.** A flat sky chart from the horizon ring to the zenith, readable at a glance.
- **Outdoor AR.** Satellite markers over the live camera as you pan the real sky.
- **Ceiling projection.** On a LiDAR iPhone, detect the ceiling from the scene mesh, lock the plane, and project the live orbital view onto it, with each satellite tracing where it came from and where it is heading. Phones without LiDAR get a manual-placement fallback.

## The engine

The orbital math is its own Swift package, **OrbitEngine**, with zero third-party dependencies: TLE and GP parsing, SGP4/SDP4 propagation, coordinate transforms, observer look angles (azimuth, elevation, range), sun position and visibility scoring, and pass prediction. It is checked against the official SGP4 verification vectors.

It builds headless, as a macOS CLI plus tests, so the math was proven correct before any UI existed. The app downloads element sets from [CelesTrak](https://celestrak.org), caches them on-device within CelesTrak's two-hour update cadence, and propagates every satellite locally. There are no per-second network calls.

Rendering is Metal with hand-written passes for the camera feed and the orbital overlay, under a SwiftUI shell with Liquid Glass. The source is private while it's in development.
