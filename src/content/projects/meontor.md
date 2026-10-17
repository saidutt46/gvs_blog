---
title: "Meontor"
description: "A tap-to-log daily tracker for iPhone with an on-device Apple Intelligence companion and a widget that learns when you do things. No server, no account."
date: 2026-09-17
status: "active"
tech: ["Swift", "SwiftUI", "SwiftData", "FoundationModels", "WidgetKit", "App Intents"]
liveUrl: "https://meontor-site.vercel.app"
featured: true
draft: false
---

Meontor is moment plus mentor. You tap to log what you do: a one-tap moment ("brushed teeth"), a bounded stretch ("clock in" to "clock out"), or a value ("mood 4/5"). At the end of the day and the week, an on-device model writes a short reflection on how the day went.

Meontor is the evolution of [ChannelOS](/projects/channelos/), the self-hosted life log I built for myself first. ChannelOS needed a server and a 26B model on my Linux box. Meontor fits the whole thing, model included, on the phone, and adds a lot that ChannelOS never had.

## What it does

- **Learns your rhythm.** The widget and the Now screen surface what you are most likely to log right now, ranked from your own history.
- **Logs from anywhere.** A Quick Capture bar in the app, a Control Center control, the Lock Screen, the Action Button, and Siri by name.
- **Reflects on-device.** Daily and weekly reflections are written by Apple's FoundationModels framework. The text never leaves the phone.
- **Never scolds.** It never reports a deficit and never makes you feel behind. That rule shaped more of the copy and design than any feature did.

## How it's built

Swift 6, SwiftUI and SwiftData, with zero third-party dependencies. There is no server, no account, and no network layer.

The app, widget, Live Activity, and controls all share one local Swift package, `MeontorKit`, split into Core, Ranking, Intelligence, Design, and WidgetUI. The ranking and reflection logic is tested headless with `swift test`, without a simulator. That matters because Apple Intelligence does not run in the simulator at all, so the app has a deterministic mentor for simulator builds and real generation is verified on device.

Meontor is in daily use on my phone and on TestFlight, and is coming to the App Store soon.
