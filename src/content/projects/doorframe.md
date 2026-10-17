---
title: "Doorframe"
description: "The pencil marks on the door frame, without the pencil. A private family height tracker for iPhone that measures with LiDAR, hands-free."
date: 2026-10-04
status: "active"
tech: ["Swift", "SwiftUI", "SwiftData", "ARKit", "RealityKit", "Vision", "Swift Charts"]
liveUrl: "https://doorframefamily.com"
featured: false
draft: false
---

Doorframe replaces the pencil marks on the door frame. Point a LiDAR iPhone at someone standing on the floor, a 3D measuring pole appears beside them, and when they hold roughly still it captures by itself and asks who it was.

## What it does

- **Zero-tap measuring.** Floor detection from LiDAR, body pose and person segmentation from Vision, and a forgiving auto-capture that waits for the person to be still enough rather than perfectly still.
- **Other ways in.** A still photo that keeps its depth data, or a number typed in from a check-up.
- **The family Doorframe.** An illustrated door frame with everyone's marks on it, a card per person, and moments like "grew 2 cm since July".
- **Kids' growth.** WHO and CDC percentile charts, growth pace, and a predicted adult height, shown only for kids who are still growing.

## How it's built

Swift 6, SwiftUI with Liquid Glass, SwiftData, ARKit and RealityKit for the live measurement, Vision for finding the person, and Swift Charts for growth. The logic lives in a local Swift package, `DoorframeKit`, split into Core, Measure, and Design, with zero third-party dependencies.

There is no account, no server, and no tracking. Nothing leaves the phone unless you share it. For an app that stores children's heights, that was the first decision, not a feature.

Doorframe is on TestFlight, heading to the App Store as "Doorframe: Height Tracker". The site at [doorframefamily.com](https://doorframefamily.com) is its home and support page.
