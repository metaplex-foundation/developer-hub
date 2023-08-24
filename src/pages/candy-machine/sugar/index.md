---
title: Overview
metaTitle: Candy Machine - Sugar - Overview
description: A detailed overview of Sugar, a CLI tool for managing Candy Machines.
---

Sugar is our new Candy Machine CLI that replaces the older JavaScript CLI. It has been written from the ground up and includes several improvements:

- better performance for upload of media/metadata files and deploy of the candy machine &mdash; these operations take advantage of multithreaded systems to significantly speed up the computational time needed;
- simplified build and installation procedures taking advantage of `cargo` package management, including a binary distributable package ready to use;
- robust error handling and validation of inputs, including improvements to config and cache files, leading to more informative error messages.

{% callout %}

View OtterSec's audit of Sugar commissioned by Ape16Z [here](https://docsend.com/view/is7963h8tbbvp2g9).

{% /callout %}