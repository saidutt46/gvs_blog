---
title: "Personal infrastructure with systemd user units"
date: 2026-05-02
description: "How Apollo-Net runs on the small Linux box in my closet. A walkthrough of using systemd user units, linger, and SSH port-forwarding to build personal services that survive reboot, don't need root, and feel local from another machine."
draft: false
---

There is a Minisforum UM790 Pro sitting in my closet. It runs Ubuntu 24.04, it never sleeps, and it hosts a small pile of services I rely on every day. One of them is [Apollo-Net](/projects/apollo-net), the operator HUD I built for my apartment's network. This post is about how Apollo-Net actually runs on that box, because the answer involves a piece of systemd that I think more people should know about.

The TL;DR: **systemd user units plus `loginctl enable-linger` are the right primitive for personal infrastructure.** No root, no Docker per service, no cron tricks, no homemade init script that breaks at the worst moment. Real services that survive reboot, log to journalctl, and read like the systemd units a sysadmin would write.

## The setup

Apollo-Net has three moving parts on the box:

1. A **snapshot builder**. A small Python script (in its own venv) that walks the home network, talks to Home Assistant, and builds a `topology.json` describing every device, every room, and every capability. Runs on a timer.
2. A **HUD static server**. Serves the legacy HTML interface and the current `topology.json` over HTTP on port 8765, bound to localhost only. Just `python3 -m http.server` with the right `--directory`.
3. **Home Assistant**. This one runs in Docker because HA wants `network_mode: host` for mDNS and SSDP discovery and I am not going to fight that on the host.

The first two are the interesting ones for this post. They are the parts I wanted running as long-lived background services on this box, restarted automatically if they crash, surviving reboots, and not requiring me to remember to start them manually.

## What I did not want to do

A few options I considered and rejected:

| Option | Why not |
|---|---|
| `crontab @reboot` | No restart-on-failure, no journaled logs, no clean stop. Cron is a scheduler, not a service manager. |
| A Docker container per service | Wrapping a small Python script in a Dockerfile adds more operational surface than the script itself contains. The host venv is enough isolation. |
| System-wide systemd units in `/etc/systemd/system/` | Means root for every tweak. Wrong friction for a personal project. |
| A shell script with `nohup` and a PID file | No. |

## What systemd user units actually are

systemd has two parallel daemons: the system one (PID 1, manages everything in `/etc/systemd/system/`), and a per-user one that runs alongside it and manages units in `~/.config/systemd/user/`. The user instance has the same interface as the system one. You write the same kind of unit files. You use the same `systemctl` and `journalctl` commands, just with `--user` added.

The catch: by default, the user systemd instance only runs while you are actively logged in. The moment you log out, your user services die. This is fine for desktop session services. It is not fine for "the snapshot builder needs to run forever even if I am not SSH'd in."

## The trick: enable-linger

```bash
sudo loginctl enable-linger $USER
```

That command tells systemd to start your user instance at boot and keep it running regardless of whether you have an active session. From that point on, your user services are real services. They start at boot. They survive logout. They survive reboot. They get restart policies. They log to journalctl.

> Without `enable-linger`, user units are toys. With it, they are infrastructure.

## What the snapshot timer actually looks like

These are the real unit files running on the box right now.

`~/.config/systemd/user/apollo-net-snapshot.service`:

```ini
[Unit]
Description=Apollo-Net snapshot builder (Phase 1)
Documentation=file://%h/Code/web/home-network-viz/backend/README.md

[Service]
Type=oneshot
WorkingDirectory=%h/Code/web/home-network-viz/backend
ExecStart=%h/Code/web/home-network-viz/backend/.venv/bin/python build_snapshot.py
Nice=5
```

`~/.config/systemd/user/apollo-net-snapshot.timer`:

```ini
[Unit]
Description=Regenerate Apollo-Net topology.json every 30s
Documentation=file://%h/Code/web/home-network-viz/backend/README.md

[Timer]
OnBootSec=10s
OnUnitActiveSec=30s
AccuracySec=1s
Unit=apollo-net-snapshot.service

[Install]
WantedBy=timers.target
```

That is the entire snapshot subsystem. A oneshot service that runs the venv's Python on `build_snapshot.py`, a timer that fires it every 30 seconds with 1 second of accuracy slack, and `Nice=5` to keep it polite about CPU. The first run is delayed 10 seconds after boot to let the network come up. To enable:

```bash
systemctl --user daemon-reload
systemctl --user enable --now apollo-net-snapshot.timer
```

To inspect:

```bash
systemctl --user list-timers apollo-net-snapshot.timer
journalctl --user -u apollo-net-snapshot -f
systemctl --user start apollo-net-snapshot.service   # force a snapshot off-cadence
```

The HUD server is similarly compact:

```ini
[Unit]
Description=Apollo-Net HUD (static file server)
Documentation=file://%h/Code/web/home-network-viz/backend/README.md
After=network.target

[Service]
Type=simple
WorkingDirectory=%h/Code/web/home-network-viz
ExecStart=/usr/bin/python3 -m http.server --directory frontend --bind 127.0.0.1 8765
Restart=on-failure
RestartSec=3
Nice=5

[Install]
WantedBy=default.target
```

`Type=simple` because this is a long-running process that doesn't background itself. `Restart=on-failure` with a 3-second backoff means a crashed HUD comes back without me noticing. `--bind 127.0.0.1` is the important flag: the HUD is not exposed to the network, only to localhost on the box itself. Anything reaching it from another machine has to come through SSH.

## Where Docker still wins

Home Assistant runs in Docker because it has to. HA needs `network_mode: host` for mDNS and SSDP, it has its own plugin system, it manages its own state, and the Docker image is the supported install path. There is no upside to fighting that.

The compose file is a few lines. The container has Docker's restart policy. Apollo-Net does not care whether HA is local-process or container, it just talks to it on `localhost:8123`.

The rule I follow: if the upstream project ships a Docker image and expects you to use it, use it. If you wrote the script yourself and it has zero dependencies, run it as a user unit. The line is not "containers good, processes bad" or the reverse. The line is "use the operational model the upstream wants."

## Making it feel local from the Mac

The UM790 is in the closet, my MacBook is on the desk. Every Apollo-Net service binds to `127.0.0.1` so nothing is exposed to the network. To use them from the Mac, I forward the relevant ports over SSH. In `~/.ssh/config`:

```sshconfig
Host um790
  HostName 192.168.1.42
  User saidutt
  LocalForward 5173 127.0.0.1:5173
  LocalForward 8123 127.0.0.1:8123
  LocalForward 8765 127.0.0.1:8765
```

Run `ssh um790` once and leave the connection open. Now `http://127.0.0.1:8765` on the Mac is the HUD running on the Linux box. `http://127.0.0.1:8123` is Home Assistant. `http://127.0.0.1:5173` is the new TS HUD's Vite dev server when I am working on it.

This is the part that surprised me with how well it works. The services are not exposed to the network. There is no reverse proxy, no Tailscale, no VPN. SSH is doing all the work, the same SSH I already use to log into the box. The only state on the Mac is the SSH config entry.

---

## The pattern, generalized

The pattern is more useful than the specific case. If you have a personal Linux machine and want to run small services on it without the operational tax of full system administration, the path is:

1. Write the service in whatever language is easiest. Stdlib if you can.
2. Write a unit file in `~/.config/systemd/user/`. Service or service-plus-timer.
3. Run `sudo loginctl enable-linger $USER` once.
4. `systemctl --user enable --now <unit>`.
5. Forward the port over SSH from wherever you actually use it.

That is it. You get real services, real logs, real restart policies, and real survival across reboots, all without touching `/etc` or `sudo` again.

I have been running Apollo-Net this way for weeks now. The snapshot timer has fired tens of thousands of times. The HUD has not gone down except when I redeployed it on purpose. The journal has all the logs I need to debug anything that goes wrong. It is the calmest piece of infrastructure I own.

If you have a small Linux box doing nothing in a closet, this is what to do with it.
