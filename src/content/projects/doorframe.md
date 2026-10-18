---
title: "Doorframe"
description: "A private family height tracker for iPhone. It measures a person with LiDAR and captures the height without a tap."
date: 2026-10-04
status: "active"
tech: ["Swift", "SwiftUI", "SwiftData", "ARKit", "RealityKit", "Vision", "Swift Charts"]
liveUrl: "https://doorframefamily.com"
featured: false
draft: false
---

Many families mark their children's height in pencil on a door frame. Doorframe keeps the same record on an iPhone. You point a LiDAR iPhone at a person who stands on the floor. A 3D measuring pole appears next to them. When they are still enough, the app captures the height and asks who the person is.

## Features

- **Live measurement.** LiDAR finds the floor. Vision finds the person's body pose and outline. The capture starts when the person is still enough, so they do not have to be perfectly still.
- **Other inputs.** You can use a still photo that keeps its depth data, or type a number from a doctor's visit.
- **The family Doorframe.** An illustrated door frame shows a mark for each person. Each person also has a card, with notes such as "grew 2 cm since July".
- **Growth for children.** Children get WHO and CDC percentile charts, their growth pace, and a predicted adult height. The app shows these only for children who are still growing.

## How I built it

Doorframe uses Swift 6, SwiftUI with Liquid Glass, and SwiftData. ARKit and RealityKit do the live measurement. Vision finds the person, and Swift Charts draws the growth charts. The logic is in a local Swift package, `DoorframeKit`, with three modules: Core, Measure, and Design. The app has no third-party dependencies.

The app has no account, no server, and no tracking. Data leaves the phone only when you share it. The app stores children's heights, so I made this decision before any other.

Doorframe is on TestFlight. It will be on the App Store as "Doorframe: Height Tracker". Its website is [doorframefamily.com](https://doorframefamily.com).
