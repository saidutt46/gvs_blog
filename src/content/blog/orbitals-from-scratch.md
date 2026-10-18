---
title: "Drawing electron orbitals from scratch"
date: 2026-05-02
description: "How Periodiq turns the real spherical harmonics into the orbital shapes from a chemistry textbook, and draws them live in the browser."
draft: false
---

Most periodic tables on the internet show electron orbitals as PNG images. The shapes are correct, but they are static. You cannot rotate a p orbital. You cannot see the phase change between the lobes. You cannot switch from a p orbital to an f orbital and compare the geometry.

I wanted Periodiq to do more than that. I also wanted to learn how the shapes come from the math, instead of trusting another person's render. So I wrote the orbital view from scratch in [React Three Fiber](https://r3f.docs.pmnd.rs/). The math is one TypeScript file of about 300 lines, with no math library.

The pipeline has four steps:

| Step | What happens | Output |
|---|---|---|
| 1 | Evaluate the real spherical harmonic Y(l, m) for a direction | A signed number |
| 2 | Sweep every direction on a grid and push each point out by \|Y\| | A closed surface |
| 3 | Split the triangles by the sign of Y | One mesh per phase |
| 4 | Render both meshes and connect them to an orbital picker | Interactive view |

## The function behind the shape

The spherical harmonic Y(l, m) gives an orbital its angular shape. It takes a direction, given as two angles (theta, phi), and returns a value. The quantum numbers l and m select which harmonic you use. The sign of the value is the phase of the wavefunction in that direction.

The general harmonics are complex numbers. Chemistry uses real combinations of them, and those combinations are the orbitals you know: px, py, pz, dxy, dz², dx²-y², and the seven f orbitals. I wrote the real forms directly, one formula for each (l, m), from s (l = 0) to f (l = 3). For example, pz is `0.4886 * cos(theta)`, and dx²-y² is `0.5463 * sin²(theta) * cos(2 * phi)`. Each constant is the normalization factor for that harmonic.

## Step 1 and 2: Build the surface

The surface is a polar plot. For each direction, I calculate Y. Then I put a vertex at a distance from the center that depends on |Y|. Where Y is large, the surface goes far out, and you see a lobe. Where Y is zero, the surface comes back to the center, and you see a node.

I sweep theta in 48 steps and phi in 96 steps. Each grid cell gives two triangles. The radius is not |Y| exactly. I use |Y| to the power 2/3, because that gives a smoother and more readable shape than plain |Y|. I then multiply it by a scale that grows with n, so a 3p orbital draws larger than a 2p orbital.

## Step 3: Split by phase

For each triangle, I check the sign of Y at its three corners. If all three are positive, the triangle goes in the positive mesh. If all three are negative, it goes in the negative mesh. If the signs are mixed, the triangle is on a node boundary, and I drop it. This leaves a small gap between the lobes, and the gap shows where the phase changes.

I calculate a flat normal for each triangle, so the lighting shows the facets of the shape.

## Step 4: Render and select

The positive mesh uses the color of the element's category. The negative mesh uses a second, contrasting color. Both meshes use a transparent physical material. The group rotates slowly, and dashed axis lines and a dot at the nucleus give you a reference frame.

On the element page, you pick a subshell and then one orbital in it. The mesh is calculated on the CPU, once for each orbital you select. At this grid size, that is fast enough that I did not need a worker or a shader.

This is the part I wanted most. In Periodiq, you can rotate dxy, switch to dz², and rotate that. Then you can go to an f orbital and see how much more structure appears at higher l. A static textbook image cannot show you that.

## What this model leaves out

The view shows only the angular part of the wavefunction. A real orbital also has a radial part, which depends on n and l. The radial part is what makes a 3p orbital different from a 2p orbital: it adds radial nodes, which are spherical shells where the probability is zero. In Periodiq, n changes only the size. A 2p and a 3p have the same shape.

A more accurate version would multiply the angular part by the radial wavefunction and sample the result on a 3D grid. Then it would extract a surface that contains a fixed share of the probability, for example 90%, with marching cubes. That would show radial nodes and true relative sizes. It would also cost more, so it would probably need to run off the main thread.

## Source code and live site

Periodiq is on [GitHub](https://github.com/saidutt46/Periodiq) and live at [periodiq-three.vercel.app](https://periodiq-three.vercel.app). The orbital math is in `src/lib/chemistry/orbitals.ts`.
