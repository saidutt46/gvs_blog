---
title: "Meontor"
description: "A daily activity tracker for iPhone. You tap to log, a widget learns your routine, and Apple Intelligence writes a reflection on the device."
date: 2026-09-17
status: "active"
tech: ["Swift", "SwiftUI", "SwiftData", "FoundationModels", "WidgetKit", "App Intents"]
liveUrl: "https://meontor-site.vercel.app"
featured: true
draft: false
---

The name Meontor comes from "moment" and "mentor". You tap to log what you do. A log entry can be a single moment ("brushed teeth"), a period with a start and an end ("clock in", then "clock out"), or a value ("mood 4/5"). At the end of each day and each week, a model on the phone writes a short reflection.

Meontor comes from [ChannelOS](/projects/channelos/), a self-hosted life log that I built for myself first. ChannelOS needs a server and a 26B model on my Linux box. Meontor puts the full system on the phone, including the model, and has many features that ChannelOS does not have.

## Features

- The widget and the Now screen show the activities you are most likely to log at this time. The ranking comes from your own history.
- You can log from the Quick Capture bar in the app, from Control Center, from the Lock Screen, with the Action Button, or by name with Siri.
- Apple's FoundationModels framework writes the daily and weekly reflections on the device. The text does not leave the phone.
- The app never reports a deficit. It does not tell you that you are behind.

## How I built it

Meontor uses Swift 6, SwiftUI, and SwiftData. It has no third-party dependencies, no server, no account, and no network layer.

The app, the widget, the Live Activity, and the controls share one local Swift package, `MeontorKit`. The package has five modules: Core, Ranking, Intelligence, Design, and WidgetUI. I test the ranking and reflection logic with `swift test`, with no simulator.

Apple Intelligence does not run in the simulator. For simulator builds, the app uses a deterministic mentor. I check the real model output on a device.

I use Meontor every day. It is on TestFlight now, and it will be on the App Store soon.
