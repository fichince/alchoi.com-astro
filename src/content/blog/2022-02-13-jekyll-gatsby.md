---
layout: post
title:  From Jekyll to Gatsby
description: R. L. Stevenson v. F. S. Fitzgerald?
date: 2022-02-13
tags:
  - tech
  - coding
---

[Previously](/blog/2022-01-04-revive-again), I mentioned that I was building this website using [Jekyll](https://jekyllrb.com/), after having moved off the friendly-but-closed system of Squarespace. Since then, I pivoted again, and landed on [Gatsby](https://www.gatsbyjs.com/). My motivations for the switch were somewhat esoteric so I thought I'd explain myself here.

I have nothing against Jekyll itself. I like the simplicity of its templating system and how you can see exactly what HTML it generates. I like that blog posts just go into a directory called `_posts` and get picked up without any extra configuration.

My first crack at building the site involved choosing one of the [many themes](https://jekyllrb.com/docs/themes/) that are available online. It's a good way to get started without worrying too much about the code. But I'm a tinkerer by nature and I couldn't help but try to customize things like colours and fonts.

I had been playing around with [Tailwind CSS](https://tailwindcss.com/) and I'm a big fan of working with CSS this way.[^1] I decided to edit my Jekyll templates and customize the style using Tailwind. In hindsight, it might have been less time-consuming to start from scratch without a theme, but even so, the code changes weren't hard to do. Anyway, before I got too far, I ran into the issues that ultimately put an end to my time with Jekyll.

I'm hosting this site on the [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform)[^2], which is a _zero-configuration_ hosting solution. You just point to a GitHub repo, and it goes, _"Hey, that looks like Jekyll!"_ and automatically builds and hosts the site with a CDN. As nice as that is, it became a roadblock when it came to combining Jekyll with Tailwind.

When the DO App Platform goes _"Hey, that looks like Jekyll!"_, what it does next is to start a [Buildpack](https://buildpacks.io/) to execute the build. Because Jekyll is implemented in Ruby, the Jekyll Buildpack contains a Ruby executable.

The problem is, Tailwind is implemented in Javascript. It integrates into a Jekyll build by having the Ruby process spawn a NodeJS process. This works fine in an environment which has both Ruby and NodeJS installed, like my local development laptop. But the Buildpack only contains the Ruby executable, so it chokes when it gets to the NodeJS part.

I couldn't find any way to choose a different Buildpack or to provide my own Buildpack or anything like that. I don't blame DigitalOcean for not supporting advanced custom builds--it is supposed to be zero-configuration, after all.

I could have moved off the App Platform and created my own build system, but I have a soft spot for what DigitalOcean is trying to do, so I decided to try a different tack. I don't need much of an excuse to play around with different tools anyway, so I turned my attention to Gatsby.

Since Gatsby is implemented in Javascript, I didn't foresee that it would have any issues with Tailwind. DigitalOcean would just say, _"Hey, that looks like Gatsby!"_, and start a Buildpack that has a NodeJS executable, which is what Tailwind needs as well.

Lo and behold, this is the tech stack that I've landed on... Gatsby with Tailwind, hosted on DigitalOcean App Platform.

I might write more about Gatsby specifically in the future, but that's all for now.

[^1]: It's like [CSS without CSS](https://youtu.be/Pex_0zg9EsE?t=112). 
[^2]: I see DO as the underdog David to the Goliaths of AWS and GCP and Azure.
