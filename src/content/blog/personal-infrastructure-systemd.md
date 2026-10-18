---
title: "Personal infrastructure with systemd user units"
date: 2026-05-02
description: "How Apollo-Net runs on the small Linux box in my closet, with systemd user units, linger, and SSH port forwarding. The services survive a reboot, need no root, and feel local from another machine."
draft: false
---

*Update, October 2026: two things have changed since I wrote this. I now reach this box over Tailscale instead of the home LAN, including from my phone. The services in this post still bind to localhost, so the SSH forwarding below works the same way over that connection. Also, Apollo-Net is paused. The systemd pattern has not changed, and I would still use it to run a small personal service.*

A Minisforum UM790 Pro sits in my closet. It runs Ubuntu 24.04 and never sleeps. It hosts a small group of services that I use every day. One of them is [Apollo-Net](/projects/apollo-net), the operator HUD I built for my apartment's network. This post explains how Apollo-Net runs on that box. The answer uses a part of systemd that I think more people should know about.

In summary: systemd user units with `loginctl enable-linger` are the right base for personal infrastructure. They do not need root, and they replace cron jobs and custom init scripts. The services survive reboot and log to journalctl. The unit files are the same kind that a sysadmin would write.

## The setup

Apollo-Net has three parts on the box:

1. A snapshot builder. This is a small Python script in its own venv. It scans the home network, talks to Home Assistant, and builds a `topology.json` file. The file describes every device, every room, and every capability. A timer runs the script.
2. A HUD static server. It serves the legacy HTML interface and the current `topology.json` over HTTP on port 8765. It binds to localhost only. It is `python3 -m http.server` with the correct `--directory`.
3. Home Assistant. It runs in Docker, because HA needs `network_mode: host` for mDNS and SSDP discovery. I do not want to work against that on the host.

This post is about the first two parts. I wanted them to run as long-lived background services on the box. They had to restart automatically after a crash, survive reboots, and start without my help.

## Options I rejected

| Option | Why not |
|---|---|
| `crontab @reboot` | No restart on failure, no journaled logs, and no clean stop. Cron is a scheduler. It is not a service manager. |
| A Docker container per service | A Dockerfile for a small Python script adds more operational work than the script itself. The host venv gives enough isolation. |
| System-wide systemd units in `/etc/systemd/system/` | Every change needs root. That is too much friction for a personal project. |
| A shell script with `nohup` and a PID file | I did not want to maintain this. |

## What systemd user units are

systemd runs two kinds of instances. The system instance is PID 1, and it manages the units in `/etc/systemd/system/`. A per-user instance runs next to it and manages the units in `~/.config/systemd/user/`. The user instance has the same interface as the system instance. You write the same type of unit files. You use the same `systemctl` and `journalctl` commands, with `--user` added.

By default, the user instance runs only while you are logged in. When you log out, your user services stop. This is acceptable for desktop session services. It does not work for a snapshot builder that must run when I am not connected over SSH.

## Keep user services running with enable-linger

```bash
sudo loginctl enable-linger $USER
```

This command tells systemd to start your user instance at boot. The instance then keeps running, whether or not you have an active session. After this, your user services behave like real services. They start at boot and continue after logout and reboot. They have restart policies, and they log to journalctl.

## The snapshot timer

These are the real unit files on the box.

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

These two files are the full snapshot subsystem. A oneshot service runs `build_snapshot.py` with the venv's Python. A timer starts the service every 30 seconds, with 1 second of accuracy slack. `Nice=5` gives the job a lower CPU priority. The first run waits 10 seconds after boot, so the network can come up first. To enable the timer:

```bash
systemctl --user daemon-reload
systemctl --user enable --now apollo-net-snapshot.timer
```

To inspect it:

```bash
systemctl --user list-timers apollo-net-snapshot.timer
journalctl --user -u apollo-net-snapshot -f
systemctl --user start apollo-net-snapshot.service   # force a snapshot off-cadence
```

The HUD server unit is also short:

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

I use `Type=simple` because the process runs for a long time and does not move itself to the background. `Restart=on-failure` with a 3-second delay restarts a crashed HUD before I notice. The most important flag is `--bind 127.0.0.1`. It keeps the HUD off the network, so only localhost on the box can reach it. Another machine must connect through SSH.

## Where Docker is the better choice

Home Assistant runs in Docker because it must. HA needs `network_mode: host` for mDNS and SSDP. It has its own plugin system, and it manages its own state. The Docker image is the supported install method, so I see no reason to work against it.

The compose file is a few lines, and Docker's restart policy manages the container. Apollo-Net does not care if HA is a local process or a container. It connects to HA on `localhost:8123`.

I follow this rule. If the upstream project ships a Docker image and expects you to use it, use it. If you wrote a small script yourself and it runs from its own venv, run it as a user unit. In both cases, use the operational model that the upstream project expects.

## Access from the Mac

The UM790 is in the closet, and my MacBook is on the desk. Every Apollo-Net service binds to `127.0.0.1`, so the network cannot reach them. To use them from the Mac, I forward the ports over SSH. In `~/.ssh/config`:

```sshconfig
Host linuxbox
  HostName <box-hostname-or-ip>
  User <you>
  LocalForward 5173 127.0.0.1:5173
  LocalForward 8123 127.0.0.1:8123
  LocalForward 8765 127.0.0.1:8765
```

I run `ssh linuxbox` once and keep the connection open. Then `http://127.0.0.1:8765` on the Mac opens the HUD on the Linux box. `http://127.0.0.1:8123` opens Home Assistant. `http://127.0.0.1:5173` opens the Vite dev server for the new TS HUD, when I work on it.

This setup works better than I expected. The services stay off the network. I do not use a reverse proxy, Tailscale, or a VPN. SSH does all the work, and it is the same SSH that I use to log in to the box. The only state on the Mac is the SSH config entry.

---

## The general pattern

The general pattern is more useful than this one case. You may have a personal Linux machine and want to run small services on it without full system administration. These are the steps:

1. Write the service in the language that is easiest for you. Use the standard library if you can.
2. Write a unit file in `~/.config/systemd/user/`. Use a service, or a service and a timer.
3. Run `sudo loginctl enable-linger $USER` one time.
4. Run `systemctl --user enable --now <unit>`.
5. Forward the port over SSH from the machine where you use the service.

You get services with logs and restart policies, and they survive reboots. After step 3, you do not need to touch `/etc` or use `sudo` again.

While I worked on Apollo-Net, I ran it this way for weeks. The snapshot timer fired tens of thousands of times. The HUD went down only when I redeployed it on purpose. The journal had all the logs I needed to debug a problem.
