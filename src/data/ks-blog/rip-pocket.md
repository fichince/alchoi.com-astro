---
title: RIP Pocket
date: 2025-06-11
tags:
  - books
  - tech
description: Kobo's Killer App Killed
image: '@assets/images/ks-blog/rip-pocket/wallabag.png'
---
A while back, [I wrote about](/blog/2017/04/kobos-killer-app) my history with e-readers, and highlighted in particular the [Pocket](https://en.wikipedia.org/wiki/Pocket_%28service%29) app that’s available on [Kobo](https://www.kobo.com/) devices. I named it “Kobo’s killer app,” because I think that e-readers hit their sweet spot with long articles: for shorter pieces, I can live with the slight eyestrain of reading on a phone or computer screen, and for full-length books, I’ll always prefer a physical copy. For me, e-readers are perfect for the in-between articles and essays that can be read in 15-30 minutes, and Pocket is the key piece of software that makes it happen. That is, until now.

Sadly, the Pocket service [will be shutting down](https://arstechnica.com/gadgets/2025/05/mozilla-is-killing-its-pocket-and-fakespot-services-to-focus-on-firefox/). There are [other](https://www.instapaper.com/) [alternatives](https://hq.getmatter.com/) for saving articles, but there’s no (easy) way to access them on the Kobo.

What to do? Luckily, the open-source community comes to the rescue.

<!-- excerpt -->

[Wallabag](https://wallabag.org/) is a program that can save web pages for later reading, just like Pocket does. You can run your own server, either on a home machine or in the cloud, so you’re not chained to any company that may require subscriptions or cease to exist someday. I’ve deployed my own instance using [Fly.io](https://fly.io/). Saved articles can be downloaded using an iOS or Android app (also open-source) for offline reading.

The final link in the chain is getting the saved articles onto the Kobo. Enter [KOReader](https://koreader.rocks/), a sort-of Swiss Army Knife of reading apps. Among many other things, it can download and view articles from a Wallabag server. Somehow, the developers managed to find a way to install this app on Kobo devices, which isn’t an open platform as far as I can tell.

Unfortunately, the whole process requires some technical expertise, and if I’m honest, the UI/UX of both Wallabag and KOReader are mediocre. But I’m still happy that I was able to do this, so that the value of my Kobo reader didn’t immediately diminish.
