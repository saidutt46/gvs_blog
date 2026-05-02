---
title: "Drawing electron orbitals from scratch"
date: 2026-05-02
description: "How Periodiq turns the spherical harmonic equations into the orbital shapes you remember from a chemistry textbook, in real time, in the browser."
draft: false
---

Most periodic tables on the internet show electron orbitals as PNGs. A library somewhere generated them years ago and they got pasted into the page. The shapes are correct, but they're frozen. You can't tip a p-orbital, you can't see the phase change between the lobes, and you definitely can't switch from a 3p to a 4f and watch the geometry get more interesting.

I wanted Periodiq to do better than that. I also wanted to learn how the shapes actually come out of the math, not just trust someone else's render. So I wrote the orbital visualizer from scratch in [React Three Fiber](https://r3f.docs.pmnd.rs/). Here is how it works.

The pipeline is four steps:

| Step | What happens | Output |
|---|---|---|
| 1 | Evaluate the spherical harmonic Y(l, m) on a 3D grid | Scalar field |
| 2 | Run marching cubes at a threshold | Triangle mesh per phase |
| 3 | Color each mesh by the sign of the wavefunction | Two complementary lobes |
| 4 | Wire it to a subshell and orbital picker | Interactive selector |

## The function you're drawing

An electron orbital is the spatial part of the wavefunction for an electron in an atom. The bit of math that gives the orbital its shape is the **spherical harmonic** Y(l, m), a function on the unit sphere parameterized by the angular momentum numbers l and m.

For a given (l, m) you get a function that takes a direction (theta, phi) and returns a complex number. The squared magnitude tells you probability density. The sign of the real part tells you the phase. The shape of the orbital is the surface where the magnitude crosses some threshold, colored by the sign.

> That is the entire physics. Everything else is rendering.

## Step one: evaluate the harmonic

I evaluate Y(l, m) on a 3D grid sampled in spherical coordinates. For each grid point I compute the real part of the harmonic. This gives me a scalar field where positive and negative regions correspond to the two phases of the wavefunction.

For p, d, and f orbitals you can use the cubic-harmonic real-valued forms directly, which is easier than dragging complex arithmetic through a fragment shader. The standard names you remember from chemistry (px, py, pz, dxy, dz², dx²-y²) are exactly these real combinations.

## Step two: extract a surface

A scalar field is not a 3D shape. To get a mesh, I run **marching cubes** over the volume at the threshold value. This gives me a triangle mesh that traces the isosurface where the wavefunction magnitude crosses the threshold.

Marching cubes is one of those algorithms that reads worse than it works. The implementation is a couple hundred lines, it is fully deterministic, and once it is written you stop thinking about it. There are well-tested JS ports; I used one and moved on.

The threshold matters. Too high and the orbitals look like marbles. Too low and they smear into spheres. I picked a value that reproduces the textbook lobes for a 2p orbital and kept it consistent across every (l, m) so different orbitals are visually comparable.

## Step three: color by phase

Two meshes come out of the marching cubes pass: one for the positive lobe of the wavefunction, one for the negative. I render each in a complementary color. This is the part that matters pedagogically. The lobes of a p orbital aren't just two blobs in space; they have opposite phase, and that phase is what makes molecular bonding work. A static PNG can show you the lobes. A live render can show you that the lobes are signed.

## Step four: drill in

The element detail page lets you pick a subshell (1s, 2p, 3d, 4f) and then an individual orbital within that subshell. The orbital list updates because once you have the (l, m) machinery in place, generating the full set is cheap. No hand-modeling, no asset pipeline, no PNG tax. You add a new orbital by changing two numbers.

This is the part that made the whole thing worth building. A static image of the dxy orbital is fine. Being able to spin it, switch to dz², spin that, then drop into 4f and see how much more structure shows up at higher angular momentum, that is something you cannot get from a textbook diagram. The math becomes legible.

---

## What I would do differently

### Push the harmonic evaluation onto the GPU

The grid sampling is the bottleneck on slower devices. For high-l orbitals (4f and up) the surface has a lot of detail and the grid resolution has to go up to capture it. I am running everything on the CPU right now. The natural next step is to push the harmonic evaluation into a compute shader and let the GPU do the sampling.

### Pick a per-orbital threshold

Picking one constant that works across all (l, m) is a compromise. A smarter version would pick a per-orbital threshold based on integrating the probability density and choosing the contour that contains 90% of the total. That is the right physics answer. I picked the visually consistent one because shipping matters and most users are not going to integrate a wavefunction.

## The whole thing is open

Periodiq is on [GitHub](https://github.com/saidutt46/Periodiq) and live at [periodiq-three.vercel.app](https://periodiq-three.vercel.app). Click any element, scroll to the orbital tab, and you are looking at the output of the four steps above. The math is correct. The rendering is honest. The lobes have signs.
