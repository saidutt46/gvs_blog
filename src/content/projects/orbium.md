---
title: "Orbium"
description: "Shows live satellite traffic overhead. My own SGP4 engine calculates every orbit on the device, and LiDAR and Metal project it onto your ceiling."
date: 2026-06-14
status: "active"
tech: ["Swift", "SwiftUI", "ARKit", "Metal", "SGP4", "LiDAR"]
featured: false
draft: true
---

Orbium shows the satellites above you in real time: Starlink, the ISS, GPS, and weather and communication satellites. You can view them on a sky map, over the camera, or projected onto your ceiling.

## Views

- **Sky map.** A flat chart of the sky, from the horizon to the zenith.
- **Outdoor AR.** Satellite markers on the live camera view as you move the phone across the sky.
- **Ceiling projection.** On a LiDAR iPhone, the app finds the ceiling in the scene mesh and locks to that plane. It then projects the live satellites onto the ceiling, with a trace of each satellite's past and future path. On phones without LiDAR, you place the view manually.

## The orbit engine

The orbit math is a separate Swift package, OrbitEngine, with no third-party dependencies. It parses TLE and GP data and propagates orbits with SGP4 and SDP4. It also converts coordinates, calculates look angles (azimuth, elevation, and range), finds the sun's position, scores visibility, and predicts passes. I test it against the official SGP4 verification vectors.

The engine builds without a UI, as a macOS CLI with tests. This let me prove the math before I wrote any app code.

The app downloads element sets from [CelesTrak](https://celestrak.org) and caches them on the device. It obeys CelesTrak's two-hour update interval. It propagates every satellite locally, so it does not call the network every second.

Metal draws the camera feed and the satellite overlay in custom render passes. The app shell is SwiftUI with Liquid Glass. The source is private while I develop it.
