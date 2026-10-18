---
title: "Periodiq"
description: "An interactive periodic table with 3D atom visualizations for all 118 elements."
date: 2026-04-06
status: "active"
tech: ["Next.js", "React Three Fiber", "Three.js", "Zustand", "TypeScript"]
github: "https://github.com/saidutt46/Periodiq"
liveUrl: "https://periodiq-three.vercel.app"
featured: true
draft: false
---

When I search for "periodic table", most top results look old. They have dense tables, flat colors, and many ads. I wanted a reference that is easier to explore.

In Periodiq, the elements have animations. Metals shimmer, gases emit particles, and radioactive elements pulse. The grid changes when you select a different property view. A temperature slider goes from 0K to 6000K, and the elements change phase in real time as you move it.

## What's inside

When you click an element, you get a detail page with four 3D visualization modes.

| Mode | What you're looking at |
|---|---|
| Bohr model | The nucleus and electrons that orbit on tilted shells. Outer shells orbit more slowly than inner shells, as in the model. |
| Electron orbitals | 3D shapes built from the real spherical harmonics Y(l, m). Positive and negative phases use complementary colors. You can open individual orbitals (dxy, dz², dx²-y²). |
| Crystal structure | BCC, FCC, HCP, and diamond cubic unit cells, with atom positions, nearest-neighbor bonds, and wireframe edges. |
| Atomic radii | Three concentric spheres for the covalent, atomic, and van der Waals radii, drawn to scale. |

Each element also has five tabs of data: overview, properties, electrons, compounds, and history. There are about 100 fields per element, collected from PubChem and Wikipedia. The site has 381 compounds across 99 elements. I wrote the etymology for all 118 names by hand.

## Why I built it

I wanted to learn React Three Fiber on a real project, not a demo. I also wanted a reference that I would use. The orbital visualizations were the most difficult part, and they gave me the most satisfaction. The app computes spherical harmonics in real time and turns the result into a surface mesh, split by phase. The [orbitals post](/blog/orbitals-from-scratch/) explains how. The math and the rendering must agree. When they do, the output looks like the diagrams in a textbook.

For a technical walkthrough of how the orbitals are drawn, see [Drawing electron orbitals from scratch](/blog/orbitals-from-scratch/). The site is live at [periodiq-three.vercel.app](https://periodiq-three.vercel.app).
