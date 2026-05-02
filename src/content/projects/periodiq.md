---
title: "Periodiq"
description: "An interactive periodic table with 3D atom visualizations for all 118 elements. The reference site chemistry deserves."
date: 2026-04-06
status: "active"
tech: ["Next.js", "React Three Fiber", "Three.js", "Zustand", "TypeScript"]
github: "https://github.com/saidutt46/Periodiq"
liveUrl: "https://periodiq-three.vercel.app"
featured: true
draft: false
---

Search "periodic table" and the top results look like they were built in 2010. Dense tables, flat colors, ad-heavy layouts. Chemistry deserves a better reference.

Periodiq treats the periodic table as something worth exploring, not just looking up. Metals shimmer. Gases emit particles. Radioactive elements pulse. The whole grid transforms when you switch property views, and elements change phase in real time as you drag the temperature slider from 0K to 6000K.

## What's inside

Click any element and you land on a detail page with four 3D visualization modes:

- **Bohr model.** Nucleus and orbiting electrons on tilted shells. Outer shells orbit slower than inner ones, because that's actually how it works.
- **Electron orbitals.** Isosurfaces generated from real spherical harmonic functions Y(l,m). Positive and negative wavefunction phases in complementary colors. You can drill into individual orbitals: dxy, dz², dx²-y².
- **Crystal structure.** BCC, FCC, HCP, and diamond cubic unit cells with atom positions, nearest-neighbor bonds, and wireframe edges.
- **Atomic radii.** Three concentric spheres for covalent, atomic, and van der Waals radii, scaled honestly.

Plus five tabs of data per element: overview, properties, electrons, compounds, history. Roughly 100 fields per element, aggregated from PubChem and Wikipedia. 381 compounds across 99 elements. Etymology hand-written for all 118 names.

## Why I built it

I wanted to learn React Three Fiber on something that wasn't a tech demo, and I wanted a reference I would actually use. The orbital visualizations were the hardest part and the most satisfying to get right. Computing spherical harmonics in real time and turning the result into a clean isosurface mesh is one of those problems where the math and the rendering have to agree, and when they do, the output looks like the textbook diagrams finally make sense.

Live at [periodiq-three.vercel.app](https://periodiq-three.vercel.app).
